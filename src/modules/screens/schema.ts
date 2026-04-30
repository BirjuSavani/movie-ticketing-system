import Joi from "joi";
import { SEAT_TYPES } from "../../config/constants";

export const createScreenSchema = Joi.object({
  name: Joi.string().trim().max(100).required().messages({
    "string.empty": "Screen name is required",
    "string.max": "Screen name cannot exceed 100 characters",
    "any.required": "Screen name is required",
  }),

  totalSeats: Joi.number().integer().min(1).required().messages({
    "number.base": "Total seats must be a number",
    "number.min": "Total seats must be at least 1",
    "any.required": "Total seats is required",
  }),

  rows: Joi.number().integer().min(1).required().messages({
    "number.base": "Rows must be a number",
    "number.min": "Rows must be at least 1",
    "any.required": "Rows is required",
  }),

  seatsPerRow: Joi.number().integer().min(1).required().messages({
    "number.base": "Seats per row must be a number",
    "number.min": "Seats per row must be at least 1",
    "any.required": "Seats per row is required",
  }),

  rowTypeMapping: Joi.object()
    .pattern(Joi.string().length(1).uppercase(), Joi.string().valid(...Object.values(SEAT_TYPES)))
    .required()
    .messages({
      "object.base": "Row type mapping must be an object",
      "any.required": "Row type mapping is required",
    }),
});

export const screenIdSchema = Joi.object({
  id: Joi.string().trim().uuid().required().messages({
    "string.empty": "Screen ID is required",
    "string.uuid": "Invalid screen ID format",
    "any.required": "Screen ID is required",
  }),
});
