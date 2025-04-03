interface UserJSON {
  userId: string;
  email: string;
  password: string;
  callbackUrl: string;
}

interface LinkJSON {
  shortId: string;
  ip: string;
  country: string | "unknown";
  userAgent: string | "unknown";
}

type Webhook<EvtType, Data> = {
  type: EvtType;
  data: Data;
};

export type UserWebhookEvent = Webhook<
  "user.created" | "user.deleted",
  UserJSON
>;

export type LinkWebhookEvent = Webhook<
  "link.clicked" | "link.deleted",
  LinkJSON
>;
export type WebhookEvent = UserWebhookEvent | LinkWebhookEvent;
export type WebhookEventType = WebhookEvent["type"];
