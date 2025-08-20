import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Brain } from "lucide-react";

export const StickyQuizBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-primary to-primary-hover text-white p-4 shadow-floating animate-slide-in-right md:hidden">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Brain className="h-6 w-6 flex-shrink-0" />
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate">Not sure where to start?</p>
            <p className="text-xs opacity-90 truncate">Take the Sleep Planner</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => (window.location.href = '/sleep-planner')}
            className="text-xs font-semibold"
          >
            Take the Sleep Planner
          </Button>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};