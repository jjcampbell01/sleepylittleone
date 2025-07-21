import { Clock, Coffee, AlertTriangle } from "lucide-react";

export const ProblemSection = () => {
  return (
    <section className="py-20 bg-gradient-calm">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            You're Not Alone in This 
            <span className="text-primary block">Exhausting Cycle</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Every night feels like a battle. Every morning starts with dread. 
            The sleep deprivation is affecting your relationships, your work, your health...
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-card p-8 rounded-2xl shadow-soft border border-border/50 hover:shadow-floating transition-all duration-300">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
              <Clock className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="text-xl font-semibold text-card-foreground mb-4">
              Multiple Night Wakings
            </h3>
            <p className="text-muted-foreground">
              "It's 3 AM again... and again at 4 AM... and 5:30 AM. When will this end? 
              I haven't slept more than 2 hours straight in months."
            </p>
          </div>

          <div className="bg-card p-8 rounded-2xl shadow-soft border border-border/50 hover:shadow-floating transition-all duration-300">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
              <Coffee className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="text-xl font-semibold text-card-foreground mb-4">
              Caffeine Dependence
            </h3>
            <p className="text-muted-foreground">
              "I need coffee just to function. I'm irritable with my partner, 
              can't focus at work, and feel like I'm failing as a parent."
            </p>
          </div>

          <div className="bg-card p-8 rounded-2xl shadow-soft border border-border/50 hover:shadow-floating transition-all duration-300">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="text-xl font-semibold text-card-foreground mb-4">
              Desperate for Solutions
            </h3>
            <p className="text-muted-foreground">
              "I've tried everything - white noise, blackout curtains, sleep training apps. 
              Nothing works, and I'm running out of hope."
            </p>
          </div>
        </div>

        <div className="bg-accent/30 p-8 rounded-2xl border-l-4 border-primary">
          <blockquote className="text-lg italic text-foreground mb-4">
            "The truth is, most sleep advice treats symptoms, not the root cause. 
            That's why you're stuck in this cycle of temporary fixes that never last."
          </blockquote>
          <p className="text-sm text-muted-foreground">
            — Sarah Mitchell, Certified Sleep Consultant & Creator of Sleepy Little One
          </p>
        </div>
      </div>
    </section>
  );
};