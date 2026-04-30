import { Response } from 'express';

export const sendSuccess = (res: Response, statusCode: number, message?: string, data?: any) => {
  const response: any = { success: true };
  if (message) response.message = message;
  if (data !== undefined) response.data = data;
  
  return res.status(statusCode).json(response);
};

export const sendError = (res: Response, statusCode: number, errorCode: string, message: string, details?: any[]) => {
  return res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message,
      details: details || [],
    },
  });
};
