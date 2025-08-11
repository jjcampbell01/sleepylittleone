import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressStepperProps {
  currentStep: number;
  totalSteps: number;
}

const stepLabels = [
  'Age & Context',
  'Sleep Pressure', 
  'Independent Settling',
  'Night Nutrition',
  'Environment & Consistency'
];

export function ProgressStepper({ currentStep, totalSteps }: ProgressStepperProps) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNumber = i + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <React.Fragment key={stepNumber}>
              <div className="flex flex-col items-center">
                <div className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300",
                  isCompleted 
                    ? "bg-primary border-primary text-primary-foreground" 
                    : isCurrent 
                    ? "border-primary text-primary bg-background" 
                    : "border-muted-foreground/30 text-muted-foreground"
                )}>
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{stepNumber}</span>
                  )}
                </div>
                <div className={cn(
                  "mt-2 text-xs text-center max-w-20 leading-tight",
                  isCurrent ? "text-primary font-medium" : "text-muted-foreground"
                )}>
                  {stepLabels[i]}
                </div>
              </div>
              
              {stepNumber < totalSteps && (
                <div className={cn(
                  "flex-1 h-0.5 mx-2 transition-all duration-300",
                  isCompleted ? "bg-primary" : "bg-muted-foreground/20"
                )} />
              )}
            </React.Fragment>
          );
        })}
      </div>
      
      {/* Progress bar */}
      <div className="mt-6 w-full bg-muted rounded-full h-2">
        <div 
          className="bg-gradient-primary h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
      
      <div className="mt-2 text-center text-sm text-muted-foreground">
        Step {currentStep} of {totalSteps} • {Math.round((currentStep / totalSteps) * 100)}% complete
      </div>
    </div>
  );
}