import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Moon } from "lucide-react";

export const ExitIntentPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse leaves from the top of the page and hasn't shown before
      if (e.clientY <= 0 && !hasShown && !isOpen) {
        setIsOpen(true);
        setHasShown(true);
      }
    };

    // Only add the listener after user has been on page for at least 10 seconds
    timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
    }, 10000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hasShown, isOpen]);

  const handleTakeQuiz = () => {
    setIsOpen(false);
    window.location.href = '/sleep-quiz';
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md mx-auto bg-gradient-to-br from-background to-accent/20 border-primary/20">
        <div className="text-center space-y-6 p-2">
          <div className="relative">
            <div className="text-6xl mb-4">
              <Moon className="w-16 h-16 mx-auto text-primary animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Wait! Before you go...
            </h2>
            <p className="text-muted-foreground">
              Discover what's really keeping your baby awake with our free 60-second quiz.
            </p>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleTakeQuiz}
              variant="cta" 
              size="lg" 
              className="w-full"
            >
              🧠 Take the Free Sleep Quiz
            </Button>
            <Button 
              onClick={() => setIsOpen(false)}
              variant="ghost" 
              size="sm"
              className="w-full text-muted-foreground"
            >
              No thanks, I'll figure it out myself
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Join 10,000+ parents who found their solution
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};