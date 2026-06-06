import type { RequestHandler } from "express";
import { logger } from "@config/logger.js";

export const requestLogger: RequestHandler = (req, res, next) => {
  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;

    logger.info(
      {
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        durationMs: Number(durationMs.toFixed(3)),
        requestId: res.getHeader("x-request-id"),
      },
      "Request completed",
    );
  });

  next();
};
