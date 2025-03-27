import { prisma } from "../lib/prisma.ts";
import geoip from "geoip-lite";
import { UAParser } from "ua-parser-js";
import requestIp from "request-ip";
import type { Response, Request, NextFunction } from "express";
import axiosInstance from "../lib/axios.ts";

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

  // get the owner of the shortId
  const url = await prisma.urlShort.findFirst({
    where: {
      shortId,
    },
    select: {
      userId: true,
    },
  });

  // fetch endpoint from db
  const endpoint = await prisma.endpoint.findFirst({
    where: {
      userId: url?.userId,
    },
  });
  // use docx endpoint to send data
  if (endpoint?.url) {
    await fetch(endpoint.url, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        "X-User-ID": url?.userId || "",
      }),
      body: JSON.stringify({
        event: "link.clicked",
        data: {
          shortId,
          ip,
          country: geo?.country || "unknown",
          userAgent: deviceInfo.ua || "unknown",
        },
      }),
      });
  } else {
    console.warn("No webhook endpoint found for user:", url?.userId);
  }

  next(); 
};
