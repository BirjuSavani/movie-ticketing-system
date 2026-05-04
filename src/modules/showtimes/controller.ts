import { MESSAGES } from "../../messages/messages";
import { catchAsync } from "../../utils/helpers";
import { sendSuccess } from "../../utils/sendResponse";
import { Request, Response } from "express";
import * as showtimeService from "./service";

export const create = catchAsync(async (req: Request, res: Response) => {
  const showtime = await showtimeService.create(req.body);

  sendSuccess(res, 201, MESSAGES.SHOWTIME.SUCCESS.CREATE, showtime);
});

export const getAll = catchAsync(async (req: Request, res: Response) => {
  const showtime = await showtimeService.getAll({
    ...req.query,
    page: Number(req.query.page),
    limit: Number(req.query.limit),
  });

  sendSuccess(res, 200, MESSAGES.SHOWTIME.SUCCESS.FETCH, showtime);
});

export const getById = catchAsync(async (req: Request, res: Response) => {
  const showtime = await showtimeService.getById(req.params.id as string);

  sendSuccess(res, 200, MESSAGES.SHOWTIME.SUCCESS.FETCH, showtime);
});

export const getSeats = catchAsync(async (req: Request, res: Response) => {
  const seats = await showtimeService.getSeats(req.params.id as string);

  sendSuccess(res, 200, MESSAGES.SHOWTIME.SUCCESS.FETCH, seats);
});
