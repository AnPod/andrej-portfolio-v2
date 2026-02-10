import { checkRateLimit, getRateLimitIdentifier } from './utils/rateLimit.js';
import { validateContactForm, detectSpam, sanitizeForEmail } from './utils/contactValidation.js';

const RECIPIENT_EMAIL = 'andrej@podgorsek.de';

export default async function handler(req, res) {
  const requestId = Date.now().toString(36);

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const clientIp = getRateLimitIdentifier(req);
  const rateLimit = checkRateLimit(`contact:${clientIp}`, {
    windowMs: 60 * 60 * 1000,
    max: 5
  });

  if (!rateLimit.allowed) {
    res.setHeader('Retry-After', rateLimit.retryAfter);
    return res.status(429).json({
      error: 'Too many submissions. Please try again later.',
      retryAfter: rateLimit.retryAfter
    });
  }

  try {
    const validatedData = validateContactForm(req.body);

    if (detectSpam(validatedData.subject, validatedData.message)) {
      return res.status(200).json({ success: true, message: 'Message received' });
    }

    const sanitizedEmail = validatedData.email ? sanitizeForEmail(validatedData.email) : null;
    const sanitizedSubject = sanitizeForEmail(validatedData.subject);
    const sanitizedMessage = sanitizeForEmail(validatedData.message);

    const hasResendKey = !!process.env.RESEND_API_KEY;

    if (!hasResendKey) {
      console.log('\n' + '='.repeat(70));
      console.log(' CONTACT FORM SUBMISSION (Resend not configured)');
      console.log('='.repeat(70));
      console.log(`Request ID: ${requestId}`);
      console.log(`From: ${sanitizedEmail || 'Not provided'}`);
      console.log(`Subject: ${sanitizedSubject}`);
      console.log(`Message: ${sanitizedMessage}`);
      console.log('='.repeat(70));

      return res.status(200).json({ success: true, message: 'Message received' });
    }

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Portfolio Contact <onboarding@resend.dev>',
        to: [RECIPIENT_EMAIL],
        replyTo: sanitizedEmail || undefined,
        subject: `[Portfolio] ${sanitizedSubject}`,
        html: `
          <h1>New Portfolio Contact</h1>
          <p><strong>From:</strong> ${sanitizedEmail || 'Not provided'}</p>
          <p><strong>Subject:</strong> ${sanitizedSubject}</p>
          <p><strong>Message:</strong></p>
          <p>${sanitizedMessage.replace(/\n/g, '<br>')}</p>
          <hr>
          <p><small>Request ID: ${requestId}</small></p>
        `,
        text: `From: ${sanitizedEmail || 'Not provided'}\nSubject: ${sanitizedSubject}\n\nMessage:\n${sanitizedMessage}`
      })
    });

    if (!emailResponse.ok) {
      throw new Error('Failed to send email');
    }

    res.status(200).json({ success: true, message: 'Message sent successfully' });

  } catch (error) {
    let statusCode = 500;
    let errorMessage = 'Failed to send message.';

    if (error.message?.includes('required') || error.message?.includes('Invalid')) {
      statusCode = 400;
      errorMessage = error.message;
    }

    res.status(statusCode).json({ error: errorMessage, requestId });
  }
}
