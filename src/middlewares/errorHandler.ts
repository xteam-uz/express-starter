import { type Request, type Response, type NextFunction } from "express";

export function errorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction,
) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
}
