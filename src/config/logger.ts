import { env } from "./env.js";

type LogPayload = Record<string, unknown>;
type LogLevel = "fatal" | "error" | "warn" | "info" | "debug" | "trace";

const levelOrder: Record<LogLevel | "silent", number> = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
  silent: 6,
};

const serializeError = (value: unknown): unknown => {
  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: env.NODE_ENV === "production" ? undefined : value.stack,
    };
  }

  return value;
};

const writeLog = (level: LogLevel, payload: LogPayload | string, message?: string): void => {
  if (levelOrder[level] > levelOrder[env.LOG_LEVEL]) {
    return;
  }

  const body = typeof payload === "string" ? { message: payload } : payload;

  console.log(
    JSON.stringify({
      level,
      time: new Date().toISOString(),
      service: "express-starter",
      environment: env.NODE_ENV,
      message,
      ...Object.fromEntries(Object.entries(body).map(([key, value]) => [key, serializeError(value)])),
    }),
  );
};

export const logger = {
  fatal: (payload: LogPayload | string, message?: string) => writeLog("fatal", payload, message),
  error: (payload: LogPayload | string, message?: string) => writeLog("error", payload, message),
  warn: (payload: LogPayload | string, message?: string) => writeLog("warn", payload, message),
  info: (payload: LogPayload | string, message?: string) => writeLog("info", payload, message),
  debug: (payload: LogPayload | string, message?: string) => writeLog("debug", payload, message),
  trace: (payload: LogPayload | string, message?: string) => writeLog("trace", payload, message),
};
