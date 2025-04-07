import express from "express";
import { deleteUrl, redirectUrl } from "../../controllers/url.ts";
import { authMiddleware as apiKeyMiddleware } from "../../middlewares/auth_api.ts";
import { trackClick } from "../../middlewares/click_tracker.ts";

export const urlRouter = express.Router();
urlRouter.get("/url/:shortId", trackClick, async (req, res) => {
  await redirectUrl(req, res);
});

urlRouter.delete(
  "/delete/:shortId",
  apiKeyMiddleware,
  async (req, res) => {
    await deleteUrl(req, res);
  }
);
