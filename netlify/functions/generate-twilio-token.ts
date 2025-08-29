import type { Handler } from "@netlify/functions";
import { jwt } from "twilio";

const { AccessToken } = jwt;
const { VoiceGrant } = jwt;

// Generates a 5‑minute access token for your TwiML app
export const handler: Handler = async () => {
  const { TWILIO_ACCOUNT_SID, TWILIO_API_KEY, TWILIO_API_SECRET, TWILIO_TWIML_APP_SID } = process.env;

  if (!TWILIO_ACCOUNT_SID || !TWILIO_API_KEY || !TWILIO_API_SECRET || !TWILIO_TWIML_APP_SID) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Missing Twilio environment variables" }),
    };
  }

  const token = new AccessToken(TWILIO_ACCOUNT_SID, TWILIO_API_KEY, TWILIO_API_SECRET, { ttl: 300 });
  const grant = new VoiceGrant({ outgoingApplicationSid: TWILIO_TWIML_APP_SID });
  token.addGrant(grant);

  return {
    statusCode: 200,
    body: JSON.stringify({ token: token.toJwt() }),
  };
};
