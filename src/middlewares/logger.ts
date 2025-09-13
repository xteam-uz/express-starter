import { type NextFunction, type Request, type Response } from "express";
import chalk from "chalk";

export const logger = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const start = process.hrtime.bigint();

    res.on("finish", () => {
        const end = process.hrtime.bigint();
        const duration = Number(end - start) / 1_000_000; // ms
        const length = res.getHeader("content-length") || 0;

        let coloredMethod;
        switch (req.method) {
            case "GET":
                coloredMethod = chalk.green(req.method);
                break;
            case "POST":
                coloredMethod = chalk.blue(req.method);
                break;
            case "DELETE":
                coloredMethod = chalk.red(req.method);
                break;
            default:
                coloredMethod = chalk.white(req.method);
        }

        console.log(
            `${coloredMethod} ${req.originalUrl} ${res.statusCode} ${duration.toFixed(
                3,
            )} ms - ${length}`,
        );
    });
    next();
};
