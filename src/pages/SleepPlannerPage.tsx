import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ProgressStepper } from "@/components/sleep-planner/ProgressStepper";
import { SleepScienceInsight } from "@/components/sleep-planner/SleepScienceInsight";
import { SEO } from "@/components/SEO";
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Clock,
  Moon,
  Utensils,
  Home,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import { SleepPlannerFormData, validateSleepPlannerData } from "@/api/validate";
import { celsiusToFahrenheit, fahrenheitToCelsius } from "@/lib/time";
import { disclaimers } from "@/data/sleep-planner/insights";
import questions from "@/data/sleep-planner/questions.json";

const STORAGE_KEY = "sleepPlannerV2Data";

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
  {
    id: "intro",
    title: "Getting Started",
    icon: Shield,
    description:
      "Let's start with the basics about your baby and your consent for this assessment.",
  },
  {
    id: "pressure",
    title: "Sleep Pressure & Timing",
    icon: Clock,
    description:
      "Understanding your baby's current sleep schedule and wake windows.",
  },
  {
    id: "settling",
    title: "Settling & Night Wakings",
    icon: Moon,
    description:
      "How your baby falls asleep and stays asleep through the night.",
  },
  {
    id: "nutrition",
    title: "Night Nutrition",
    icon: Utensils,
    description: "Night feeding patterns and timing.",
  },
  {
    id: "environment",
    title: "Sleep Environment & Routine",
    icon: Home,
    description: "The physical sleep space and bedtime consistency.",
  },
  {
    id: "routine",
    title: "Bedtime Routine",
    icon: Home,
    description: "Your bedtime routine and wake time consistency.",
  },
  {
    id: "other",
    title: "Final Considerations",
    icon: Shield,
    description: "Health factors and parent preferences.",
  },
];

// helpers
const getQuestionById = (id: string) =>
  (questions as Question[]).find((q) => q.id === id);
const getSectionIndexById = (id: string) =>
  sections.findIndex((s) => s.id === id);

