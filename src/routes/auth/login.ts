import express from "express";
import { login } from "../../controllers/auth.ts";

export const loginRouter = express.Router();

loginRouter.post("/login", async (req, res) => {
    await login(req, res)
});