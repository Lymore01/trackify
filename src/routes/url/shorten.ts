import express from "express";
import { shortenUrl } from "../../controllers/url.ts";
import { authMiddleware as apiKeyMiddleware } from "../../middlewares/auth_api.ts"; //api key
// import { authenticateToken } from "../../middlewares/authenticate_token.ts";
import { validateUrl } from "../../middlewares/url_validation.ts";

export const shortenRouter = express.Router();

// shortenRouter.use(authenticateToken);
shortenRouter.use(apiKeyMiddleware);
shortenRouter.use(validateUrl);

shortenRouter.post("/shorten", async (req, res) => {
  await shortenUrl(req, res);
});
