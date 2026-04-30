import { Request, Response } from "express";
import { MESSAGES } from "../../messages/messages";
import { catchAsync } from "../../utils/helpers";
import { sendSuccess } from "../../utils/sendResponse";
import * as movieService from "./service";

export const create = catchAsync(async (req: Request, res: Response) => {
  const movie = await movieService.create(req.body);

  sendSuccess(res, 201, MESSAGES.MOVIE.CREATE_SUCCESS, movie);
});

export const getAll = catchAsync(async (req: Request, res: Response) => {
  const result = await movieService.getAll(req.query);

  sendSuccess(res, 200, MESSAGES.MOVIE.FETCH_SUCCESS, result);
});

export const getById = catchAsync(async (req: Request, res: Response) => {
  const movie = await movieService.getById(req.params.id as string);

  sendSuccess(res, 200, MESSAGES.MOVIE.FETCH_SUCCESS, movie);
});

export const update = catchAsync(async (req: Request, res: Response) => {
  const movie = await movieService.update(req.params.id as string, req.body);

  sendSuccess(res, 200, MESSAGES.MOVIE.UPDATE_SUCCESS, movie);
});

export const deleteMovie = catchAsync(async (req: Request, res: Response) => {
  await movieService.softDelete(req.params.id as string);

  sendSuccess(res, 200, MESSAGES.MOVIE.DELETE_SUCCESS);
});
