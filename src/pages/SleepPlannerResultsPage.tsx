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

  // Compute everything when formData arrives
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

  // Loading / fatal error states
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

  // PDF generation
  const generatePDF = async () => {
    if (!formData || !scores || !tonightPlan) return;
    setIsGeneratingPDF(true);
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.width;
      const margin = 20;
      let y = margin;

      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      const babyName = formData.email || 'Your Baby';
      pdf.text(`Sleep Plan for ${babyName}`, margin, y); y += 15;

      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Sleep Readiness Index: ${sleepReadinessIndex}/100`, margin, y); y += 10;

      pdf.setFontSize(14); pdf.setFont('helvetica', 'bold');
      pdf.text('Sleep Pillar Scores:', margin, y); y += 8;
      pdf.setFont('helvetica', 'normal'); pdf.setFontSize(12);
      pdf.text(`Sleep Pressure: ${scores.pressure}/100`, margin, y); y += 6;
      pdf.text(`Settling: ${scores.settling}/100`, margin, y); y += 6;
      pdf.text(`Nutrition: ${scores.nutrition}/100`, margin, y); y += 6;
      pdf.text(`Environment: ${scores.environment}/100`, margin, y); y += 6;
      pdf.text(`Consistency: ${scores.consistency}/100`, margin, y); y += 15;

      pdf.setFontSize(14); pdf.setFont('helvetica', 'bold');
      pdf.text("Tonight's Plan:", margin, y); y += 8;
      pdf.setFont('helvetica', 'normal'); pdf.setFontSize(12);
      pdf.text(`Wake Time: ${tonightPlan.wakeTime || ''}`, margin, y); y += 6;

      if (Array.isArray(tonightPlan.napSchedule) && tonightPlan.napSchedule.length > 0) {
        pdf.text('Nap Schedule:', margin, y); y += 6;
        tonightPlan.napSchedule.forEach((nap, i) => {
          pdf.text(`  Nap ${i + 1}: ${nap.startTime} - ${nap.endTime}`, margin + 10, y);
          y += 6;
        });
      }

      pdf.text(
        `Bedtime Window: ${(tonightPlan.bedTimeWindow?.earliest) || ''} - ${(tonightPlan.bedTimeWindow?.latest) || ''}`,
        margin, y
      ); y += 10;

      if (Array.isArray(tonightPlan.keyTips) && tonightPlan.keyTips.length > 0) {
        pdf.setFont('helvetica', 'bold');
        pdf.text('Key Tips for Tonight:', margin, y); y += 8;
        pdf.setFont('helvetica', 'normal');
        tonightPlan.keyTips.forEach((tip) => {
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

      (roadmap || []).forEach((week) => {
        pdf.setFontSize(14); pdf.setFont('helvetica', 'bold');
        pdf.text(`${week?.title || 'Week'}: ${week?.focus || ''}`, margin, y); y += 8;
        pdf.setFont('helvetica', 'normal'); pdf.setFontSize(12);
        (week?.tasks || []).forEach((task) => {
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
              <span className="font-bold text-primary">{sleepReadinessIndex ?? 0}/100</span>
            </p>
          </div>

          {/* Results */}
          <ResultView
            babyName={formData.email || 'Your Baby'}
            ageMonths={formData.age_months ?? 0}
            ageWeeks={0}
            scores={{
              overall: sleepReadinessIndex ?? 0,
              sleepPressure: scores?.pressure ?? 0,
              settling: scores?.settling ?? 0,
              nutrition: scores?.nutrition ?? 0,
              environment: scores?.environment ?? 0,
              consistency: scores?.consistency ?? 0,
            }}
            tonightPlan={{
              wakeUpTime: tonightPlan?.wakeTime || '',
              napTimes: tonightPlan?.napSchedule?.map(n => n.startTime) || [],
              bedtime: tonightPlan?.bedTimeWindow?.earliest || '',
              routineSteps: tonightPlan?.routineSteps || [],
              keyTips: tonightPlan?.keyTips || [],
            }}
            roadmap={(roadmap || []).map((week, i) => ({
              week: i + 1,
              focus: week?.focus || '',
              tasks: week?.tasks || [],
            }))}
            formData={formData}
          />

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button onClick={generatePDF} disabled={isGeneratingPDF} className="flex items-center gap-2" size="lg">
              <Download className="h-5 w-5" />
              {isGeneratingPDF ? 'Generating PDF…' : 'Download Full Plan'}
            </Button>
          </div>

          {/* Share Card */}
          <div className="mt-8">
            <ShareCard
              score={sleepReadinessIndex ?? 0}
              babyName={formData.email || 'Your Baby'}
              ageMonths={formData.age_months ?? 0}
              ageWeeks={0}
              scores={scores || { pressure: 0, settling: 0, nutrition: 0, environment: 0, consistency: 0 } as PillarScores}
              tonightPlan={tonightPlan || {
                wakeTime: '',
                napSchedule: [],
                bedTimeWindow: { earliest: '', latest: '' },
                routineSteps: [],
                keyTips: [],
              }}
              roadmap={roadmap || []}
              formData={formData}
            />
          </div>
        </div>
      </div>
    </>
  );
}
