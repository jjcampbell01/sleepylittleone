import React, { useMemo } from "react";

/* ---------- Types ---------- */
export type BlockType = "feed" | "play" | "nap" | "bed";
export type Severity = "green" | "yellow" | "red";

export interface Block {
  type: BlockType;
  start: number;   // hour in decimal, e.g., 6.5 = 06:30
  end: number;     // hour in decimal (may cross midnight if end < start)
  note?: string;
}
export interface Marker {
  time: number;    // hour in decimal, 0–24
  severity: Severity;
  msg: string;
}

/* ---------- Utils ---------- */
function hm(f: number) {
  let h = Math.floor(f);
  let m = Math.round((f - h) * 60);
  if (m === 60) { h += 1; m = 0; }
  const hh = String((h + 24) % 24).padStart(2, "0");
  const mm = String(m).padStart(2, "0");
  return `${hh}:${mm}`;
}
const toMin = (f: number) => Math.round(((f % 24) + 24) % 24 * 60);

function splitCrossMidnight(blocks: Block[]): Block[] {
  const out: Block[] = [];
  for (const b of blocks) {
    if (b.end < b.start) {
      out.push({ ...b, end: 24 });
      out.push({ ...b, start: 0 });
    } else out.push(b);
  }
  return out;
}
function statusFromMarkers(b: Block, markers: Marker[]): Severity {
  const inside = (t: number) =>
    (b.end >= b.start && t >= b.start && t <= b.end) ||
    (b.end < b.start && (t >= b.start || t <= b.end));
  if (markers.some((m) => inside(m.time) && m.severity === "red")) return "red";
  if (markers.some((m) => inside(m.time) && m.severity === "yellow")) return "yellow";
  return "green";
}
const titleFor = (t: BlockType, i: number) =>
  t === "nap" ? `Nap ${i}` : t === "bed" ? "Bed" : t.toUpperCase();

/* ---------- Component ---------- */
export default function AgendaTimeline({
  blocks,
  markers,
  dayStart = 6,
  dayEnd = 22,
  hourHeight = 56,
}: {
  blocks: Block[];
  markers: Marker[];
  dayStart?: number;
  dayEnd?: number;
  hourHeight?: number;
}) {
  // Normalize blocks (split midnight) and number naps
  const split = useMemo(() => splitCrossMidnight(blocks), [blocks]);

  let napIdx = 0;
  const items = split.map((b) => ({
    kind: b.type as BlockType,
    startMin: toMin(b.start),
    endMin: toMin(b.end),
    title: titleFor(b.type, b.type === "nap" ? ++napIdx : 0),
    tip: b.note,
    status: statusFromMarkers(b, markers),
  }));

  // Rail bounds
  const minShown = Math.min(toMin(dayStart), ...items.map(i => i.startMin));
  const maxShown = Math.max(toMin(dayEnd), ...items.map(i => i.endMin));
  const totalMin = Math.max(60, maxShown - minShown);
  const railHeight = (totalMin / 60) * hourHeight;

  const yTop = (m: number) => ((m - minShown) / 60) * hourHeight;

  const statusDot = (s: Severity) =>
    s === "red" ? "bg-red-500" : s === "yellow" ? "bg-yellow-500" : "bg-green-500";
  const tone = (k: BlockType) =>
    k === "bed" ? "bg-violet-100 ring-violet-200"
    : k === "nap" ? "bg-violet-50 ring-violet-200"
    : k === "feed" ? "bg-amber-50 ring-amber-200"
    : "bg-sky-50 ring-sky-200"; // play

  return (
    <div className="w-full grid grid-cols-[64px,1fr] gap-3">
      {/* Time rail */}
      <div className="relative" style={{ height: railHeight }}>
        <div className="absolute inset-y-0 right-0 w-px bg-slate-200" />
        {Array.from({ length: Math.floor(totalMin / 60) + 1 }).map((_, i) => {
          const hh = Math.floor(dayStart + i) % 24;
          const label = `${String(hh).padStart(2, "0")}:00`;
          return (
            <div
              key={i}
              className="absolute left-0 -translate-y-1/2 text-xs text-slate-500"
              style={{ top: yTop(minShown + i * 60) }}
            >
              {label}
            </div>
          );
        })}
      </div>

      {/* Agenda column */}
      <div
        className="relative rounded-2xl bg-white ring-1 ring-slate-200 p-3"
        style={{ height: railHeight }}
      >
        {items.map((it, idx) => {
          const top = yTop(it.startMin);
          const height = Math.max(28, yTop(it.endMin) - yTop(it.startMin));
          return (
            <div
              key={idx}
              className={`absolute left-3 right-3 rounded-xl ring-1 ${tone(it.kind)} shadow-[0_1px_0_rgba(0,0,0,0.02)]`}
              style={{ top, height }}
            >
              <div className="flex items-center gap-2 px-3 py-2">
                <span className={`inline-block h-2.5 w-2.5 rounded-full ${statusDot(it.status)}`} />
                <div className="font-medium text-slate-900 text-sm">{it.title}</div>
                <div className="ml-auto text-xs text-slate-600">
                  {hm(it.startMin / 60)}–{hm(it.endMin / 60)}
                </div>
              </div>
              {it.tip && (
                <div className="px-3 pb-2 text-xs text-slate-600/80">{it.tip}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
