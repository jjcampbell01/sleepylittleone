import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Download, Mail, Share2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceDot } from "recharts";
import jsPDF from "jspdf";

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

// Placeholder for actual rules
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

// Split sleep blocks that go past midnight into two
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

// Build timeline with markers
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

// Format data for chart
function makeChartData(blocks: any[]) {
  const map: Record<string, number> = {
    nap: 0.1,
    bed: 0.05,
    feed: 0.8,
    play: 0.5,
  };

  return blocks.map((b) => ({
    hour: (hmToFloat(floatToHM(b.start)) + 24) % 24,
    value: map[b.type],
    activity: b.type,
    label: `${b.type.toUpperCase()} • ${floatToHM(b.start)}–${floatToHM(b.end)}`,
  }));
}

export default function SleepAnalyzerPage() {
  const { blocks, markers, rule } = useMemo(
    () =>
      buildTimeline({
        blocks: [
          { type: "nap", start: 10, end: 11.5 },
          { type: "bed", start: 20, end: 7 },
        ],
        months: 8,
      }),
    []
  );

  const chartData = useMemo(() => makeChartData(blocks), [blocks]);
  const markerCounts = useMemo(
    () => ({
      green: markers.filter((m) => m.severity === "green").length,
      yellow: markers.filter((m) => m.severity === "yellow").length,
      red: markers.filter((m) => m.severity === "red").length,
    }),
    [markers]
  );

  return (
    <div className="space-y-4">
      <div className="text-sm text-slate-500 mb-2">
        🟢 on track ({markerCounts.green}) • 🟡 caution ({markerCounts.yellow}) • 🔴 needs adjustment ({markerCounts.red})
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <XAxis
            type="number"
            dataKey="hour"
            domain={[0, 24]}
            tickFormatter={(h) => floatToHM(h)}
          />
          <YAxis hide domain={[0, 1]} />
          <Tooltip
            formatter={(v, n, { payload }) => [payload.label, ""]}
            labelFormatter={(h) => floatToHM(h)}
            cursor={false}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#7c3aed"
            fillOpacity={0.2}
            fill="#7c3aed"
            dot={false}
            activeDot={false}
          />
          {markers.map((m, i) => (
            <ReferenceDot
              key={i}
              x={(m.time + 24) % 24}
              y={0.95}
              r={4}
              fill={
                m.severity === "red"
                  ? "#ef4444"
                  : m.severity === "yellow"
                  ? "#f59e0b"
                  : "#22c55e"
              }
              stroke="none"
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
