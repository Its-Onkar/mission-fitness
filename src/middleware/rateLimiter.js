const rateLimitStore = new Map();

export const createRateLimit = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    max = 100, // limit each IP to 100 requests per windowMs
    message = 'Too many requests from this IP, please try again later.',
    standardHeaders = true,
    legacyHeaders = false,
  } = options;

  return (req, res, next) => {
    const key = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    if (!rateLimitStore.has(key)) {
      rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }
    
    const record = rateLimitStore.get(key);
    
    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + windowMs;
      return next();
    }
    
    if (record.count >= max) {
      if (standardHeaders) {
        res.set({
          'X-RateLimit-Limit': max,
          'X-RateLimit-Remaining': Math.max(0, max - record.count),
          'X-RateLimit-Reset': new Date(record.resetTime)
        });
      }
      
      return res.status(429).json({
        success: false,
        message,
        retryAfter: Math.ceil((record.resetTime - now) / 1000)
      });
    }
    
    record.count++;
    
    if (standardHeaders) {
      res.set({
        'X-RateLimit-Limit': max,
        'X-RateLimit-Remaining': Math.max(0, max - record.count),
        'X-RateLimit-Reset': new Date(record.resetTime)
      });
    }
    
    next();
  };
};

// Specific rate limiters
export const authLimiter = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 login attempts per 15 minutes
  message: 'Too many authentication attempts, please try again later.'
});

export const apiLimiter = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 API calls per 15 minutes
  message: 'Too many API requests, please try again later.'
});

export const aiLimiter = createRateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 AI generations per hour
  message: 'AI generation limit reached, please try again later.'
});

export const rateLimiter = apiLimiter;
