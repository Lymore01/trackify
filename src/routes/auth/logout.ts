import express from 'express';
import { logout } from "../../controllers/auth.ts";

export const logoutRouter = express.Router();

logoutRouter.post("/logout", async (req, res) => {
    await logout(req, res)
});