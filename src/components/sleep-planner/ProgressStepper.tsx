import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressStepperProps {
  currentStep: number;
  totalSteps: number;
  /** Optional: make steps clickable */
  onStepClick?: (index: number) => void;
  /**
   * Optional: boolean flags per step that indicate an error on that step.
   * If omitted or undefined, no steps are marked as errors.
   * Only provide `true` for steps you actually want to highlight.
   */
  errorsByStep?: boolean[];
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
  onStepClick,
  errorsByStep,
}: ProgressStepperProps) {
  // Defensive default: no errors unless explicitly passed
  const safeErrors = Array.from({ length: totalSteps }, (_, i) => Boolean(errorsByStep?.[i]));

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNumber = i + 1;
          const isCompleted = i < currentStep;
          const isCurrent = i === currentStep;
          const hasError = safeErrors[i] === true;

          const canClick = typeof onStepClick === 'function';

          // Visual states:
          // - Error: red filled with alert icon
          // - Completed (no error): primary filled with check
          // - Current (no error): primary border with number
          // - Future: muted border with number
          let circleClasses =
            'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300';
          let content: React.ReactNode;

          if (hasError) {
            circleClasses = cn(circleClasses, 'bg-destructive border-destructive text-destructive-foreground');
            content = <AlertCircle className="h-5 w-5" />;
          } else if (isCompleted) {
            circleClasses = cn(circleClasses, 'bg-primary border-primary text-primary-foreground');
            content = <CheckCircle2 className="h-5 w-5" />;
          } else if (isCurrent) {
            circleClasses = cn(circleClasses, 'border-primary text-primary bg-background');
            content = <span className="text-sm font-medium">{stepNumber}</span>;
          } else {
            circleClasses = cn(circleClasses, 'border-muted-foreground/30 text-muted-foreground');
            content = <span className="text-sm font-medium">{stepNumber}</span>;
          }

          return (
            <React.Fragment key={stepNumber}>
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  className={cn(circleClasses, canClick ? 'cursor-pointer hover:scale-[1.03]' : 'cursor-default')}
                  aria-current={isCurrent ? 'step' : undefined}
                  onClick={() => canClick && onStepClick?.(i)}
                >
                  {content}
                </button>
                <button
                  type="button"
                  className={cn(
                    'mt-2 text-xs text-center max-w-24 leading-tight',
                    isCurrent ? 'text-primary font-medium' : 'text-muted-foreground',
                    canClick ? 'cursor-pointer hover:underline' : 'cursor-default'
                  )}
                  onClick={() => canClick && onStepClick?.(i)}
                >
                  {stepLabels[i]}
                </button>
              </div>

              {stepNumber < totalSteps && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-2 transition-all duration-300',
                    isCompleted ? 'bg-primary' : 'bg-muted-foreground/20'
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
