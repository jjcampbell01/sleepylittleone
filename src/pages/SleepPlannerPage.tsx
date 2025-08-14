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
import { SleepScienceInsight } from '@/components/sleep-planner/SleepScienceInsight';
import { SEO } from '@/components/SEO';
import { ArrowLeft, ArrowRight, Save, Baby, Clock, Moon, Utensils, Home, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { SleepPlannerFormData, validateSleepPlannerData } from '@/api/validate';
import { parseTime, formatTime, celsiusToFahrenheit, fahrenheitToCelsius } from '@/lib/time';
import { disclaimers } from '@/data/sleep-planner/insights';
import questions from '@/data/sleep-planner/questions.json';

const STORAGE_KEY = 'sleepPlannerV2Data';

interface Question {
  id: string;
  section: string;
  type: string;
  label: string;
  required?: boolean;
  options?: Array<{value: any; label: string}>;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  insight?: string;
  ageNote?: string;
  visibleIf?: Record<string, any[]>;
}

const sections = [
  { id: 'intro', title: 'Getting Started', icon: Shield, description: 'Let\'s start with the basics about your baby and your consent for this assessment.' },
  { id: 'pressure', title: 'Sleep Pressure & Timing', icon: Clock, description: 'Understanding your baby\'s current sleep schedule and wake windows.' },
  { id: 'settling', title: 'Settling & Night Wakings', icon: Moon, description: 'How your baby falls asleep and stays asleep through the night.' },
  { id: 'nutrition', title: 'Night Nutrition', icon: Utensils, description: 'Night feeding patterns and timing.' },
  { id: 'environment', title: 'Sleep Environment & Routine', icon: Home, description: 'The physical sleep space and bedtime consistency.' }
];

export default function SleepPlannerPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0); // 0-indexed for sections
  const [formData, setFormData] = useState<Partial<SleepPlannerFormData>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tempUnit, setTempUnit] = useState<'F' | 'C'>('F');

  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const savedData = JSON.parse(saved);
        setFormData(savedData.formData || {});
        setCurrentStep(savedData.currentStep || 0);
      } catch (e) {
        console.error('Failed to load saved data');
      }
    }
  }, []);

  // Auto-save data
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ formData, currentStep }));
    }, 1000);
    return () => clearTimeout(timer);
  }, [formData, currentStep]);

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
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
    return questions.filter(q => q.section === currentSection.id);
  };

  const isQuestionVisible = (question: Question) => {
    if (!question.visibleIf) return true;
    
    return Object.entries(question.visibleIf).every(([field, allowedValues]) => {
      const currentValue = formData[field as keyof typeof formData];
      return allowedValues.includes(currentValue);
    });
  };

  const getRequiredFields = () => {
    const currentQuestions = getCurrentSectionQuestions().filter(isQuestionVisible);
    return currentQuestions.filter(q => q.required).map(q => q.id);
  };

  const validateCurrentStep = () => {
    const requiredFields = getRequiredFields();
    const newErrors: Record<string, string> = {};
    
    requiredFields.forEach(field => {
      const value = formData[field as keyof typeof formData];
      if (value === undefined || value === null || value === '') {
        const question = questions.find(q => q.id === field);
        newErrors[field] = `${question?.label} is required`;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (currentStep < sections.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Final validation and navigate to results
      const validation = validateSleepPlannerData(formData);
      if (validation.success && validation.data) {
        navigate('/sleep-planner/results', { state: { formData: validation.data } });
      } else {
        setErrors(validation.errors || {});
        toast.error('Please check all fields and try again');
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const saveProgress = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ formData, currentStep }));
    toast.success('Progress saved!');
  };

  const renderInput = (question: Question) => {
    const value = formData[question.id as keyof typeof formData];
    const error = errors[question.id];
    
    const handleTempChange = (newValue: number) => {
      if (question.id === 'temp_f') {
        updateFormData('temp_f', tempUnit === 'F' ? newValue : celsiusToFahrenheit(newValue));
      } else {
        updateFormData(question.id, newValue);
      }
    };

    const displayTemp = question.id === 'temp_f' && tempUnit === 'C' 
      ? fahrenheitToCelsius(value as number || 70) 
      : value as number;

    switch (question.type) {
      case 'email':
        return (
          <Input
            type="email"
            value={value as string || ''}
            onChange={(e) => updateFormData(question.id, e.target.value)}
            placeholder={question.placeholder}
            className={error ? 'border-red-500' : ''}
          />
        );
        
      case 'number':
        return question.id === 'temp_f' ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={tempUnit === 'F' ? question.min : Math.round((question.min! - 32) * 5/9)}
                max={tempUnit === 'F' ? question.max : Math.round((question.max! - 32) * 5/9)}
                step={question.step}
                value={displayTemp || ''}
                onChange={(e) => handleTempChange(Number(e.target.value))}
                className={error ? 'border-red-500' : ''}
              />
              <div className="flex gap-1">
                <Button
                  type="button"
                  variant={tempUnit === 'F' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTempUnit('F')}
                >
                  °F
                </Button>
                <Button
                  type="button"
                  variant={tempUnit === 'C' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTempUnit('C')}
                >
                  °C
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <Input
            type="number"
            min={question.min}
            max={question.max}
            step={question.step}
            value={value as number || ''}
            onChange={(e) => updateFormData(question.id, Number(e.target.value))}
            className={error ? 'border-red-500' : ''}
          />
        );
        
      case 'time':
        return (
          <Input
            type="time"
            value={value as string || ''}
            onChange={(e) => updateFormData(question.id, e.target.value)}
            className={error ? 'border-red-500' : ''}
          />
        );
        
      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={value as boolean || false}
              onCheckedChange={(checked) => updateFormData(question.id, checked)}
            />
            <Label>{question.label}</Label>
          </div>
        );
        
      case 'select':
        return (
          <Select 
            value={value?.toString() || ''} 
            onValueChange={(v) => updateFormData(question.id, question.options?.find(opt => opt.value.toString() === v)?.value)}
          >
            <SelectTrigger className={error ? 'border-red-500' : ''}>
              <SelectValue placeholder={`Select ${question.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
        
      case 'multiselect':
        return (
          <div className="grid grid-cols-2 gap-3">
            {question.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  checked={(value as string[] || []).includes(option)}
                  onCheckedChange={() => toggleArrayItem(question.id, option)}
                />
                <Label className="text-sm capitalize">{option.replace('_', ' ')}</Label>
              </div>
            ))}
          </div>
        );
        
      case 'multitime':
        return (
          <div className="space-y-2">
            {(value as string[] || []).map((time, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => {
                    const newTimes = [...(value as string[] || [])];
                    newTimes[index] = e.target.value;
                    updateFormData(question.id, newTimes);
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newTimes = (value as string[] || []).filter((_, i) => i !== index);
                    updateFormData(question.id, newTimes);
                  }}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const newTimes = [...(value as string[] || []), ''];
                updateFormData(question.id, newTimes);
              }}
            >
              Add Time
            </Button>
          </div>
        );
        
      default:
        return null;
    }
  };

  const renderStep = () => {
    const section = sections[currentStep];
    const sectionQuestions = getCurrentSectionQuestions().filter(isQuestionVisible);
    const IconComponent = section.icon;
    
    // Special handling for intro section
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
          
          <SleepScienceInsight
            title="Educational Content Only"
            content={disclaimers.educational}
            type="info"
          />
          
          <div className="space-y-4">
            {sectionQuestions.map((question) => (
              <div key={question.id} className="space-y-2">
                <Label className={question.required ? 'font-medium' : ''}>
                  {question.label}
                  {question.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {renderInput(question)}
                {errors[question.id] && (
                  <p className="text-red-500 text-sm">{errors[question.id]}</p>
                )}
              </div>
            ))}
          </div>
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
        
        <div className="space-y-6">
          {sectionQuestions.map((question) => (
            <div key={question.id} className="space-y-2">
              <Label className={question.required ? 'font-medium' : ''}>
                {question.label}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              
              {question.type !== 'boolean' && renderInput(question)}
              {question.type === 'boolean' && renderInput(question)}
              
              {errors[question.id] && (
                <p className="text-red-500 text-sm">{errors[question.id]}</p>
              )}
              
              {question.insight && (
                <SleepScienceInsight
                  title="Why this matters"
                  content={question.insight}
                  compact
                />
              )}
              
              {question.ageNote && formData.age_months && formData.age_months < 4 && (
                <SleepScienceInsight
                  title="For babies under 4 months"
                  content={question.ageNote}
                  type="info"
                  compact
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const getProgress = () => {
    const totalSteps = sections.length;
    return Math.round(((currentStep + 1) / totalSteps) * 100);
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

          <ProgressStepper currentStep={currentStep} totalSteps={sections.length} />

          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Step {currentStep + 1} of {sections.length}</span>
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
                  disabled={currentStep === 0}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                <Button
                  onClick={handleNext}
                  className="flex items-center gap-2"
                >
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