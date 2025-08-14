import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SEO } from '@/components/SEO';
import { ResultView } from '@/components/sleep-planner/ResultView';
import { ShareCard } from '@/components/sleep-planner/ShareCard';
import { ArrowLeft, Download } from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

import type { SleepPlannerFormData } from '@/api/validate';
import {
  scorePillars,
  computeIndex,
  buildTonightPlan,
  buildGentleSettlingPlan,
  buildRoadmap,
  type PillarScores,
  type TonightPlan,
  type GentleSettlingPlan,
  type RoadmapWeek,
} from '@/lib/sleep-planner/rules';

const STORAGE_KEY = 'sleepPlannerV2Data';

/** Error boundary to prevent white-screen if a child component throws while rendering */
class RenderErrorBoundary extends React.Component<
  { label: string; children: React.ReactNode },
  { hasError: boolean; message?: string }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, message: undefined };
  }
  static getDerivedStateFromError(err: any) {
    return { hasError: true, message: err?.message || String(err) };
  }
  componentDidCatch(error: any, info: any) {
    console.error(`[RESULTS] ${this.props.label} render error:`, error, info?.componentStack);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
          <div className="font-semibold mb-1">{this.props.label} couldn’t render.</div>
          <div className="text-muted-foreground">
            {this.state.message || 'An unexpected error occurred.'} Check the console for details.
          </div>
        </div>
      );
    }
    return this.props.children as React.ReactElement;
  }
}

