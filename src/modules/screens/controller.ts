import { Request, Response } from "express";
import { MESSAGES } from "../../messages/messages";
import { catchAsync } from "../../utils/helpers";
import { sendSuccess } from "../../utils/sendResponse";
import * as screenService from "./service";

export const create = catchAsync(async (req: Request, res: Response) => {
  const screen = await screenService.create(req.body);

  sendSuccess(res, 201, MESSAGES.SCREEN.SUCCESS.CREATE, screen);
});

export const getAll = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const screens = await screenService.getAll(page, limit);

  sendSuccess(res, 200, MESSAGES.SCREEN.SUCCESS.FETCH, screens);
});

export const getById = catchAsync(async (req: Request, res: Response) => {
  const screen = await screenService.getById(req.params.id as string);

  sendSuccess(res, 200, MESSAGES.SCREEN.SUCCESS.FETCH, screen);
});
