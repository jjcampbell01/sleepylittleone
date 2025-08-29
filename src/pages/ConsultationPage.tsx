import { useEffect, useState } from "react";
import { SEO } from "@/components/SEO";
import { StructuredData } from "@/components/StructuredData";
import { Button } from "@/components/ui/button";
import { startCall, endCall } from "@/api/voice";
import type { Device } from "@twilio/voice-sdk";

const TOTAL_SECONDS = 300; // 5 minutes

const ConsultationPage = () => {
  const [device, setDevice] = useState<Device | null>(null);
  const [active, setActive] = useState(false);
  const [seconds, setSeconds] = useState(TOTAL_SECONDS);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // countdown timer
  useEffect(() => {
    let id: ReturnType<typeof setInterval> | undefined;
    if (active && seconds > 0) {
      id = setInterval(() => setSeconds((s) => s - 1), 1000);
    } else if (seconds === 0 && active) {
      handleEnd();
    }
    return () => {
      if (id) clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, seconds]);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (active) {
        try {
          endCall();
        } catch {}
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const ss = (s % 60).toString().padStart(2, "0");
    return `${m}:${ss}`;
  };

  const handleStart = async () => {
    setError(null);
    try {
      const dev = await startCall();
      // Append assistant messages to transcript as they arrive
      dev.on("messageReceived", (msg: { content?: string }) => {
        if (msg?.content) setTranscript((t) => [...t, msg.content as string]);
      });
      setDevice(dev);
      setActive(true);
      setSeconds(TOTAL_SECONDS);
    } catch (e: any) {
      setError(e?.message || "Failed to start call");
      setDevice(null);
      setActive(false);
    }
  };

  const handleEnd = () => {
    try {
      endCall();
    } catch {}
    setDevice(null);
    setActive(false);
  };

  return (
    <div className="min-h-screen">
      <SEO
        title="Consultation"
        description="Free 5-minute baby sleep consultation with optional upgrade."
        canonical="https://www.sleepylittleone.com/consultation"
      />
      <StructuredData
        type="BreadcrumbList"
        data={{
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://www.sleepylittleone.com",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Consultation",
              item: "https://www.sleepylittleone.com/consultation",
            },
          ],
        }}
      />

      <main className="max-w-3xl mx-auto px-6 py-16 space-y-6">
        <header className="mb-4">
          <h1 className="text-3xl font-bold tracking-tight">
            Free 5-Minute Consultation
          </h1>
          <p className="mt-2 text-muted-foreground">
            Speak with our AI sleep consultant for five minutes. Upgrade for a
            longer call if you need more help.
          </p>
        </header>

        {error && (
          <div className="text-sm text-red-600 border border-red-200 rounded p-3">
            {error}
          </div>
        )}

        {!active && seconds === TOTAL_SECONDS && (
          <Button onClick={handleStart}>Start 5-Minute Call</Button>
        )}

        {active && (
          <div className="space-y-4">
            <p className="font-medium">Time remaining: {formatTime(seconds)}</p>
            <Button variant="destructive" onClick={handleEnd}>
              End Call
            </Button>
          </div>
        )}

        {!active && seconds !== TOTAL_SECONDS && (
          <Button asChild>
            <a href="https://buy.stripe.com/fZucN7fFr8VOcKJeDWc7u01">
              Buy 20-Minute Call
            </a>
          </Button>
        )}

        <section className="mt-8 p-4 border rounded min-h-[150px] space-y-2">
          {transcript.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Transcript will appear here…
            </p>
          ) : (
            transcript.map((line, i) => <p key={i}>{line}</p>)
          )}
        </section>
      </main>
    </div>
  );
};

export default ConsultationPage;
