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
    return Ob
