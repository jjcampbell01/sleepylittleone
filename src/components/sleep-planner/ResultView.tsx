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
  formData: any;
  isPublic?: boolean;
}

/* helpers */
const safeArray = <T,>(v: T[] | null | undefined): T[] => (Array.isArray(v) ? v : []);
const safeStr = (v: any, fallback = '—') => (typeof v === 'string' && v.length > 0 ? v : fallback);
const safeNum = (v: any, fallback = 0) => (typeof v === 'number' && !Number.isNaN(v) ? v : fallback);

class SectionErrorBoundary extends React.Component<
  { label: string; children: React.ReactNode },
  { hasError: boolean; msg?: string }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(err: any) {
    return { hasError: true, msg: err?.message || String(err) };
  }
  componentDidCatch(error: any, info: any) {
    console.error(`[ResultView] ${this.props.label} error:`, error, info?.componentStack);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm">
          <div className="font-medium">{this.props.label} couldn’t render.</div>
          <div className="text-muted-foreground">{this.state.msg}</div>
        </div>
      );
    }
    return this.props.children as React.ReactElement;
  }
}

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

  const fd = {
    age_months: safeNum(formData?.age_months),
    anchor_wake: safeStr(formData?.anchor_wake, ''),
    nap_count: safeNum(formData?.nap_count),
    last_wake_window_h: safeNum(formData?.last_wake_window_h),

    associations: safeArray(formData?.associations),
    night_wakings: safeNum(formData?.night_wakings),
    longest_stretch_h: safeNum(formData?.longest_stretch_h),

    night_feeds: safeNum(formData?.night_feeds),
    feed_clock_times: safeArray(formData?.feed_clock_times),

    dark_hand_test: safeStr(formData?.dark_hand_test, 'pass'),
    white_noise_on: !!formData?.white_noise_on,
    white_noise_distance_ft: safeNum(formData?.white_noise_distance_ft, 0),
    white_noise_db: safeNum(formData?.white_noise_db, 0),
    temp_f: safeNum(formData?.temp_f),
    humidity_pct: safeNum(formData?.humidity_pct, 0),
    sleep_surface: safeStr(formData?.sleep_surface, 'crib'),

    routine_steps: safeArray(formData?.routine_steps),
    wake_variability: safeStr(formData?.wake_variability, '15-45'),
    health_flags: safeArray(formData?.health_flags),
    parent_preference: safeStr(formData?.parent_preference, 'gentle'),
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

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Sleep Readiness Index */}
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-wrap items-center gap-2">
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

              <SectionErrorBoundary label="Environment checklist">
                <EnvChecklist formData={fd} />
              </SectionErrorBoundary>
            </CardContent>
          </Card>

          {/* Tonight's Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-wrap items-center gap-2">
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
                  <div
                    key={`nap-${index}`}
                    className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg"
                  >
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
                  {keyTips.map((tip, index) => (
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

const PillarRow: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-sm">{label}</span>
    <div className="flex flex-wrap items-center gap-2">
      <div className="w-16 bg-secondary rounded-full h-2">
        <div className="h-2 bg-primary rounded-full transition-all duration-500" style={{ width: `${safeNum(value)}%` }} />
      </div>
      <span className="text-sm font-medium">{safeNum(value)}/100</span>
    </div>
  </div>
);
