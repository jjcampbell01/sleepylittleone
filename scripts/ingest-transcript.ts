import fs from "fs/promises";
import { encoding_for_model } from "@dqbd/tiktoken";
import { Pinecone } from "@pinecone-database/pinecone";

const OPENROUTER_MODEL = "text-embedding-3-large";
const MAX_TOKENS = 1000;

interface ChunkMeta {
  text: string;
  module: string;
  startLine: number;
  endLine: number;
}

async function chunkBackground(filePath: string): Promise<ChunkMeta[]> {
  const content = await fs.readFile(filePath, "utf-8");
  const lines = content.split("\n");

  const encoder = encoding_for_model("gpt-3.5-turbo");

  const chunks: ChunkMeta[] = [];
  let currentLines: string[] = [];
  let tokenCount = 0;
  let startLine = 1;
  let currentModule = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("#")) {
      currentModule = line.replace(/^#+\s*/, "").trim();
    }

    const lineTokens = encoder.encode(line).length;
    if (tokenCount + lineTokens > MAX_TOKENS && currentLines.length > 0) {
      chunks.push({
        text: currentLines.join("\n"),
        module: currentModule,
        startLine,
        endLine: i,
      });
      currentLines = [];
      tokenCount = 0;
      startLine = i + 1;
    }

    if (currentLines.length === 0) {
      startLine = i + 1;
    }

    currentLines.push(line);
    tokenCount += lineTokens;
  }

  if (currentLines.length > 0) {
    chunks.push({
      text: currentLines.join("\n"),
      module: currentModule,
      startLine,
      endLine: lines.length,
    });
  }

  encoder.free();
  return chunks;
}

async function embed(text: string): Promise<number[]> {
  const res = await fetch("https://openrouter.ai/api/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      input: text,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenRouter embedding error: ${err}`);
  }

  const json = await res.json();
  return json.data[0].embedding as number[];
}

async function main() {
  const file = new URL("../BACKGROUND.md", import.meta.url);
  const chunks = await chunkBackground(file.pathname);

  const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY || "" });
  let index = pinecone.Index(process.env.PINECONE_INDEX || "");
  const namespace = process.env.PINECONE_NAMESPACE;
  if (namespace) {
    index = index.namespace(namespace);
  }

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const embedding = await embed(chunk.text);
    await index.upsert([
      {
        id: `background-${chunk.startLine}-${chunk.endLine}`,
        values: embedding,
        metadata: {
          module: chunk.module,
          startLine: chunk.startLine,
          endLine: chunk.endLine,
        },
      },
    ]);
    console.log(
      `Upserted lines ${chunk.startLine}-${chunk.endLine} (${chunk.module})`
    );
  }
}

main().catch((err) => {
  console.error("❌ Ingestion failed:", err);
  process.exit(1);
});
