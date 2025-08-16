import React from "react";
import { Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressStepperProps {
  currentStep: number;
  totalSteps: number;
  /** indices (0-based) of steps that have validation errors */
  errorStepIndexes?: number[];
  /** clicking a step moves to it */
  onStepClick?: (index: number) => void;
}

const stepLabels = [
  "Getting Started",
  "Sleep Pressure",
  "Independent Settling",
  "Night Nutrition",
  "Environment & Routine",
  "Bedtime Routine",
  "Final Considerations",
];

function StepLabel({ index }: { index: number }) {
  const label = stepLabels[index] ?? `Step ${index + 1}`;
  return <span className="mt-2 text-[10px] sm:text-xs text-center max-w-20 sm:max-w-24">{label}</span>;
}

export default function ProgressStepper({
  currentStep,
  totalSteps,
  errorStepIndexes = [],
  onStepClick,
}: ProgressStepperProps) {
  const errorSet = new Set(errorStepIndexes);

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex items-center gap-4 overflow-x-auto no-scrollbar px-1 sm:justify-between">
        {Array.from({ length: totalSteps }, (_, i) => {
          const isCompleted = i < currentStep;
          const isCurrent = i === currentStep;
          const isError = errorSet.has(i);

          const circle = (
            <div
              className={cn(
                "flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-colors shrink-0",
                isCurrent
                  ? "border-primary bg-primary/10"
                  : isCompleted
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted"
              )}
            >
              {isCompleted ? (
                <Check className="w-4 h-4" />
              ) : isError ? (
                <AlertCircle className="w-4 h-4 text-destructive" />
              ) : (
                <span className="font-medium">{i + 1}</span>
              )}
            </div>
          );

          return (
            <button
              key={i}
              type="button"
              onClick={() => onStepClick?.(i)}
              className={cn(
                "flex flex-col items-center focus:outline-none shrink-0 min-w-16",
                isCurrent ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
              aria-current={isCurrent ? "step" : undefined}
              aria-label={`Step ${i + 1}: ${stepLabels[i] ?? ""}`}
            >
              {circle}
              <StepLabel index={i} />
            </button>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="bg-gradient-primary h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
        />
      </div>

      <div className="mt-2 text-center text-sm text-muted-foreground">
        Step {currentStep + 1} of {totalSteps} •{" "}
        {Math.round(((currentStep + 1) / totalSteps) * 100)}% complete
      </div>
    </div>
  );
}
