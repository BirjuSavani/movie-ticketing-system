import { Request, Response, NextFunction, RequestHandler } from "express";

export const catchAsync = (fn: RequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const generateBookingReference = (): string => {
  const randomAlphaNumeric = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `BK-${randomAlphaNumeric}`;
};
