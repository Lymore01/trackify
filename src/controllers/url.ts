import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.ts";
import { generateShortId } from "../lib/utils.ts";

// named export

export const deleteUrl = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { shortId } = req.params;

  if (!shortId) {
    return res.status(400).json({
      success: false,
      message: "Invalid short Id!",
    });
  }

  const shortUrl = await prisma.urlShort.findUnique({
    where: {
      shortId,
    },
  });

  if (!shortUrl) {
    return res.status(400).json({
      success: false,
      message: "Short url not found!",
    });
  }

  await prisma.urlShort.delete({
    where: {
      shortId,
    },
  });

  return res.status(200).json({
    success: true,
    message: "Short Url deleted Succcesfully!",
  });
};

// shorten url
export const shortenUrl = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const body: {
    original: string;
  } = req.body;
  const { original } = body;
  const { user } = req;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!original) {
    console.log("invalid long url");
    return res.status(400).json({
      success: false,
      message: "Invalid long Url!",
    });
  }

  // check if the url is already shortened
  const existingShortUrl = await prisma.urlShort.findFirst({
    where: {
      original,
    },
  });

  if (existingShortUrl) {
    console.log("existingShortUrl", existingShortUrl);
    return res.status(400).json({
      success: false,
      message: "Url already shortened!",
    });
  }

  const shortUrl = await prisma.urlShort.create({
    data: {
      shortId: generateShortId(),
      user: { connect: { id: user.id } },
      original,
    },
  });

  return res.status(200).json({
    success: true,
    shortUrl: shortUrl.shortId,
  });
};

//  redirect route
export const redirectUrl = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { shortId } = req.params;

  if (!shortId) {
    res.status(400).json({
      success: false,
      message: "Invalid short Id!",
    });
    return;
  }

  const shortUrl = await prisma.urlShort.findUnique({
    where: {
      shortId,
    },
    include: {
      clicks: true,
    },
  });

  if (!shortUrl) {
    res.status(400).json({
      success: false,
      message: "Short url not found!",
    });
    return;
  }

  return res.redirect(shortUrl.original);
};
