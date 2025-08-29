import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";

const ConsultationPage = () => {
  const [started, setStarted] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [timeLeft, setTimeLeft] = useState(300);
  const [showCTA, setShowCTA] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleEnd = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    wsRef.current?.close();
    processorRef.current?.disconnect();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    audioCtxRef.current?.close();
  }, []);

  useEffect(() => {
    if (!started) return;

    const init = async () => {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = audioCtxRef.current!.createMediaStreamSource(streamRef.current);
      processorRef.current = audioCtxRef.current!.createScriptProcessor(4096, 1, 1);
      source.connect(processorRef.current);
      processorRef.current.connect(audioCtxRef.current!.destination);

      const ws = new WebSocket(
        `wss://${window.location.host}/.netlify/functions/voice-agent`
      );
      wsRef.current = ws;

      ws.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.audio && audioCtxRef.current) {
            const binary = Uint8Array.from(atob(data.audio), (c) =>
              c.charCodeAt(0)
            );
            const buffer = await audioCtxRef.current.decodeAudioData(binary.buffer);
            const src = audioCtxRef.current.createBufferSource();
            src.buffer = buffer;
            src.connect(audioCtxRef.current.destination);
            src.start();
          }
          if (data.transcript) {
            setTranscript((prev) => prev + data.transcript);
          }
        } catch (err) {
          console.error("WS message error", err);
        }
      };

      processorRef.current.onaudioprocess = (e) => {
        if (ws.readyState === WebSocket.OPEN) {
          const input = e.inputBuffer.getChannelData(0);
          const pcm16 = new Int16Array(input.length);
          for (let i = 0; i < input.length; i++) {
            const s = Math.max(-1, Math.min(1, input[i]));
            pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
          }
          ws.send(pcm16.buffer);
        }
      };
    };

    init();

    return handleEnd;
  }, [started, handleEnd]);

  useEffect(() => {
    if (!started) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleEnd();
          setShowCTA(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return handleEnd;
  }, [started, handleEnd]);

  // Ensure cleanup if the component unmounts mid-call
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => handleEnd, []);

  const start = () => setStarted(true);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="min-h-screen max-w-2xl mx-auto px-6 py-12 space-y-4">
      <SEO title="Consultation" description="Live voice consultation" />
      {!started ? (
        <Button onClick={start}>Start Consultation</Button>
      ) : (
        <div className="space-y-4">
          <div>Time left: {formatTime(timeLeft)}</div>
          <div className="whitespace-pre-wrap border p-4 rounded min-h-[150px]">
            {transcript || "Waiting for transcript..."}
          </div>
          {showCTA && (
            <a
              href="https://buy.stripe.com/fZucN7fFr8VOcKJeDWc7u01"
              className="inline-block mt-4"
            >
              <Button>Book Full Consultation</Button>
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default ConsultationPage;
