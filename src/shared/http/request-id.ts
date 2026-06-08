import { randomUUID } from "node:crypto";
import type { RequestHandler } from "express";

export const requestId: RequestHandler = (req, res, next) => {
  const existingRequestId = req.header("x-request-id");
  const id = existingRequestId && existingRequestId.length > 0 ? existingRequestId : randomUUID();

  res.setHeader("x-request-id", id);
  next();
};
