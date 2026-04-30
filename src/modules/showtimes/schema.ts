import Joi from "joi";

export const createShowtimeSchema = Joi.object({
  movieId: Joi.string().trim().uuid().required().messages({
    "string.empty": "Movie ID is required",
    "string.uuid": "Invalid movie ID format",
    "any.required": "Movie ID is required",
  }),

  screenId: Joi.string().trim().uuid().required().messages({
    "string.empty": "Screen ID is required",
    "string.uuid": "Invalid screen ID format",
    "any.required": "Screen ID is required",
  }),

  startsAt: Joi.date().iso().required().messages({
    "date.base": "Start time must be a valid date",
    "date.format": "Start time must be in ISO format",
    "any.required": "Start time is required",
  }),

  endsAt: Joi.date().iso().min(Joi.ref("startsAt")).required().messages({
    "date.base": "End time must be a valid date",
    "date.min": "End time must be after start time",
    "any.required": "End time is required",
  }),

  basePrice: Joi.number().positive().required().messages({
    "number.base": "Base price must be a number",
    "number.positive": "Base price must be greater than 0",
    "any.required": "Base price is required",
  }),
});

export const getShowtimesFilterSchema = Joi.object({
  movieId: Joi.string().trim().uuid().optional().messages({
    "string.uuid": "Invalid movie ID format",
  }),

  screenId: Joi.string().trim().uuid().optional().messages({
    "string.uuid": "Invalid screen ID format",
  }),

  date: Joi.date().iso().optional().messages({
    "date.base": "Date must be valid",
    "date.format": "Date must be in ISO format (YYYY-MM-DD)",
  }),
});

export const showtimeIdSchema = Joi.object({
  id: Joi.string().trim().uuid().required().messages({
    "string.empty": "Showtime ID is required",
    "string.uuid": "Invalid showtime ID format",
    "any.required": "Showtime ID is required",
  }),
});
