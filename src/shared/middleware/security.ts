import type { RequestHandler } from "express";
import { env } from "@config/env.js";

export const securityHeaders: RequestHandler = (_req, res, next) => {
  res.setHeader("content-security-policy", "default-src 'self'; object-src 'none'; frame-ancestors 'none'");
  res.setHeader("x-content-type-options", "nosniff");
  res.setHeader("x-frame-options", "DENY");
  res.setHeader("x-dns-prefetch-control", "off");
  res.setHeader("x-download-options", "noopen");
  res.setHeader("x-permitted-cross-domain-policies", "none");
  res.setHeader("referrer-policy", "no-referrer");

  if (env.NODE_ENV === "production") {
    res.setHeader("strict-transport-security", "max-age=15552000; includeSubDomains");
  }

  next();
};

export const cors: RequestHandler = (req, res, next) => {
  const origin = req.header("origin");

  if (origin && env.CORS_ORIGINS.includes(origin)) {
    res.setHeader("access-control-allow-origin", origin);
    res.setHeader("access-control-allow-credentials", "true");
  }

  res.setHeader("access-control-allow-methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("access-control-allow-headers", "content-type,authorization,x-request-id");

  if (req.method === "OPTIONS") {
    res.status(204).send();
    return;
  }

  next();
};
