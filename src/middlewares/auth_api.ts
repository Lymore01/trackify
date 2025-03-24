import { prisma } from "../lib/prisma";
import { Request, Response, NextFunction } from "express";

interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const apiKey = Array.isArray(req.headers["x-api-key"])
    ? req.headers["x-api-key"][0]
    : req.headers["x-api-key"];

  if (!apiKey) {
    res.status(401).json({ error: "API Key required" });
    return;
  }

  const user = await prisma.user.findUnique({
    where: {
      apiKey
    },
  });

  if (!user) {
    res.status(403).json({ error: "Invalid API Key" });
    return;
  }

  req.user = user;
  next();
};
