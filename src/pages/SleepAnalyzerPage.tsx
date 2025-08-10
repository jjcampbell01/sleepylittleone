import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Download, Mail, Share2 } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { SEO } from "@/components/SEO";

// ---------------------------
// Types
// ---------------------------
interface AgeRule {
  range: [number, number];
  wakeMin: number;
  wakeMax: number;
  naps: [number, number];
  totalDay: [number, number];
  nightFeeds: [number, number];
  bedtime: [number, number];
  napLen: [number, number];
}

interface Block {
  type: "feed" | "play" | "nap" | "bed";
  start: number;
  end: number;
  note?: string;
}

interface Marker {
  time: number;
  severity: "red" | "yellow";
  msg: string;
}

// ---------------------------
// Sleep Logic & Data
// ---------------------------

const AGE_RULES: AgeRule[] = [
  { range: [0, 2], wakeMin: 45, wakeMax: 60, naps: [4, 6], totalDay: [14, 17], nightFeeds: [2, 4], bedtime: [21, 23], napLen: [30, 90] },
  { range: [3, 4], wakeMin: 75, wakeMax: 90, naps: [4, 5], totalDay: [14, 16], nightFeeds: [2, 3], bedtime: [19.5, 21], napLen: [45, 120] },
  { range: [5, 6], wakeMin: 120, wakeMax: 150, naps: [3, 3], totalDay: [14, 15], nightFeeds: [1, 2], bedtime: [19, 20], napLen: [60, 90] },
  { range: [7, 8], wakeMin: 150, wakeMax: 180, naps: [2, 3], totalDay: [13, 14], nightFeeds: [0, 1], bedtime: [18.75, 19.75], napLen: [60, 90] },
  { range: [9, 10], wakeMin: 180, wakeMax: 210, naps: [2, 2], totalDay: [13, 14], nightFeeds: [0, 1], bedtime: [18.75, 19.5], napLen: [60, 90] },
  { range: [11, 12], wakeMin: 210, wakeMax: 240, naps: [2, 2], totalDay: [13, 14], nightFeeds: [0, 0], bedtime: [18.75, 19.25], napLen: [60, 90] },
  { range: [13, 15], wakeMin: 240, wakeMax: 270, naps: [1, 2], totalDay: [12, 14], nightFeeds: [0, 0], bedtime: [19, 19], napLen: [120, 150] },
  { range: [16, 18], wakeMin: 270, wakeMax: 300, naps: [1, 1], totalDay: [12, 13], nightFeeds: [0, 0], bedtime: [19, 19], napLen: [120, 150] },
  { range: [19, 24], wakeMin: 300, wakeMax: 360, naps: [1, 1], totalDay: [12, 13], nightFeeds: [0, 0], bedtime: [19, 19], napLen: [90, 120] },
];

function getAgeRule(months: number): AgeRule {
  return (
    AGE_RULES.find((r) => months >= r.range[0] && months <= r.range[1]) || AGE_RULES[AGE_RULES.length - 1]
  );
}

function hmToFloat(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h + (m || 0) / 60;
}

function floatToHM(f: number): string {
  let h = Math.floor(f);
  let m = Math.round((f - h) * 60);
  if (m === 60) {
    h += 1;
    m = 0;
  }
  const hh = String((h + 24) % 24).padStart(2, "0");
  const mm = String(m).padStart(2, "0");
  return `${hh}:${mm}`;
}

