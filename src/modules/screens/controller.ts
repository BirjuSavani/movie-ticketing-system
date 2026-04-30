import { Request, Response } from "express";
import { MESSAGES } from "../../messages/messages";
import { catchAsync } from "../../utils/helpers";
import { sendSuccess } from "../../utils/sendResponse";
import * as screenService from "./service";

export const create = catchAsync(async (req: Request, res: Response) => {
  const screen = await screenService.create(req.body);

  sendSuccess(res, 201, MESSAGES.SCREEN.CREATE_SUCCESS, screen);
});

export const getAll = catchAsync(async (req: Request, res: Response) => {
  const screens = await screenService.getAll();

  sendSuccess(res, 200, MESSAGES.SCREEN.FETCH_SUCCESS, screens);
});

export const getById = catchAsync(async (req: Request, res: Response) => {
  const screen = await screenService.getById(req.params.id as string);

  sendSuccess(res, 200, MESSAGES.SCREEN.FETCH_SUCCESS, screen);
});
