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

interface RoadmapWeek {
  week: number;
  focus: string;
  tasks: string[];
}

interface ResultViewProps {
  babyName?: string;
  ageMonths: number;
  ageWeeks?: number;
  scores: SleepScore;
  tonightPlan: TonightPlan;
  roadmap: RoadmapWeek[];
  formData: any;         // raw planner form data
  isPublic?: boolean;
}

/* ---------- helpers ---------- */
const safeArray = <T,>(v: T[] | null | undefined): T[] => (Array.isArray(v) ? v : []);
const safeStr = (v: any, fallback = '—') => (typeof v === 'string' && v.length > 0 ? v : fallback);
const safeNum = (v: any, fallback = 0) => (typeof v === 'number' && !Number.isNaN(v) ? v : fallback);
/* ------------------------------ */

// °F → °C for checklist display
const fToC = (f: number | undefined) =>
  typeof f === 'number' ? Math.round(((f - 32) * 5) / 9) : 0;

// wake variability → 0–5 score
const mapWakeVariabilityToScore = (v: string | undefined) => {
  switch (v) {
    case '0-15': return 5;   // very consistent
    case '15-45': return 3;  // somewhat consistent
    case '45+': return 1;    // inconsistent
    default: return 0;
  }
};

export function ResultView({
  babyName,
  ageMonths,
  ageWeeks,
  scores,
  tonightPlan,
  roadmap,
  formData,
  isPublic = false,
}: ResultViewProps) {
  // normalize for render
  const napTimes = safeArray(tonightPlan?.napTimes);
  const routineSteps = safeArray(tonightPlan?.routineSteps);
  const keyTips = safeArray(tonightPlan?.keyTips);
  const roadmapSafe = safeArray(roadmap);
  const wakeUpTime = safeStr(tonightPlan?.wakeUpTime);
  const bedtime = safeStr(tonightPlan?.bedtime);

  const s = {
    overall: safeNum(scores?.overall),
    sleepPressure: safeNum(scores?.sleepPressure),
    settling: safeNum(scores?.settling),
    nutrition: safeNum(scores?.nutrition),
    environment: safeNum(scores?.environment),
    consistency: safeNum(scores?.consistency),
  };

  // Build the exact shape EnvChecklist expects
  const envForm = {
    roomTemp: fToC(formData?.temp_f), // planner stores °F
    roomLight: formData?.dark_hand_test === 'pass' ? 'very_dark' : 'can_see_hand',
    noiseLevel: formData?.white_noise_on ? 'white_noise_on' : 'quiet',
    routine: Array.isArray(formData?.routine_steps) ? formData.routine_steps : [],
    consistencyRating: mapWakeVariabilityToScore(formData?.wake_variability),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">
            {babyName ? `${babyName}'s` : 'Baby'} Sleep Plan
          </h1>
          <p className="text-lg text-muted-foreground">
            Personalized for {safeNum(ageMonths)} months
            {ageWeeks ? ` (${safeNum(ageWeeks)} weeks)` : ''}
          </p>
          {isPublic && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                📚 Educational content only — not medical advice. Created with evidence-based sleep science.
              </p>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sleep Readiness Index */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Moon className="h-5 w-5" />
                Sleep Readiness Index
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <ScoreMeter score={s.overall} size="lg" />
              </div>

              <div className="space-y-3">
                <PillarRow label="Sleep Pressure" value={s.sleepPressure} />
                <PillarRow label="Settling Ability" value={s.settling} />
                <PillarRow label="Nutrition" value={s.nutrition} />
                <PillarRow label="Environment" value={s.environment} />
                <PillarRow label="Consistency" value={s.consistency} />
              </div>

              {/* EnvChecklist now receives the exact shape it expects */}
              <EnvChecklist formData={envForm} />
            </CardContent>
          </Card>

          {/* Tonight's Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Tonight's Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                  <span className="font-medium">Wake Up</span>
                  <Badge variant="outline">{wakeUpTime}</Badge>
                </div>

                {napTimes.map((napTime, index) => (
                  <div key={`nap-${index}`} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                    <span className="font-medium">Nap {index + 1}</span>
                    <Badge variant="outline">{safeStr(napTime)}</Badge>
                  </div>
                ))}

                <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <span className="font-medium">Bedtime</span>
                  <Badge className="bg-primary">{bedtime}</Badge>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Sun className="h-4 w-4" />
                  Bedtime Routine
                </h4>
                <ul className="space-y-2">
                  {routineSteps.map((step, index) => (
                    <li key={`routine-${index}`} className="flex items-start gap-2 text-sm">
                      <span className="flex-shrink-0 w-5 h-5 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </span>
                      {safeStr(step)}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Key Tips for Tonight
                </h4>
                <ul className="space-y-2">
                  {safeArray(keyTips).map((tip, index) => (
                    <li key={`tip-${index}`} className="text-sm flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {safeStr(tip)}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* 14-Day Roadmap */}
          <Card>
            <CardHeader>
              <CardTitle>14-Day Roadmap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {roadmapSafe.map((week, wi) => (
                  <div key={`week-${week?.week ?? wi}`} className="border rounded-lg p-4">
                    <h4 className="font-semibold text-primary mb-2">
                      Week {safeNum(week?.week, wi + 1)}: {safeStr(week?.focus, 'Focus')}
                    </h4>
                    <ul className="space-y-1">
                      {safeArray(week?.tasks).map((task, ti) => (
                        <li key={`task-${wi}-${ti}`} className="text-sm flex items-start gap-2">
                          <span className="text-primary">•</span>
                          {safeStr(task)}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {isPublic && (
          <div className="mt-12 p-6 bg-muted/50 rounded-lg border">
            <h3 className="font-semibold mb-2">Sleep Science Insight</h3>
            <p className="text-sm text-muted-foreground mb-4">
              This plan is based on evidence-based sleep science and considers your baby's unique age, development,
              and current sleep patterns. Remember that all babies are different, and consistency is key to success.
            </p>
            <p className="text-xs text-muted-foreground">
              💡 Want to create your own personalized sleep plan?
              <a href="/sleep-planner" className="text-primary hover:underline ml-1">
                Try our free Sleep Planner
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* small presentational helper for the pillar rows */
const PillarRow: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-sm">{label}</span>
    <div className="flex items-center gap-2">
      <div className="w-16 bg-secondary rounded-full h-2">
        <div
          className="h-2 bg-primary rounded-full transition-all duration-500"
          style={{ width: `${safeNum(value)}%` }}
        />
      </div>
      <span className="text-sm font-medium">{safeNum(value)}/100</span>
    </div>
  </div>
);
