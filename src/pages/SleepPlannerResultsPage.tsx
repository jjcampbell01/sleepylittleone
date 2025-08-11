import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScoreMeter } from '@/components/sleep-planner/ScoreMeter';
import { EnvChecklist } from '@/components/sleep-planner/EnvChecklist';
import { ShareCard } from '@/components/sleep-planner/ShareCard';
import { SEO } from '@/components/SEO';
import { 
  Download, 
  ArrowLeft, 
  Clock, 
  Moon, 
  Star, 
  Calendar,
  Target,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { toast } from 'sonner';

interface FormData {
  babyName: string;
  ageMonths: number;
  ageWeeks: number;
  currentChallenges: string[];
  parentExperience: string;
  wakeUpTime: string;
  bedTime: string;
  napCount: number;
  longestWakeWindow: number;
  napDuration: string;
  settlingMethod: string;
  sleepAssociations: string[];
  nightWakings: number;
  nightFeeds: number;
  lastFeedTime: string;
  feedingMethod: string;
  roomTemp: number;
  roomLight: string;
  noiseLevel: string;
  routine: string[];
  consistencyRating: number;
}

interface SleepScore {
  overall: number;
  sleepPressure: number;
  independentSettling: number;
  nightNutrition: number;
  environment: number;
  consistency: number;
}

interface TonightPlan {
  wakeUpTime: string;
  napTimes: string[];
  bedTime: string;
  routineSteps: string[];
  keyTips: string[];
}

export default function SleepPlannerResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    const data = location.state?.formData || localStorage.getItem('sleepPlannerData');
    if (data) {
      setFormData(typeof data === 'string' ? JSON.parse(data) : data);
    } else {
      navigate('/sleep-planner');
    }
  }, [location, navigate]);

  if (!formData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-4">Loading your sleep plan...</p>
          <Button onClick={() => navigate('/sleep-planner')}>
            Start New Assessment
          </Button>
        </div>
      </div>
    );
  }

  // Calculate Sleep Readiness Index
  const calculateSleepScore = (): SleepScore => {
    const ageInWeeks = formData.ageMonths * 4.33 + formData.ageWeeks;
    
    // Sleep Pressure Score (30%)
    let sleepPressureScore = 70;
    const optimalWakeWindows: { [key: string]: number } = {
      '0-3': 1.5, '4-6': 2, '7-9': 3, '10-12': 4, '13-18': 5, '19-24': 6
    };
    
    const ageGroup = ageInWeeks <= 12 ? '0-3' : 
                    ageInWeeks <= 24 ? '4-6' : 
                    ageInWeeks <= 36 ? '7-9' : 
                    ageInWeeks <= 48 ? '10-12' : 
                    ageInWeeks <= 72 ? '13-18' : '19-24';
    
    const optimal = optimalWakeWindows[ageGroup];
    const difference = Math.abs(formData.longestWakeWindow - optimal);
    sleepPressureScore = Math.max(30, 100 - (difference * 20));
    
    // Independent Settling Score (25%)
    let settlingScore = 50;
    switch (formData.settlingMethod) {
      case 'self-settling': settlingScore = 100; break;
      case 'minimal-help': settlingScore = 80; break;
      case 'moderate-help': settlingScore = 60; break;
      case 'full-help': settlingScore = 30; break;
    }
    settlingScore -= formData.nightWakings * 5;
    settlingScore = Math.max(20, settlingScore);
    
    // Night Nutrition Score (20%)
    let nutritionScore = 80;
    const expectedFeeds = ageInWeeks <= 12 ? 3 : ageInWeeks <= 24 ? 2 : ageInWeeks <= 52 ? 1 : 0;
    const feedDifference = Math.abs(formData.nightFeeds - expectedFeeds);
    nutritionScore = Math.max(30, 100 - (feedDifference * 20));
    
    // Environment Score (15%)
    let environmentScore = 70;
    if (formData.roomTemp >= 18 && formData.roomTemp <= 22) environmentScore += 10;
    if (formData.roomLight === 'blackout') environmentScore += 10;
    if (formData.noiseLevel === 'white-noise') environmentScore += 10;
    
    // Consistency Score (10%)
    const consistencyScore = formData.consistencyRating * 10;
    
    const overall = Math.round(
      (sleepPressureScore * 0.3) +
      (settlingScore * 0.25) +
      (nutritionScore * 0.2) +
      (environmentScore * 0.15) +
      (consistencyScore * 0.1)
    );
    
    return {
      overall,
      sleepPressure: Math.round(sleepPressureScore),
      independentSettling: Math.round(settlingScore),
      nightNutrition: Math.round(nutritionScore),
      environment: Math.round(environmentScore),
      consistency: Math.round(consistencyScore)
    };
  };

  const generateTonightPlan = (): TonightPlan => {
    const ageInWeeks = formData.ageMonths * 4.33 + formData.ageWeeks;
    const wakeTime = formData.wakeUpTime || '07:00';
    
    // Calculate optimal nap times based on age-appropriate wake windows
    const napTimes: string[] = [];
    let currentTime = new Date(`2024-01-01T${wakeTime}`);
    
    const wakeWindow = ageInWeeks <= 12 ? 1.5 : 
                      ageInWeeks <= 24 ? 2 : 
                      ageInWeeks <= 36 ? 2.5 : 
                      ageInWeeks <= 48 ? 3.5 : 4.5;
    
    for (let i = 0; i < formData.napCount; i++) {
      currentTime.setHours(currentTime.getHours() + wakeWindow);
      napTimes.push(currentTime.toTimeString().slice(0, 5));
      currentTime.setHours(currentTime.getHours() + 1); // 1 hour nap
    }
    
    // Calculate bedtime
    const lastNap = napTimes[napTimes.length - 1] || wakeTime;
    const bedtimeDate = new Date(`2024-01-01T${lastNap}`);
    bedtimeDate.setHours(bedtimeDate.getHours() + wakeWindow + 1);
    const bedTime = bedtimeDate.toTimeString().slice(0, 5);
    
    const routineSteps = [
      '30 min before bed: Start wind-down routine',
      '15 min before: Final feeding/snack',
      '10 min before: Dim all lights',
      '5 min before: Into sleep clothes',
      'Bedtime: Place in sleep space awake'
    ];
    
    const keyTips = [
      'Watch for sleepy cues 15-30 minutes before nap times',
      'Keep room temperature at 18-20°C',
      'Use consistent settling method for all sleep periods',
      'If baby cries, wait 3-5 minutes before responding'
    ];
    
    return {
      wakeUpTime: wakeTime,
      napTimes,
      bedTime,
      routineSteps,
      keyTips
    };
  };

  const generate14DayRoadmap = () => {
    const score = calculateSleepScore();
    const roadmap = [];
    
    // Week 1: Foundation
    roadmap.push({
      title: 'Days 1-3: Establish Routine',
      tasks: [
        'Implement consistent wake-up time',
        'Start age-appropriate wake windows',
        'Create calming bedtime routine'
      ]
    });
    
    roadmap.push({
      title: 'Days 4-7: Environmental Optimization',
      tasks: [
        'Optimize room temperature (18-20°C)',
        'Introduce blackout curtains',
        'Add white noise if needed'
      ]
    });
    
    // Week 2: Skill Building
    if (score.independentSettling < 70) {
      roadmap.push({
        title: 'Days 8-10: Gentle Sleep Training',
        tasks: [
          'Practice putting baby down awake',
          'Reduce sleep associations gradually',
          'Implement consistent response to night wakings'
        ]
      });
    }
    
    roadmap.push({
      title: 'Days 11-14: Consolidation',
      tasks: [
        'Fine-tune nap timing',
        'Adjust night feeding schedule',
        'Monitor and track progress'
      ]
    });
    
    return roadmap;
  };

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      // Lazy load jsPDF
      const { default: jsPDF } = await import('jspdf');
      
      const pdf = new jsPDF();
      const score = calculateSleepScore();
      const tonightPlan = generateTonightPlan();
      const roadmap = generate14DayRoadmap();
      
      // Header
      pdf.setFontSize(20);
      pdf.text(`${formData.babyName || 'Your Baby'}'s Sleep Plan`, 20, 30);
      
      // Sleep Readiness Index
      pdf.setFontSize(16);
      pdf.text('Sleep Readiness Index', 20, 50);
      pdf.setFontSize(12);
      pdf.text(`Overall Score: ${score.overall}/100`, 20, 65);
      
      // Tonight's Plan
      pdf.setFontSize(16);
      pdf.text("Tonight's Plan", 20, 90);
      pdf.setFontSize(12);
      let yPos = 105;
      pdf.text(`Wake-up: ${tonightPlan.wakeUpTime}`, 20, yPos);
      yPos += 15;
      pdf.text(`Bedtime: ${tonightPlan.bedTime}`, 20, yPos);
      yPos += 15;
      
      tonightPlan.napTimes.forEach((nap, i) => {
        pdf.text(`Nap ${i + 1}: ${nap}`, 20, yPos);
        yPos += 10;
      });
      
      // 14-Day Roadmap
      yPos += 20;
      pdf.setFontSize(16);
      pdf.text('14-Day Roadmap', 20, yPos);
      yPos += 15;
      
      roadmap.forEach(week => {
        pdf.setFontSize(14);
        pdf.text(week.title, 20, yPos);
        yPos += 10;
        pdf.setFontSize(10);
        week.tasks.forEach(task => {
          pdf.text(`• ${task}`, 25, yPos);
          yPos += 8;
        });
        yPos += 5;
      });
      
      pdf.save(`${formData.babyName || 'baby'}-sleep-plan.pdf`);
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      toast.error('Failed to generate PDF');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const score = calculateSleepScore();
  const tonightPlan = generateTonightPlan();
  const roadmap = generate14DayRoadmap();

  return (
    <>
      <SEO 
        title={`Sleep Plan for ${formData.babyName || 'Your Baby'} - Personalized Results`}
        description="Your personalized baby sleep plan with Sleep Readiness Index, tonight's schedule, and 14-day improvement roadmap."
        keywords="baby sleep plan results, sleep schedule, sleep training plan"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Button
              variant="outline"
              onClick={() => navigate('/sleep-planner')}
              className="mb-4 flex items-center gap-2 mx-auto"
            >
              <ArrowLeft className="h-4 w-4" />
              Start New Assessment
            </Button>
            
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
              {formData.babyName ? `${formData.babyName}'s` : 'Your Baby\'s'} Sleep Plan
            </h1>
            <p className="text-lg text-muted-foreground">
              Age: {formData.ageMonths} months {formData.ageWeeks ? `${formData.ageWeeks} weeks` : ''}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Sleep Readiness Index */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-primary" />
                    Sleep Readiness Index
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScoreMeter score={score.overall} />
                  
                  <div className="space-y-3 mt-6">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Sleep Pressure</span>
                      <Badge variant={score.sleepPressure >= 70 ? 'default' : 'secondary'}>
                        {score.sleepPressure}%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Independent Settling</span>
                      <Badge variant={score.independentSettling >= 70 ? 'default' : 'secondary'}>
                        {score.independentSettling}%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Night Nutrition</span>
                      <Badge variant={score.nightNutrition >= 70 ? 'default' : 'secondary'}>
                        {score.nightNutrition}%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Environment</span>
                      <Badge variant={score.environment >= 70 ? 'default' : 'secondary'}>
                        {score.environment}%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Consistency</span>
                      <Badge variant={score.consistency >= 70 ? 'default' : 'secondary'}>
                        {score.consistency}%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <EnvChecklist formData={formData} />
            </div>

            {/* Middle Column - Tonight's Plan */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Tonight's Plan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-secondary/50 rounded-lg">
                      <h4 className="font-semibold mb-2">Sleep Schedule</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Wake-up:</span>
                          <span className="font-medium">{tonightPlan.wakeUpTime}</span>
                        </div>
                        {tonightPlan.napTimes.map((nap, i) => (
                          <div key={i} className="flex justify-between">
                            <span>Nap {i + 1}:</span>
                            <span className="font-medium">{nap}</span>
                          </div>
                        ))}
                        <div className="flex justify-between">
                          <span>Bedtime:</span>
                          <span className="font-medium">{tonightPlan.bedTime}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Bedtime Routine</h4>
                      <div className="space-y-2">
                        {tonightPlan.routineSteps.map((step, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Key Tips</h4>
                      <div className="space-y-2">
                        {tonightPlan.keyTips.map((tip, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm">
                            <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            <span>{tip}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - 14-Day Roadmap */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    14-Day Roadmap
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {roadmap.map((week, i) => (
                      <div key={i} className="border-l-2 border-primary pl-4">
                        <h4 className="font-semibold text-sm mb-2">{week.title}</h4>
                        <div className="space-y-1">
                          {week.tasks.map((task, j) => (
                            <div key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <Target className="h-3 w-3 mt-1 flex-shrink-0" />
                              <span>{task}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="space-y-4 mt-6">
                <Button
                  onClick={generatePDF}
                  disabled={isGeneratingPDF}
                  className="w-full flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  {isGeneratingPDF ? 'Generating PDF...' : 'Download Full Plan'}
                </Button>

                <ShareCard 
                  score={score.overall}
                  babyName={formData.babyName}
                />
              </div>
            </div>
          </div>

          {/* Sleep Challenges Addressed */}
          {formData.currentChallenges.length > 0 && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  Addressing Your Challenges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {formData.currentChallenges.map((challenge, i) => (
                    <div key={i} className="p-4 bg-secondary/30 rounded-lg">
                      <h4 className="font-semibold mb-2">{challenge}</h4>
                      <p className="text-sm text-muted-foreground">
                        {challenge === 'Frequent night wakings' && 
                          'Focus on independent settling skills and reducing night feeds gradually.'}
                        {challenge === 'Difficulty falling asleep' && 
                          'Optimize wake windows and create stronger sleep pressure.'}
                        {challenge === 'Short naps' && 
                          'Ensure appropriate wake windows and create optimal sleep environment.'}
                        {challenge === 'Early morning wake-ups' && 
                          'Adjust bedtime and last nap timing. Use blackout curtains.'}
                        {challenge === 'Bedtime resistance' && 
                          'Implement consistent routine and check wake windows aren\'t too long.'}
                        {challenge === 'Sleep associations' && 
                          'Gradually reduce dependence on external sleep aids.'}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}