export default function SleepPlannerPage() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<SleepPlannerFormData>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tempUnit, setTempUnit] = useState<"F" | "C">("F");

  /** steps the user *attempted* and failed (red) */
  const [localErrorSteps, setLocalErrorSteps] = useState<Set<number>>(
    () => new Set()
  );
  /** turn on global error mode only after a failed final submit */
  const [showGlobalErrors, setShowGlobalErrors] = useState(false);

  // Load saved
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const savedData = JSON.parse(saved);
        setFormData(savedData.formData || {});
        setCurrentStep(savedData.currentStep || 0);
      } catch {
        console.error("Failed to load saved data");
      }
    }
  }, []);

  // Auto-save
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ formData, currentStep })
      );
    }, 800);
    return () => clearTimeout(timer);
  }, [formData, currentStep]);

  // Default required booleans on step
  useEffect(() => {
    const sectionId = sections[currentStep].id;
    const sectionQuestions = (questions as Question[]).filter(
      (q) => q.section === sectionId
    );

    setFormData((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const q of sectionQuestions) {
        if (
          q.type === "boolean" &&
          q.required &&
          typeof (next as any)[q.id] === "undefined"
        ) {
          (next as any)[q.id] = false;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [currentStep]);

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };

      if (field === "night_feeds" && typeof value === "number") {
        if (value > 0) {
          const currentTimes = (newData.feed_clock_times as string[]) || [];
          const requiredTimes = new Array(value)
            .fill("")
            .map((_, i) => currentTimes[i] || "");
          newData.feed_clock_times = requiredTimes;
        } else {
          newData.feed_clock_times = [];
        }
      }

      return newData;
    });

    // clear error for this field as user edits
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const toggleArrayItem = (field: string, item: string) => {
    setFormData((prev) => {
      const currentArray = (prev[field as keyof typeof prev] as string[]) || [];
      return {
        ...prev,
        [field]: currentArray.includes(item)
          ? currentArray.filter((i) => i !== item)
          : [...currentArray, item],
      };
    });
  };

  const getCurrentSectionQuestions = () => {
    const currentSection = sections[currentStep];
    return (questions as Question[]).filter((q) => q.section === currentSection.id);
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
      if (value === undefined || value === null || value === "") {
        return `${q.label} is required`;
      }
      if (q.type === "multitime") {
        const arr = value as string[];
        if (!arr || arr.length === 0 || arr.some((t) => !t || t.trim() === "")) {
          return `${q.label} is required - please specify all times`;
        }
      }
    }
    if (q.type === "number" && value !== "" && value !== undefined && value !== null) {
      const num = Number(value);
      if (Number.isNaN(num)) return `Invalid input for ${q.label}`;
      if (typeof q.min === "number" && num < q.min) return `Invalid input`;
      if (typeof q.max === "number" && num > q.max) return `Invalid input`;
    }
    return null;
  };

  /** validate all visible fields on the *current* step */
  const runStepValidation = (stepIndex: number) => {
    const sectionId = sections[stepIndex].id;
    const visibleQs = (questions as Question[])
      .filter((q) => q.section === sectionId)
      .filter(isQuestionVisible);

    const stepErrors: Record<string, string> = {};
    visibleQs.forEach((q) => {
      const v = formData[q.id as keyof typeof formData];
      const msg = validateField(q, v);
      if (msg) stepErrors[q.id] = msg;
    });
    return stepErrors;
  };

  /** validate all visible fields across all sections */
  const validateAllVisible = (): Record<string, string> => {
    const map: Record<string, string> = {};
    (questions as Question[]).forEach((q) => {
      if (!isQuestionVisible(q)) return;
      const value = formData[q.id as keyof typeof formData];
      const msg = validateField(q, value);
      if (msg) map[q.id] = msg;
    });
    return map;
  };

  // Which steps should be red in the stepper?
  // - During normal navigation: only steps the user *failed* (localErrorSteps)
  // - After a failed final submit: all steps that currently have errors (global mode)
  const errorStepIndexes = useMemo(() => {
    if (showGlobalErrors) {
      const all = validateAllVisible();
      const set = new Set<number>();
      Object.keys(all).forEach((fieldId) => {
        const q = getQuestionById(fieldId);
        if (q) {
          const idx = getSectionIndexById(q.section);
          if (idx >= 0) set.add(idx);
        }
      });
      return Array.from(set.values()).sort((a, b) => a - b);
    }
    return Array.from(localErrorSteps.values()).sort((a, b) => a - b);
  }, [showGlobalErrors, localErrorSteps, formData]);

  const handleNext = () => {
    // validate this step
    const stepErrors = runStepValidation(currentStep);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      setLocalErrorSteps((prev) => new Set(prev).add(currentStep));
      toast.error("Please fix the highlighted fields.");
      return;
    }

    // step ok → clear any local error flag for it
    setLocalErrorSteps((prev) => {
      const copy = new Set(prev);
      copy.delete(currentStep);
      return copy;
    });
    setErrors({});

    if (currentStep < sections.length - 1) {
      // skip sections with no visible questions
      let next = currentStep + 1;
      while (next < sections.length) {
        const hasVisible = (questions as Question[]).some(
          (q) => q.section === sections[next].id && isQuestionVisible(q)
        );
        if (!hasVisible) next += 1;
        else break;
      }
      setCurrentStep(Math.min(next, sections.length - 1));
      return;
    }

    // Final submit
    const normalized = normalizeForValidation(formData);
    const validation = validateSleepPlannerData(normalized);

    if (validation.success && validation.data) {
      setShowGlobalErrors(false);
      navigate("/sleep-planner/results", { state: { formData: validation.data } });
    } else {
      // enter "global errors" mode
      setShowGlobalErrors(true);
      const combined = { ...validateAllVisible(), ...(validation.errors || {}) };
      setErrors(combined);

      // jump to first error step
      const firstFieldId = Object.keys(combined)[0];
      if (firstFieldId) {
        const q = getQuestionById(firstFieldId);
        if (q) setCurrentStep(getSectionIndexById(q.section));
        toast.error("Please complete the missing fields before generating your plan.");
      } else {
        toast.error("Please check all fields and try again.");
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  const saveProgress = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ formData, currentStep }));
    toast.success("Progress saved!");
  };

  // If we are in global error mode and the user navigates to a step,
  // recompute that step's errors so they are visible immediately.
  useEffect(() => {
    if (showGlobalErrors) {
      const stepErrors = runStepValidation(currentStep);
      setErrors(stepErrors);
    } else {
      // otherwise clear on step change to avoid stale messages
      setErrors({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, showGlobalErrors]);

  /* ---------- render inputs (single place for error message) ---------- */
  const renderInput = (q: Question) => {
    const value = formData[q.id as keyof typeof formData];
    const err = errors[q.id];

    const showNumber = (node: React.ReactNode) => (
      <div className="space-y-1">
        {node}
        {err && <p className="text-xs text-red-600">{err}</p>}
      </div>
    );

    switch (q.type) {
      case "email":
        return showNumber(
          <Input
            type="email"
            value={(value as string) || ""}
            onChange={(e) => updateFormData(q.id, e.target.value)}
            placeholder={q.placeholder}
            className={err ? "border-red-500" : ""}
          />
        );

      case "number": {
        // handle °F/°C switching only for temp_f
        const isTemp = q.id === "temp_f";
        const display =
          isTemp && tempUnit === "C"
            ? fahrenheitToCelsius((value as number) || 70)
            : (value as number);

        const min = isTemp && tempUnit === "C" ? Math.round(((q.min ?? 0) - 32) * 5 / 9) : q.min;
        const max = isTemp && tempUnit === "C" ? Math.round(((q.max ?? 0) - 32) * 5 / 9) : q.max;

        const input = (
          <div className={cn("flex items-center gap-2", err && "has-[input]:border-red-500")}>
            <Input
              type="number"
              min={min}
              max={max}
              step={q.step}
              value={display ?? ""}
              onChange={(e) => {
                const nv = Number(e.target.value);
                if (isTemp) {
                  updateFormData("temp_f", tempUnit === "F" ? nv : celsiusToFahrenheit(nv));
                } else {
                  updateFormData(q.id, nv);
                }
              }}
              className={cn("flex-1", err ? "border-red-500" : "")}
            />
            {isTemp && (
              <div className="flex gap-1 flex-shrink-0">
                <Button
                  type="button"
                  size="sm"
                  variant={tempUnit === "F" ? "default" : "outline"}
                  onClick={() => setTempUnit("F")}
                  className="min-w-[44px]"
                >
                  °F
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={tempUnit === "C" ? "default" : "outline"}
                  onClick={() => setTempUnit("C")}
                  className="min-w-[44px]"
                >
                  °C
                </Button>
              </div>
            )}
          </div>
        );

        return showNumber(input);
      }

      case "time":
        return showNumber(
          <Input
            type="time"
            value={(value as string) || ""}
            onChange={(e) => updateFormData(q.id, e.target.value)}
            className={err ? "border-red-500" : ""}
          />
        );

      case "boolean":
        return (
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={(value as boolean) || false}
                onCheckedChange={(checked) => updateFormData(q.id, checked)}
              />
              <Label>{q.label}</Label>
            </div>
            {err && <p className="text-xs text-red-600">{err}</p>}
          </div>
        );

      case "select": {
        const raw = q.options || [];
        const opts =
          typeof raw[0] === "string"
            ? (raw as string[]).map((opt) => ({
                value: opt,
                label:
                  opt.replace(/_/g, " ").charAt(0).toUpperCase() +
                  opt.replace(/_/g, " ").slice(1),
              }))
            : (raw as Array<{ value: any; label: string }>);

        return showNumber(
          <Select
            value={value?.toString() || ""}
            onValueChange={(v) =>
              updateFormData(q.id, opts.find((o) => o.value.toString() === v)?.value)
            }
          >
            <SelectTrigger className={err ? "border-red-500" : ""}>
              <SelectValue placeholder={`Select ${q.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {opts.map((o) => (
                <SelectItem key={o.value} value={o.value.toString()}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }

      case "multiselect": {
        const raw = q.options || [];
        const opts =
          typeof raw[0] === "string"
            ? (raw as string[])
            : (raw as Array<{ value: any; label: string }>).map((o) => o.value);

        return (
          <div className="space-y-1">
            <div className="grid grid-cols-2 gap-3">
              {opts.map((opt) => (
                <div key={opt} className="flex items-center space-x-2">
                  <Checkbox
                    checked={((value as string[]) || []).includes(opt)}
                    onCheckedChange={() => toggleArrayItem(q.id, opt)}
                  />
                  <Label className="text-sm capitalize">
                    {opt.toString().replaceAll("_", " ")}
                  </Label>
                </div>
              ))}
            </div>
            {err && <p className="text-xs text-red-600">{err}</p>}
          </div>
        );
      }

      case "multitime": {
        const times = (value as string[]) || [];
        const nightFeeds = (formData.night_feeds as number) || 0;

        if (q.id === "feed_clock_times" && nightFeeds > 0 && times.length === 0) {
          updateFormData(q.id, Array.from({ length: nightFeeds }, () => ""));
          return (
            <div className="text-sm text-muted-foreground p-2 bg-muted rounded">
              Initializing feeding time slots…
            </div>
          );
        }

        return (
          <div className="space-y-2">
            {times.length > 0 ? (
              times.map((t, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Label className="min-w-0 text-sm">Feed {i + 1}:</Label>
                  <Input
                    type="time"
                    value={t}
                    onChange={(e) => {
                      const arr = [...times];
                      arr[i] = e.target.value;
                      updateFormData(q.id, arr);
                    }}
                    className={err ? "border-red-500" : ""}
                  />
                  {times.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const arr = times.filter((_, idx) => idx !== i);
                        updateFormData(q.id, arr);
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

            {q.id === "feed_clock_times" && nightFeeds > times.length && (
              <div className="text-sm text-amber-600 bg-amber-50 p-2 rounded">
                You indicated {nightFeeds} night feeds, but only have {times.length} time
                slots configured.
              </div>
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => updateFormData(q.id, [...times, ""])}
            >
              Add Time
            </Button>

            {err && <p className="text-xs text-red-600">{err}</p>}
          </div>
        );
      }

      default:
        return (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-700">
              Unsupported question type: {q.type}
            </p>
          </div>
        );
    }
  };

  const renderStep = () => {
    const section = sections[currentStep];
    const sectionQuestions = getCurrentSectionQuestions().filter(isQuestionVisible);
    const Icon = section.icon;

    if (sectionQuestions.length === 0) {
      return (
        <div className="space-y-6 text-center py-8">
          <Icon className="h-12 w-12 text-muted-foreground mx-auto" />
          <div>
            <h2 className="text-xl font-semibold text-muted-foreground">
              {section.title}
            </h2>
            <p className="text-muted-foreground mt-2">
              No questions to display in this section based on your previous answers.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Click “Next” to continue to the next section.
            </p>
          </div>
        </div>
      );
    }

    const body = (
      <div className="space-y-6">
        {sectionQuestions.map((q) => (
          <div key={q.id} data-field={q.id} className="space-y-2">
            <Label className={q.required ? "font-medium" : ""}>
              {q.label}
              {q.required && <span className="text-red-500 ml-1">*</span>}
            </Label>

            {renderInput(q)}

            {q.insight && (
              <SleepScienceInsight
                title="Why this matters"
                content={q.insight}
                compact
              />
            )}

            {q.ageNote && formData.age_months && formData.age_months < 4 && (
              <SleepScienceInsight
                title="For babies under 4 months"
                content={q.ageNote}
                type="info"
                compact
              />
            )}
          </div>
        ))}
      </div>
    );

    if (section.id === "intro") {
      return (
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Icon className="h-8 w-8 text-primary" />
              <h2 className="text-2xl font-bold">{section.title}</h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Welcome to Sleepy Little One's evidence-informed baby sleep planner.
              We'll create a personalized sleep plan based on your baby's specific
              needs and your family's preferences.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-card border rounded-lg p-4">
                <h4 className="font-semibold text-primary">Evidence-Informed</h4>
                <p className="text-muted-foreground">
                  Based on sleep science and pediatric research
                </p>
              </div>
              <div className="bg-card border rounded-lg p-4">
                <h4 className="font-semibold text-primary">8-10 Minutes</h4>
                <p className="text-muted-foreground">Quick assessment for busy parents</p>
              </div>
              <div className="bg-card border rounded-lg p-4">
                <h4 className="font-semibold text-primary">Personalized Plan</h4>
                <p className="text-muted-foreground">
                  Tonight's schedule + 14-day roadmap
                </p>
              </div>
            </div>
          </div>

          <SleepScienceInsight
            title="Educational Content Only"
            content={disclaimers.educational}
            type="info"
          />
          {body}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <Icon className="h-8 w-8 text-primary" />
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
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
              Baby Sleep Planner
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get a personalized, science-backed sleep plan tailored to your baby's
              unique needs
            </p>
          </div>

          <ProgressStepper
            currentStep={currentStep}
            totalSteps={sections.length}
            errorStepIndexes={errorStepIndexes}
            onStepClick={(i) => setCurrentStep(i)}
          />

          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>
                  Step {currentStep + 1} of {sections.length}
                </span>
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

              <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
                <Button
                  variant="outline"
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 w-full sm:w-auto"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>

                <Button onClick={handleNext} className="flex items-center gap-2 w-full sm:w-auto">
                  {currentStep === sections.length - 1 ? "Get My Plan" : "Next"}
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

/* ------------------------ helpers ------------------------ */

function normalizeForValidation(
  data: Partial<SleepPlannerFormData>
): Partial<SleepPlannerFormData> {
  const nightFeeds = (data.night_feeds as number) ?? 0;

  return {
    ...data,
    white_noise_on: (data.white_noise_on as boolean) ?? false,
    associations: (data.associations as string[]) ?? [],
    routine_steps: (data.routine_steps as string[]) ?? [],
    health_flags: (data.health_flags as string[]) ?? [],
    feed_clock_times:
      nightFeeds > 0
        ? ((data.feed_clock_times as string[]) ??
            Array.from({ length: nightFeeds }, () => ""))
        : [],
  } as Partial<SleepPlannerFormData>;
}

function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}
