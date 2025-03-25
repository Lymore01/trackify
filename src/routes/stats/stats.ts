import express from "express";
import { getAllStats, getStats } from "../../controllers/stats.ts";
// import { authenticateToken } from "../../middlewares/authenticate_token.ts";
import { authMiddleware as apiKeyMiddleware } from "../../middlewares/auth_api.ts";

export const statsRouter = express.Router();

// statsRouter.use(authenticateToken);
statsRouter.use(apiKeyMiddleware);

statsRouter.get("/me/stats", async (req, res) => {
  await getAllStats(req, res);
});

statsRouter.get("/stats", async (req, res) => {
  await getStats(req, res);
});