function buildTimeline({
  ageMonths,
  wakeTime,
  napsCount,
  nightFeedsCount,
  challenge,
  styleFast,
}: {
  ageMonths: number;
  wakeTime: string;
  napsCount: number;
  nightFeedsCount: number;
  challenge: string;
  styleFast: boolean;
}): { blocks: Block[]; markers: Marker[]; rule: AgeRule } {
  const rule = getAgeRule(ageMonths);
  const idealWake = (rule.wakeMin + rule.wakeMax) / 2; // minutes
  const wakeHrs = idealWake / 60;

  const blocks: Block[] = [];
  let cursor = hmToFloat(wakeTime);

  const pushBlock = (type: Block["type"], start: number, end: number, note = "") => {
    blocks.push({ type, start, end, note });
    cursor = end;
  };

  // First feed within ~15 minutes of wake
  pushBlock("feed", cursor, Math.min(cursor + 0.25, cursor + 0.3), "Feed within 15 minutes of wake");

  const targetNaps = Math.max(rule.naps[0], Math.min(napsCount || rule.naps[1], rule.naps[1]));
  for (let i = 0; i < targetNaps; i++) {
    // Wake window play
    pushBlock("play", cursor, cursor + wakeHrs, "Wake window");

    // Nap length (midpoint of recommended)
    const napLenHrs = Math.max(
      rule.napLen[0] / 60,
      Math.min((rule.napLen[0] + rule.napLen[1]) / 120, rule.napLen[1] / 60)
    );
    pushBlock("nap", cursor, cursor + napLenHrs, `Nap ${i + 1}`);

    // Feed after nap (short)
    pushBlock("feed", cursor, cursor + 0.25, "Feed on wake");
  }

  // Final wake window to bedtime target
  const targetBed = rule.bedtime[rule.bedtime.length - 1];
  if (cursor < targetBed) {
    pushBlock("play", cursor, targetBed, "Calm play, bedtime routine");
  }
  pushBlock("bed", targetBed, (targetBed + 12) % 24, "Night sleep");

  const markers: Marker[] = [];
  const notes: string[] = [];
  const addMarker = (time: number, severity: Marker["severity"], msg: string) => markers.push({ time, severity, msg });
  const addNote = (s: string) => notes.push(s);

  if (challenge === "early_waking") {
    if (targetBed < 19) addMarker(targetBed, "red", "Bedtime too early → may cause early waking");
    if (targetBed > 20) addMarker(targetBed, "red", "Bedtime late → overtiredness");
    addNote("Shift bedtime by 10–15 min nightly toward ~19:00.");
    addNote("Keep room pitch-dark until target wake.");
  }
  if (challenge === "short_naps") {
    blocks.forEach((b) => {
      if (b.type === "nap") addMarker(b.start + (b.end - b.start) * 0.8, "yellow", "Protect nap environment (dark + white noise)");
    });
    addNote("Adjust wake window by ±10 min/day until naps lengthen.");
    addNote("Try crib hour to extend naps.");
  }
  if (challenge === "night_wakings") {
    addMarker(targetBed + 2, "yellow", "Encourage self-settling before intervening");
    addNote("Boost daytime calories; review last feed timing.");
    if (nightFeedsCount > (rule.nightFeeds[1] || 0)) addNote("Gradually reduce night feeds (minutes or ounces).");
  }
  if (challenge === "bedtime_resistance") {
    addMarker(targetBed - 0.5, "yellow", "Start wind-down 30–45 min before bed");
    addNote("Align last wake window to ideal; remove stimulating play in last hour.");
  }

  if (styleFast) {
    addNote("Faster track: make 15–20 min adjustments per day if baby tolerates well.");
  } else {
    addNote("Gentle track: keep changes to 10 min/day and watch baby cues.");
  }

  return { blocks, markers, rule };
}

function makeChartData(blocks: Block[]) {
  const pts: { time: string; value: number; label: string }[] = [];
  const map: Record<Block["type"], number> = { nap: 0.1, bed: 0.05, feed: 0.8, play: 0.5 };
  blocks.forEach((b) => {
    pts.push({ t: b.start, v: map[b.type], label: `${b.type}: ${b.note || ""}` } as any);
    pts.push({ t: b.end, v: map[b.type], label: `${b.type}: ${b.note || ""}` } as any);
  });
  // @ts-ignore sorting by internal temp key
  pts.sort((a, b) => a.t - b.t);
  // normalize to 24h strings
  // @ts-ignore map temp keys to final shape
  return pts.map((p) => ({ time: floatToHM(p.t), value: p.v, label: p.label }));
}

async function downloadPDF({
  babyName,
  ageMonths,
  challengeLabel,
  blocks,
  notes,
}: {
  babyName: string;
  ageMonths: number;
  challengeLabel: string;
  blocks: Block[];
  notes: string[];
}) {
  const { default: jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 40;
  let y = margin;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Your Baby’s Personalized Sleep Plan", margin, y);
  y += 26;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(`Baby: ${babyName || "Your baby"}  •  Age: ${ageMonths} months`, margin, y);
  y += 18;
  doc.text(`Focus: ${challengeLabel}`, margin, y);
  y += 24;

  doc.setFont("helvetica", "bold");
  doc.text("3-Day Gentle Adjustment Plan", margin, y);
  y += 18;
  doc.setFont("helvetica", "normal");

  notes.slice(0, 6).forEach((n) => {
    const lines = doc.splitTextToSize("• " + n, 515);
    doc.text(lines, margin, y);
    y += (lines as string[]).length * 16 + 6;
  });

  y += 8;
  doc.setDrawColor(200);
  doc.line(margin, y, 555, y);
  y += 20;

  doc.setFont("helvetica", "bold");
  doc.text("Today’s Ideal Flow (high level)", margin, y);
  y += 18;
  doc.setFont("helvetica", "normal");

  blocks.forEach((b) => {
    const line = `${floatToHM(b.start)}–${floatToHM(b.end)}  ${b.type.toUpperCase()}  ${b.note || ""}`;
    const lines = doc.splitTextToSize(line, 515);
    doc.text(lines, margin, y);
    y += (lines as string[]).length * 14 + 4;
  });

  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text("Sleepy Little One — Gentle, science-backed baby sleep support", margin, 810);
  doc.save("SleepyLittleOne_Plan.pdf");
}

// ---------------------------
// UI Helpers
// ---------------------------

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="grid gap-2">
    <Label className="text-sm text-muted-foreground">{label}</Label>
    {children}
  </div>
);

