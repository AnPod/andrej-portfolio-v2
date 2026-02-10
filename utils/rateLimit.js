import RateLimit from 'express-rate-limit';

const rateLimiter = new RateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 requests per hour
  handler: (req, res, next, options) => {
    if (options && options.skip) {
      return next();
    }
    
    const identifier = getRateLimitIdentifier(req);
    rateLimiter.consume(identifier, options.points || 1)
      .then(() => {
        if (!options.allowAll && rateLimiter.get(identifier)) {
          return res.status(429).json({
            error: 'Too many contact form submissions. Please try again later.',
            retryAfter: rateLimiter.resetTime.get(identifier)
          });
        }
        next();
      })
      .catch(() => {
        res.status(429).json({
          error: 'Too many contact form submissions. Please try again later.',
          retryAfter: rateLimiter.resetTime.get(identifier)
        });
      });
  },
  keyGenerator: (req) => {
    const ip = req.headers['x-forwarded-for'] || 
               req.headers['x-real-ip'] || 
               req.socket.remoteAddress || 
               req.ip;
    
    // Include user agent for more precise limiting if available
    const userAgent = req.headers['user-agent'] || '';
    
    return `contact:${ip}:${userAgent}`;
  }
});

export function checkRateLimit(identifier, options = {}) {
  return rateLimiter.get(identifier);
}

export function getRateLimitIdentifier(req) {
  return rateLimiter.keyGenerator(req);
}

export default rateLimiter;
