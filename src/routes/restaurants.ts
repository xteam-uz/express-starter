import { validate } from "@middlewares/validate.js";
import { RestaurantSchema, type Restaurant } from "@schemas/restaurant.js";
import { initializeRedisClient } from "@utils/client.js";
import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";

const router: Router = Router();

router.post(
  "/",
  validate(RestaurantSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body as Restaurant;
    const client = await initializeRedisClient();
    res.send("Hello");
  }
);

export default router;
