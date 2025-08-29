// Point your Twilio TwiML App (and phone number) to this function's URL.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handler = async (event: any) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/xml'
    },
    body: `<Response>\n  <Connect>\n    <Stream url="wss://${event.headers.host}/.netlify/functions/voice-agent"/>\n  </Connect>\n</Response>`
  };
};
