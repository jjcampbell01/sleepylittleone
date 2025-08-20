import { Button } from "@/components/ui/button";
import { ArrowRight, Moon, Star, Shield } from "lucide-react";
import heroBaby from "@/assets/hero-baby-sleep.jpg";
import heroBabyMobile from "@/assets/hero-baby-mobile.jpg";
export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBaby} 
          alt="Peaceful sleeping baby" 
          className="hidden md:block w-full h-full object-cover object-center"
        />
        <img 
          src={heroBabyMobile} 
          alt="Peaceful sleeping baby" 
          className="md:hidden w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/50 md:bg-black/60"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-transparent to-primary/30"></div>
      </div>

      {/* Floating Elements - Hidden on mobile */}
      <div className="absolute top-20 left-10 animate-pulse opacity-30 hidden md:block">
        <Moon className="w-8 h-8 text-primary-foreground" />
      </div>
      <div className="absolute top-32 right-20 animate-pulse opacity-20 delay-1000 hidden md:block">
        <Star className="w-6 h-6 text-primary-foreground" />
      </div>
      <div className="absolute bottom-40 left-20 animate-pulse opacity-25 delay-500 hidden sm:block">
        <Star className="w-4 h-4 text-primary-foreground" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className="space-y-6 animate-fade-in">
<h1 className="text-5xl lg:text-7xl font-bold leading-tight">
  <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-purple-300 bg-clip-text text-transparent drop-shadow-2xl">
    Plan Your Baby’s Sleep Tonight.
  </span>
</h1>

<p className="text-xl lg:text-2xl text-white/95 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
  Create your baby's custom sleep schedule in minutes with our free Sleep Planner —
  based on the Sleepy Little One Method™.
</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <a href="/sleep-planner">
              <Button
                size="xl"
                variant="cta"
                className="text-lg group"
              >
                <strong>Plan My Baby's Sleep (Free)</strong>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
            <a
              href="https://buy.stripe.com/14AfZj2SF0pi6ml9jCc7u00"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="xl"
                variant="gentle"
                className="text-lg group bg-white/90 text-primary hover:bg-white"
              >
                <strong>Get Instant Access — $197</strong>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
          </div>
          <div className="pt-4 flex justify-center">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white/90">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">3-Day Money Back Guarantee</span>
            </div>
          </div>

          <div className="pt-4 text-center">
            <p className="text-white/90 text-base md:text-lg drop-shadow-lg">
              ⭐ Over 10,000 families sleeping better
            </p>
          </div>
          <div className="pt-4 text-white/80 text-sm drop-shadow-lg">
            <p>Works for babies 5 months - 2 years</p>
          </div>

        </div>

        {/* Planner CTA Section */}
        <div className="mt-12 p-6 bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-2xl max-w-2xl mx-auto shadow-glow">
          <div className="text-center space-y-4">
            <h3 className="text-white text-xl font-semibold">
              Want a personalized plan?
            </h3>
            <p className="text-white/90">
              Use our free Sleep Planner to get age-specific wake windows and gentle routines.
            </p>
            <a href="/sleep-planner">
              <Button
                size="lg"
                variant="gentle"
                className="text-lg group bg-white/90 text-primary hover:bg-white"
              >
                <strong>Plan My Baby's Sleep</strong>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/40 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};