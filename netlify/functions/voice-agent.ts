import { WebSocketServer, WebSocket, RawData } from 'ws';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ELEVENLABS_TRANSCRIPTION_URL = 'https://api.elevenlabs.io/v1/transcription';
const ELEVENLABS_TTS_URL = 'https://api.elevenlabs.io/v1/text-to-speech/LGzcffsz71CPfVxelXqr/stream';
const OPENROUTER_CHAT_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_EMBED_URL = 'https://openrouter.ai/api/v1/embeddings';

const wss = new WebSocketServer({ noServer: true });

interface TwilioStartEvent {
  event: 'start';
  start: { streamSid: string };
}

interface TwilioMediaEvent {
  event: 'media';
  media: { payload: string };
}

interface TwilioStopEvent {
  event: 'stop';
}

type TwilioEvent = TwilioStartEvent | TwilioMediaEvent | TwilioStopEvent | { event?: string };

wss.on('connection', (ws: WebSocket) => {
  const sessionTimer = setTimeout(() => ws.close(), 5 * 60 * 1000);
  const history: Message[] = [];
  let streamSid = '';

  ws.on('message', async (raw: RawData) => {
    let evt: TwilioEvent;
    try {
      evt = JSON.parse(raw.toString()) as TwilioEvent;
    } catch {
      return;
    }

    if (evt.event === 'start') {
      streamSid = evt.start.streamSid;
      return;
    }

    if (evt.event === 'stop') {
      ws.close();
      return;
    }

    if (evt.event !== 'media') return;

    const payload = evt.media.payload;
    if (!payload) return;
    const audio = Buffer.from(payload, 'base64');

    try {
      const transcription = await transcribeAudio(audio);
      if (!transcription) return;

      history.push({ role: 'user', content: transcription });
      const context = await retrieveContext(transcription);
      const prompt = composePrompt(context, history);
      const reply = await chatComplete(history, prompt);
      if (!reply) return;
      history.push({ role: 'assistant', content: reply });

      ws.send(JSON.stringify({ event: 'msg', streamSid, content: reply }));
      await streamTTS(reply, streamSid, ws);
    } catch (err) {
      ws.send(JSON.stringify({ event: 'error', streamSid, message: (err as Error).message }));
    }
  });

  ws.on('close', () => {
    clearTimeout(sessionTimer);
  });
});

interface NetlifyEvent {
  headers: Record<string, string | undefined>;
}

interface NetlifyContext {
  sockets?: { upgrade: (cb: (socket: unknown) => void) => void };
}

export const handler = async (event: NetlifyEvent, context: NetlifyContext) => {
  if (event.headers.upgrade?.toLowerCase() !== 'websocket') {
    return { statusCode: 400, body: 'Expected WebSocket upgrade' };
  }

  const upgrade = context.sockets?.upgrade;
  if (!upgrade) {
    return { statusCode: 500, body: 'WebSocket upgrade not supported' };
  }

  await new Promise<void>((resolve) => {
    upgrade((socket: unknown) => {
      wss.emit('connection', socket as WebSocket); // hand off to ws server
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
      encoding: 'mulaw',
      sample_rate: 8000
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
  const matches = (pcJson.matches || []) as Array<{
    metadata?: { text?: string };
  }>;
  return matches
    .map((m) => m.metadata?.text)
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

async function streamTTS(text: string, streamSid: string, ws: WebSocket) {
  const res = await fetch(ELEVENLABS_TTS_URL, {
    method: 'POST',
    headers: {
      'xi-api-key': process.env.ELEVENLABS_API_KEY || '',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text })
  });

  if (!res.body) return;
  const stream = res.body as unknown as AsyncIterable<Uint8Array>;
  for await (const chunk of stream) {
    const payload = Buffer.from(chunk).toString('base64');
    ws.send(
      JSON.stringify({
        event: 'media',
        streamSid,
        media: { payload }
      })
    );
  }
}

