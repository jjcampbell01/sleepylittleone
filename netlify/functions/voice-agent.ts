// Netlify function that supports BOTH HTTP media posts and WebSocket upgrades
// - HTTP: simple "send audio, get audio back" pipeline
// - WS: real-time Twilio-style media stream with running history

import type { Handler } from "@netlify/functions";
import { WebSocketServer, WebSocket, RawData } from "ws";
import { getPineconeClient } from "../../src/utils/pinecone";

// ---- Env ----
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || "";
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const PINECONE_INDEX = process.env.PINECONE_INDEX || "";

if (!ELEVENLABS_VOICE_ID) {
  console.warn("Missing ELEVENLABS_VOICE_ID");
}
if (!PINECONE_INDEX) {
  console.warn("Missing PINECONE_INDEX");
}

const OPENROUTER_CHAT_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_EMBED_URL = "https://openrouter.ai/api/v1/embeddings";
const ELEVENLABS_TTS_URL = (voiceId: string) =>
  `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`;
const ELEVENLABS_TRANSCRIBE_URL = "https://api.elevenlabs.io/v1/transcription";

// ---- Types ----
interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface TwilioStartEvent {
  event: "start";
  start: { streamSid: string };
}
interface TwilioMediaEvent {
  event: "media";
  media: { payload: string };
}
interface TwilioStopEvent {
  event: "stop";
}
type TwilioEvent =
  | TwilioStartEvent
  | TwilioMediaEvent
  | TwilioStopEvent
  | { event?: string };

// ---- Shared: RAG (OpenRouter emb → Pinecone) ----
async function embedText(text: string): Promise<number[]> {
  const res = await fetch(OPENROUTER_EMBED_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    // Use a stable small model for speed/cost; swap if you prefer large:
    body: JSON.stringify({ model: "text-embedding-3-small", input: text }),
  });
  if (!res.ok) {
    throw new Error(
      `Embedding failed: ${res.status} ${await res.text().catch(() => "")}`
    );
  }
  const json = await res.json();
  return json?.data?.[0]?.embedding || [];
}

async function retrieveContext(query: string, topK = 3): Promise<string[]> {
  if (!PINECONE_INDEX) return [];
  const vector = await embedText(query);
  const client = getPineconeClient();
  const index = client.Index(PINECONE_INDEX);
  const pc = await index.query({
    vector,
    topK,
    includeMetadata: true,
  });

  return (
    pc.matches
      ?.map((m: any) => m?.metadata?.text)
      ?.filter(Boolean)
      ?.slice(0, topK) || []
  );
}

// ---- Shared: Chat (OpenRouter) ----
async function chatComplete(
  userPrompt: string,
  contextSnippets: string[],
  history: Message[] = []
): Promise<string> {
  const system: Message = {
    role: "system",
    content:
      "You are a warm, human baby sleep consultant. " +
      "Base advice on the provided context snippets. " +
      "If context is insufficient, say what you need and offer general best practices.\n\n" +
      contextSnippets.join("\n"),
  };

  const messages: Message[] = [system, ...history, { role: "user", content: userPrompt }];

  const res = await fetch(OPENROUTER_CHAT_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    // choose your preferred model; gpt-4o-mini is fast/cost-effective
    body: JSON.stringify({ model: "gpt-4o-mini", messages }),
  });

  if (!res.ok) {
    throw new Error(
      `Chat completion failed: ${res.status} ${await res.text().catch(() => "")}`
    );
  }
  const json = await res.json();
  return json?.choices?.[0]?.message?.content || "";
}

// ---- STT (Two flavors for convenience) ----
// 1) For Twilio μ-law 8k frames (WebSocket path)
async function transcribeMuLawPCM(pcm: Buffer): Promise<string> {
  const res = await fetch(ELEVENLABS_TRANSCRIBE_URL, {
    method: "POST",
    headers: {
      "xi-api-key": ELEVENLABS_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      audio: pcm.toString("base64"),
      encoding: "mulaw",
      sample_rate: 8000,
    }),
  });
  if (!res.ok) {
    throw new Error(
      `Transcription (μ-law) failed: ${res.status} ${await res.text().catch(() => "")}`
    );
  }
  const json = await res.json();
  return json?.text || "";
}

// 2) For full raw audio blobs (HTTP path)
async function transcribeOctetStream(audio: Buffer): Promise<string> {
  const res = await fetch(ELEVENLABS_TRANSCRIBE_URL, {
    method: "POST",
    headers: {
      "xi-api-key": ELEVENLABS_API_KEY,
      "Content-Type": "application/octet-stream",
    },
    body: audio,
  });
  if (!res.ok) {
    throw new Error(
      `Transcription (octet-stream) failed: ${res.status} ${await res.text().catch(() => "")}`
    );
  }
  const json = await res.json();
  return json?.text || "";
}

