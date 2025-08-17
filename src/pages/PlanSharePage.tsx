import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ResultView } from '@/components/sleep-planner/ResultView';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';

interface SharedPlan {
  id: string;
  slug: string;
  age_months: number;
  age_weeks?: number;
  input_data: any;
  derived_data: any;
  baby_name_public?: string;
  consent_analytics: boolean;
  created_at: string;
}

interface PayloadScores {
  overall: number;
  sleepPressure: number;
  settling: number;
  nutrition: number;
  environment: number;
  consistency: number;
}

interface PayloadTonightPlan {
  wakeUpTime: string;
  napTimes: string[];
  bedtime: string;
  routineSteps: string[];
  keyTips: string[];
}

interface PayloadWeek {
  week: number;
  focus: string;
  tasks: string[];
}

interface SharePayload {
  meta?: { v?: number };
  babyName?: string;
  ageMonths?: number;
  ageWeeks?: number;
  scores?: Partial<PayloadScores>;
  tonightPlan?: Partial<PayloadTonightPlan>;
  roadmap?: Partial<PayloadWeek>[];
  formData?: any;
}

function tryDecode<T = any>(s: string | null | undefined): T | null {
  if (!s) return null;
  try {
    // reverse of btoa(unescape(encodeURIComponent(json)))
    const json = decodeURIComponent(escape(atob(s)));
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

export default function PlanSharePage() {
  const { slug } = useParams<{ slug: string }>();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const [payload, setPayload] = useState<SharePayload | null>(null);
  const [plan, setPlan] = useState<SharedPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Try to decode a payload first; if not possible, fall back to Supabase
  useEffect(() => {
    let isMounted = true;

    async function run() {
      setLoading(true);
      setError(null);
      setPayload(null);
      setPlan(null);

      // 1) Preferred: /plan/:slug where :slug is a base64 payload
      const fromSlug = tryDecode<SharePayload>(slug);
      if (fromSlug && isMounted) {
        setPayload(fromSlug);
        setLoading(false);
        return;
      }

      // 2) Fallback: /plan?data=... style links (older)
      const fromQuery = tryDecode<SharePayload>(params.get('data'));
      if (fromQuery && isMounted) {
        setPayload(fromQuery);
        setLoading(false);
        return;
      }

      // 3) Legacy DB lookup: treat :slug as a database slug
      if (!slug) {
        setError('Invalid plan link');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('public_sleep_plans')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (!isMounted) return;

      if (error) {
        console.error('Error loading plan:', error);
        setError('Failed to load sleep plan');
        setLoading(false);
        return;
      }
      if (!data) {
        setError('Sleep plan not found');
        setLoading(false);
        return;
      }

      setPlan(data);

      // Track view if analytics consent given
      if (data.consent_analytics) {
        try {
          await supabase.from('sleep_plan_analytics').insert({
            plan_slug: slug,
            event_type: 'plan_viewed',
            user_agent: navigator.userAgent,
            referrer: document.referrer,
          });
        } catch (e) {
          // non-blocking
          console.warn('analytics insert failed', e);
        }
      }

      setLoading(false);
    }

    run();
    return () => {
      isMounted = false;
    };
  }, [slug, params]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading sleep plan...</p>
        </div>
      </div>
    );
  }

  if (error || (!payload && !plan)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold mb-4">Plan Not Found</h1>
          <p className="text-muted-foreground mb-6">
            {error || 'This sleep plan link is invalid or has expired.'}
          </p>
          <div className="space-y-3">
            <Button onClick={() => navigate('/sleep-planner')} className="w-full">
              Create Your Own Sleep Plan
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

  // ------- Render from payload (new share links) -------
  if (payload) {
    const p = payload;

    const scores: PayloadScores = {
      overall: p.scores?.overall ?? 0,
      sleepPressure: p.scores?.sleepPressure ?? 0,
      settling: p.scores?.settling ?? 0,
      nutrition: p.scores?.nutrition ?? 0,
      environment: p.scores?.environment ?? 0,
      consistency: p.scores?.consistency ?? 0,
    };

    const tonightPlan = {
      wakeUpTime: p.tonightPlan?.wakeUpTime || '',
      napTimes: Array.isArray(p.tonightPlan?.napTimes) ? p.tonightPlan!.napTimes! : [],
      bedtime: p.tonightPlan?.bedtime || '',
      routineSteps: Array.isArray(p.tonightPlan?.routineSteps) ? p.tonightPlan!.routineSteps! : [],
      keyTips: Array.isArray(p.tonightPlan?.keyTips) ? p.tonightPlan!.keyTips! : [],
    };

    const roadmap = Array.isArray(p.roadmap)
      ? p.roadmap!.map((w, i) => ({
          week: typeof w?.week === 'number' ? w.week : i + 1,
          focus: w?.focus || '',
          tasks: Array.isArray(w?.tasks) ? (w.tasks as string[]) : [],
        }))
      : [];

    return (
      <>
        <SEO
          title={`${p.babyName ? `${p.babyName}'s` : 'Baby'} Sleep Plan${p.ageMonths ? ` - ${p.ageMonths} Months` : ''}`}
          description="Personalized sleep plan including tonight's schedule, a 14-day roadmap, and a sleep readiness assessment."
          keywords="baby sleep plan, sleep training, baby sleep schedule, sleep consultant"
          type="article"
        />
        <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <ResultView
              babyName={p.babyName || 'Your Baby'}
              ageMonths={p.ageMonths || 0}
              ageWeeks={p.ageWeeks || 0}
              scores={scores}
              tonightPlan={tonightPlan}
              roadmap={roadmap}
              formData={p.formData || {}}
              isPublic
            />
          </div>
        </div>
      </>
    );
  }

  // ------- Render from Supabase (legacy links) -------
  const { derived_data, input_data, baby_name_public, age_months, age_weeks } = plan as SharedPlan;

  return (
    <>
      <SEO
        title={`${baby_name_public ? `${baby_name_public}'s` : 'Baby'} Sleep Plan - ${age_months} Months`}
        description={`Personalized sleep plan for ${age_months}-month-old baby. Includes tonight's schedule, 14-day roadmap, and sleep readiness assessment.`}
        keywords="baby sleep plan, sleep training, baby sleep schedule, sleep consultant"
        type="article"
      />
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <ResultView
            babyName={baby_name_public}
            ageMonths={age_months}
            ageWeeks={age_weeks}
            scores={derived_data?.scores || {
              overall: 0, sleepPressure: 0, settling: 0, nutrition: 0, environment: 0, consistency: 0
            }}
            tonightPlan={derived_data?.tonightPlan || {
              wakeUpTime: '', napTimes: [], bedtime: '', routineSteps: [], keyTips: []
            }}
            roadmap={derived_data?.roadmap || []}
            formData={input_data || {}}
            isPublic
          />
        </div>
      </div>
    </>
  );
}
