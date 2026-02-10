import { NextRequest, NextResponse } from 'next/server';

const RECIPIENT_EMAIL = 'andrej@podgorsek.de';

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour
  const max = 5;

  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return { allowed: true };
  }

  if (entry.count >= max) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetTime - now) / 1000) };
  }

  entry.count++;
  return { allowed: true };
}

function validateContactForm(data: Record<string, unknown>) {
  const errors: string[] = [];
  const { email, subject, message, timestamp } = data;

  if (!email || typeof email !== 'string') {
    errors.push('Email is required');
  } else {
    const trimmedEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.push('Invalid email address');
    }
    if (trimmedEmail.length > 254) {
      errors.push('Email is too long');
    }
  }

  if (!subject || typeof subject !== 'string') {
    errors.push('Subject is required');
  } else {
    if (subject.trim().length < 3) errors.push('Subject must be at least 3 characters');
    if (subject.trim().length > 200) errors.push('Subject must be less than 200 characters');
  }

  if (!message || typeof message !== 'string') {
    errors.push('Message is required');
  } else {
    if (message.trim().length < 10) errors.push('Message must be at least 10 characters');
    if (message.trim().length > 5000) errors.push('Message must be less than 5000 characters');
  }

  if (timestamp && typeof timestamp === 'number') {
    const timeDiff = Date.now() - timestamp;
    if (timeDiff < 0 || timeDiff > 5 * 60 * 1000) {
      errors.push('Request expired');
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join(', '));
  }

  return {
    email: (email as string).trim(),
    subject: (subject as string).trim(),
    message: (message as string).trim(),
  };
}

function detectSpam(subject: string, message: string): boolean {
  const text = (subject + ' ' + message).toLowerCase();

  const spamKeywords = [
    'viagra', 'cialis', 'lottery', 'winner', 'claim your prize',
    'click here', 'buy now', 'limited time', 'act now',
    'make money fast', 'work from home', 'free money',
    'nigerian prince', 'inheritance', 'bitcoin investment'
  ];

  if (spamKeywords.some(kw => text.includes(kw))) return true;

  const urlCount = (text.match(/https?:\/\//gi) || []).length;
  if (urlCount > 2) return true;

  if (/https?:\/\/.*\.(ru|cn|tk|ml|ga|cf|gq)/i.test(text)) return true;

  return false;
}

function sanitize(text: string): string {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

export async function POST(request: NextRequest) {
  const requestId = Date.now().toString(36);

  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown';

    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again later.', retryAfter: rateLimit.retryAfter },
        { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfter) } }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }
    
    const validated = validateContactForm(body);

    if (detectSpam(validated.subject, validated.message)) {
      return NextResponse.json({ success: true, message: 'Message received' });
    }

    const safeEmail = sanitize(validated.email);
    const safeSubject = sanitize(validated.subject);
    const safeMessage = sanitize(validated.message);

    const resendKey = process.env.RESEND_API_KEY;

    if (!resendKey) {
      console.log(`\n${'='.repeat(60)}`);
      console.log(' CONTACT FORM (no Resend key configured)');
      console.log(`${'='.repeat(60)}`);
      console.log(`ID: ${requestId} | From: ${safeEmail}`);
      console.log(`Subject: ${safeSubject}`);
      console.log(`Message: ${safeMessage}`);
      console.log(`${'='.repeat(60)}\n`);
      return NextResponse.json({ success: true, message: 'Message received' });
    }

    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Portfolio Contact <onboarding@resend.dev>',
        to: [RECIPIENT_EMAIL],
        replyTo: safeEmail || undefined,
        subject: `[Portfolio] ${safeSubject}`,
        html: `
          <h1>New Portfolio Contact</h1>
          <p><strong>From:</strong> ${safeEmail}</p>
          <p><strong>Subject:</strong> ${safeSubject}</p>
          <p><strong>Message:</strong></p>
          <p>${safeMessage.replace(/\n/g, '<br>')}</p>
          <hr>
          <p><small>Request ID: ${requestId}</small></p>
        `,
        text: `From: ${safeEmail}\nSubject: ${safeSubject}\n\nMessage:\n${validated.message}`,
      }),
    });

    if (!emailRes.ok) {
      throw new Error('Failed to send email');
    }

    return NextResponse.json({ success: true, message: 'Message sent successfully' });
  } catch (error: unknown) {
    const err = error as Error;
    const is400 = err.message?.includes('required') || err.message?.includes('Invalid');
    return NextResponse.json(
      { error: is400 ? err.message : 'Failed to send message.', requestId },
      { status: is400 ? 400 : 500 }
    );
  }
}
