/**
 * Point your TwiML App's Voice URL to this function.
 */
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

