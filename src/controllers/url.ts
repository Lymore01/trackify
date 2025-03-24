import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import express from "express";

// named export

export const deleteUrl = async (req: Request, res: Response): Promise<Response> => {
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
