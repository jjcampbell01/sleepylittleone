import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ProgressStepper } from '@/components/sleep-planner/ProgressStepper';
import { SEO } from '@/components/SEO';
import { ArrowLeft, ArrowRight, Save, Baby, Clock, Moon, Utensils, Home } from 'lucide-react';
import { toast } from 'sonner';

interface FormData {
  // Section 1: Age & Context
  babyName: string;
  ageMonths: number;
  ageWeeks: number;
  currentChallenges: string[];
  parentExperience: string;
  
  // Section 2: Sleep Pressure
  wakeUpTime: string;
  bedTime: string;
  napCount: number;
  longestWakeWindow: number;
  napDuration: string;
  
  // Section 3: Independent Settling
  settlingMethod: string;
  sleepAssociations: string[];
  nightWakings: number;
  
  // Section 4: Night Nutrition
  nightFeeds: number;
  lastFeedTime: string;
  feedingMethod: string;
  
  // Section 5: Environment & Consistency
  roomTemp: number;
  roomLight: string;
  noiseLevel: string;
  routine: string[];
  consistencyRating: number;
}

const STORAGE_KEY = 'sleepPlannerData';

export default function SleepPlannerPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    babyName: '',
    ageMonths: 0,
    ageWeeks: 0,
    currentChallenges: [],
    parentExperience: '',
    wakeUpTime: '',
    bedTime: '',
    napCount: 0,
    longestWakeWindow: 0,
    napDuration: '',
    settlingMethod: '',
    sleepAssociations: [],
    nightWakings: 0,
    nightFeeds: 0,
    lastFeedTime: '',
    feedingMethod: '',
    roomTemp: 20,
    roomLight: '',
    noiseLevel: '',
    routine: [],
    consistencyRating: 5,
  });

  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load saved data');
      }
    }
  }, []);

  // Auto-save data
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    }, 1000);
    return () => clearTimeout(timer);
  }, [formData]);

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: keyof FormData, item: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).includes(item)
        ? (prev[field] as string[]).filter(i => i !== item)
        : [...(prev[field] as string[]), item]
    }));
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Navigate to results
      navigate('/sleep-planner/results', { state: { formData } });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const saveProgress = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    toast.success('Progress saved!');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <Baby className="h-8 w-8 text-primary" />
              <h2 className="text-2xl font-bold">Tell us about your baby</h2>
            </div>
            
            <div className="grid gap-4">
              <div>
                <Label htmlFor="babyName">Baby's name (optional)</Label>
                <Input
                  id="babyName"
                  value={formData.babyName}
                  onChange={(e) => updateFormData('babyName', e.target.value)}
                  placeholder="Your little one's name"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ageMonths">Age (months)</Label>
                  <Select value={formData.ageMonths.toString()} onValueChange={(v) => updateFormData('ageMonths', parseInt(v))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select months" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 25 }, (_, i) => (
                        <SelectItem key={i} value={i.toString()}>{i} months</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="ageWeeks">Additional weeks</Label>
                  <Select value={formData.ageWeeks.toString()} onValueChange={(v) => updateFormData('ageWeeks', parseInt(v))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select weeks" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 4 }, (_, i) => (
                        <SelectItem key={i} value={i.toString()}>{i} weeks</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label>Current sleep challenges (select all that apply)</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {[
                    'Frequent night wakings',
                    'Difficulty falling asleep',
                    'Short naps',
                    'Early morning wake-ups',
                    'Bedtime resistance',
                    'Sleep associations'
                  ].map(challenge => (
                    <div key={challenge} className="flex items-center space-x-2">
                      <Checkbox
                        id={challenge}
                        checked={formData.currentChallenges.includes(challenge)}
                        onCheckedChange={() => toggleArrayItem('currentChallenges', challenge)}
                      />
                      <Label htmlFor={challenge} className="text-sm">{challenge}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <Label>Your parenting experience</Label>
                <RadioGroup value={formData.parentExperience} onValueChange={(v) => updateFormData('parentExperience', v)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="first-time" id="first-time" />
                    <Label htmlFor="first-time">First-time parent</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="experienced" id="experienced" />
                    <Label htmlFor="experienced">Experienced parent</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="professional" id="professional" />
                    <Label htmlFor="professional">Childcare professional</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="h-8 w-8 text-primary" />
              <h2 className="text-2xl font-bold">Sleep pressure & timing</h2>
            </div>
            
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="wakeUpTime">Typical wake-up time</Label>
                  <Input
                    id="wakeUpTime"
                    type="time"
                    value={formData.wakeUpTime}
                    onChange={(e) => updateFormData('wakeUpTime', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="bedTime">Typical bedtime</Label>
                  <Input
                    id="bedTime"
                    type="time"
                    value={formData.bedTime}
                    onChange={(e) => updateFormData('bedTime', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="napCount">Number of naps per day</Label>
                <Select value={formData.napCount.toString()} onValueChange={(v) => updateFormData('napCount', parseInt(v))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select nap count" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 6 }, (_, i) => (
                      <SelectItem key={i} value={i.toString()}>{i} naps</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="longestWakeWindow">Longest wake window (hours)</Label>
                <Select value={formData.longestWakeWindow.toString()} onValueChange={(v) => updateFormData('longestWakeWindow', parseFloat(v))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select wake window" />
                  </SelectTrigger>
                  <SelectContent>
                    {[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6].map(hours => (
                      <SelectItem key={hours} value={hours.toString()}>{hours} hours</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Average nap duration</Label>
                <RadioGroup value={formData.napDuration} onValueChange={(v) => updateFormData('napDuration', v)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="short" id="short" />
                    <Label htmlFor="short">Short (15-45 minutes)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium">Medium (45-90 minutes)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="long" id="long" />
                    <Label htmlFor="long">Long (90+ minutes)</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <Moon className="h-8 w-8 text-primary" />
              <h2 className="text-2xl font-bold">Independent settling</h2>
            </div>
            
            <div className="grid gap-4">
              <div>
                <Label>Current settling method</Label>
                <RadioGroup value={formData.settlingMethod} onValueChange={(v) => updateFormData('settlingMethod', v)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="self-settling" id="self-settling" />
                    <Label htmlFor="self-settling">Self-settling (no help needed)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="minimal-help" id="minimal-help" />
                    <Label htmlFor="minimal-help">Minimal help (patting, shushing)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="moderate-help" id="moderate-help" />
                    <Label htmlFor="moderate-help">Moderate help (rocking, feeding)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="full-help" id="full-help" />
                    <Label htmlFor="full-help">Full help (co-sleeping, constant presence)</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <Label>Sleep associations (select all that apply)</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {[
                    'Feeding to sleep',
                    'Rocking to sleep',
                    'Pacifier/dummy',
                    'White noise',
                    'Music/lullabies',
                    'Comfort object'
                  ].map(association => (
                    <div key={association} className="flex items-center space-x-2">
                      <Checkbox
                        id={association}
                        checked={formData.sleepAssociations.includes(association)}
                        onCheckedChange={() => toggleArrayItem('sleepAssociations', association)}
                      />
                      <Label htmlFor={association} className="text-sm">{association}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="nightWakings">Average night wakings</Label>
                <Select value={formData.nightWakings.toString()} onValueChange={(v) => updateFormData('nightWakings', parseInt(v))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select night wakings" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 11 }, (_, i) => (
                      <SelectItem key={i} value={i.toString()}>{i} times</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <Utensils className="h-8 w-8 text-primary" />
              <h2 className="text-2xl font-bold">Night nutrition</h2>
            </div>
            
            <div className="grid gap-4">
              <div>
                <Label htmlFor="nightFeeds">Number of night feeds</Label>
                <Select value={formData.nightFeeds.toString()} onValueChange={(v) => updateFormData('nightFeeds', parseInt(v))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select night feeds" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 8 }, (_, i) => (
                      <SelectItem key={i} value={i.toString()}>{i} feeds</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="lastFeedTime">Last feed before bedtime</Label>
                <Input
                  id="lastFeedTime"
                  type="time"
                  value={formData.lastFeedTime}
                  onChange={(e) => updateFormData('lastFeedTime', e.target.value)}
                />
              </div>
              
              <div>
                <Label>Feeding method</Label>
                <RadioGroup value={formData.feedingMethod} onValueChange={(v) => updateFormData('feedingMethod', v)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="breastfeeding" id="breastfeeding" />
                    <Label htmlFor="breastfeeding">Breastfeeding</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bottle" id="bottle" />
                    <Label htmlFor="bottle">Bottle feeding</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="combination" id="combination" />
                    <Label htmlFor="combination">Combination feeding</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <Home className="h-8 w-8 text-primary" />
              <h2 className="text-2xl font-bold">Environment & consistency</h2>
            </div>
            
            <div className="grid gap-4">
              <div>
                <Label htmlFor="roomTemp">Room temperature (°C)</Label>
                <Input
                  id="roomTemp"
                  type="number"
                  min="16"
                  max="25"
                  value={formData.roomTemp}
                  onChange={(e) => updateFormData('roomTemp', parseInt(e.target.value))}
                />
              </div>
              
              <div>
                <Label>Room lighting during sleep</Label>
                <RadioGroup value={formData.roomLight} onValueChange={(v) => updateFormData('roomLight', v)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="blackout" id="blackout" />
                    <Label htmlFor="blackout">Blackout dark</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dim" id="dim" />
                    <Label htmlFor="dim">Dim lighting</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="some-light" id="some-light" />
                    <Label htmlFor="some-light">Some light</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <Label>Noise level</Label>
                <RadioGroup value={formData.noiseLevel} onValueChange={(v) => updateFormData('noiseLevel', v)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="silent" id="silent" />
                    <Label htmlFor="silent">Complete silence</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="white-noise" id="white-noise" />
                    <Label htmlFor="white-noise">White noise/fan</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="household" id="household" />
                    <Label htmlFor="household">Normal household noise</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <Label>Bedtime routine elements (select all that apply)</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {[
                    'Bath time',
                    'Story reading',
                    'Feeding',
                    'Massage',
                    'Singing/lullabies',
                    'Dimming lights'
                  ].map(routine => (
                    <div key={routine} className="flex items-center space-x-2">
                      <Checkbox
                        id={routine}
                        checked={formData.routine.includes(routine)}
                        onCheckedChange={() => toggleArrayItem('routine', routine)}
                      />
                      <Label htmlFor={routine} className="text-sm">{routine}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="consistencyRating">Routine consistency (1-10)</Label>
                <Input
                  id="consistencyRating"
                  type="range"
                  min="1"
                  max="10"
                  value={formData.consistencyRating}
                  onChange={(e) => updateFormData('consistencyRating', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-center text-sm text-muted-foreground mt-1">
                  {formData.consistencyRating}/10
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <SEO 
        title="Baby Sleep Planner - Get Your Personalized Sleep Plan"
        description="Create a personalized, science-backed sleep plan for your baby. Free assessment covering age, sleep pressure, settling methods, nutrition, and environment."
        keywords="baby sleep planner, personalized sleep plan, sleep assessment, baby sleep help"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
              Baby Sleep Planner
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get a personalized, science-backed sleep plan tailored to your baby's unique needs
            </p>
          </div>

          <ProgressStepper currentStep={currentStep} totalSteps={5} />

          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Step {currentStep} of 5</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={saveProgress}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Progress
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderStep()}
              
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={handlePrev}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                <Button
                  onClick={handleNext}
                  className="flex items-center gap-2"
                >
                  {currentStep === 5 ? 'Get My Plan' : 'Next'}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}