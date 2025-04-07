import express from "express";
import { getUser, deleteUser, updateUser } from "../../controllers/users.ts";
import { authMiddleware } from "../../middlewares/auth_api.ts";

export const userRouter = express.Router();

userRouter.use(authMiddleware);

userRouter.get("/user", async (req, res) => {
  await getUser(req, res);
});

userRouter.delete("/user/:id", async (req, res) => {
  await deleteUser(req, res);
});

userRouter.put("/user/:id", async (req, res) => {
  await updateUser(req, res);
});
