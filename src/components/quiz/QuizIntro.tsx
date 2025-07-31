import { Button } from "@/components/ui/button";

interface QuizIntroProps {
  onStart: () => void;
}

export const QuizIntro = ({ onStart }: QuizIntroProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-background flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Decorative checkerboard pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-12 gap-1 h-full">
            {Array.from({ length: 144 }, (_, i) => (
              <div
                key={i}
                className={`${
                  (Math.floor(i / 12) + i) % 2 === 0 ? 'bg-primary' : 'bg-secondary'
                } rounded-sm`}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              Why Isn't Your Baby Sleeping Through the Night Yet?
            </h1>
            <p className="text-xl text-muted-foreground max-w-xl mx-auto">
              Take this 60-second quiz to uncover what's disrupting your baby's sleep — and get a custom 3-step plan to fix it.
            </p>
          </div>

          <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-3xl p-8 shadow-soft max-w-lg mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              Let's find out what's really going on with your baby's sleep.
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              This quick quiz will help you understand your baby's unique sleep challenges — and how to fix them gently, without overwhelm.
            </p>
            <Button 
              onClick={onStart}
              size="lg" 
              variant="cta" 
              className="w-full text-lg"
            >
              → Start the Quiz
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};