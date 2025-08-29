import { WebSocketServer, WebSocket } from 'ws';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ELEVENLABS_TRANSCRIPTION_URL = 'https://api.elevenlabs.io/v1/transcription';
const ELEVENLABS_TTS_URL = 'https://api.elevenlabs.io/v1/text-to-speech/LGzcffsz71CPfVxelXqr/stream';
const OPENROUTER_CHAT_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_EMBED_URL = 'https://openrouter.ai/api/v1/embeddings';

const wss = new WebSocketServer({ noServer: true });

wss.on('connection', (ws: WebSocket) => {
  const sessionTimer = setTimeout(() => ws.close(), 5 * 60 * 1000);
  let audioBuffer: Buffer[] = [];
  const history: Message[] = [];

  ws.on('message', async (data) => {
    if (typeof data === 'string') return;

    audioBuffer.push(Buffer.from(data as ArrayBuffer));
    const combined = Buffer.concat(audioBuffer);

    if (combined.length < 32000) return; // ~1s of 16khz pcm16
    audioBuffer = [];

    try {
      const transcription = await transcribeAudio(combined);
      if (!transcription) return;

      history.push({ role: 'user', content: transcription });
      const context = await retrieveContext(transcription);
      const prompt = composePrompt(context, history);
      const reply = await chatComplete(history, prompt);
      if (!reply) return;
      history.push({ role: 'assistant', content: reply });
      await streamTTS(reply, ws);
    } catch (err) {
      ws.send(JSON.stringify({ error: (err as Error).message }));
    }
  });

  ws.on('close', () => {
    clearTimeout(sessionTimer);
  });
});

export const handler = async (event: any, context: any) => {
  if (event.headers.upgrade?.toLowerCase() !== 'websocket') {
    return { statusCode: 400, body: 'Expected WebSocket upgrade' };
  }

  const upgrade = (context as any)?.sockets?.upgrade;
  if (!upgrade) {
    return { statusCode: 500, body: 'WebSocket upgrade not supported' };
  }

  await new Promise<void>((resolve) => {
    upgrade((socket: any) => {
      wss.emit('connection', socket); // hand off to ws server
      resolve();
    });
  });

  return { statusCode: 101, body: '' };
};

async function transcribeAudio(pcm: Buffer): Promise<string> {
  const res = await fetch(ELEVENLABS_TRANSCRIPTION_URL, {
    method: 'POST',
    headers: {
      'xi-api-key': process.env.ELEVENLABS_API_KEY || '',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      audio: pcm.toString('base64'),
      encoding: 'pcm_s16le',
      sample_rate: 16000
    })
  });

  const json = await res.json().catch(() => ({}));
  return json.text || '';
}

async function retrieveContext(text: string): Promise<string> {
  const embedRes = await fetch(OPENROUTER_EMBED_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY || ''}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ model: 'text-embedding-3-small', input: text })
  });
  const embedJson = await embedRes.json();
  const vector = embedJson.data?.[0]?.embedding || [];

  const pineconeUrl = `https://${process.env.PINECONE_INDEX}.svc.${process.env.PINECONE_ENVIRONMENT}.pinecone.io/query`;
  const pcRes = await fetch(pineconeUrl, {
    method: 'POST',
    headers: {
      'Api-Key': process.env.PINECONE_API_KEY || '',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ vector, topK: 3, includeMetadata: true })
  });
  const pcJson = await pcRes.json();
  return (pcJson.matches || [])
    .map((m: any) => m.metadata?.text)
    .filter(Boolean)
    .join('\n');
}

function composePrompt(context: string, history: Message[]): string {
  const conversation = history
    .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n');
  return `Use the following course excerpts to answer the user.\n${context}\n\nConversation so far:\n${conversation}\nAssistant:`;
}

async function chatComplete(history: Message[], prompt: string): Promise<string> {
  const messages = history.concat({ role: 'user', content: prompt });
  const res = await fetch(OPENROUTER_CHAT_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY || ''}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ model: 'gpt-4o-mini', messages })
  });
  const json = await res.json();
  return json.choices?.[0]?.message?.content || '';
}

async function streamTTS(text: string, ws: WebSocket) {
  const res = await fetch(ELEVENLABS_TTS_URL, {
    method: 'POST',
    headers: {
      'xi-api-key': process.env.ELEVENLABS_API_KEY || '',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text })
  });

  if (!res.body) return;
  for await (const chunk of res.body as any) {
    ws.send(chunk);
  }
}

