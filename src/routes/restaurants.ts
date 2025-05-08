import { validate } from "@middlewares/validate.js";
import { RestaurantSchema, type Restaurant } from "@schemas/restaurant.js";
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
    res.send("Hello");
  }
);

export default router;
