import express from "express";
import { getAllStats, getStats } from "../../controllers/stats.ts";
import { authMiddleware as apiKeyMiddleware } from "../../middlewares/auth_api.ts";

export const statsRouter = express.Router();

statsRouter.get("/me/stats", apiKeyMiddleware, async (req, res) => {
  await getAllStats(req, res);
});

statsRouter.get("/stats",apiKeyMiddleware, async (req, res) => {
  await getStats(req, res);
});
