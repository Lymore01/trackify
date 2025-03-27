import express, { type Request, type Response } from "express"
import { listenEventsFromDocx } from "../../controllers/webhooks.ts";

export const webHookRouter = express.Router();

const webHookHandlers: Record<string, Function> = {
  docx: listenEventsFromDocx,
  // more handlers here
};

webHookRouter.post("/:service", async (req: Request, res: Response): Promise<void> => {
  const { service } = req.params;
  const handler = webHookHandlers[service];
  if (!handler) {
    res.status(404).send("Service not found");
    return;
  }
  await handler(req, res);
});

