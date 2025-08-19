import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const SleepPlannerCTA = () => {
  return (
    <div className="text-center my-16">
      <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-6">
        See your baby's #1 sleep blocker.
      </h3>
      <a href="/sleep-planner">
        <Button size="lg" className="group">
          Start Free Sleep Planner
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </a>
    </div>
  );
};
