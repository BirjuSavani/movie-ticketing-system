import { Request, Response } from "express";
import { MESSAGES } from "../../messages/messages";
import { catchAsync } from "../../utils/helpers";
import { sendSuccess } from "../../utils/sendResponse";
import * as showtimeService from "./service";

export const create = catchAsync(async (req: Request, res: Response) => {
  const showtime = await showtimeService.create(req.body);

  sendSuccess(res, 201, MESSAGES.SHOWTIME.CREATE_SUCCESS, showtime);
});

export const getAll = catchAsync(async (req: Request, res: Response) => {
  const showtimes = await showtimeService.getAll(req.query);

  sendSuccess(res, 200, MESSAGES.SHOWTIME.FETCH_SUCCESS, showtimes);
});

export const getById = catchAsync(async (req: Request, res: Response) => {
  const showtime = await showtimeService.getById(req.params.id as string);

  sendSuccess(res, 200, MESSAGES.SHOWTIME.FETCH_SUCCESS, showtime);
});

export const getSeats = catchAsync(async (req: Request, res: Response) => {
  const seats = await showtimeService.getSeats(req.params.id as string);

  sendSuccess(res, 200, MESSAGES.SHOWTIME.FETCH_SUCCESS, seats);
});
