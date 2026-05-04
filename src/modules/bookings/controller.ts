import { Request, Response } from "express";
import { ROLES } from "../../config/constants";
import { MESSAGES } from "../../messages/messages";
import { catchAsync } from "../../utils/helpers";
import { sendSuccess } from "../../utils/sendResponse";
import * as bookingService from "./service";

export const reserve = catchAsync(async (req: Request, res: Response) => {
  const idempotencyKey = req.headers["idempotency-key"] as string | undefined;
  const result = await bookingService.reserve(req.user!.id, idempotencyKey, req.body);

  sendSuccess(res, 201, MESSAGES.BOOKING.SUCCESS.RESERVE, result);
});

export const confirm = catchAsync(async (req: Request, res: Response) => {
  const result = await bookingService.confirm(req.user!.id, req.params.id as string, req.body);

  sendSuccess(res, 200, MESSAGES.BOOKING.SUCCESS.CONFIRM, result);
});

export const cancel = catchAsync(async (req: Request, res: Response) => {
  const isAdmin = req.user!.role === ROLES.ADMIN;

  await bookingService.cancel(req.user!.id, req.params.id as string, isAdmin);

  sendSuccess(res, 200, MESSAGES.BOOKING.SUCCESS.CANCEL);
});

export const getMyBookings = catchAsync(async (req: Request, res: Response) => {
  const bookings = await bookingService.getMyBookings(req.user!.id);

  sendSuccess(res, 200, MESSAGES.BOOKING.SUCCESS.FETCH, bookings);
});

export const getById = catchAsync(async (req: Request, res: Response) => {
  const isAdmin = req.user!.role === ROLES.ADMIN;

  const booking = await bookingService.getById(req.user!.id, req.params.id as string, isAdmin);

  sendSuccess(res, 200, MESSAGES.BOOKING.SUCCESS.FETCH, booking);
});
