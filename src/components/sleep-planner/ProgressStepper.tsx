import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressStepperProps {
  currentStep: number;
  totalSteps: number;
  errorStepIndexes?: number[];
  onStepClick?: (index: number) => void;
}

const stepLabels = [
  'Getting Started',
  'Sleep Pressure',
  'Independent Settling',
  'Night Nutrition',
  'Environment & Routine',
  'Bedtime Routine',
  'Final Considerations'
];

export function ProgressStepper({
  currentStep,
  totalSteps,
  errorStepIndexes = [],
  onStepClick
}: ProgressStepperProps) {
  const isError = (i: number) => errorStepIndexes.includes(i);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNumber = i + 1;
          const isCompleted = i < currentStep && !isError(i);
          const isCurrent = i === currentStep;

          return (
            <React.Fragment key={stepNumber}>
              <button
                type="button"
                onClick={() => onStepClick?.(i)}
                className="flex flex-col items-center focus:outline-none"
              >
                <div
                  className={cn(
                    'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300',
                    isError(i) && 'bg-red-600/15 border-red-600 text-red-700',
                    !isError(i) && isCompleted && 'bg-primary border-primary text-primary-foreground',
                    !isError(i) && !isCompleted && isCurrent && 'border-primary text-primary bg-background',
                    !isError(i) && !isCompleted && !isCurrent && 'border-muted-foreground/30 text-muted-foreground'
                  )}
                  aria-label={stepLabels[i]}
                >
                  {isError(i) ? (
                    <AlertCircle className="h-5 w-5" />
                  ) : isCompleted ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{stepNumber}</span>
                  )}
                </div>
                <div
                  className={cn(
                    'mt-2 text-xs text-center max-w-24 leading-tight',
                    isError(i)
                      ? 'text-red-700 font-medium'
                      : isCurrent
                      ? 'text-primary font-medium'
                      : 'text-muted-foreground'
                  )}
                >
                  {stepLabels[i]}
                </div>
              </button>

              {stepNumber < totalSteps && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-2 transition-all duration-300',
                    isError(i) ? 'bg-red-300' : i < currentStep ? 'bg-primary' : 'bg-muted-foreground/20'
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
        Step {currentStep + 1} of {totalSteps} • {Math.round(((currentStep + 1) / totalSteps) * 100)}% complete
      </div>
    </div>
  );
}
