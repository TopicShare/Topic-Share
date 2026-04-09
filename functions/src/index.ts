import { onCall } from "firebase-functions/v2/https";
import * as twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

export const getTurnCredentials = onCall({ invoker: "public" }, async () => {
  if (!accountSid || !authToken) {
    throw new Error("Twilio credentials not configured");
  }

  const client = twilio.default(accountSid, authToken);
  const token = await client.tokens.create({ ttl: 3600 });

  return { iceServers: token.iceServers };
});
