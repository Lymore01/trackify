import crypto from "crypto";
import type { WebhookEvent } from "../../@types/Webhooks.js";

export interface WebhookOptions {
  format?: "raw";
}

export class MissingHeadersError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MissingHeaderError";
  }
}

export class VerificationFailedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "VerificationFailedError";
  }
}

// todo: add other webhook headers ie. id, timestamp
export interface WebhookRequiredHeaders {
  "webhook-signature": string;
}

export default class Webhook {
  private secret: string | Uint8Array;
  private options?: WebhookOptions;

  constructor(secret: string | Uint8Array, options?: WebhookOptions) {
    this.secret = secret;
    this.options = options;
  }

  private generateHMAC(payload: string | Buffer): string {
    return crypto
      .createHmac("sha256", this.secret)
      .update(payload)
      .digest("hex");
  }

  verify(
    payload: string | Buffer,
    headers_: WebhookRequiredHeaders | Record<string, string>
  ) {
    const receivedSignature = headers_["webhook-signature"];

    if (!receivedSignature) {
      throw new MissingHeadersError("Missing 'webhook-signature' header.");
    }

    const generatedSignature = this.generateHMAC(payload);

    const isValid: boolean = crypto.timingSafeEqual(
      Buffer.from(receivedSignature, "hex"),
      Buffer.from(generatedSignature, "hex")
    );

    if (!isValid) {
      throw new VerificationFailedError("Could not verify webhook");
    }

    const evt: WebhookEvent = JSON.parse(payload as string);

    return evt;
  }
}
