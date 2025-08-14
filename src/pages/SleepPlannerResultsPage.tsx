import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SEO } from '@/components/SEO';
import { ResultView } from '@/components/sleep-planner/ResultView';
import { ShareCard } from '@/components/sleep-planner/ShareCard';
import { Download, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import { SleepPlannerFormData } from '@/api/validate';
import {
  scorePillars,
  computeIndex,
  buildTonightPlan,
  buildGentleSettlingPlan,
  buildRoadmap,
  PillarScores,
  TonightPlan,
  GentleSettlingPlan,
  RoadmapWeek
} from '@/lib/sleep-planner/rules';

const STORAGE_KEY = 'sleepPlannerV2Data';

export default function SleepPlannerResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<SleepPlannerFormData | null>(null);
  const [scores, setScores] = useState<PillarScores | null>(null);
  const [sleepReadinessIndex, setSleepReadinessIndex] = useState<number>(0);
  const [tonightPlan, setTonightPlan] = useState<TonightPlan | null>(null);
  const [gentleSettlingPlan, setGentleSettlingPlan] = useState<GentleSettlingPlan | null>(null);
  const [roadmap, setRoadmap] = useState<RoadmapWeek[]>([]);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Get form data from navigation state or localStorage
  useEffect(() => {
    const stateData = (location.state as any)?.formData;
    if (stateData) {
      setFormData(stateData);
      return;
    }
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      navigate('/sleep-planner');
      return;
    }
    try {
      const savedData = JSON.parse(saved);
      if (savedData.formData) setFormData(savedData.formData);
      else navigate('/sleep-planner');
    } catch {
      navigate('/sleep-planner');
    }
  }, [location.state, navigate]);

  // Calculate everything once we have form data
  useEffect(() => {
    if (!formData) return;
    try {
      const calculatedScores = scorePillars(formData);
      const index = computeIndex(calculatedScores, formData.age_months);
      const tonight = buildTonightPlan(formData);
      const settling = buildGentleSettlingPlan(formData);
      const weeklyRoadmap = buildRoadmap(formData, calculatedScores);

      setScores(calculatedScores);
      setSleepReadinessIndex(index);
      setTonightPlan(tonight);
      setGentleSettlingPlan(settling);
      setRoadmap(weeklyRoadmap);
    } catch (err) {
      console.error('Error calculating sleep plan:', err);
      toast.error('Error generating sleep plan. Please try again.');
    }
  }, [formData]);

  if (!formData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your sleep plan...</p>
        </div>
      </div>
    );
  }

  const generatePDF = async () => {
    if (!formData || !scores || !tonightPlan) return;

    setIsGeneratingPDF(true);
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.width;
      const margin = 20;
      let y = margin;

      // Title
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Sleep Plan for ${formData.email || 'Your Baby'}`, margin, y);
      y += 15;

      // Index
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Sleep Readiness Index: ${sleepReadinessIndex}/100`, margin, y);
      y += 10;

      // Pillars
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Sleep Pillar Scores:', margin, y);
      y += 8;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(12);
      pdf.text(`Sleep Pressure: ${scores.pressure}/100`, margin, y); y += 6;
      pdf.text(`Settling: ${scores.settling}/100`, margin, y); y += 6;
      pdf.text(`Nutrition: ${scores.nutrition}/100`, margin, y); y += 6;
      pdf.text(`Environment: ${scores.environment}/100`, margin, y); y += 6;
      pdf.text(`Consistency: ${scores.consistency}/100`, margin, y); y += 15;

      // Tonight
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text("Tonight's Plan:", margin, y);
      y += 8;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(12);
      pdf.text(`Wake Time: ${tonightPlan.wakeTime}`, margin, y); y += 6;

      if (tonightPlan.napSchedule?.length) {
        pdf.text('Nap Schedule:', margin, y); y += 6;
        tonightPlan.napSchedule.forEach((nap, i) => {
          pdf.text(`  Nap ${i + 1}: ${nap.startTime} - ${nap.endTime}`, margin + 10, y);
          y += 6;
        });
      }

      pdf.text(
        `Bedtime Window: ${tonightPlan.bedTimeWindow.earliest} - ${tonightPlan.bedTimeWindow.latest}`,
        margin,
        y
      );
      y += 10;

      if (tonightPlan.keyTips?.length) {
        pdf.setFont('helvetica', 'bold');
        pdf.text('Key Tips for Tonight:', margin, y);
        y += 8;

        pdf.setFont('helvetica', 'normal');
        tonightPlan.keyTips.forEach(tip => {
          const lines = pdf.splitTextToSize(`• ${tip}`, pageWidth - margin * 2);
          pdf.text(lines, margin, y);
          y += lines.length * 6;
        });
        y += 10;
      }

      // Roadmap
      pdf.addPage(); y = margin;
      pdf.setFontSize(16); pdf.setFont('helvetica', 'bold');
      pdf.text('14-Day Sleep Improvement Roadmap', margin, y); y += 15;

      roadmap.forEach(week => {
        pdf.setFontSize(14); pdf.setFont('helvetica', 'bold');
        pdf.text(`${week.title}: ${week.focus}`, margin, y); y += 8;
        pdf.setFont('helvetica', 'normal'); pdf.setFontSize(12);
        (week.tasks || []).forEach(task => {
          const lines = pdf.splitTextToSize(`• ${task}`, pageWidth - margin * 2);
          pdf.text(lines, margin + 10, y); y += lines.length * 6;
        });
        y += 10;
      });

      pdf.save(`sleep-plan-${formData.email || 'baby'}.pdf`);
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (!scores || !tonightPlan || !gentleSettlingPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Calculating your personalized sleep plan...</p>
        </div>
      </div>
    );
  }

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
              <Button
                variant="outline"
                onClick={() => navigate('/sleep-planner')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Assessment
              </Button>
              <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Your Sleep Plan Results
              </h1>
              <div className="w-20" /> {/* spacer */}
            </div>
            <p className="text-lg text-muted-foreground">
              Sleep Readiness Index: <span className="font-bold text-primary">{sleepReadinessIndex}/100</span>
            </p>
          </div>

          {/* Results */}
          <ResultView
            babyName={formData?.email || 'Your Baby'}
            ageMonths={formData?.age_months || 0}
            ageWeeks={0}
            scores={{
              overall: sleepReadinessIndex ?? 0,
              sleepPressure: scores?.pressure ?? 0,
              settling: scores?.settling ?? 0,
              nutrition: scores?.nutrition ?? 0,
              environment: scores?.environment ?? 0,
              consistency: scores?.consistency ?? 0
            }}
            tonightPlan={{
              wakeUpTime: tonightPlan?.wakeTime || '',
              napTimes: tonightPlan?.napSchedule?.map(nap => nap.startTime) || [],
              bedtime: tonightPlan?.bedTimeWindow?.earliest || '',
              routineSteps: tonightPlan?.routineSteps || [],
              keyTips: tonightPlan?.keyTips || []
            }}
            roadmap={roadmap?.map((week, index) => ({
              week: index + 1,
              focus: week?.focus || '',
              tasks: week?.tasks || []
            })) || []}
            formData={formData as any}
          />

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button
              onClick={generatePDF}
              disabled={isGeneratingPDF}
              className="flex items-center gap-2"
              size="lg"
            >
              <Download className="h-5 w-5" />
              {isGeneratingPDF ? 'Generating PDF...' : 'Download Full Plan'}
            </Button>
          </div>

          {/* Share Card */}
          <div className="mt-8">
            <ShareCard
              score={sleepReadinessIndex ?? 0}
              babyName={formData?.email || 'Your Baby'}
              ageMonths={formData?.age_months || 0}
              ageWeeks={0}
              scores={
                scores || { pressure: 0, settling: 0, nutrition: 0, environment: 0, consistency: 0 }
              }
              tonightPlan={
                tonightPlan || {
                  wakeTime: '',
                  bedTimeWindow: { earliest: '', latest: '' },
                  napSchedule: [],
                  routineSteps: [],
                  keyTips: []
                } as any
              }
              roadmap={roadmap || []}
              formData={formData}
            />
          </div>
        </div>
      </div>
    </>
  );
}
