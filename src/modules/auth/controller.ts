import { Request, Response } from "express";
import { MESSAGES } from "../../messages/messages";
import { catchAsync } from "../../utils/helpers";
import { sendSuccess } from "../../utils/sendResponse";
import * as authService from "./service";

export const register = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.register(req.body);

  sendSuccess(res, 201, MESSAGES.AUTH.SUCCESS.REGISTER, result);
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);

  sendSuccess(res, 200, MESSAGES.AUTH.SUCCESS.LOGIN, result);
});

export const refresh = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.refresh(req.body);

  sendSuccess(res, 200, MESSAGES.AUTH.SUCCESS.REFRESH, result);
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  await authService.logout(req.body);

  sendSuccess(res, 200, MESSAGES.AUTH.SUCCESS.LOGOUT);
});
