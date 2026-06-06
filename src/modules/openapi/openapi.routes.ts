import { Router } from "express";

const openApiDocument = {
  openapi: "3.1.0",
  info: {
    title: "Express Starter API",
    version: "2.0.0",
  },
  paths: {
    "/health/live": {
      get: {
        summary: "Liveness check",
        responses: {
          "200": { description: "Application is alive" },
        },
      },
    },
    "/health/ready": {
      get: {
        summary: "Readiness check",
        responses: {
          "200": { description: "Application is ready" },
          "503": { description: "Application is not ready" },
        },
      },
    },
    "/api/users": {
      get: {
        summary: "List users",
        responses: { "200": { description: "Users returned" } },
      },
      post: {
        summary: "Create user",
        responses: {
          "201": { description: "User created" },
          "400": { description: "Validation failed" },
          "409": { description: "Email already registered" },
        },
      },
    },
  },
};

export const createOpenApiRouter = (): Router => {
  const router = Router();

  router.get("/openapi.json", (_req, res) => {
    res.status(200).json(openApiDocument);
  });

  return router;
};
