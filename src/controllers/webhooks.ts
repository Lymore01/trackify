import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.ts";
import axiosInstance from "../lib/axios.ts";
import { generateHMAC } from "../lib/utils.ts";
import { token } from "morgan";

// enum WebhookEvents {
//   "user.created"="user.created",
//   "user.deleted"="user.deleted",
// }

interface WebhookData {
  userId: string;
  email: string;
  password: string;
  callbackUrl: string;
}

export const listenEventsFromDocx = async (req: Request, res: Response) => {
  try {
    const signature = req.headers["x-webhook-signature"] as string;
    const payload = JSON.stringify(req.body);

    // Validate the HMAC signature
    // webhook_secret is shared between docx and the server
    const hash = generateHMAC(process.env.WEBHOOK_SECRET || "", payload);

    console.log("hash", hash);
    if (hash !== signature) {
      res.status(403).send("Invalid signature");
      return;
    }

    const { event, data } = req.body;

    switch (event) {
      case "user.created":
        // create a user
        const response = await fetch("http://localhost:4030/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: data.userId,
            email: data.email,
            password: data.password,
          }),
        });
        const regData = await response.json();
        await prisma.endpoint.create({
          data: {
            name: "Docx",
            url: data.callbackUrl,
            userId: regData.newUser.id,
          },
        });
        // return userid to docx
        res.status(200).json({
          success: true,
          message: "User created",
          userId: regData.newUser.id,
          token: regData.newUser.token,
        });
        // console.log("User created");
        break;
      case "user.deleted":
        const user = await prisma.user.findUnique({
          where: {
            id: data.userId,
          },
        });
        if (!user) {
          throw new Error("User not found");
        }
        // delete a user
        await axiosInstance.delete(`/user/${data.userId}`);
        break;
      default:
        console.log("Event not found");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
};
