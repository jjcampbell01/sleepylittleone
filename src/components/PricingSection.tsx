import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Zap, Shield, Star } from "lucide-react";

export const PricingSection = () => {
  const handleEnrollClick = () => {
    window.open('https://sleepylittleone.com/store', '_blank');
  };

  return (
    <section id="pricing" className="py-20 bg-gradient-hero relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-10 left-10 opacity-20">
        <Star className="w-12 h-12 text-primary-foreground animate-pulse" />
      </div>
      <div className="absolute bottom-20 right-20 opacity-15">
        <Star className="w-8 h-8 text-primary-foreground animate-pulse delay-1000" />
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Transform Your Family's Sleep
            <span className="block text-accent/90">Starting Tonight</span>
          </h2>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
            Everything you need to get your baby sleeping through the night—
            for less than the cost of one night nanny visit.
          </p>
        </div>

        {/* Main Pricing Card */}
        <div className="bg-card/95 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-floating border border-primary-foreground/20 mb-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Zap className="w-4 h-4 mr-2" />
              Limited Time Offer
            </div>
            <h3 className="text-3xl lg:text-4xl font-bold text-card-foreground mb-2">
              The Complete Sleepy Little One Method™
            </h3>
            <div className="flex items-center justify-center space-x-4 mb-6">
              <span className="text-3xl text-muted-foreground line-through">$497</span>
              <span className="text-5xl lg:text-6xl font-bold text-primary">$197</span>
            </div>
            <p className="text-muted-foreground">One-time payment • Lifetime access • 60% savings</p>
          </div>

          {/* What's Included */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              {[
                "Complete 3-Module Video Course",
                "Triple-Alignment Framework Guide",
                "7-Day Quick-Start Sleep Plan",
                "Room Setup & Environment Guide",
                "Sleep Assessment & Tracking Tools",
                "Video Demonstrations Library"
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-card-foreground">{item}</span>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {[
                "Troubleshooting & Regression Toolkit",
                "Travel Sleep Strategy Guide",
                "Age-Progression Sleep Plans",
                "Private Parent Community Access",
                "Lifetime Updates & New Content",
                "24/7 Access on All Devices"
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-card-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Guarantee */}
          <div className="bg-accent/20 p-6 rounded-2xl mb-8 text-center">
            <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
            <h4 className="font-semibold text-card-foreground mb-2">
              3-Day Money-Back Guarantee
            </h4>
            <p className="text-sm text-muted-foreground">
              If you don't see improvement in your baby's sleep within 3 days of starting 
              the program, get a full refund. No questions asked.
            </p>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Button 
              size="xl" 
              variant="cta" 
              onClick={handleEnrollClick}
              className="text-xl px-12 py-6 group mb-4"
            >
              Get Instant Access Now - $197
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Button>
            <p className="text-sm text-muted-foreground">
              ⚡ Instant download • Works on all devices • Join 10,000+ families
            </p>
          </div>
        </div>

        {/* Value Comparison */}
        <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-6 text-center">
          <h4 className="text-lg font-semibold text-primary-foreground mb-4">
            Compare the Investment:
          </h4>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="text-primary-foreground/80">
              <strong>One Night Nanny:</strong> $200-400/night
            </div>
            <div className="text-primary-foreground/80">
              <strong>Sleep Consultant:</strong> $500-2,000
            </div>
            <div className="text-primary-foreground">
              <strong>Sleepy Little One:</strong> $197 (one-time)
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};