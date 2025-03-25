import express from "express";
import { deleteUrl, redirectUrl, shortenUrl } from "../../controllers/url.ts";
import { authMiddleware as apiKeyMiddleware } from "../../middlewares/auth_api.ts"; //api key
// import { authenticateToken } from "../../middlewares/authenticate_token.ts";
import { trackClick } from "../../middlewares/click_tracker.ts";

export const urlRouter = express.Router();
//  redirect route - public
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
