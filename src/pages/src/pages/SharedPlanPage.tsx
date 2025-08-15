import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ResultView } from '@/components/sleep-planner/ResultView';
import { SEO } from '@/components/SEO';

function decodePayload<T = any>(s: string | null): T | null {
  if (!s) return null;
  try {
    const json = decodeURIComponent(escape(atob(s)));
    return JSON.parse(json) as T;
  } catch (e) {
    console.error('decode error', e);
    return null;
  }
}

export default function SharedPlanPage() {
  const [params] = useSearchParams();
  const data = useMemo(() => decodePayload(params.get('data')), [params]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-2">
          <h1 className="text-xl font-semibold">This shared plan could not be loaded.</h1>
          <p className="text-muted-foreground">Ask the sender to regenerate the link.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO title="Shared Sleep Plan" description="View a shared baby sleep plan." />
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <ResultView
            babyName={data.babyName || 'Your Baby'}
            ageMonths={data.ageMonths || 0}
            ageWeeks={data.ageWeeks || 0}
            scores={data.scores || { overall: 0, sleepPressure: 0, settling: 0, nutrition: 0, environment: 0, consistency: 0 }}
            tonightPlan={data.tonightPlan || { wakeUpTime: '', napTimes: [], bedtime: '', routineSteps: [], keyTips: [] }}
            roadmap={data.roadmap || []}
            formData={data.formData || {}}
            isPublic
          />
        </div>
      </div>
    </>
  );
}
