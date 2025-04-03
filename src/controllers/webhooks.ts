import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.ts";
import { generateHMAC } from "../lib/utils.ts";
import Webhook, {
  MissingHeadersError,
  VerificationFailedError,
} from "../lib/webhook.ts";
import type { UserJSON, WebhookEvent } from "../../@types/Webhooks.js";

interface WebhookData {
  userId: string;
  email: string;
  password: string;
  callbackUrl: string;
}

export const listenEventsFromDocx = async (req: Request, res: Response) => {
  try {
    // validate signature
    const TRACKIFY_SIGNING_SECRET = process.env.WEBHOOK_SECRET;

    if (!TRACKIFY_SIGNING_SECRET) {
      throw new Error(
        "Error: Please add TRACKIFY_SIGNING_SECRET from Docx Dashboard to .env or .env"
      );
    }

    // create trackify webhook with secret
    const wh = new Webhook(TRACKIFY_SIGNING_SECRET);

    // get headers
    const signature = req.headers["x-webhook-signature"] as string;
    const apiKey = req.headers["x-api-key"] as string;

    if (!signature || !apiKey) {
      throw new MissingHeadersError("Missing headers");
    }

    const payload = req.body;
    const body = JSON.stringify(payload);

    let evt: WebhookEvent;

    try {
      evt = wh.verify(body, {
        "webhook-signature": signature,
      }) as WebhookEvent;
    } catch (error) {
      if (error instanceof VerificationFailedError) {
        console.error(`${error.name}:`, error.message);
      } else {
        console.error("Unexpected error:", error);
      }
      return res.status(401).json({ success: false, message: "Verification failed" });
    }

    const data = evt.data as UserJSON;
    const eventType = evt.type

    switch (eventType) {
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
            "x-api-key": apiKey,
          },
        });

        break;
      default:
        console.log(`Unhandled event: ${event}`);
        return res
          .status(400)
          .json({ success: false, message: "Unknown event type" });
    }
  } catch (error: any) {
    console.error("Webhook Error:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
