import { prisma } from "../lib/prisma.ts";
import geoip from "geoip-lite";
import { UAParser } from "ua-parser-js";
import requestIp from "request-ip";
import type { Response, Request, NextFunction } from "express";

export const trackClick = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { shortId } = req.params;
  // get ip
  const ip = requestIp.getClientIp(req);
  // get geo from ip
  const geo = ip ? geoip.lookup(ip) : null;
  // get user agent
  const userAgent = req.headers["user-agent"];
  // get device info
  const parser = new UAParser(userAgent);
  const deviceInfo = parser.getResult();

  await prisma.clickTracker.create({
    data: {
      url: { connect: { shortId } },
      ip: ip || "unknown",
      country: geo?.country || "unknown",
      userAgent: deviceInfo.ua || "unknown",
    },
  });

  next();
};
