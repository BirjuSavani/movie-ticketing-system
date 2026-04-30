import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import { env } from '../config/env';

export const authRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_AUTH_WINDOW_MS,
  max: env.RATE_LIMIT_AUTH_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json({
      success: false,
      error: {
        code: 'TOO_MANY_REQUESTS',
        message: 'Too many requests, please try again later.',
        details: []
      }
    });
  }
});

export const bookingRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_BOOKING_WINDOW_MS,
  max: env.RATE_LIMIT_BOOKING_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return (req as any).user?.id || ipKeyGenerator(req.ip || '');
  },
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json({
      success: false,
      error: {
        code: 'TOO_MANY_REQUESTS',
        message: 'Too many requests, please try again later.',
        details: []
      }
    });
  }
});

export const generalRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_GENERAL_WINDOW_MS,
  max: env.RATE_LIMIT_GENERAL_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return (req as any).user?.id || ipKeyGenerator(req.ip || '');
  },
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json({
      success: false,
      error: {
        code: 'TOO_MANY_REQUESTS',
        message: 'Too many requests, please try again later.',
        details: []
      }
    });
  }
});
