import { Router } from "express";
import { validateRequest } from "@shared/middleware/validate-request.js";
import { UserController } from "./user.controller.js";
import { createUserBodySchema, updateUserBodySchema, userIdParamsSchema } from "./user.schemas.js";
import type { UserService } from "./user.service.js";

export const createUserRouter = (userService: UserService): Router => {
  const router = Router();
  const controller = new UserController(userService);

  router.get("/", controller.findAll);
  router.get("/:id", validateRequest({ params: userIdParamsSchema }), controller.findById);
  router.post("/", validateRequest({ body: createUserBodySchema }), controller.create);
  router.put(
    "/:id",
    validateRequest({ params: userIdParamsSchema, body: updateUserBodySchema }),
    controller.update,
  );
  router.delete("/:id", validateRequest({ params: userIdParamsSchema }), controller.delete);

  return router;
};
