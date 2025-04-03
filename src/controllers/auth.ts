// register, signin user
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.ts";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

const SALT = 10;

export const register = async (req: Request, res: Response) => {
  // get user from body
  const body: {
    id: string;
    email: string;
    password: string;
  } = req.body;
  const { id, email, password } = body;
  // check if user exists
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (user) {
    return res
      .status(400)
      .json({ success: false, message: "User already exists" });
  }
  // create user
  const hashedPassword = await bcrypt.hash(password, SALT);
  const newUser = await prisma.user.create({
    data: {
      id: id,
      email: email,
      password: hashedPassword,
    },
  });

  // generate token
  const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });

  if (!token) {
    return res
      .status(500)
      .json({ success: false, message: "Error generating token" });
  }

  return res.status(201).json({
    success: true,
    message: "User Registered Successfully!",
    newUser,
    token,
  });
};

// login user
export const login = async (req: Request, res: Response) => {
  // get user from body
  const body: {
    email: string;
    password: string;
  } = req.body;
  const { email, password } = body;
  // check if user exists
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "User does not exist" });
  }

  // compare password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid credentials" });
  }

  // generate token
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });

  if (!token) {
    return res
      .status(500)
      .json({ success: false, message: "Error generating token" });
  }

  return res.status(200).json({
    success: true,
    message: "User Logged In Successfully!",
    token,
  });
};

// generate api key using uuid
export const generateApiKey = async (req: Request, res: Response) => {
  const apiKey = uuidv4();
  const { user } = req;
  // update user with api key
  const updatedUser = await prisma.user.update({
    where: {
      id: user?.id,
    },
    data: {
      apiKey,
    },
  });
  if (!updatedUser) {
    return res
      .status(500)
      .json({ success: false, message: "Error generating API Key" });
  }
  return res.status(200).json({
    success: true,
    message: "API Key Generated Successfully!",
    apiKey,
  });
};
