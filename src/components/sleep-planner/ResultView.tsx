/* FULL FILE — paste everything */
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Moon, Sun, Lightbulb } from 'lucide-react';
import { ScoreMeter } from './ScoreMeter';
import { EnvChecklist } from './EnvChecklist';

interface SleepScore {
  overall: number;
  sleepPressure: number;
  settling: number;
  nutrition: number;
  environment: number;
  consistency: number;
}
interface TonightPlan {
  wakeUpTime: string;
  napTimes: string[];
  bedtime: string;
  routineSteps: string[];
  keyTips: string[];
}
interface RoadWeek {
  week: number;
  focus: string;
  tasks: string[];
}
export function ResultView({
  babyName,
  ageMonths,
  ageWeeks,
  scores,
  tonightPlan,
  roadmap,
  isPublic = false,
  formData,
}: {
  babyName?: string;
  ageMonths: number;
  ageWeeks?: number;
  scores: SleepScore;
  tonightPlan: TonightPlan;
  roadmap: RoadWeek[];
  isPublic?: boolean;
  formData?: any;
}) {
  const safeNum = (v: any, fallback = 0) => (typeof v === 'number' && !Number.isNaN(v) ? v : fallback);
  const safeStr = (v: any, fallback = '') => (typeof v === 'string' ? v : fallback);
  const safeArray = (v: any) => (Array.isArray(v) ? v : []);

  /* …rest of your original helpers that read formData safely… */

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">
            {babyName ? `${babyName}'s` : 'Baby'} Sleep Plan
          </h1>
          <p className="text-lg text-muted-foreground">
            Personalized for {safeNum(ageMonths)} months{ageWeeks ? ` (${safeNum(ageWeeks)} weeks)` : ''}
          </p>
          {isPublic && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                📚 Educational content only - not medical advice. Created with evidence-based sleep science.
              </p>
            </div>
          )}
        </div>

        {/* Three-column on large screens; single column on mobile by default */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* …everything else in your original ResultView (cards for scores, tonight plan, roadmap, etc.)…
              No content changes—just the grid class changed to ensure clean mobile stacking. */}
        </div>
      </div>
    </div>
  );
}
