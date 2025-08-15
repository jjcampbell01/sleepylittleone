import React from 'react';
import { Badge } from '@/components/ui/badge';

type Props = {
  formData: any; // normalized fd from ResultView
};

const safeNum = (v: any, f = 0) => (typeof v === 'number' && !Number.isNaN(v) ? v : f);
const safeStr = (v: any, f = '') => (typeof v === 'string' ? v : f);
const safeArray = <T,>(v: T[] | undefined | null): T[] => (Array.isArray(v) ? v : []);

export function EnvChecklist({ formData }: Props) {
  const tempF = safeNum(formData?.temp_f, 0);
  const darkness = safeStr(formData?.dark_hand_test, 'pass'); // 'pass' or 'fail'
  const wnOn = !!formData?.white_noise_on;
  const wnDist = safeNum(formData?.white_noise_distance_ft, 0);
  const wnDb = safeNum(formData?.white_noise_db, 0);
  const humidity = safeNum(formData?.humidity_pct, 0);
  const routineSteps = safeArray<string>(formData?.routine_steps);

  const items: { label: string; ok: boolean; hint?: string }[] = [
    {
      label: `Dark room (can't see your hand)`,
      ok: darkness === 'pass',
      hint: 'Use blackout shades if you can still see your hand.'
    },
    {
      label: `Room temperature ~68–72°F (20–22°C)`,
      ok: tempF >= 68 && tempF <= 72,
      hint: `Currently ${tempF || '—'}°F`
    },
    {
      label: `White noise ${wnOn ? 'on' : 'off'} at 3–6 ft, ~65–70 dB`,
      ok: wnOn ? wnDist >= 3 && wnDist <= 6 && (wnDb === 0 || (wnDb >= 60 && wnDb <= 72)) : true,
      hint: wnOn ? `Distance ${wnDist}ft${wnDb ? ` • ${wnDb} dB` : ''}` : 'Optional but helpful'
    },
    {
      label: `Humidity ~40–60%`,
      ok: humidity === 0 || (humidity >= 40 && humidity <= 60),
      hint: humidity ? `Currently ${humidity}%` : 'If unknown, ignore'
    },
    {
      label: `Simple 3–5 step bedtime routine`,
      ok: routineSteps.length >= 3 && routineSteps.length <= 5,
      hint: routineSteps.length ? `${routineSteps.length} steps selected` : 'Try 3–5 steps nightly'
    }
  ];

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">Environment checklist</div>
      <ul className="space-y-1">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <Badge variant={it.ok ? 'default' : 'destructive'} className="mt-0.5">
              {it.ok ? 'OK' : 'Fix'}
            </Badge>
            <div>
              <div>{it.label}</div>
              {!!it.hint && <div className="text-muted-foreground text-xs">{it.hint}</div>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
