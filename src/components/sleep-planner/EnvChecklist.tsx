import React from 'react';

interface EnvFormData {
  roomTemp: number;          // °C
  roomLight: string;         // 'very_dark' | 'can_see_hand' | etc.
  noiseLevel: string;        // 'white_noise_on' | 'quiet' | etc.
  routine: string[];         // bedtime routine steps
  consistencyRating: number; // 0–5 (5 = very consistent)
}

const A = <T,>(v: T[] | null | undefined): T[] => (Array.isArray(v) ? v : []);
const N = (v: any, d = 0) => (typeof v === 'number' && !Number.isNaN(v) ? v : d);
const S = (v: any, d = '') => (typeof v === 'string' ? v : d);

export const EnvChecklist: React.FC<{ formData: EnvFormData }> = ({ formData }) => {
  const data: EnvFormData = {
    roomTemp: N(formData?.roomTemp, 0),
    roomLight: S(formData?.roomLight, ''),
    noiseLevel: S(formData?.noiseLevel, ''),
    routine: A(formData?.routine),
    consistencyRating: N(formData?.consistencyRating, 0),
  };

  const checks = [
    { label: 'Room is very dark', ok: data.roomLight === 'very_dark' },
    { label: 'White noise (optional) or quiet room', ok: ['white_noise_on', 'quiet'].includes(data.noiseLevel) },
    { label: 'Bedtime routine has 3–5 steps', ok: data.routine.length >= 3 && data.routine.length <= 5 },
    { label: 'Wake time consistency is good', ok: data.consistencyRating >= 3 },
    { label: 'Room temp ~20–22°C', ok: data.roomTemp === 0 ? true : data.roomTemp >= 20 && data.roomTemp <= 22 },
  ];

  return (
    <div className="space-y-2">
      {checks.map((c, i) => (
        <div key={i} className="flex items-center justify-between text-sm">
          <span>{c.label}</span>
          <span className={c.ok ? 'text-green-600' : 'text-amber-600'}>
            {c.ok ? 'OK' : 'Review'}
          </span>
        </div>
      ))}
    </div>
  );
};
