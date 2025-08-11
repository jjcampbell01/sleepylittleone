import React, { useMemo } from "react";
import AgendaTimeline, {
  type Block as AgendaBlock,
  type Marker as AgendaMarker,
} from "@/components/sleep/AgendaTimeline";

/* ----------------- helpers (same behavior as before) ----------------- */

// Convert HH:MM string to float hours
function hmToFloat(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h + m / 60;
}

// Convert float hours to HH:MM string
function floatToHM(f: number) {
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

// Placeholder rules (unchanged)
const AGE_RULES = [
  { range: [0, 3], idealNaps: 5 },
  { range: [4, 6], idealNaps: 3 },
  { range: [7, 12], idealNaps: 2 },
  { range: [13, 24], idealNaps: 1 },
];

function getAgeRule(months: number) {
  return (
    AGE_RULES.find((r) => months >= r.range[0] && months <= r.range[1]) ||
    AGE_RULES[AGE_RULES.length - 1]
  );
}

// Split blocks that cross midnight
function splitCrossMidnightBlocks(blocks: any[]) {
  const out: any[] = [];
  blocks.forEach((b) => {
    if (b.end < b.start) {
      out.push({ ...b, end: 24 });
      out.push({ ...b, start: 0 });
    } else {
      out.push(b);
    }
  });
  return out;
}

// Build blocks + markers (same idea as before)
function buildTimeline({ blocks = [], markers = [], months = 6 }) {
  const rule = getAgeRule(months);

  blocks.forEach((b) => {
    if (b.type === "nap") {
      markers.push({
        time: b.start,
        severity: "green",
        msg: "Ideal nap start",
      });
    }
  });

  blocks = splitCrossMidnightBlocks(blocks);
  return { blocks, markers, rule };
}

/* ----------------- page ----------------- */

export default function SleepAnalyzerPage() {
  // TEMP demo data; replace with your real computed plan
  const { blocks, markers } = useMemo(
    () =>
      buildTimeline({
        blocks: [
          { type: "feed", start: 6.5, end: 6.75, note: "Feed within 15 min of wake" },
          { type: "play", start: 6.75, end: 10.5, note: "Wake window" },
          { type: "nap", start: 10.5, end: 11.75, note: "Nap 1" },
          { type: "feed", start: 11.75, end: 12.0, note: "Feed on wake" },
          { type: "play", start: 12.0, end: 15.75, note: "Wake window" },
          { type: "nap", start: 15.75, end: 17.0, note: "Nap 2" },
          { type: "feed", start: 17.0, end: 17.25, note: "Feed on wake" },
          { type: "play", start: 17.25, end: 19.25, note: "Calm play, bedtime routine" },
          { type: "bed", start: 19.25, end: 7.25, note: "Night sleep" }, // cross‑midnight
        ],
        months: 12,
      }),
    []
  );

  // Map to AgendaTimeline props
  const agendaBlocks: AgendaBlock[] = blocks.map((b: any) => ({
    type: b.type,
    start: b.start,
    end: b.end,
    note: b.note,
  }));

  const agendaMarkers: AgendaMarker[] = markers.map((m: any) => ({
    time: m.time,
    severity: m.severity,
    msg: m.msg,
  }));

  const counts = {
    green: agendaMarkers.filter((m) => m.severity === "green").length,
    yellow: agendaMarkers.filter((m) => m.severity === "yellow").length,
    red: agendaMarkers.filter((m) => m.severity === "red").length,
  };

  return (
    <div className="space-y-4">
      {/* Header + legend */}
      <div className="text-sm text-slate-600">
        🟢 on track ({counts.green}) • 🟡 caution ({counts.yellow}) • 🔴 needs adjustment ({counts.red})
      </div>

      {/* New agenda view (replaces the old Recharts area graph) */}
      <AgendaTimeline
        blocks={agendaBlocks}
        markers={agendaMarkers}
        dayStart={6}
        dayEnd={22}
        hourHeight={56}
      />

      {/* Example 3‑day plan section kept beneath (optional) */}
      <div className="rounded-xl border border-slate-200 p-4">
        <h3 className="font-semibold mb-2">3‑Day Gentle Adjustment Plan</h3>
        <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
          <li>Shift bedtime by 10–15 minutes nightly toward ~7:00 PM.</li>
          <li>Keep room pitch‑dark until target wake; avoid early morning stimulation.</li>
          <li>Ensure last wake window is within the ideal range for age.</li>
          <li>Gentle track: keep changes to ~10 minutes/day.</li>
        </ul>
      </div>
    </div>
  );
}
