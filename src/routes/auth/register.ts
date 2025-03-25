import express from "express";
import { register } from "../../controllers/auth.ts";

export const registerRouter = express.Router();

registerRouter.post("/register", async (req, res) => {
    await register(req, res)
});