const ChallengeOptions = [
  { value: "early_waking", label: "Early Waking" },
  { value: "short_naps", label: "Short Naps" },
  { value: "night_wakings", label: "Night Wakings" },
  { value: "bedtime_resistance", label: "Bedtime Resistance" },
] as const;

export default function SleepAnalyzerPage() {
  const [babyName, setBabyName] = useState("");
  const [ageMonths, setAgeMonths] = useState(7);
  const [wakeTime, setWakeTime] = useState("06:30");
  const [napsCount, setNapsCount] = useState(2);
  const [nightFeedsCount, setNightFeedsCount] = useState(1);
  const [challenge, setChallenge] = useState<(typeof ChallengeOptions)[number]["value"]>("early_waking");
  const [styleFast, setStyleFast] = useState(false);
  const [showPlan, setShowPlan] = useState(false);

  const { blocks, markers, rule } = useMemo(
    () => buildTimeline({ ageMonths, wakeTime, napsCount, nightFeedsCount, challenge, styleFast }),
    [ageMonths, wakeTime, napsCount, nightFeedsCount, challenge, styleFast]
  );

  const chartData = useMemo(() => makeChartData(blocks), [blocks]);

  const challengeLabel = useMemo(
    () => ChallengeOptions.find((c) => c.value === challenge)?.label || "—",
    [challenge]
  );

  const pdfNotes = useMemo(() => {
    const arr: string[] = [];
    if (challenge === "early_waking") {
      arr.push("Shift bedtime by 10–15 minutes nightly toward ~7:00 PM.");
      arr.push("Keep room pitch-dark until target wake; avoid early morning stimulation.");
      arr.push("Ensure last wake window is within the ideal range for age.");
    } else if (challenge === "short_naps") {
      arr.push("Adjust wake window by ±10 minutes/day until naps lengthen.");
      arr.push("Dark room + white noise; use a short wind-down before each nap.");
      arr.push("Try crib hour for linking sleep cycles.");
    } else if (challenge === "night_wakings") {
      arr.push("Boost daytime calories; separate feed from falling asleep at bedtime.");
      arr.push("Use a brief pause before intervening overnight to allow self-settling.");
      arr.push("If above age-norm, gradually reduce night feeds.");
    } else if (challenge === "bedtime_resistance") {
      arr.push("Align last wake window to ideal; reduce stimulating play in last hour.");
      arr.push("Start a consistent wind-down 30–45 minutes before bed.");
      arr.push("Keep bedtime within the age-appropriate window.");
    }
    arr.push(styleFast ? "Faster track: make 15–20 minute changes per day if baby tolerates well." : "Gentle track: keep changes to ~10 minutes/day.");
    return arr;
  }, [challenge, styleFast]);

  return (
    <>
      <SEO
        title="Baby Sleep Analyzer"
        description="Create a gentle, science-backed daily sleep plan for your baby in seconds. Personalized by age, naps, and challenges."
        canonical="https://www.sleepylittleone.com/sleep-analyzer"
        keywords="baby sleep analyzer, gentle sleep training, naps, bedtime, early waking"
      />

      <main className="min-h-screen bg-background">
        <section className="max-w-5xl mx-auto px-4 py-8 md:py-12">
          <header className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Baby Sleep Analyzer</h1>
            <p className="text-muted-foreground mt-2">Your baby’s perfect day — in 30 seconds. Gentle, science-backed, and practical.</p>
          </header>

          <Card className="shadow-sm border rounded-2xl bg-card">
            <CardContent className="p-6 md:p-8 grid gap-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Field label="Baby’s Name (optional)">
                  <Input placeholder="e.g., Liam" value={babyName} onChange={(e) => setBabyName(e.target.value)} />
                </Field>

                <Field label="Baby’s Age (months)">
                  <Input type="number" min={0} max={24} value={ageMonths} onChange={(e) => setAgeMonths(Number(e.target.value))} />
                </Field>

                <Field label="Typical Wake-Up Time">
                  <Input type="time" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} />
                </Field>

                <Field label="Number of Naps">
                  <Input type="number" min={0} max={4} value={napsCount} onChange={(e) => setNapsCount(Number(e.target.value))} />
                </Field>

                <Field label="Night Feeds (number)">
                  <Input type="number" min={0} max={4} value={nightFeedsCount} onChange={(e) => setNightFeedsCount(Number(e.target.value))} />
                </Field>

                <Field label="Main Challenge">
                  <Select onValueChange={(v) => setChallenge(v as any)} value={challenge}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose one" />
                    </SelectTrigger>
                    <SelectContent>
                      {ChallengeOptions.map((c) => (
                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <div className="flex items-center gap-3 mt-2">
                  <Switch id="style" checked={styleFast} onCheckedChange={setStyleFast} />
                  <Label htmlFor="style">I’m OK with a faster track</Label>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button className="rounded-xl" onClick={() => setShowPlan(true)}>Generate Plan</Button>
                <Button
                  variant="secondary"
                  className="rounded-xl"
                  onClick={() => downloadPDF({ babyName, ageMonths, challengeLabel, blocks, notes: pdfNotes })}
                >
                  <Download className="h-4 w-4 mr-2" /> Download PDF
                </Button>
                <Button variant="ghost" className="rounded-xl">
                  <Share2 className="h-4 w-4 mr-2" /> Share
                </Button>
                <Button variant="ghost" className="rounded-xl">
                  <Mail className="h-4 w-4 mr-2" /> Email me this
                </Button>
              </div>
            </CardContent>
          </Card>

          <AnimatePresence>
            {showPlan && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.3 }}
                className="mt-8 grid gap-6"
              >
                <Card className="border rounded-2xl shadow-sm bg-card">
                  <CardContent className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-semibold text-foreground">Here’s {babyName ? `${babyName}’s` : "your baby’s"} ideal day</h2>
                        <p className="text-muted-foreground">Focus: <span className="font-medium text-foreground/90">{challengeLabel}</span> • Bedtime target: {floatToHM(rule.bedtime[rule.bedtime.length - 1])}</p>
                      </div>
                      <div className="text-sm text-muted-foreground">🟢 on track • 🟡 caution • 🔴 needs adjustment</div>
                    </div>

                    <div className="h-64 mt-4">
                      <ChartContainer
                        config={{
                          value: {
                            label: "Activity",
                            color: "hsl(var(--primary))",
                          },
                        }}
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                              <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-value)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="var(--color-value)" stopOpacity={0.06} />
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="time" interval={3} tick={{ fontSize: 10 }} />
                            <YAxis hide domain={[0, 1]} />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent className="w-[260px]" />} />
                            <Area type="monotone" dataKey="value" stroke="var(--color-value)" fill="url(#fillValue)" />
                            {markers.map((m, i) => (
                              <ReferenceArea key={i} x1={floatToHM(m.time)} x2={floatToHM(m.time + 0.01)} />
                            ))}
                          </AreaChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>

                    <div className="mt-6 grid md:grid-cols-3 gap-4">
                      {blocks.map((b, idx) => (
                        <div key={idx} className="rounded-xl p-4 bg-card border border-border">
                          <div className="text-xs uppercase tracking-wide text-muted-foreground">{b.type}</div>
                          <div className="text-lg font-semibold text-foreground">{floatToHM(b.start)}–{floatToHM(b.end)}</div>
                          <div className="text-sm text-muted-foreground">{b.note}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border rounded-2xl shadow-sm bg-card">
                  <CardContent className="p-6 md:p-8">
                    <h3 className="text-xl font-semibold text-foreground">3-Day Gentle Adjustment Plan</h3>
                    <ul className="mt-3 grid gap-2 text-foreground/90 list-disc pl-6">
                      {pdfNotes.slice(0, 6).map((n, i) => (
                        <li key={i} className="text-sm text-muted-foreground">{n}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <footer className="mt-10 text-center text-muted-foreground text-sm">© {new Date().getFullYear()} Sleepy Little One — For educational purposes only; not medical advice.</footer>
        </section>
      </main>
    </>
  );
}
