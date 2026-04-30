import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(255).required().messages({
    "string.base": "Name must be a string",
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name must not exceed 255 characters",
    "any.required": "Name is required",
  }),

  email: Joi.string().trim().lowercase().email().required().messages({
    "string.email": "Please provide a valid email address",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),

  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/)
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters",
      "string.max": "Password cannot exceed 128 characters",
      "string.pattern.base": "Password must contain at least one letter and one number",
      "string.empty": "Password is required",
      "any.required": "Password is required",
    }),
});

export const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required().messages({
    "string.email": "Please provide a valid email address",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),

  password: Joi.string().required().messages({
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
});

export const refreshSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    "string.empty": "Refresh token is required",
    "any.required": "Refresh token is required",
  }),
});
