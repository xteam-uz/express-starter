type NodeEnvironment = "development" | "test" | "production";
type LogLevel = "fatal" | "error" | "warn" | "info" | "debug" | "trace" | "silent";

export type Env = {
  NODE_ENV: NodeEnvironment;
  HOST: string;
  PORT: number;
  DB_URI: string | undefined;
  CORS_ORIGINS: string[];
  LOG_LEVEL: LogLevel;
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX: number;
};

const allowedNodeEnvironments = new Set<NodeEnvironment>(["development", "test", "production"]);
const allowedLogLevels = new Set<LogLevel>(["fatal", "error", "warn", "info", "debug", "trace", "silent"]);

const readNumber = (name: string, fallback: number): number => {
  const rawValue = process.env[name];

  if (!rawValue) {
    return fallback;
  }

  const value = Number(rawValue);

  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${name} must be a positive integer`);
  }

  return value;
};

const readNodeEnv = (): NodeEnvironment => {
  const value = process.env.NODE_ENV ?? "development";

  if (!allowedNodeEnvironments.has(value as NodeEnvironment)) {
    throw new Error("NODE_ENV must be one of development, test, production");
  }

  return value as NodeEnvironment;
};

const readLogLevel = (): LogLevel => {
  const value = process.env.LOG_LEVEL ?? "info";

  if (!allowedLogLevels.has(value as LogLevel)) {
    throw new Error("LOG_LEVEL is invalid");
  }

  return value as LogLevel;
};

export const env: Env = {
  NODE_ENV: readNodeEnv(),
  HOST: process.env.HOST ?? "localhost",
  PORT: readNumber("PORT", 3000),
  DB_URI: process.env.DB_URI,
  CORS_ORIGINS: (process.env.CORS_ORIGINS ?? "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  LOG_LEVEL: readLogLevel(),
  RATE_LIMIT_WINDOW_MS: readNumber("RATE_LIMIT_WINDOW_MS", 15 * 60 * 1000),
  RATE_LIMIT_MAX: readNumber("RATE_LIMIT_MAX", 100),
};
