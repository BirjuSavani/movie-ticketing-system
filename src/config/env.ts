import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config();

const envSchema = Joi.object({
  PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),

  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  TEST_DB_NAME: Joi.string().required(),

  ACCESS_TOKEN_SECRET: Joi.string().required(),
  ACCESS_TOKEN_EXPIRES_IN: Joi.string().default('15m'),
  REFRESH_TOKEN_SECRET: Joi.string().required(),
  REFRESH_TOKEN_EXPIRES_IN: Joi.string().default('7d'),

  BCRYPT_SALT_ROUNDS: Joi.number().default(12),

  RATE_LIMIT_AUTH_WINDOW_MS: Joi.number().default(900000), // 15 minutes
  RATE_LIMIT_AUTH_MAX: Joi.number().default(10), // 10 attempts per 15 minutes for auth routes
  RATE_LIMIT_BOOKING_WINDOW_MS: Joi.number().default(60000), // 1 minute
  RATE_LIMIT_BOOKING_MAX: Joi.number().default(20), // 20 attempts per minute for booking routes
  RATE_LIMIT_GENERAL_WINDOW_MS: Joi.number().default(60000), // 1 minute
  RATE_LIMIT_GENERAL_MAX: Joi.number().default(100), // 100 attempts per minute for general routes

  SEAT_HOLD_DURATION_MINUTES: Joi.number().default(10) // Duration to hold seats in minutes (10 by default)
}).unknown(true);

const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const env = {
  PORT: envVars.PORT,
  NODE_ENV: envVars.NODE_ENV,

  DB_HOST: envVars.DB_HOST,
  DB_PORT: envVars.DB_PORT,
  DB_USERNAME: envVars.DB_USERNAME,
  DB_PASSWORD: envVars.DB_PASSWORD,
  DB_NAME: envVars.DB_NAME,
  TEST_DB_NAME: envVars.TEST_DB_NAME,

  ACCESS_TOKEN_SECRET: envVars.ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES_IN: envVars.ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_SECRET: envVars.REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRES_IN: envVars.REFRESH_TOKEN_EXPIRES_IN,

  BCRYPT_SALT_ROUNDS: envVars.BCRYPT_SALT_ROUNDS,

  RATE_LIMIT_AUTH_WINDOW_MS: envVars.RATE_LIMIT_AUTH_WINDOW_MS,
  RATE_LIMIT_AUTH_MAX: envVars.RATE_LIMIT_AUTH_MAX,
  RATE_LIMIT_BOOKING_WINDOW_MS: envVars.RATE_LIMIT_BOOKING_WINDOW_MS,
  RATE_LIMIT_BOOKING_MAX: envVars.RATE_LIMIT_BOOKING_MAX,
  RATE_LIMIT_GENERAL_WINDOW_MS: envVars.RATE_LIMIT_GENERAL_WINDOW_MS,
  RATE_LIMIT_GENERAL_MAX: envVars.RATE_LIMIT_GENERAL_MAX,

  SEAT_HOLD_DURATION_MINUTES: envVars.SEAT_HOLD_DURATION_MINUTES
};
