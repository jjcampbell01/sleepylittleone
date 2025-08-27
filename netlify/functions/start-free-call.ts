/* eslint-env node */
import type { Handler } from "@netlify/functions";

// Voice ID for ElevenLabs
const VOICE_ID = "LGzcffsz71CPfVxelXqr";

// Script that guides the AI response
const CALL_FLOW_PROTOCOL = `You are the Sleepy Little One free consultation bot.
Follow these steps:
1. Greet the caller warmly and introduce yourself as the assistant.
2. Ask how old their child is and what sleep challenge they are facing.
3. Provide one short, empathetic tip from our program.
4. Offer to schedule a full consultation and thank them for calling.`;

export const handler: Handler = async (event) => {
  try {
    const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

    if (!DEEPGRAM_API_KEY || !OPENROUTER_API_KEY || !ELEVENLABS_API_KEY) {
      return {
        statusCode: 500,
        body: "Missing API keys",
      };
    }

    if (!event.body) {
      return {
        statusCode: 400,
        body: "No audio provided",
      };
    }

    const audioBuffer = Buffer.from(event.body, "base64");

    // Transcribe audio with Deepgram
    const dgResponse = await fetch("https://api.deepgram.com/v1/listen", {
      method: "POST",
      headers: {
        Authorization: `Token ${DEEPGRAM_API_KEY}`,
        "Content-Type": "audio/wav",
      },
      body: audioBuffer,
    });
    const dgData: any = await dgResponse.json();
    const transcript =
      dgData.results?.channels?.[0]?.alternatives?.[0]?.transcript ?? "";

    // Generate response with OpenRouter
    const orResponse = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openrouter/auto",
          messages: [
            { role: "system", content: CALL_FLOW_PROTOCOL },
            { role: "user", content: transcript },
          ],
        }),
      }
    );
    const orData: any = await orResponse.json();
    const reply = orData.choices?.[0]?.message?.content ?? "";

    // Convert AI response to speech with ElevenLabs
    const ttsResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: reply,
          voice_settings: { stability: 0.5, similarity_boost: 0.5 },
        }),
      }
    );
    const ttsArrayBuffer = await ttsResponse.arrayBuffer();
    const audioBase64 = Buffer.from(ttsArrayBuffer).toString("base64");

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript, reply, audio: audioBase64 }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: "Failed to process call",
    };
  }
};

export default handler;
