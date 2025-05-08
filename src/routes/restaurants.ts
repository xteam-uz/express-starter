import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";

const router: Router = Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ msg: "This is restaurants route" });
});

export default router;
