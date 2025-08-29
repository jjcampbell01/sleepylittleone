import fs from "fs/promises";
import { encoding_for_model } from "@dqbd/tiktoken";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Pinecone } from "@pinecone-database/pinecone";

const OPENROUTER_MODEL = "text-embedding-3-large";
const MAX_TOKENS = 1000;

interface ChunkMeta {
  text: string;
  module: string;
  startLine: number;
  endLine: number;
}

function assertEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is not set`);
  return v;
}

async function chunkBackground(filePath: string): Promise<ChunkMeta[]> {
  const content = await fs.readFile(filePath, "utf-8");
  const lines = content.split("\n");

  // Track which module (# Heading) each line belongs to
  const moduleForLine: string[] = [];
  let currentModule = "";
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("#")) {
      currentModule = line.replace(/^#+\s*/, "").trim();
    }
    moduleForLine[i] = currentModule;
  }

  // Token-aware splitter
  const encoder = encoding_for_model("gpt-3.5-turbo");
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: MAX_TOKENS,
    chunkOverlap: 0,
    separators: ["\n\n", "\n", " ", ""],
    lengthFunction: (text) => encoder.encode(text).length,
  });

  const texts = await splitter.splitText(content);
  const chunks: ChunkMeta[] = [];
  let lineCursor = 0;

  // Map chunk text back to approximate line ranges
  for (const text of texts) {
    const chunkLines = text.split("\n");
    const startLine = lineCursor + 1;
    const endLine = lineCursor + chunkLines.length;
    chunks.push({
      text,
      module: moduleForLine[Math.max(0, startLine - 1)],
      startLine,
      endLine,
    });
    lineCursor = endLine;
  }

  encoder.free();
  return chunks;
}

async function embed(text: string): Promise<number[]> {
  const res = await fetch("https://openrouter.ai/api/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${assertEnv("OPENROUTER_API_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      input: text,
    }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "");
    throw new Error(`OpenRouter embedding error: ${res.status} ${err}`);
  }

  const json = await res.json();
  return (json?.data?.[0]?.embedding || []) as number[];
}

async function main() {
  // Resolve BACKGROUND.md relative to this file
  const file = new URL("../BACKGROUND.md", import.meta.url);
  const chunks = await chunkBackground(file.pathname);

  const pinecone = new Pinecone({ apiKey: assertEnv("PINECONE_API_KEY") });
  const indexName = assertEnv("PINECONE_INDEX");
  let index = pinecone.Index(indexName);
  const namespace = process.env.PINECONE_NAMESPACE;
  if (namespace) {
    index = index.namespace(namespace);
  }

  // Batch uploads (smaller batches keep request sizes reasonable)
  const batchSize = 50;
  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);

    const embeddings = await Promise.all(batch.map((c) => embed(c.text)));

    const vectors = batch.map((chunk, j) => ({
      id: `background-${chunk.startLine}-${chunk.endLine}`,
      values: embeddings[j],
      metadata: {
        text: chunk.text,
        module: chunk.module,
        startLine: chunk.startLine,
        endLine: chunk.endLine,
      },
    }));

    await index.upsert(vectors);
    console.log(
      `Upserted ${vectors.length} vectors (lines ${batch[0].startLine}-${batch[batch.length - 1].endLine})`
    );
  }

  console.log("✅ Ingestion complete.");
}

main().catch((err) => {
  console.error("❌ Ingestion failed:", err);
  process.exit(1);
});
