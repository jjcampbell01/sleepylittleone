import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressStepperProps {
  currentStep: number;
  totalSteps: number;
  /** Indexes (0-based) of steps that currently contain validation errors */
  errorStepIndexes?: number[];
  /** Click to jump to a step (optional) */
  onStepClick?: (index: number) => void;
}

const stepLabels = [
  'Getting Started',
  'Sleep Pressure',
  'Independent Settling',
  'Night Nutrition',
  'Environment & Routine',
  'Bedtime Routine',
  'Final Considerations',
];

export function ProgressStepper({
  currentStep,
  totalSteps,
  errorStepIndexes = [],
  onStepClick,
}: ProgressStepperProps) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNumber = i + 1;
          const isCompleted = i < currentStep;
          const isCurrent = i === currentStep;
          const hasError = errorStepIndexes.includes(i);

          const dotClasses = cn(
            'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300',
            hasError
              ? 'bg-red-600 border-red-600 text-white'
              : isCompleted
              ? 'bg-primary border-primary text-primary-foreground'
              : isCurrent
              ? 'border-primary text-primary bg-background'
              : 'border-muted-foreground/30 text-muted-foreground'
          );

          const labelClasses = cn(
            'mt-2 text-xs text-center max-w-24 leading-tight',
            hasError ? 'text-red-600' : isCurrent ? 'text-primary font-medium' : 'text-muted-foreground'
          );

          return (
            <React.Fragment key={stepNumber}>
              <button
                type="button"
                aria-current={isCurrent ? 'step' : undefined}
                aria-label={`Step ${stepNumber}: ${stepLabels[i]}`}
                onClick={() => onStepClick?.(i)}
                className="flex flex-col items-center cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded"
              >
                <div className={dotClasses}>
                  {hasError ? (
                    <AlertCircle className="h-5 w-5" />
                  ) : isCompleted ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{stepNumber}</span>
                  )}
                </div>
                <div className={labelClasses}>{stepLabels[i]}</div>
              </button>

              {stepNumber < totalSteps && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-2 transition-all duration-300',
                    // show primary line if the previous step is completed; otherwise muted
                    i < currentStep ? 'bg-primary' : 'bg-muted-foreground/20'
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="mt-6 w-full bg-muted rounded-full h-2">
        <div
          className="bg-gradient-primary h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
        />
      </div>

      <div className="mt-2 text-center text-sm text-muted-foreground">
        Step {currentStep + 1} of {totalSteps} • {Math.round(((currentStep + 1) / totalSteps) * 100)}% complete
      </div>
    </div>
  );
}
