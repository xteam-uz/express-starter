import mongoose from "mongoose";
import { logger } from "@config/logger.js";

export const connectDatabase = async (uri: string): Promise<void> => {
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  logger.info("Database connected");
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.connection.close(false);
  logger.info("Database disconnected");
};

export const isDatabaseReady = (): boolean => mongoose.connection.readyState === 1;
