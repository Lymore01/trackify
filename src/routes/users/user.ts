// delete user
import express from "express"

export const userRouter = express.Router();

userRouter.delete("/user/:id")