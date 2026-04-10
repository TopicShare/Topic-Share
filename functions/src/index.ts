import { onRequest } from "firebase-functions/v2/https";
import * as twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

export const getTurnCredentials = onRequest({ cors: true, invoker: "public" }, async (req, res) => {
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  if (!accountSid || !authToken) {
    res.status(500).json({ error: "Twilio credentials not configured" });
    return;
  }

  try {
    const client = twilio.default(accountSid, authToken);
    const token = await client.tokens.create({ ttl: 3600 });
    res.json({ iceServers: token.iceServers });
  } catch (err) {
    res.status(500).json({ error: "Failed to get TURN credentials" });
  }
});
