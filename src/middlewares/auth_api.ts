import type { User } from "@prisma/client";
import { prisma } from "../lib/prisma.ts";
import type { Request, Response, NextFunction } from "express";


export const authMiddleware = async (
  req: Request,
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
      apiKey,
    },
  });

  if (!user) {
    res.status(403).json({ error: "Invalid API Key" });
    return;
  }
  if (typeof user === "object" && user !== null) {
    req.user = user as User;
    next();
  } else {
    res.status(403).json({ error: "Invalid user" });
    return;
  }
};
