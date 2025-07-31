import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface QuizStepProps {
  currentStep: number;
  totalSteps: number;
  question: string;
  options: string[];
  selectedOptions: string[];
  onOptionSelect: (option: string) => void;
  onNext: () => void;
  onBack: () => void;
  isMultiSelect?: boolean;
  canProceed: boolean;
}

export const QuizStep = ({
  currentStep,
  totalSteps,
  question,
  options,
  selectedOptions,
  onOptionSelect,
  onNext,
  onBack,
  isMultiSelect = false,
  canProceed
}: QuizStepProps) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-background flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto w-full">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">
              Question {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question card */}
        <Card className="p-8 shadow-soft border-border/50 bg-card/80 backdrop-blur-sm">
          <h2 className="text-2xl font-semibold mb-8 text-foreground leading-relaxed">
            {question}
          </h2>

          <div className="space-y-3 mb-8">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => onOptionSelect(option)}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 hover:scale-[1.02] ${
                  selectedOptions.includes(option)
                    ? 'border-primary bg-primary/10 text-primary font-medium'
                    : 'border-border bg-background hover:border-primary/50 hover:bg-accent/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {selectedOptions.includes(option) && (
                    <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {isMultiSelect && (
            <p className="text-sm text-muted-foreground mb-6 text-center">
              You can select up to 2 options
            </p>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={onBack}
              className="gap-2"
              disabled={currentStep === 1}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            <Button
              onClick={onNext}
              disabled={!canProceed}
              variant="cta"
              className="gap-2"
            >
              {currentStep === totalSteps ? 'Get My Results' : 'Next'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};