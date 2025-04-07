// register, signin user
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.ts";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { config } from "../../config/config.ts";
import { generateAccessToken, generateRefreshToken } from "../lib/jwt.ts";

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
  const token = generateAccessToken(newUser);

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
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  if (!accessToken) {
    return res
      .status(500)
      .json({ success: false, message: "Error generating token" });
  }

  res.cookie("trackifyRefreshToken", refreshToken, {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return res.status(200).json({
    success: true,
    message: "User Logged In Successfully!",
    accessToken,
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

export const fetchNewAccessToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.trackifyRefreshToken;
  if (!refreshToken) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  jwt.verify(
    refreshToken,
    config.JWT_REFRESH_SECRET!,
    (err: any, user: any) => {
      if (err) {
        return res.status(403).json({ success: false, message: "Forbidden" });
      }
      const accessToken = generateAccessToken(user);
      return res.status(200).json({
        success: true,
        accessToken,
      });
    }
  );
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("trackifyRefreshToken", {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: "strict",
  });
  return res.status(200).json({
    success: true,
    message: "User Logged Out Successfully!",
  });
}
