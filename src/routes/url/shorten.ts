import express, { type Response, type Request } from "express";
import { shortenUrl } from "../../controllers/url.ts";
import { authMiddleware as apiKeyMiddleware } from "../../middlewares/auth_api.ts"; //api key
// import { authenticateToken } from "../../middlewares/authenticate_token.ts";
import { validateUrl } from "../../middlewares/url_validation.ts";

export const shortenRouter = express.Router();

shortenRouter.post(
  "/shorten",
  apiKeyMiddleware,
  validateUrl,
  async (req:Request, res:Response) => {
    await shortenUrl(req, res);
  }
);
