import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ResultView } from '@/components/sleep-planner/ResultView';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { SleepPlannerFormData } from '@/api/validate';
import { toast } from 'sonner';
import {
  scorePillars,
  buildTonightPlan,
  buildRoadmap
} from '@/lib/sleep-planner/rules';
import { supabase } from '@/integrations/supabase/client';

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
      const pillars = scorePillars(formData) || {
        pressure: 0,
        settling: 0,
        nutrition: 0,
        environment: 0,
        consistency: 0,
      };

      // Compute overall index inline (avoids missing export)
      const values = [
        pillars.pressure ?? 0,
        pillars.settling ?? 0,
        pillars.nutrition ?? 0,
        pillars.environment ?? 0,
        pillars.consistency ?? 0,
      ].map(n => (typeof n === 'number' && !Number.isNaN(n) ? n : 0));
      const overall =
        values.length > 0
          ? Math.round(values.reduce((a, b) => a + b, 0) / values.length)
          : 0;

      const tonight = buildTonightPlan(formData) || {};
      const road = buildRoadmap(formData, pillars) || [];

      return {
        scores: {
          overall,
          sleepPressure: pillars.pressure ?? 0,
          settling: pillars.settling ?? 0,
          nutrition: pillars.nutrition ?? 0,
          environment: pillars.environment ?? 0,
          consistency: pillars.consistency ?? 0,
        },
        tonightPlan: {
          wakeUpTime: (tonight as any)?.wakeTime || '',
          // show start–end, not just start
          napTimes: Array.isArray((tonight as any)?.napSchedule)
            ? (tonight as any).napSchedule
                .map((n: any) =>
                  n?.startTime && n?.endTime
                    ? `${n.startTime}–${n.endTime}`
                    : (n?.startTime || '')
                )
                .filter(Boolean)
            : [],
          // use IDEAL bedtime (not earliest)
          bedtime: (tonight as any)?.bedTimeWindow?.ideal || '',
          // pass through window & asleep-by for the view
          bedtimeWindow: (tonight as any)?.bedTimeWindow || null, // { earliest, latest, ideal }
          asleepBy: (tonight as any)?.asleepBy || '',
          routineSteps: Array.isArray((tonight as any)?.routineSteps)
            ? (tonight as any).routineSteps
            : [],
          keyTips: Array.isArray((tonight as any)?.keyTips)
            ? (tonight as any).keyTips
            : [],
        },
        roadmap: Array.isArray(road)
          ? road.map((w: any, i: number) => ({
              week: i + 1,
              focus: w?.focus || '',
              tasks: Array.isArray(w?.tasks) ? w.tasks : [],
            }))
          : [],
      };
    } catch (e) {
      console.error('[RESULTS] derivation failed:', e);
      setFatal('Sorry—something went wrong building your plan.');
      return null;
    }
  }, [formData]);

  const emailLike = (formData as any)?.email as string | undefined;
  const [email, setEmail] = useState(emailLike || '');
  const [emailSending, setEmailSending] = useState(false);

  useEffect(() => {
    if (emailLike) setEmail(emailLike);
  }, [emailLike]);

  const helpfulLinks = useMemo(() => {
    if (!formData || !derived) return [] as { label: string; href: string }[];
    const links: { label: string; href: string }[] = [];
    const age = (formData as any)?.age_months ?? 0;
    const regressionAges = [4, 8, 12, 18, 24];
    if (regressionAges.some(m => Math.abs(age - m) < 1)) {
      links.push({ label: 'How to handle sleep regressions', href: '/faq#regression' });
    }
    if (derived.scores.sleepPressure < 70) {
      links.push({ label: 'Understanding wake windows', href: '/blog' });
    }
    if (derived.scores.settling < 70) {
      links.push({ label: 'Gentle settling techniques', href: '/faq' });
    }
    return links;
  }, [formData, derived]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!derived) return;
    setEmailSending(true);
    try {
      const { error } = await supabase.functions.invoke('email-plan', {
        body: { email, formData, derived },
      });
      if (error) throw error;
      toast.success('Plan sent! Check your inbox.');
    } catch (err) {
      console.error('Email plan error', err);
      toast.error('Failed to send plan');
    } finally {
      setEmailSending(false);
    }
  };

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
      <div className="mt-8 px-4 flex flex-col items-center gap-6">
        <a
          href="https://buy.stripe.com/14AfZj2SF0pi6ml9jCc7u00"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto"
        >
          <Button size="lg" className="w-full">
            Get the Complete Sleepy Little One Method — $197
          </Button>
        </a>

        <form
          onSubmit={handleEmailSubmit}
          className="w-full max-w-sm flex gap-2"
        >
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="flex-1"
          />
          <Button type="submit" disabled={emailSending} className="whitespace-nowrap">
            {emailSending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Email me this plan
          </Button>
        </form>

        {helpfulLinks.length > 0 && (
          <div className="w-full max-w-lg text-left">
            <h3 className="font-semibold mb-2 text-center">Helpful Resources</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              {helpfulLinks.map(link => (
                <li key={link.href}>
                  <a href={link.href} className="underline text-primary">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
