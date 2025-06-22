
const setRateLimit = require("express-rate-limit");

const rateLimit = setRateLimit({
    windowMs: 60 * 1000, // 1 minutes || For 15 minutes  15 * 60 * 1000
    max: 5,
    validate: {xForwardedForHeader: false},
    handler: (req, res, next) => {
      res.status(429).json({
        success: false,
        code: 429,
        error: 'Too many requests, please try again later.',
      });
    },
  });

// Use the rate limiter as middleware
exports.rateLimit = rateLimit;