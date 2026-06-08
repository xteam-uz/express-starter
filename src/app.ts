import express, { type Application } from "express";
import { createHealthRouter } from "@modules/health/health.routes.js";
import { createOpenApiRouter } from "@modules/openapi/openapi.routes.js";
import { MongooseUserRepository } from "@modules/users/user.repository.js";
import { createUserRouter } from "@modules/users/user.routes.js";
import { UserService } from "@modules/users/user.service.js";
import type { UserRepository } from "@modules/users/user.types.js";
import { requestId } from "@shared/http/request-id.js";
import { errorHandler } from "@shared/middleware/error-handler.js";
import { notFoundHandler } from "@shared/middleware/not-found.js";
import { rateLimit } from "@shared/middleware/rate-limit.js";
import { requestLogger } from "@shared/middleware/request-logger.js";
import { cors, securityHeaders } from "@shared/middleware/security.js";

export type AppDependencies = {
  userRepository?: UserRepository;
};

export const createApp = (dependencies: AppDependencies = {}): Application => {
  const app = express();
  const userRepository = dependencies.userRepository ?? new MongooseUserRepository();
  const userService = new UserService(userRepository);

  app.disable("x-powered-by");
  app.use(requestId);
  app.use(requestLogger);
  app.use(securityHeaders);
  app.use(cors);
  app.use(express.json({ limit: "100kb" }));
  app.use(rateLimit);

  app.use("/health", createHealthRouter());
  app.use("/docs", createOpenApiRouter());
  app.use("/api/users", createUserRouter(userService));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

export default createApp;
