export const DEVELOPMENT = process.env.NODE_ENV === "development";
export const PRODUCTION = process.env.NODE_ENV === "production";

export const SERVER_HOST = process.env.HOST || "localhost";
export const SERVER_PORT = process.env.PORT || "8000";
