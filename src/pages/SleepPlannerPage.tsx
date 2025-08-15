import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ProgressStepper } from '@/components/sleep-planner/ProgressStepper';
import { SleepScienceInsight } from '@/components/sleep-planner/SleepScienceInsight';
import { SEO } from '@/components/SEO';
import { ArrowLeft, ArrowRight, Save, Clock, Moon, Utensils, Home, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { SleepPlannerFormData, validateSleepPlannerData } from '@/api/validate';
import { celsiusToFahrenheit, fahrenheitToCelsius } from '@/lib/time';
import { disclaimers } from '@/data/sleep-planner/insights';
import questions from '@/data/sleep-planner/questions.json';

const STORAGE_KEY = 'sleepPlannerV2Data';

interface Question {
  id: string;
  section: string;
  type: string;
  label: string;
  required?: boolean;
  options?: Array<{ value: any; label: string }> | string[];
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  insight?: string;
  ageNote?: string;
  visibleIf?: Record<string, any | any[]>;
}

const sections = [
  { id: 'intro', title: 'Getting Started', icon: Shield, description: 'Let\'s start with the basics about your baby and your consent for this assessment.' },
  { id: 'pressure', title: 'Sleep Pressure & Timing', icon: Clock, description: 'Understanding your baby\'s current sleep schedule and wake windows.' },
  { id: 'settling', title: 'Settling & Night Wakings', icon: Moon, description: 'How your baby falls asleep and stays asleep through the night.' },
  { id: 'nutrition', title: 'Night Nutrition', icon: Utensils, description: 'Night feeding patterns and timing.' },
  { id: 'environment', title: 'Sleep Environment & Routine', icon: Home, description: 'The physical sleep space and bedtime consistency.' },
  { id: 'routine', title: 'Bedtime Routine', icon: Home, description: 'Your bedtime routine and wake time consistency.' },
  { id: 'other', title: 'Final Considerations', icon: Shield, description: 'Health factors and parent preferences.' }
];

// helpers
const getQuestionById = (id: string) => (questions as Question[]).find(q => q.id === id);
const getSectionIndexById = (id: string) => sections.findIndex(s => s.id === id);

export default function SleepPlannerPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<SleepPlannerFormData>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tempUnit, setTempUnit] = useState<'F' | 'C'>('F');
  const [focusField, setFocusField] = useState<string | null>(null);

  // Load saved
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const savedData = JSON.parse(saved);
        setFormData(savedData.formData || {});
        setCurrentStep(savedData.currentStep || 0);
      } catch {
        console.error('Failed to load saved data');
      }
    }
  }, []);

  // Auto-save
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ formData, currentStep }));
    }, 1000);
    return () => clearTimeout(timer);
  }, [formData, currentStep]);

  // Default required booleans on step
  useEffect(() => {
    const sectionId = sections[currentStep].id;
    const sectionQuestions = (questions as Question[]).filter(q => q.section === sectionId);

    setFormData(prev => {
      const next = { ...prev };
      let changed = false;
      for (const q of sectionQuestions) {
        if (q.type === 'boolean' && q.required && typeof (next as any)[q.id] === 'undefined') {
          (next as any)[q.id] = false;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [currentStep]);

  // Scroll to field when asked
  useEffect(() => {
    if (!focusField) return;
    const el = document.querySelector<HTMLElement>(`[data-field="${focusField}"]`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('ring-2', 'ring-primary/50', 'rounded-md');
      setTimeout(() => el.classList.remove('ring-2', 'ring-primary/50', 'rounded-md'), 1500);
    }
  }, [focusField, currentStep]);

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };

      if (field === 'night_feeds' && typeof value === 'number') {
        if (value > 0) {
          const currentTimes = (newData.feed_clock_times as string[]) || [];
          const requiredTimes = new Array(value).fill('').map((_, i) => currentTimes[i] || '');
          newData.feed_clock_times = requiredTimes;
        } else {
          newData.feed_clock_times = [];
        }
      }

      return newData;
    });

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const toggleArrayItem = (field: string, item: string) => {
    setFormData(prev => {
      const currentArray = (prev[field as keyof typeof prev] as string[]) || [];
      return {
        ...prev,
        [field]: currentArray.includes(item)
          ? currentArray.filter(i => i !== item)
          : [...currentArray, item]
      };
    });
  };

  const getCurrentSectionQuestions = () => {
    const currentSection = sections[currentStep];
    return (questions as Question[]).filter(q => q.section === currentSection.id);
  };

  const isQuestionVisible = (question: Question) => {
    if (!question.visibleIf) return true;
    return Object.entries(question.visibleIf).every(([field, allowed]) => {
      const currentValue = formData[field as keyof typeof formData];
      const allowedArray = Array.isArray(allowed) ? allowed : [allowed];
      return allowedArray.includes(currentValue as any);
    });
  };

  const validateField = (q: Question, value: any): string | null => {
    if (q.required) {
      if (value === undefined || value === null || value === '') {
        return `${q.label} is required`;
      }
      if (q.type === 'multitime') {
        const arr = value as string[];
        if (!arr || arr.length === 0 || arr.some(t => !t || t.trim() === '')) {
          return `${q.label} is required - please specify all times`;
        }
      }
    }
    if (q.type === 'number' && (value !== '' && value !== undefined && value !== null)) {
      const num = Number(value);
      if (Number.isNaN(num)) return `Invalid input for ${q.label}`;
      if (typeof q.min === 'number' && num < q.min) return `Invalid input`;
      if (typeof q.max === 'number' && num > q.max) return `Invalid input`;
    }
    return null;
  };

  /** return fresh error map for the current step (so we don't rely on stale state) */
  const validateCurrentStep = (): { valid: boolean; errors: Record<string, string> } => {
    const currentQuestions = getCurrentSectionQuestions().filter(isQuestionVisible);
    const newErrors: Record<string, string> = {};
    currentQuestions.forEach(q => {
      const value = formData[q.id as keyof typeof formData];
      const msg = validateField(q, value);
      if (msg) newErrors[q.id] = msg;
    });
    setErrors(newErrors);
    return { valid: Object.keys(newErrors).length === 0, errors: newErrors };
  };

  const normalizeFormDataForValidation = (data: Partial<SleepPlannerFormData>) => {
    const nightFeeds = (data.night_feeds as number) ?? 0;
    return {
      ...data,
      white_noise_on: (data.white_noise_on as boolean) ?? false,
      associations: (data.associations as string[]) ?? [],
      routine_steps: (data.routine_steps as string[]) ?? [],
      health_flags: (data.health_flags as string[]) ?? [],
      feed_clock_times:
        nightFeeds > 0
          ? ((data.feed_clock_times as string[]) ?? Array.from({ length: nightFeeds }, () => ''))
          : []
    } as Partial<SleepPlannerFormData>;
  };

  const validateAllVisible = (): Record<string, string> => {
    const map: Record<string, string> = {};
    (questions as Question[]).forEach(q => {
      if (!isQuestionVisible(q)) return;
      const value = formData[q.id as keyof typeof formData];
      const msg = validateField(q, value);
      if (msg) map[q.id] = msg;
    });
    return map;
  };

  const jumpToField = (fieldId: string) => {
    const q = getQuestionById(fieldId);
    if (!q) return;
    const stepIndex = getSectionIndexById(q.section);
    if (stepIndex >= 0) setCurrentStep(stepIndex);
    setTimeout(() => setFocusField(fieldId), 60);
  };

  // 👉 derive which steps have errors (so the stepper can show them in red)
  const errorStepIndexes = useMemo(() => {
    const all = validateAllVisible();
    const indexes = new Set<number>();
    Object.keys(all).forEach((fieldId) => {
      const q = getQuestionById(fieldId);
      if (q) {
        const idx = getSectionIndexById(q.section);
        if (idx >= 0) indexes.add(idx);
      }
    });
    return Array.from(indexes.values()).sort((a, b) => a - b);
  }, [formData]);

  const handleNext = () => {
    const { valid, errors: stepErrors } = validateCurrentStep();

    if (!valid) {
      const firstFieldId = Object.keys(stepErrors)[0];
      if (firstFieldId) jumpToField(firstFieldId);
      toast.error('Please fix the highlighted field.');
      return;
    }

    if (currentStep < sections.length - 1) {
      let next = currentStep + 1;
      while (next < sections.length) {
        const nextSection = sections[next];
        const nextQs = (questions as Question[]).filter(q => q.section === nextSection.id);
        const visibleNext = nextQs.filter(isQuestionVisible);
        if (visibleNext.length === 0) { next += 1; continue; }
        break;
      }
      setCurrentStep(Math.min(next, sections.length - 1));
    } else {
      const normalized = normalizeFormDataForValidation(formData);
      const validation = validateSleepPlannerData(normalized);

      if (validation.success && validation.data) {
        navigate('/sleep-planner/results', { state: { formData: validation.data } });
      } else {
        const schemaErrors = validation.errors || {};
        const uiErrors = validateAllVisible();
        const combined = { ...uiErrors, ...schemaErrors };

        if (Object.keys(combined).length) {
          setErrors(prev => ({ ...prev, ...combined }));
          // handle dotted paths like "feed_clock_times.0"
          const firstKey = Object.keys(combined)[0];
          const rootField = firstKey.split('.')[0];
          const q = getQuestionById(rootField);
          const sectionTitle = q ? sections[getSectionIndexById(q.section)]?.title : 'this section';
          toast.error(`Fix "${q?.label || rootField}" in ${sectionTitle}.`);
          jumpToField(rootField);
        } else {
          toast.error('Please check all fields and try again');
        }
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const saveProgress = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ formData, currentStep }));
    toast.success('Progress saved!');
  };

  const renderInput = (question: Question) => {
    try {
      const value = formData[question.id as keyof typeof formData];
      const error = errors[question.id];

      const handleTempChange = (newValue: number) => {
        if (question.id === 'temp_f') {
          updateFormData('temp_f', tempUnit === 'F' ? newValue : celsiusToFahrenheit(newValue));
        } else {
          updateFormData(question.id, newValue);
        }
      };

      const displayTemp =
        question.id === 'temp_f' && tempUnit === 'C'
          ? fahrenheitToCelsius((value as number) || 70)
          : (value as number);

      switch (question.type) {
        case 'email':
          return (
            <div className="space-y-1">
              <Input
                type="email"
                value={(value as string) || ''}
                onChange={(e) => updateFormData(question.id, e.target.value)}
                placeholder={question.placeholder}
                className={error ? 'border-red-500' : ''}
              />
              {error && <p className="text-xs text-red-600">{error}</p>}
            </div>
          );

        case 'number': {
          const numVal = typeof displayTemp === 'number' ? displayTemp : (value as number);
          let outOfRange = false;
          if (typeof question.min === 'number' && typeof numVal === 'number' &&
              numVal < (question.id === 'temp_f' && tempUnit === 'C'
                ? Math.round(((question.min ?? 0) - 32) * 5 / 9)
                : question.min)) outOfRange = true;

          if (typeof question.max === 'number' && typeof numVal === 'number' &&
              numVal > (question.id === 'temp_f' && tempUnit === 'C'
                ? Math.round(((question.max ?? 0) - 32) * 5 / 9)
                : question.max)) outOfRange = true;

          if (question.id === 'temp_f') {
            return (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={tempUnit === 'F' ? question.min : Math.round(((question.min ?? 0) - 32) * 5 / 9)}
                    max={tempUnit === 'F' ? question.max : Math.round(((question.max ?? 0) - 32) * 5 / 9)}
                    step={question.step}
                    value={displayTemp || ''}
                    onChange={(e) => handleTempChange(Number(e.target.value))}
                    className={(error || outOfRange) ? 'border-red-500' : ''}
                  />
                  <div className="flex gap-1">
                    <Button type="button" variant={tempUnit === 'F' ? 'default' : 'outline'} size="sm" onClick={() => setTempUnit('F')}>°F</Button>
                    <Button type="button" variant={tempUnit === 'C' ? 'default' : 'outline'} size="sm" onClick={() => setTempUnit('C')}>°C</Button>
                  </div>
                </div>
                {(error || outOfRange) && <p className="text-xs text-red-600">Invalid input</p>}
              </div>
            );
          }

          return (
            <div className="space-y-1">
              <Input
                type="number"
                min={question.min}
                max={question.max}
                step={question.step}
                value={(value as number) || ''}
                onChange={(e) => updateFormData(question.id, Number(e.target.value))}
                className={error ? 'border-red-500' : ''}
              />
              {error && <p className="text-xs text-red-600">{error}</p>}
            </div>
          );
        }

        case 'time':
          return (
            <div className="space-y-1">
              <Input
                type="time"
                value={(value as string) || ''}
                onChange={(e) => updateFormData(question.id, e.target.value)}
                className={error ? 'border-red-500' : ''}
              />
              {error && <p className="text-xs text-red-600">{error}</p>}
            </div>
          );

        case 'boolean':
          return (
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={(value as boolean) || false}
                  onCheckedChange={(checked) => updateFormData(question.id, checked)}
                />
                <Label>{question.label}</Label>
              </div>
              {error && <p className="text-xs text-red-600">{error}</p>}
            </div>
          );

        case 'select': {
          const selectOptions =
            Array.isArray(question.options) && question.options.length > 0
              ? typeof question.options[0] === 'string'
                ? (question.options as string[]).map(opt => ({
                    value: opt,
                    label: opt.replace('_', ' ').charAt(0).toUpperCase() + opt.replace('_', ' ').slice(1)
                  }))
                : (question.options as Array<{ value: any; label: string }>)
              : [];
          return (
            <div className="space-y-1">
              <Select
                value={value?.toString() || ''}
                onValueChange={(v) => updateFormData(question.id, selectOptions.find(opt => opt.value.toString() === v)?.value)}
              >
                <SelectTrigger className={error ? 'border-red-500' : ''}>
                  <SelectValue placeholder={`Select ${question.label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {selectOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {error && <p className="text-xs text-red-600">{error}</p>}
            </div>
          );
        }

        case 'multiselect': {
          const multiselectOptions =
            Array.isArray(question.options) && question.options.length > 0
              ? typeof question.options[0] === 'string'
                ? (question.options as string[])
                : (question.options as Array<{ value: any; label: string }>).map(opt => opt.value)
              : [];
          return (
            <div className="space-y-1">
              <div className="grid grid-cols-2 gap-3">
                {multiselectOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      checked={((value as string[]) || []).includes(option)}
                      onCheckedChange={() => toggleArrayItem(question.id, option)}
                    />
                    <Label className="text-sm capitalize">{option.replace('_', ' ')}</Label>
                  </div>
                ))}
              </div>
              {error && <p className="text-xs text-red-600">{error}</p>}
            </div>
          );
        }

        case 'multitime': {
          const currentArray = (value as string[]) || [];
          const nightFeeds = (formData.night_feeds as number) || 0;

          if (question.id === 'feed_clock_times' && nightFeeds > 0 && currentArray.length === 0) {
            const initialArray = new Array(nightFeeds).fill('');
            updateFormData(question.id, initialArray);
            return <div className="text-sm text-muted-foreground p-2 bg-muted rounded">Initializing feeding time slots...</div>;
          }

          return (
            <div className="space-y-2">
              {currentArray.length > 0 ? (
                currentArray.map((time, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Label className="min-w-0 text-sm">Feed {index + 1}:</Label>
                    <Input
                      type="time"
                      value={time}
                      onChange={(e) => {
                        const newTimes = [...currentArray];
                        newTimes[index] = e.target.value;
                        updateFormData(question.id, newTimes);
                      }}
                      className={error ? 'border-red-500' : ''}
                    />
                    {currentArray.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newTimes = currentArray.filter((_, i) => i !== index);
                          updateFormData(question.id, newTimes);
                        }}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">No feeding times to configure</div>
              )}

              {question.id === 'feed_clock_times' && nightFeeds > currentArray.length && (
                <div className="text-sm text-amber-600 bg-amber-50 p-2 rounded">
                  You indicated {nightFeeds} night feeds, but only have {currentArray.length} time slots configured.
                </div>
              )}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const newTimes = [...currentArray, ''];
                  updateFormData(question.id, newTimes);
                }}
              >
                Add Time
              </Button>

              {error && <p className="text-xs text-red-600">{error}</p>}
            </div>
          );
        }

        default:
          return (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-700">Unsupported question type: {question.type}</p>
            </div>
          );
      }
    } catch (error) {
      console.error(`[DEBUG] Error rendering input for question ${question.id}:`, error);
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-700">Error loading this question. Please refresh and try again.</p>
        </div>
      );
    }
  };

  const renderStep = () => {
    const section = sections[currentStep];
    const sectionQuestions = getCurrentSectionQuestions().filter(isQuestionVisible);
    const IconComponent = section.icon;

    if (sectionQuestions.length === 0) {
      return (
        <div className="space-y-6 text-center py-8">
          <IconComponent className="h-12 w-12 text-muted-foreground mx-auto" />
          <div>
            <h2 className="text-xl font-semibold text-muted-foreground">{section.title}</h2>
            <p className="text-muted-foreground mt-2">No questions to display in this section based on your previous answers.</p>
            <p className="text-sm text-muted-foreground mt-1">Click "Next" to continue to the next section.</p>
          </div>
        </div>
      );
    }

    const body = (
      <div className="space-y-6">
        {sectionQuestions.map((question: Question) => (
          <div key={question.id} data-field={question.id} className="space-y-2">
            <Label className={question.required ? 'font-medium' : ''}>
              {question.label}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>

            {renderInput(question)}

            {question.insight && (
              <SleepScienceInsight title="Why this matters" content={question.insight} compact />
            )}

            {question.ageNote && formData.age_months && formData.age_months < 4 && (
              <SleepScienceInsight title="For babies under 4 months" content={question.ageNote} type="info" compact />
            )}
          </div>
        ))}
      </div>
    );

    if (section.id === 'intro') {
      return (
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <IconComponent className="h-8 w-8 text-primary" />
              <h2 className="text-2xl font-bold">{section.title}</h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Welcome to Sleepy Little One's evidence-informed baby sleep planner.
              We'll create a personalized sleep plan based on your baby's specific needs and your family's preferences.
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="bg-card border rounded-lg p-4">
                <h4 className="font-semibold text-primary">Evidence-Informed</h4>
                <p className="text-muted-foreground">Based on sleep science and pediatric research</p>
              </div>
              <div className="bg-card border rounded-lg p-4">
                <h4 className="font-semibold text-primary">8-10 Minutes</h4>
                <p className="text-muted-foreground">Quick assessment for busy parents</p>
              </div>
              <div className="bg-card border rounded-lg p-4">
                <h4 className="font-semibold text-primary">Personalized Plan</h4>
                <p className="text-muted-foreground">Tonight's schedule + 14-day roadmap</p>
              </div>
            </div>
          </div>

          <SleepScienceInsight title="Educational Content Only" content={disclaimers.educational} type="info" />
          {body}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <IconComponent className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">{section.title}</h2>
            <p className="text-muted-foreground">{section.description}</p>
          </div>
        </div>
        {body}
      </div>
    );
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

          {/* 👉 pass error steps + click handler */}
          <ProgressStepper
            currentStep={currentStep}
            totalSteps={sections.length}
            errorStepIndexes={errorStepIndexes}
            onStepClick={(i) => setCurrentStep(i)}
          />

          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Step {currentStep + 1} of {sections.length}</span>
                <Button variant="outline" size="sm" onClick={saveProgress} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Progress
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderStep()}

              <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={handlePrev} disabled={currentStep === 0} className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>

                <Button onClick={handleNext} className="flex items-center gap-2">
                  {currentStep === sections.length - 1 ? 'Get My Plan' : 'Next'}
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
