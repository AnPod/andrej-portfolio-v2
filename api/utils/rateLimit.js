// ============================================
// RATE LIMITING UTILITY FOR VERCEL
// ============================================

const requests = new Map();

setInterval(() => {
  const now = Date.now();
  for (const [key, data] of requests.entries()) {
    if (now - data.resetTime > 0) {
      requests.delete(key);
    }
  }
}, 5 * 60 * 1000);

export function checkRateLimit(identifier, options = {}) {
  const {
    windowMs = 15 * 60 * 1000,
    max = 20
  } = options;

  const now = Date.now();
  const key = identifier;

  if (!requests.has(key)) {
    requests.set(key, {
      count: 1,
      resetTime: now + windowMs
    });
    return { allowed: true, remaining: max - 1 };
  }

  const data = requests.get(key);

  if (now > data.resetTime) {
    requests.set(key, {
      count: 1,
      resetTime: now + windowMs
    });
    return { allowed: true, remaining: max - 1 };
  }

  data.count++;

  if (data.count > max) {
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.ceil((data.resetTime - now) / 1000)
    };
  }

  return {
    allowed: true,
    remaining: max - data.count
  };
}

export function getRateLimitIdentifier(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    'unknown'
  );
}
