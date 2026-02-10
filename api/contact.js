import { checkRateLimit, getRateLimitIdentifier } from './utils/rateLimit.js';

const RECIPIENT_EMAIL = 'drejc83@gmail.com';
const SENDER_EMAIL = 'andrej@podgorsek.de';
const WEBHOOK_URL = process.env.RESEND_WEBHOOK_URL;

// Rate limiting: 5 submissions per hour per IP
async function handler(req, res) {
  const requestId = Date.now().toString(36);

  // CORS preflight
  if (req.method === 'OPTIONS') {
    const origin = req.headers.origin;
    if (origin) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '86400');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    return res.status(200).end();
  }

  // CORS headers
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting
  const clientIp = getRateLimitIdentifier(req);
  const rateLimit = checkRateLimit(`contact:${clientIp}`, {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 requests per hour
  });

  if (!rateLimit.allowed) {
    res.setHeader('Retry-After', rateLimit.retryAfter);
    return res.status(429).json({
      error: 'Too many contact form submissions. Please try again later.',
      retryAfter: rateLimit.retryAfter
    });
  }

  try {
    const body = await req.json();

    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return res.status(400).json({
        error: 'All fields are required'
      });
    }

    // Prepare email content (HTML format for better readability)
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; color: #333;">
        <h2 style="color: #8b5cf6; margin-bottom: 20px;">New Contact Form Submission</h2>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p><strong>Name:</strong> ${escapeHtml(body.name)}</p>
          <p><strong>Email:</strong> <a href="mailto:${escapeHtml(body.email)}">${escapeHtml(body.email)}</a></p>
          <p><strong>Subject:</strong> ${escapeHtml(body.subject || 'Portfolio Inquiry')}</p>
        </div>
        
        <div style="background: #ffffff; padding: 20px; border-left: 4px solid #8b5cf6; border-radius: 8px;">
          <h3 style="margin-top: 0; margin-bottom: 10px;">Message:</h3>
          <p style="color: #555; white-space: pre-wrap;">${escapeHtml(body.message)}</p>
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background: #f3f4f6; border-radius: 8px;">
          <p style="margin: 0; font-size: 14px; color: #666;">
            <strong>From:</strong> Andrej Podgorsek Portfolio<br/>
            <strong>Time:</strong> ${new Date().toISOString()}
          </p>
      </div>
    `;

    // Send via Resend webhook if available
    if (WEBHOOK_URL) {
      const webhookResponse = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: SENDER_EMAIL,
          to: [RECIPIENT_EMAIL],
          subject: `Portfolio Inquiry from ${body.name}`,
          html: emailContent,
          text: body.message,
        }),
      });

      if (!webhookResponse.ok) {
        console.error('Webhook failed:', await webhookResponse.text());
        // Fall back to console
      }
    }

    // Log for development/debugging
    console.log(`[${requestId}] Contact form: ${body.name} (${body.email})`);
    console.log(`Subject: ${body.subject || 'Portfolio Inquiry'}`);

    return res.status(200).json({
      success: true,
      message: 'Thank you! I\'ll get back to you soon.'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({
      error: 'Something went wrong. Please try again.'
    });
  }
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export { handler, config: { runtime: 'nodejs18.x' } };
