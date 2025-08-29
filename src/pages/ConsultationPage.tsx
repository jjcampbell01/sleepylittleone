import { useEffect, useState } from "react";
import { SEO } from "@/components/SEO";
import { StructuredData } from "@/components/StructuredData";
import { Button } from "@/components/ui/button";
import { startCall, endCall } from "@/api/voice";
import type { Device } from "@twilio/voice-sdk";

const ConsultationPage = () => {
  const [device, setDevice] = useState<Device | null>(null);
  const [active, setActive] = useState(false);
  const [seconds, setSeconds] = useState(300);
  const [transcript, setTranscript] = useState<string[]>([]);

  useEffect(() => {
    let id: NodeJS.Timeout;
    if (active && seconds > 0) {
      id = setInterval(() => setSeconds((s) => s - 1), 1000);
    } else if (seconds === 0) {
      handleEnd();
    }
    return () => clearInterval(id);
  }, [active, seconds]);

  const handleStart = async () => {
    const dev = await startCall();
    dev.on("messageReceived", (msg: { content?: string }) => {
      if (msg.content) {
        setTranscript((t) => [...t, msg.content!]);
      }
    });
    setDevice(dev);
    setActive(true);
    setSeconds(300);
  };

  const handleEnd = () => {
    endCall();
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
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.sleepylittleone.com" },
            { "@type": "ListItem", position: 2, name: "Consultation", item: "https://www.sleepylittleone.com/consultation" },
          ],
        }}
      />

      <main className="max-w-3xl mx-auto px-6 py-16 space-y-6">
        <header className="mb-4">
          <h1 className="text-3xl font-bold tracking-tight">Free 5-Minute Consultation</h1>
          <p className="mt-2 text-muted-foreground">
            Speak with our AI sleep consultant for five minutes. Upgrade for a longer call if you need more help.
          </p>
        </header>

        {!active && seconds === 300 && (
          <Button onClick={handleStart}>Start 5-Minute Call</Button>
        )}

        {active && (
          <div className="space-y-4">
            <p className="font-medium">
              Time remaining: {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}
            </p>
            <Button variant="destructive" onClick={handleEnd}>
              End Call
            </Button>
          </div>
        )}

        {!active && seconds !== 300 && (
          <Button asChild>
            <a href="https://buy.stripe.com/fZucN7fFr8VOcKJeDWc7u01">Buy 20-Minute Call</a>
          </Button>
        )}

        <section className="mt-8 p-4 border rounded min-h-[150px] space-y-2">
          {transcript.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </section>
      </main>
    </div>
  );
};

export default ConsultationPage;
