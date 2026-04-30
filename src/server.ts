import app from "./app";
import { AppDataSource } from "./config/database";
import { env } from "./config/env";
import { startHoldExpiryJob } from "./jobs/holdExpiry";
import { logger } from "./utils/logger";

let server: any;

const PORT = env.PORT;
const NODE_ENV = env.NODE_ENV;

const startServer = async () => {
  try {
    logger.info(`Starting server in ${NODE_ENV} mode on port ${PORT}`);

    // 1. DB Connection
    await AppDataSource.initialize();
    logger.info("Database connected");

    // 2. Migration Strategy
    if (NODE_ENV === "production") {
      // ONLY CHECK in production
      const hasPendingMigrations = await AppDataSource.showMigrations();

      if (hasPendingMigrations) {
        logger.error(
          "Pending migrations detected. Please run migrations before starting server."
        );
        process.exit(1);
      }

      logger.info("Database is up to date");
    } else {
      // DEV: Just warn (do not block)
      const hasPendingMigrations = await AppDataSource.showMigrations();

      if (hasPendingMigrations) {
        logger.warn("Pending migrations found. Run `npm run migration:run`");
      }
    }

    // 3. Cron Jobs
    const holdExpiryJob = startHoldExpiryJob();
    logger.info("Cron jobs started");

    // 4. Start Server
    server = app.listen(PORT, "0.0.0.0", () => {
      logger.info(`🚀 Server running on port ${PORT} (${NODE_ENV})`);
    });

    server.on("error", (err: any) => {
      logger.error("Server error:", err);
      process.exit(1);
    });

    // 5. Graceful Shutdown
    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}`);

      server?.close(() => logger.info("Server closed"));
      holdExpiryJob?.stop();

      if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
        logger.info("Database connection closed");
      }

      setTimeout(() => process.exit(0), 500);
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    logger.error("Startup error:", error);
    process.exit(1);
  }
};

startServer();
