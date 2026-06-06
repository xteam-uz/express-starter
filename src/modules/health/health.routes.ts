import { Router } from "express";
import { isDatabaseReady } from "@infrastructure/database/mongoose.js";

export const createHealthRouter = (): Router => {
  const router = Router();

  router.get("/live", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  router.get("/ready", (_req, res) => {
    const databaseReady = isDatabaseReady();

    res.status(databaseReady ? 200 : 503).json({
      status: databaseReady ? "ready" : "not_ready",
      checks: {
        database: databaseReady ? "up" : "down",
      },
    });
  });

  return router;
};
