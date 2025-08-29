import type { Handler } from "@netlify/functions";
import { getPineconeClient } from "../../src/utils/pinecone";

const elevenApi = process.env.ELEVENLABS_API_KEY;
const voiceId = process.env.ELEVENLABS_VOICE_ID;
const openrouterKey = process.env.OPENROUTER_API_KEY;
const pineconeIndex = process.env.PINECONE_INDEX;

async function transcribe(audio: Buffer) {
  const res = await fetch("https://api.elevenlabs.io/v1/transcription", {
    method: "POST",
    headers: {
      "xi-api-key": elevenApi || "",
      "Content-Type": "application/octet-stream",
    },
    body: audio,
  });
  const json = await res.json();
  return json.text as string;
}

async function retrieve(query: string) {
  if (!pineconeIndex) return [];
  const client = getPineconeClient();
  const index = client.Index(pineconeIndex);
  const embRes = await fetch("https://openrouter.ai/api/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openrouterKey}`,
    },
    body: JSON.stringify({ model: "text-embedding-3-large", input: query }),
  });
  const emb = (await embRes.json()).data[0].embedding;
  const results = await index.query({ topK: 3, vector: emb, includeMetadata: true });
  return results.matches?.map((m) => m.metadata?.text) || [];
}

async function respond(prompt: string, context: string[]) {
  const messages = [
    {
      role: "system",
      content:
        "You are a warm, human baby sleep consultant. Base advice on the provided context snippets." +
        context.join("\n"),
    },
    { role: "user", content: prompt },
  ];
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openrouterKey}`,
    },
    body: JSON.stringify({ model: "gpt-4.1", messages }),
  });
  const json = await res.json();
  return json.choices?.[0]?.message?.content || "";
}

async function synthesize(text: string) {
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
    {
      method: "POST",
      headers: {
        "xi-api-key": elevenApi || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    }
  );
  return Buffer.from(await res.arrayBuffer()).toString("base64");
}

export const handler: Handler = async (event) => {
  if (!elevenApi || !voiceId || !openrouterKey) {
    return { statusCode: 500, body: "Missing env" };
  }
  if (!event.body) return { statusCode: 400, body: "Missing body" };
  const data = JSON.parse(event.body);

  if (data.event === "media" && data.media?.payload) {
    const audio = Buffer.from(data.media.payload, "base64");
    const transcript = await transcribe(audio);
    const context = await retrieve(transcript);
    const reply = await respond(transcript, context);
    const audioB64 = await synthesize(reply);
    return { statusCode: 200, body: JSON.stringify({ audio: audioB64 }) };
  }

  return { statusCode: 200, body: "" };
};
