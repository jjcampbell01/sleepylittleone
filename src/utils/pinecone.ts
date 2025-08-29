import { Pinecone } from '@pinecone-database/pinecone';

/**
 * Returns a configured Pinecone client instance.
 * Reads API key and environment from process.env and throws if missing.
 */
export function getPineconeClient(): Pinecone {
  const apiKey = process.env.PINECONE_API_KEY;
  const environment = process.env.PINECONE_ENVIRONMENT;

  if (!apiKey || !environment) {
    throw new Error(
      'Pinecone API key or environment is not defined. Ensure PINECONE_API_KEY and PINECONE_ENVIRONMENT are set.'
    );
  }

  return new Pinecone({ apiKey, environment });
}
