import type { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import type { User } from "@prisma/client";
import { config } from "../../config/config.ts";

export const authenticateToken: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ success: false, message: "Token is required" });
    return;
  }

  jwt.verify(token, config.JWT_SECRET!, (err, user) => {
    if (err) {
      res.status(403).json({ success: false, message: "Invalid token" });
      return;
    }
    try {
      if (typeof user === "object" && user !== null) {
        req.user = user as User;
        next();
      } else {
        res.status(403).json({ success: false, message: "Invalid token payload" });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });
};
