import { Request, Response, NextFunction } from 'express';
import { Role } from '../config/constants';
import { AppError } from '../utils/AppError';

export const requireRole = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError(401, 'UNAUTHORIZED', 'User not authenticated.'));
    }

    if (!allowedRoles.includes(req.user.role as Role)) {
      return next(new AppError(403, 'FORBIDDEN', 'You do not have permission to perform this action.'));
    }

    next();
  };
};
