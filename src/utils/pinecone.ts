import { Pinecone } from "@pinecone-database/pinecone";

export function getPineconeClient() {
  const apiKey = process.env.PINECONE_API_KEY;
  const environment = process.env.PINECONE_ENVIRONMENT;
  if (!apiKey || !environment) {
    throw new Error("Pinecone environment variables missing");
  }
  return new Pinecone({ apiKey, environment });
}
