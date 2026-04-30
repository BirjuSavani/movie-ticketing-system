import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";
import fs from "fs";

const logDir = "logs";

// Ensure log directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

/**
 * File log format (JSON → good for production, monitoring tools)
 */
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

/**
 * Console log format (readable → good for dev)
 */
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(info => {
    return `${info.timestamp} ${info.level}: ${info.message}${info.stack ? "\n" + info.stack : ""}`;
  })
);

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",

  // Default format (for file logs)
  format: fileFormat,

  transports: [
    /**
     * Error logs (separate file)
     */
    new DailyRotateFile({
      filename: path.join(logDir, "error-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
      level: "error",
    }),

    /**
     * All logs
     */
    new DailyRotateFile({
      filename: path.join(logDir, "app-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),

    /**
     * IMPORTANT: Console logging for ALL environments
     * - Dev → colored readable logs
     * - Prod → JSON logs (for monitoring tools)
     */
    new winston.transports.Console({
      format: process.env.NODE_ENV === "production" ? fileFormat : consoleFormat,
    }),
  ],

  /**
   * Handle uncaught exceptions
   */
  exceptionHandlers: [
    new DailyRotateFile({
      filename: path.join(logDir, "exception-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
    new winston.transports.Console({
      format: consoleFormat,
    }),
  ],

  /**
   * Handle unhandled promise rejections
   */
  rejectionHandlers: [
    new DailyRotateFile({
      filename: path.join(logDir, "rejection-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
    new winston.transports.Console({
      format: consoleFormat,
    }),
  ],
});
