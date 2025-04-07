import { fetchNewAccessToken } from "../../controllers/auth.ts";
import express from 'express';

export const getNewTokenRouter = express.Router();

getNewTokenRouter.post("/token", async (req, res) => {
    await fetchNewAccessToken(req, res)
});
