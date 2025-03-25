
import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.ts";

// get user
export const getUser = async (req: Request, res: Response) => {
  // get user from body
  const user = await prisma.user.findUnique({
    where: {
      id: req.user?.id,
    },
  });

  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "User does not exist" });
  }

  return res.status(200).json({
    success: true,
    message: "User Found Successfully!",
    user,
  });
};

// delete user
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ success: false, message: "Invalid request" });
  }

  const user = await prisma.user.delete({
    where: {
      id: id,
    },
  });

  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "User does not exist" });
  }

  return res
    .status(200)
    .json({ success: true, message: "User deleted successfully" });
};

// update user
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const body: {
    email: string;
    password: string;
  } = req.body;
  const { email, password } = body;

  if (!id) {
    return res.status(400).json({ success: false, message: "Invalid request" });
  }

  const user = await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      email,
      password,
    },
  });

  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "User does not exist" });
  }

  return res
    .status(200)
    .json({ success: true, message: "User updated successfully" });
};
