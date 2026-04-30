import { Request, Response } from "express";
import { MESSAGES } from "../../messages/messages";
import { catchAsync } from "../../utils/helpers";
import { sendSuccess } from "../../utils/sendResponse";
import * as authService from "./service";

export const register = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.register(req.body);

  sendSuccess(res, 201, MESSAGES.AUTH.REGISTER_SUCCESS, result);
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);

  sendSuccess(res, 200, MESSAGES.AUTH.LOGIN_SUCCESS, result);
});

export const refresh = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.refresh(req.body.refreshToken);

  sendSuccess(res, 200, MESSAGES.AUTH.REFRESH_SUCCESS, result);
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.body.refreshToken;
  await authService.logout(refreshToken);

  sendSuccess(res, 200, MESSAGES.AUTH.LOGOUT_SUCCESS);
});
