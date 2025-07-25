const logger = require('../utils/logger');

// Request logging middleware
const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  // Log the incoming request
  logger.debug(`Incoming request: ${req.method} ${req.path}`, {
    method: req.method,
    path: req.path,
    query: req.query,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user ? req.user.userId : null
  });

  // Override res.json to capture response
  const originalJson = res.json;
  res.json = function(body) {
    const duration = Date.now() - startTime;
    
    // Log the response
    logger.api(
      req.method,
      req.path,
      res.statusCode,
      duration,
      req.user ? req.user.userId : null,
      res.statusCode >= 400 ? { message: body.error || 'Unknown error' } : null
    );
    
    return originalJson.call(this, body);
  };

  next();
};

// Error logging middleware
const errorLogger = (err, req, res, next) => {
  const duration = Date.now() - (req.startTime || Date.now());
  
  logger.api(
    req.method,
    req.path,
    res.statusCode || 500,
    duration,
    req.user ? req.user.userId : null,
    err
  );

  logger.error(`Unhandled error in ${req.method} ${req.path}`, err, {
    userId: req.user ? req.user.userId : null,
    body: req.body,
    query: req.query,
    params: req.params
  });

  next(err);
};

module.exports = {
  requestLogger,
  errorLogger
}; 