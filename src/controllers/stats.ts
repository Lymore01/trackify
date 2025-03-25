import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.ts";

// get all stats
export const getAllStats = async (req: Request, res: Response) => {    
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const stats = await prisma.urlShort.findMany({
    where: { userId: user.id },
    include: {
      clicks: true,
    },
  });

  return res.status(200).json({
    success: true,
    stats,
  });
};

// get stats for a short url
export const getStats = async (req: Request, res: Response) => {
  const shortId = typeof req.query.shortId === "string" ? req.query.shortId : undefined;
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!shortId) {
    return res.status(400).json({
      success: false,
      message: "Invalid short Id!",
    });
  }

  const stats = await prisma.urlShort.findUnique({
    where: { userId: user.id, shortId },
    include: {
      clicks: true,
    },
  });

  if(!stats) {
    return res.status(400).json({
      success: false,
      message: "Short url not found!",
    });
  }

  return res.status(200).json({
    success: true,
    stats,
  });
};
