import Joi from "joi";
import { MOVIE_RATINGS } from "../../config/constants";

export const createMovieSchema = Joi.object({
  title: Joi.string().trim().max(255).required().messages({
    "string.empty": "Title is required",
    "string.max": "Title cannot exceed 255 characters",
    "any.required": "Title is required",
  }),

  description: Joi.string().trim().required().messages({
    "string.empty": "Description is required",
    "any.required": "Description is required",
  }),

  genre: Joi.string().trim().max(100).required().messages({
    "string.empty": "Genre is required",
    "string.max": "Genre cannot exceed 100 characters",
    "any.required": "Genre is required",
  }),

  language: Joi.string().trim().max(50).required().messages({
    "string.empty": "Language is required",
    "string.max": "Language cannot exceed 50 characters",
    "any.required": "Language is required",
  }),

  durationMinutes: Joi.number().min(1).required().messages({
    "number.base": "Duration must be a number",
    "number.min": "Duration must be at least 1 minute",
    "any.required": "Duration is required",
  }),

  rating: Joi.string()
    .valid(...Object.values(MOVIE_RATINGS))
    .required()
    .messages({
      "any.only": "Invalid movie rating",
      "any.required": "Rating is required",
    }),

  releaseDate: Joi.date().iso().required().messages({
    "date.base": "Invalid date format",
    "any.required": "Release date is required",
  }),

  posterUrl: Joi.string().uri().optional().messages({
    "string.uri": "Poster URL must be a valid URL",
  }),

  isActive: Joi.boolean().optional(),
});

export const updateMovieSchema = createMovieSchema.fork(
  Object.keys(createMovieSchema.describe().keys),
  schema => schema.optional()
);

export const getMoviesFilterSchema = Joi.object({
  genre: Joi.string().optional(),
  language: Joi.string().optional(),
  rating: Joi.string()
    .valid(...Object.values(MOVIE_RATINGS))
    .optional(),

  search: Joi.string().optional(),

  sortBy: Joi.string().valid("releaseDate", "title").default("releaseDate").messages({
    "any.only": "sortBy must be releaseDate or title",
  }),

  sortOrder: Joi.string().valid("ASC", "DESC", "asc", "desc").default("DESC").messages({
    "any.only": "sortOrder must be ASC or DESC",
  }),

  page: Joi.number().min(1).default(1).messages({
    "number.min": "Page must be greater than 0",
  }),

  limit: Joi.number().min(1).max(100).default(10).messages({
    "number.min": "Limit must be at least 1",
    "number.max": "Limit cannot exceed 100",
  }),
});

export const movieIdSchema = Joi.object({
  id: Joi.string().trim().uuid().required().messages({
    "string.empty": "Movie ID is required",
    "string.uuid": "Invalid movie ID format",
    "any.required": "Movie ID is required",
  }),
});
