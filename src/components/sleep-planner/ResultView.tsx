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

export function ResultView({ 
  babyName, 
  ageMonths, 
  ageWeeks, 
  scores, 
  tonightPlan, 
  roadmap, 
  formData,
  isPublic = false 
}: ResultViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">
            {babyName ? `${babyName}'s` : 'Baby'} Sleep Plan
          </h1>
          <p className="text-lg text-muted-foreground">
            Personalized for {ageMonths} months {ageWeeks && `(${ageWeeks} weeks)`}
          </p>
          {isPublic && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                📚 Educational content only - not medical advice. Created with evidence-based sleep science.
              </p>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sleep Readiness Index */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Moon className="h-5 w-5" />
                Sleep Readiness Index
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <ScoreMeter score={scores.overall} size="lg" />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Sleep Pressure</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-secondary rounded-full h-2">
                      <div 
                        className="h-2 bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${scores.sleepPressure}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{scores.sleepPressure}/100</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Settling Ability</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-secondary rounded-full h-2">
                      <div 
                        className="h-2 bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${scores.settling}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{scores.settling}/100</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Nutrition</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-secondary rounded-full h-2">
                      <div 
                        className="h-2 bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${scores.nutrition}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{scores.nutrition}/100</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Environment</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-secondary rounded-full h-2">
                      <div 
                        className="h-2 bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${scores.environment}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{scores.environment}/100</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Consistency</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-secondary rounded-full h-2">
                      <div 
                        className="h-2 bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${scores.consistency}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{scores.consistency}/100</span>
                  </div>
                </div>
              </div>
              
              <EnvChecklist formData={formData} />
            </CardContent>
          </Card>

          {/* Tonight's Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Tonight's Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                  <span className="font-medium">Wake Up</span>
                  <Badge variant="outline">{tonightPlan.wakeUpTime}</Badge>
                </div>
                
                {tonightPlan.napTimes.map((napTime, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                    <span className="font-medium">Nap {index + 1}</span>
                    <Badge variant="outline">{napTime}</Badge>
                  </div>
                ))}
                
                <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <span className="font-medium">Bedtime</span>
                  <Badge className="bg-primary">{tonightPlan.bedtime}</Badge>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Sun className="h-4 w-4" />
                  Bedtime Routine
                </h4>
                <ul className="space-y-2">
                  {tonightPlan.routineSteps.map((step, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="flex-shrink-0 w-5 h-5 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </span>
                      {step}
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
                  {tonightPlan.keyTips.map((tip, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {tip}
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
                {roadmap.map((week) => (
                  <div key={week.week} className="border rounded-lg p-4">
                    <h4 className="font-semibold text-primary mb-2">
                      Week {week.week}: {week.focus}
                    </h4>
                    <ul className="space-y-1">
                      {week.tasks.map((task, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <span className="text-primary">•</span>
                          {task}
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
              This plan is based on evidence-based sleep science and considers your baby's unique age, development, and current sleep patterns. 
              Remember that all babies are different, and consistency is key to success.
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