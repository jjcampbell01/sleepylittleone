import { Brain, Heart, Shield, Zap } from "lucide-react";
import scienceImage from "@/assets/science-sleep.jpg";

export const SolutionSection = () => {
  return (
    <section className="py-20 bg-gradient-calm">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            The Sleepy Little One Method™
            <span className="text-primary block">Triple-Alignment Framework</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
            Unlike other approaches that focus on behavior modification, our method addresses 
            the three biological sleep systems that must work in harmony for lasting results.
          </p>
        </div>

        {/* Hero Image */}
        <div className="relative mb-16 rounded-3xl overflow-hidden shadow-floating">
          <img 
            src={scienceImage} 
            alt="The science of baby sleep" 
            className="w-full h-64 md:h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-hero/20 flex items-center justify-center">
            <div className="text-center text-primary-foreground">
              <h3 className="text-3xl font-bold mb-2">Science-Backed</h3>
              <p className="text-lg">Evidence-based sleep solutions</p>
            </div>
          </div>
        </div>

        {/* Three Systems */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-card p-8 rounded-2xl shadow-soft border border-border/50 hover:shadow-floating transition-all duration-300 group">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Brain className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold text-card-foreground mb-4">
              Neurological System
            </h3>
            <p className="text-muted-foreground mb-4">
              Your baby's brain architecture and sleep patterns. We optimize neural pathways 
              for natural, restorative sleep cycles.
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Circadian rhythm alignment</li>
              <li>• Sleep pressure optimization</li>
              <li>• Neural pathway strengthening</li>
            </ul>
          </div>

          <div className="bg-card p-8 rounded-2xl shadow-soft border border-border/50 hover:shadow-floating transition-all duration-300 group">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold text-card-foreground mb-4">
              Emotional System
            </h3>
            <p className="text-muted-foreground mb-4">
              Building secure attachment while fostering independence. No cry-it-out methods—
              just gentle, responsive techniques.
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Secure attachment building</li>
              <li>• Emotional regulation skills</li>
              <li>• Parent-child connection</li>
            </ul>
          </div>

          <div className="bg-card p-8 rounded-2xl shadow-soft border border-border/50 hover:shadow-floating transition-all duration-300 group">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold text-card-foreground mb-4">
              Environmental System
            </h3>
            <p className="text-muted-foreground mb-4">
              Creating the optimal sleep environment that supports your baby's natural 
              sleep architecture.
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Room optimization</li>
              <li>• Routine establishment</li>
              <li>• Sleep cue development</li>
            </ul>
          </div>
        </div>

        {/* Why It Works */}
        <div className="bg-accent/30 p-8 rounded-2xl">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Why This Works When Other Methods Fail
              </h3>
              <p className="text-muted-foreground mb-4">
                Most sleep training focuses on just one system—usually behavior modification. 
                But sustainable sleep requires all three systems working together. When they're 
                aligned, sleep becomes natural and effortless.
              </p>
              <p className="text-foreground font-medium">
                Result: Your baby sleeps through the night because their body wants to, 
                not because they've given up trying to get their needs met.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};