export default function SleepPlannerResultsPage() {
  const location = useLocation() as { state?: { formData?: SleepPlannerFormData } };
  const navigate = useNavigate();

  const [formData, setFormData] = useState<SleepPlannerFormData | null>(null);
  const [scores, setScores] = useState<PillarScores | null>(null);
  const [sleepReadinessIndex, setSleepReadinessIndex] = useState<number>(0);
  const [tonightPlan, setTonightPlan] = useState<TonightPlan | null>(null);
  const [gentleSettlingPlan, setGentleSettlingPlan] = useState<GentleSettlingPlan | null>(null);
  const [roadmap, setRoadmap] = useState<RoadmapWeek[]>([]);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [fatalError, setFatalError] = useState<string | null>(null);

  // Load data from navigation state OR localStorage
  useEffect(() => {
    try {
      const fromState = location.state?.formData;
      if (fromState) {
        console.log('[RESULTS] Loaded formData from route state');
        setFormData(fromState);
        return;
      }
      const savedRaw = localStorage.getItem(STORAGE_KEY);
      if (savedRaw) {
        const saved = JSON.parse(savedRaw);
        if (saved?.formData) {
          console.log('[RESULTS] Loaded formData from localStorage');
          setFormData(saved.formData);
          return;
        }
      }
      console.warn('[RESULTS] No formData found; sending back to planner');
      toast.error('We couldn’t find your answers. Please complete the planner again.');
      navigate('/sleep-planner');
    } catch (e) {
      console.error('[RESULTS] Error loading formData:', e);
      setFatalError('Something went wrong loading your data.');
    }
  }, [location.state, navigate]);

  // Compute plan
  useEffect(() => {
    if (!formData) return;
    try {
      console.log('[RESULTS] formData:', formData);

      const calculated = scorePillars(formData);
      const index = computeIndex(calculated, formData.age_months ?? 0);
      const tonight = buildTonightPlan(formData);
      const settling = buildGentleSettlingPlan(formData);
      const weekly = buildRoadmap(formData, calculated);

      setScores(calculated);
      setSleepReadinessIndex(index ?? 0);
      setTonightPlan(tonight);
      setGentleSettlingPlan(settling);
      setRoadmap(Array.isArray(weekly) ? weekly : []);
    } catch (e) {
      console.error('[RESULTS] Error generating plan:', e);
      setFatalError('We hit a snag generating the plan. Please go back and try again.');
      toast.error('Error generating sleep plan. Please try again.');
    }
  }, [formData]);

  // Loading / fatal error
  if (fatalError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center px-4">
        <div className="max-w-lg text-center space-y-4">
          <h2 className="text-2xl font-semibold">Oops—something went wrong</h2>
          <p className="text-muted-foreground">{fatalError}</p>
          <div className="flex items-center justify-center gap-3">
            <Button variant="outline" onClick={() => navigate('/sleep-planner')} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Assessment
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!formData || !scores || !tonightPlan || !gentleSettlingPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Preparing your personalized sleep plan…</p>
        </div>
      </div>
    );
  }

  // Defensively shape the props we pass down (so children never see undefined)
  const safeScores = {
    overall: sleepReadinessIndex ?? 0,
    sleepPressure: scores?.pressure ?? 0,
    settling: scores?.settling ?? 0,
    nutrition: scores?.nutrition ?? 0,
    environment: scores?.environment ?? 0,
    consistency: scores?.consistency ?? 0,
  };

  const safeTonight = {
    wakeUpTime: tonightPlan?.wakeTime || '',
    napTimes: tonightPlan?.napSchedule?.map(n => n?.startTime || '')?.filter(Boolean) || [],
    bedtime: tonightPlan?.bedTimeWindow?.earliest || '',
    routineSteps: tonightPlan?.routineSteps || [],
    keyTips: tonightPlan?.keyTips || [],
  };

  const safeRoadmap =
    (roadmap || []).map((w, i) => ({
      week: i + 1,
      focus: w?.focus || '',
      tasks: w?.tasks || [],
    })) || [];

  // PDF
  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.width;
      const margin = 20;
      let y = margin;

      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Sleep Plan for ${formData.email || 'Your Baby'}`, margin, y); y += 15;

      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Sleep Readiness Index: ${safeScores.overall}/100`, margin, y); y += 10;

      pdf.setFontSize(14); pdf.setFont('helvetica', 'bold');
      pdf.text('Sleep Pillar Scores:', margin, y); y += 8;

      pdf.setFont('helvetica', 'normal'); pdf.setFontSize(12);
      pdf.text(`Sleep Pressure: ${safeScores.sleepPressure}/100`, margin, y); y += 6;
      pdf.text(`Settling: ${safeScores.settling}/100`, margin, y); y += 6;
      pdf.text(`Nutrition: ${safeScores.nutrition}/100`, margin, y); y += 6;
      pdf.text(`Environment: ${safeScores.environment}/100`, margin, y); y += 6;
      pdf.text(`Consistency: ${safeScores.consistency}/100`, margin, y); y += 15;

      pdf.setFontSize(14); pdf.setFont('helvetica', 'bold');
      pdf.text("Tonight's Plan:", margin, y); y += 8;

      pdf.setFont('helvetica', 'normal'); pdf.setFontSize(12);
      pdf.text(`Wake Time: ${safeTonight.wakeUpTime}`, margin, y); y += 6;

      if (safeTonight.napTimes.length > 0) {
        pdf.text('Nap Schedule:', margin, y); y += 6;
        safeTonight.napTimes.forEach((start, i) => {
          pdf.text(`  Nap ${i + 1}: ${start}`, margin + 10, y);
          y += 6;
        });
      }

      pdf.text(`Bedtime Window: ${tonightPlan?.bedTimeWindow?.earliest || ''} - ${tonightPlan?.bedTimeWindow?.latest || ''}`, margin, y); y += 10;

      if (safeTonight.keyTips.length > 0) {
        pdf.setFont('helvetica', 'bold');
        pdf.text('Key Tips for Tonight:', margin, y); y += 8;
        pdf.setFont('helvetica', 'normal');
        safeTonight.keyTips.forEach((tip) => {
          const lines = pdf.splitTextToSize(`• ${tip}`, pageWidth - margin * 2);
          pdf.text(lines, margin, y);
          y += lines.length * 6;
        });
        y += 10;
      }

      pdf.addPage();
      y = margin;
      pdf.setFontSize(16); pdf.setFont('helvetica', 'bold');
      pdf.text('14-Day Sleep Improvement Roadmap', margin, y); y += 15;

      safeRoadmap.forEach((week) => {
        pdf.setFontSize(14); pdf.setFont('helvetica', 'bold');
        pdf.text(`${week.week ? `Week ${week.week}` : 'Week'}: ${week.focus}`, margin, y); y += 8;
        pdf.setFont('helvetica', 'normal'); pdf.setFontSize(12);
        (week.tasks || []).forEach((task) => {
          const lines = pdf.splitTextToSize(`• ${task}`, pageWidth - margin * 2);
          pdf.text(lines, margin + 10, y);
          y += lines.length * 6;
        });
        y += 10;
      });

      pdf.save(`sleep-plan-${formData.email || 'baby'}.pdf`);
      toast.success('PDF downloaded successfully!');
    } catch (e) {
      console.error('Error generating PDF:', e);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <>
      <SEO
        title={`Sleep Plan Results - ${formData.email || 'Your Baby'}`}
        description="Your personalized baby sleep plan with tonight's schedule, improvement roadmap, and expert recommendations."
        keywords="baby sleep plan results, personalized sleep schedule, sleep improvement plan"
      />

      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Button variant="outline" onClick={() => navigate('/sleep-planner')} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Assessment
              </Button>
              <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Your Sleep Plan Results
              </h1>
              <div className="w-20" />
            </div>
            <p className="text-lg text-muted-foreground">
              Sleep Readiness Index:{' '}
              <span className="font-bold text-primary">{safeScores.overall}/100</span>
            </p>
          </div>

          {/* Wrap each child in an error boundary to avoid blank screen */}
          <div className="space-y-8">
            <RenderErrorBoundary label="Results View">
              <ResultView
                babyName={formData.email || 'Your Baby'}
                ageMonths={formData.age_months ?? 0}
                ageWeeks={0}
                scores={safeScores}
                tonightPlan={safeTonight}
                roadmap={safeRoadmap}
                formData={formData}
              />
            </RenderErrorBoundary>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={generatePDF} disabled={isGeneratingPDF} className="flex items-center gap-2" size="lg">
                <Download className="h-5 w-5" />
                {isGeneratingPDF ? 'Generating PDF…' : 'Download Full Plan'}
              </Button>
            </div>

            <RenderErrorBoundary label="Share Card">
              <ShareCard
                score={safeScores.overall}
                babyName={formData.email || 'Your Baby'}
                ageMonths={formData.age_months ?? 0}
                ageWeeks={0}
                scores={
                  (scores as PillarScores) ||
                  ({ pressure: 0, settling: 0, nutrition: 0, environment: 0, consistency: 0 } as PillarScores)
                }
                tonightPlan={
                  tonightPlan || {
                    wakeTime: '',
                    napSchedule: [],
                    bedTimeWindow: { earliest: '', latest: '' },
                    routineSteps: [],
                    keyTips: [],
                  }
                }
                roadmap={roadmap || []}
                formData={formData}
              />
            </RenderErrorBoundary>
          </div>
        </div>
      </div>
    </>
  );
}
