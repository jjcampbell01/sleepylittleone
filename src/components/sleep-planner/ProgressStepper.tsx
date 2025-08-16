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

export function ProgressStepper({
  currentStep,
  totalSteps,
  errorStepIndexes = [],
  onStepClick,
}: ProgressStepperProps) {
  const errorSet = new Set(errorStepIndexes);

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => {
          const isCompleted = i < currentStep;
          const isCurrent = i === currentStep;
          const isError = errorSet.has(i);

          const circle = (
            <div
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors",
                isError
                  ? "border-red-500 bg-red-500/10 text-red-600"
                  : isCompleted
                  ? "border-primary bg-primary text-primary-foreground"
                  : isCurrent
                  ? "border-primary text-primary bg-background"
                  : "border-muted-foreground/30 text-muted-foreground"
              )}
            >
              {isError ? (
                <AlertCircle className="h-5 w-5" />
              ) : isCompleted ? (
                <Check className="h-5 w-5" />
              ) : (
                <span className="text-sm font-medium">{i + 1}</span>
              )}
            </div>
          );

          return (
            <React.Fragment key={i}>
              <button
                type="button"
                onClick={() => onStepClick?.(i)}
                className="flex flex-col items-center focus:outline-none"
                aria-label={`Step ${i + 1}: ${stepLabels[i]}`}
              >
                {circle}
                <div
                  className={cn(
                    "mt-2 text-xs text-center max-w-24 leading-tight",
                    isCurrent ? "text-primary font-medium" : "text-muted-foreground"
                  )}
                >
                  {stepLabels[i]}
                </div>
              </button>

              {i + 1 < totalSteps && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-2 transition-colors",
                    isCompleted ? "bg-primary" : "bg-muted-foreground/20"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="mt-6 w-full bg-muted rounded-full h-2">
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

export default ProgressStepper;
