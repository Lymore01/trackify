import crypto from "crypto";

export const generateShortId: () => string = () => {
    return Math.random().toString(36).substring(2, 7);
}

export const generateHMAC: (secret: string, payload: any) => string = (secret, payload) => {
    return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}