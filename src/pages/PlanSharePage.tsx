import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ResultView } from '@/components/sleep-planner/ResultView';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

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

export default function PlanSharePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<SharedPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError('Invalid plan link');
      setLoading(false);
      return;
    }

    loadPlan();
  }, [slug]);

  const loadPlan = async () => {
    try {
      const { data, error } = await supabase
        .from('public_sleep_plans')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error) {
        console.error('Error loading plan:', error);
        setError('Failed to load sleep plan');
        return;
      }

      if (!data) {
        setError('Sleep plan not found');
        return;
      }

      setPlan(data);
      
      // Track view if analytics consent given
      if (data.consent_analytics) {
        await supabase
          .from('sleep_plan_analytics')
          .insert({
            plan_slug: slug,
            event_type: 'plan_viewed',
            user_agent: navigator.userAgent,
            referrer: document.referrer
          });
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load sleep plan');
    } finally {
      setLoading(false);
    }
  };

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

  if (error || !plan) {
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

  const { derived_data, input_data, baby_name_public, age_months, age_weeks } = plan;

  return (
    <>
      <SEO
        title={`${baby_name_public ? `${baby_name_public}'s` : 'Baby'} Sleep Plan - ${age_months} Months`}
        description={`Personalized sleep plan for ${age_months}-month-old baby. Includes tonight's schedule, 14-day roadmap, and sleep readiness assessment.`}
        keywords="baby sleep plan, sleep training, baby sleep schedule, sleep consultant"
        type="article"
      />
      
      <ResultView
        babyName={baby_name_public}
        ageMonths={age_months}
        ageWeeks={age_weeks}
        scores={derived_data.scores}
        tonightPlan={derived_data.tonightPlan}
        roadmap={derived_data.roadmap}
        formData={input_data}
        isPublic={true}
      />
    </>
  );
}