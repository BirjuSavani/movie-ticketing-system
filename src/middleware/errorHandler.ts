import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { env } from '../config/env';
import { logger } from '../utils/logger';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.errorCode,
        message: err.message,
        details: err.details || []
      }
    });
  }

  if (err.isJoi) {
    return res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request data",
        details: err.details.map((detail: any) => ({
          field: detail.path.join("."),
          message: detail.message,
        })),
      },
    });
  }

  if (err.code === '23505') {
    return res.status(409).json({
      success: false,
      error: {
        code: 'CONFLICT',
        message: 'A record with that information already exists.',
        details: []
      }
    });
  }

  logger.error(`Unhandled Error: ${err.message}`, { err });

  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred.',
      details: env.NODE_ENV === 'development' ? [err.message] : []
    }
  });
};
