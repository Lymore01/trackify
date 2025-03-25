// post, get, delete user, update (generate new api key)
import express from "express";
import { getUser, deleteUser, updateUser } from "../../controllers/users.ts";
import { authenticateToken } from "../../middlewares/authenticate_token.ts";

export const userRouter = express.Router();

userRouter.use(authenticateToken);

userRouter.get("/user", async (req, res) => {
  await getUser(req, res);
});

userRouter.delete("/user/:id", async (req, res) => {
  await deleteUser(req, res);
});

userRouter.put("/user/:id", async (req, res) => {
  await updateUser(req, res);
});
