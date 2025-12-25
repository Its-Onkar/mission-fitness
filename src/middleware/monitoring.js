import logger from '../utils/logger.js';

// Request monitoring middleware
export const requestMonitoring = (req, res, next) => {
  const startTime = Date.now();
  
  // Log request
  logger.info('Request started', {
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    timestamp: new Date().toISOString()
  });

  // Override res.end to capture response time
  const originalEnd = res.end;
  res.end = function(...args) {
    const duration = Date.now() - startTime;
    
    // Log response
    logger.info('Request completed', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    });

    // Log slow requests
    if (duration > 1000) {
      logger.warn('Slow request detected', {
        method: req.method,
        url: req.url,
        duration: `${duration}ms`
      });
    }

    originalEnd.apply(this, args);
  };

  next();
};

// Error monitoring middleware
export const errorMonitoring = (err, req, res, next) => {
  // Log error with context
  logger.error('Application error', {
    error: {
      message: err.message,
      stack: err.stack,
      name: err.name
    },
    request: {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body,
      params: req.params,
      query: req.query
    },
    user: req.user ? { id: req.user.id, email: req.user.email } : null,
    timestamp: new Date().toISOString()
  });

  next(err);
};

// Performance monitoring
export const performanceMonitoring = () => {
  const metrics = {
    requests: {
      total: 0,
      success: 0,
      errors: 0,
      averageResponseTime: 0
    },
    memory: process.memoryUsage(),
    uptime: process.uptime()
  };

  // Log metrics every 5 minutes
  setInterval(() => {
    logger.info('Performance metrics', {
      ...metrics,
      timestamp: new Date().toISOString()
    });
  }, 5 * 60 * 1000);

  return metrics;
};

// Health check monitoring
export const healthCheck = async () => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  };

  try {
    // Check database connection
    const mongoose = await import('mongoose');
    if (mongoose.connection.readyState !== 1) {
      health.status = 'unhealthy';
      health.database = 'disconnected';
    } else {
      health.database = 'connected';
    }

    // Check external services
    health.services = {
      openai: process.env.OPENAI_API_KEY ? 'configured' : 'not configured',
      email: process.env.EMAIL_USER ? 'configured' : 'not configured'
    };

  } catch (error) {
    health.status = 'unhealthy';
    health.error = error.message;
  }

  return health;
};