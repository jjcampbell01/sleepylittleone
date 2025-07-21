import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Shield, Star } from "lucide-react";

export const CTASection = () => {
  const handleEnrollClick = () => {
    window.open('https://sleepylittleone.com/store', '_blank');
  };

  return (
    <section className="py-20 bg-gradient-hero relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-20 left-10 opacity-20 animate-pulse">
        <Star className="w-8 h-8 text-primary-foreground" />
      </div>
      <div className="absolute bottom-32 right-15 opacity-15 animate-pulse delay-1000">
        <Star className="w-6 h-6 text-primary-foreground" />
      </div>
      <div className="absolute top-1/2 left-20 opacity-10 animate-pulse delay-500">
        <Star className="w-4 h-4 text-primary-foreground" />
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        {/* Urgency Header */}
        <div className="inline-flex items-center bg-primary-foreground/10 backdrop-blur-sm text-primary-foreground px-6 py-3 rounded-full text-sm font-semibold mb-8">
          <Clock className="w-4 h-4 mr-2" />
          Don't Wait Another Sleepless Night
        </div>

        <h2 className="text-4xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
          Your Baby Can Sleep
          <span className="block text-accent/90">Through the Night</span>
          <span className="block text-3xl lg:text-4xl font-normal mt-2">
            Starting Tonight
          </span>
        </h2>

        <p className="text-xl lg:text-2xl text-primary-foreground/90 max-w-3xl mx-auto mb-8 leading-relaxed">
          Join thousands of families who have already transformed their nights with 
          the gentle, science-backed <strong>Sleepy Little One Method™</strong>
        </p>

        {/* Quick Benefits */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-primary-foreground/10 backdrop-blur-sm p-6 rounded-2xl border border-primary-foreground/20">
            <div className="text-2xl font-bold text-primary-foreground mb-2">7-14 Days</div>
            <p className="text-primary-foreground/80 text-sm">To complete transformation</p>
          </div>
          <div className="bg-primary-foreground/10 backdrop-blur-sm p-6 rounded-2xl border border-primary-foreground/20">
            <div className="text-2xl font-bold text-primary-foreground mb-2">No Crying</div>
            <p className="text-primary-foreground/80 text-sm">Gentle, attachment-based approach</p>
          </div>
          <div className="bg-primary-foreground/10 backdrop-blur-sm p-6 rounded-2xl border border-primary-foreground/20">
            <div className="text-2xl font-bold text-primary-foreground mb-2">98% Success</div>
            <p className="text-primary-foreground/80 text-sm">Proven results for families</p>
          </div>
        </div>

        {/* Main CTA */}
        <div className="space-y-6">
          <Button 
            size="xl" 
            variant="cta" 
            onClick={handleEnrollClick}
            className="text-2xl px-16 py-8 group shadow-floating hover:shadow-glow"
          >
            Transform Sleep Tonight - $197
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Button>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-8 text-primary-foreground/80">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              <span className="text-sm">3-Day Money-Back Guarantee</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <span className="text-sm">Instant Access</span>
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-2" />
              <span className="text-sm">10,000+ Happy Families</span>
            </div>
          </div>
        </div>

        {/* Final Motivation */}
        <div className="mt-12 bg-primary-foreground/10 backdrop-blur-sm p-8 rounded-2xl border border-primary-foreground/20">
          <p className="text-lg text-primary-foreground/90 mb-4">
            "The best time to start was yesterday. The second best time is right now."
          </p>
          <p className="text-primary-foreground/70">
            Every night you wait is another night of broken sleep for your entire family. 
            Take action today and wake up tomorrow feeling like a new parent.
          </p>
        </div>
      </div>
    </section>
  );
};