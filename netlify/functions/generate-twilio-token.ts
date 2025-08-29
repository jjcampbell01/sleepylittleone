import type { Handler } from "@netlify/functions";
import { jwt } from "twilio";

const { AccessToken } = jwt;
const { VoiceGrant } = AccessToken;

export const handler: Handler = async () => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const apiKey = process.env.TWILIO_API_KEY;
  const apiSecret = process.env.TWILIO_API_SECRET;
  const twimlAppSid = process.env.TWILIO_TWIML_APP_SID;

  if (!accountSid || !apiKey || !apiSecret || !twimlAppSid) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Missing Twilio environment variables" })
    };
  }

  const token = new AccessToken(accountSid, apiKey, apiSecret, { ttl: 300 });
  const grant = new VoiceGrant({ outgoingApplicationSid: twimlAppSid });
  token.addGrant(grant);

  return {
    statusCode: 200,
    body: JSON.stringify({ token: token.toJwt() })
  };
};
