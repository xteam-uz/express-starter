import type { Server } from "node:http";
import { env } from "@config/env.js";
import { logger } from "@config/logger.js";
import { connectDatabase, disconnectDatabase } from "@infrastructure/database/mongoose.js";
import { createApp } from "./app.js";

const start = async (): Promise<Server> => {
  if (env.DB_URI) {
    await connectDatabase(env.DB_URI);
  } else {
    logger.warn("DB_URI is not configured. Database-backed routes will fail until it is provided.");
  }

  const app = createApp();
  const server = app.listen(env.PORT, env.HOST, () => {
    logger.info({ host: env.HOST, port: env.PORT }, "Server started");
  });

  const shutdown = async (signal: NodeJS.Signals): Promise<void> => {
    logger.info({ signal }, "Shutdown signal received");
    server.close(async () => {
      await disconnectDatabase();
      logger.info("Shutdown complete");
      process.exit(0);
    });
  };

  process.on("SIGTERM", (signal) => {
    void shutdown(signal);
  });

  process.on("SIGINT", (signal) => {
    void shutdown(signal);
  });

  return server;
};

void start().catch((error: unknown) => {
  logger.fatal({ err: error }, "Failed to start server");
  process.exit(1);
});
