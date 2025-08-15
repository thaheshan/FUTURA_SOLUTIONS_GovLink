const rateLimit = require('express-rate-limit');
import { redisClient } from '../../config/redis';
import { config } from '../../config/environment';

// General API rate limiter
export const generalLimiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW, // 15 minutes
  max: config.RATE_LIMIT_MAX_REQUESTS, // 100 requests per windowMs
  message: {
    error: 'Too many requests',
    message: 'Please try again later',
    retryAfter: Math.ceil(config.RATE_LIMIT_WINDOW / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use user ID if authenticated, otherwise IP
    return (req as any).user?.userId || req.ip;
  }
});

// Strict limiter for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per windowMs
  message: {
    error: 'Too many authentication attempts',
    message: 'Please try again after 15 minutes',
    retryAfter: 900
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true
});

// File upload limiter
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 uploads per hour
  message: {
    error: 'Too many file uploads',
    message: 'Please try again later',
    retryAfter: 3600
  }
});

// Service query limiter
export const serviceQueryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // 200 service queries per windowMs
  message: {
    error: 'Too many service queries',
    message: 'Please try again later'
  }
});