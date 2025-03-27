import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.ts";
import { generateHMAC } from "../lib/utils.ts";

interface WebhookData {
  userId: string;
  email: string;
  password: string;
  callbackUrl: string;
}

export const listenEventsFromDocx = async (req: Request, res: Response) => {
  try {
    // validate signature
    const signature = req.headers["x-webhook-signature"] as string;
    const payload = JSON.stringify(req.body);
    const hash = generateHMAC(process.env.WEBHOOK_SECRET || "", payload);

    console.log("hash", hash);
    if (hash !== signature) {
      res.status(403).send("Invalid signature");
      return;
    }

    const { event, data } = req.body;

    if (!event || !data) {
      return res
        .status(400)
        .json({ success: false, message: "Missing event or data" });
    }

    switch (event) {
      case "user.created":
        if (!data.userId || !data.email || !data.password) {
          return res
            .status(400)
            .json({ success: false, message: "Invalid user data" });
        }
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
            userId: regData.newUser.id, //should be same as docx user id
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
        const userExists = await prisma.user.count({
          where: { id: data.userId },
        });
        if (!userExists) {
          throw new Error("User not found");
        }
        await fetch(`http://localhost:4030/user/${data.userId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        break;
      default:
        console.log(`Unhandled event: ${event}`);
        return res
          .status(400)
          .json({ success: false, message: "Unknown event type" });
    }
  } catch (error:any) {
    console.error("Webhook Error:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
