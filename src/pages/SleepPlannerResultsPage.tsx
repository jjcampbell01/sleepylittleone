import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ResultView } from '@/components/sleep-planner/ResultView';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { SleepPlannerFormData } from '@/api/validate';
import {
  scorePillars,
  computeSleepReadinessIndex,
  buildTonightPlan,
  buildRoadmap
} from '@/lib/sleep-planner/rules';

const STORAGE_KEY = 'sleepPlannerV2Data';

export default function SleepPlannerResultsPage() {
  const { state } = useLocation() as { state?: { formData?: SleepPlannerFormData } };
  const navigate = useNavigate();

  const [formData, setFormData] = useState<SleepPlannerFormData | null>(state?.formData ?? null);
  const [loading, setLoading] = useState(!state?.formData);
  const [fatal, setFatal] = useState<string | null>(null);

  // Try to recover from localStorage if user reloaded results page
  useEffect(() => {
    if (formData) return;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) { setLoading(false); return; }
    try {
      const parsed = JSON.parse(saved);
      if (parsed?.formData) setFormData(parsed.formData);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [formData]);

  const derived = useMemo(() => {
    if (!formData) return null;

    try {
      const pillars = scorePillars(formData);
      const sri = computeSleepReadinessIndex(pillars);
      const tonight = buildTonightPlan(formData, pillars);
      const road = buildRoadmap(formData, pillars);

      return {
        scores: {
          overall: sri ?? 0,
          sleepPressure: pillars?.pressure ?? 0,
          settling: pillars?.settling ?? 0,
          nutrition: pillars?.nutrition ?? 0,
          environment: pillars?.environment ?? 0,
          consistency: pillars?.consistency ?? 0
        },
        tonightPlan: {
          wakeUpTime: tonight?.wakeTime || '',
          napTimes: Array.isArray(tonight?.napSchedule) ? tonight!.napSchedule.map(n => n?.startTime || '').filter(Boolean) : [],
          bedtime: tonight?.bedTimeWindow?.earliest || '',
          routineSteps: Array.isArray(tonight?.routineSteps) ? tonight!.routineSteps : [],
          keyTips: Array.isArray(tonight?.keyTips) ? tonight!.keyTips : []
        },
        roadmap: Array.isArray(road)
          ? road.map((w, i) => ({
              week: i + 1,
              focus: w?.focus || '',
              tasks: Array.isArray(w?.tasks) ? w!.tasks : []
            }))
          : []
      };
    } catch (e) {
      console.error('[RESULTS] derivation failed:', e);
      setFatal('Sorry—something went wrong building your plan.');
      return null;
    }
  }, [formData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Generating your plan…</p>
        </div>
      </div>
    );
  }

  if (!formData || fatal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold mb-4">We couldn’t generate your plan</h1>
          <p className="text-muted-foreground mb-6">
            {fatal || 'Please go back and complete the assessment.'}
          </p>
          <div className="space-y-3">
            <Button onClick={() => navigate('/sleep-planner')} className="w-full">
              Create / Edit Sleep Plan
            </Button>
            <Button variant="outline" onClick={() => navigate('/')} className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const emailLike = (formData as any)?.email as string | undefined;

  return (
    <>
      <SEO
        title="Your Sleep Plan Results"
        description="Personalized sleep plan including tonight’s schedule and a 14-day roadmap."
        keywords="baby sleep plan, results"
      />
      <ResultView
        babyName={emailLike ? emailLike.split('@')[0] : undefined}
        ageMonths={(formData as any)?.age_months ?? 0}
        ageWeeks={0}
        scores={derived!.scores}
        tonightPlan={derived!.tonightPlan}
        roadmap={derived!.roadmap}
        formData={formData}
      />
    </>
  );
}
