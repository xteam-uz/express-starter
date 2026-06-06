import type { RequestHandler } from "express";
import { env } from "@config/env.js";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const clients = new Map<string, RateLimitEntry>();

export const rateLimit: RequestHandler = (req, res, next) => {
  const now = Date.now();
  const key = req.ip ?? "unknown";
  const entry = clients.get(key);

  if (!entry || entry.resetAt <= now) {
    clients.set(key, { count: 1, resetAt: now + env.RATE_LIMIT_WINDOW_MS });
    next();
    return;
  }

  entry.count += 1;

  if (entry.count > env.RATE_LIMIT_MAX) {
    res.status(429).json({
      error: {
        code: "RATE_LIMIT_EXCEEDED",
        message: "Too many requests",
      },
    });
    return;
  }

  next();
};