// ---- TTS ----
async function synthesizeToBase64(text: string): Promise<string> {
  const res = await fetch(ELEVENLABS_TTS_URL(ELEVENLABS_VOICE_ID), {
    method: "POST",
    headers: {
      "xi-api-key": ELEVENLABS_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) {
    throw new Error(
      `TTS failed: ${res.status} ${await res.text().catch(() => "")}`
    );
  }
  const buf = Buffer.from(await res.arrayBuffer());
  return buf.toString("base64");
}

async function streamTTSToWS(text: string, streamSid: string, ws: WebSocket) {
  const res = await fetch(ELEVENLABS_TTS_URL(ELEVENLABS_VOICE_ID), {
    method: "POST",
    headers: {
      "xi-api-key": ELEVENLABS_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (!res.ok || !res.body) {
    throw new Error(
      `TTS stream failed: ${res.status} ${await res.text().catch(() => "")}`
    );
  }
  const stream = res.body as unknown as AsyncIterable<Uint8Array>;
  for await (const chunk of stream) {
    const payload = Buffer.from(chunk).toString("base64");
    ws.send(
      JSON.stringify({
        event: "media",
        streamSid,
        media: { payload },
      })
    );
  }
}

// ---- WebSocket server (for Twilio Media Streams) ----
const wss = new WebSocketServer({ noServer: true });

wss.on("connection", (ws: WebSocket) => {
  const history: Message[] = [];
  let streamSid = "";
  const sessionTimer = setTimeout(() => ws.close(), 5 * 60 * 1000);

  ws.on("message", async (raw: RawData) => {
    let evt: TwilioEvent;
    try {
      evt = JSON.parse(raw.toString());
    } catch {
      return;
    }

    if (evt.event === "start") {
      streamSid = (evt as TwilioStartEvent).start.streamSid;
      return;
    }
    if (evt.event === "stop") {
      ws.close();
      return;
    }
    if (evt.event !== "media") return;

    const payload = (evt as TwilioMediaEvent)?.media?.payload;
    if (!payload) return;

    try {
      const pcm = Buffer.from(payload, "base64");
      const userText = await transcribeMuLawPCM(pcm);
      if (!userText) return;

      history.push({ role: "user", content: userText });

      const ctx = await retrieveContext(userText, 3);
      const reply = await chatComplete(userText, ctx, history);
      if (!reply) return;

      history.push({ role: "assistant", content: reply });

      // Optional: send the text transcript back too
      ws.send(JSON.stringify({ event: "msg", streamSid, content: reply }));

      await streamTTSToWS(reply, streamSid, ws);
    } catch (err: any) {
      console.error("WS pipeline error", err);
      ws.send(
        JSON.stringify({
          event: "error",
          streamSid,
          message: err?.message || "Unknown error",
        })
      );
    }
  });

  ws.on("close", () => clearTimeout(sessionTimer));
});

// ---- Netlify handler: either upgrade to WS or handle HTTP ----
export const handler: Handler & any = async (event: any, context: any) => {
  // Sanity check envs (minimal set)
  const missing = ["ELEVENLABS_API_KEY", "OPENROUTER_API_KEY", "PINECONE_INDEX"].filter(
    (k) => !process.env[k]
  );
  if (missing.length) {
    return {
      statusCode: 500,
      body: `Missing environment variable(s): ${missing.join(", ")}`,
    };
  }

  // WebSocket upgrade path
  if (event.headers?.upgrade?.toLowerCase() === "websocket") {
    const upgrade = context.sockets?.upgrade;
    if (!upgrade) {
      return { statusCode: 500, body: "WebSocket upgrade not supported" };
    }
    await new Promise<void>((resolve) => {
      upgrade((socket: unknown) => {
        wss.emit("connection", socket as WebSocket);
        resolve();
      });
    });
    // 101 means "Switching Protocols" (Netlify handles it)
    return { statusCode: 101, body: "" };
  }

  // HTTP path: expect { event: "media", media: { payload: base64 } }
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  if (!event.body) {
    return { statusCode: 400, body: "Missing body" };
  }

  try {
    const data = JSON.parse(event.body);
    if (data.event === "media" && data.media?.payload) {
      const audio = Buffer.from(data.media.payload, "base64");
      const transcript = await transcribeOctetStream(audio);

      const contextSnippets = await retrieveContext(transcript);
      const reply = await chatComplete(transcript, contextSnippets);

      const audioB64 = await synthesizeToBase64(reply);
      return {
        statusCode: 200,
        body: JSON.stringify({ text: reply, audio: audioB64 }),
      };
    }

    return { statusCode: 200, body: "" };
  } catch (err: any) {
    console.error("HTTP pipeline error", err);
    return { statusCode: 500, body: err?.message || "Internal error" };
  }
};
