import express from "express"
import { listenEventsFromDocx } from "../../controllers/webhooks.ts";

export const webHookRouter = express.Router();

webHookRouter.post("/docx", async (req, res) => {
  await listenEventsFromDocx(req, res);
});

// use this api endpoint in docx for it to send you data
// http://localhost:4030/webhook/docx
