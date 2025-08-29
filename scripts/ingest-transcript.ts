import fs from "fs/promises";
import { getPineconeClient } from "../src/utils/pinecone";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const PINECONE_INDEX = process.env.PINECONE_INDEX;

if (!OPENROUTER_API_KEY) {
  throw new Error("OPENROUTER_API_KEY is not set");
}
if (!PINECONE_INDEX) {
  throw new Error("PINECONE_INDEX is not set");
}

function chunkText(text: string, size = 1000) {
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size));
  }
  return chunks;
}

async function embed(input: string) {
  const res = await fetch("https://openrouter.ai/api/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({ model: "text-embedding-3-large", input }),
  });
  const json = await res.json();
  return json.data[0].embedding as number[];
}

async function main() {
  const file = await fs.readFile("BACKGROUND.md", "utf8");
  const chunks = chunkText(file);
  const pinecone = getPineconeClient();
  const index = pinecone.Index(PINECONE_INDEX!);

  const vectors = await Promise.all(
    chunks.map(async (chunk, i) => ({
      id: `chunk-${i}`,
      values: await embed(chunk),
      metadata: { text: chunk },
    }))
  );

  await index.upsert(vectors);
  console.log(`Uploaded ${vectors.length} chunks to Pinecone`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
