import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Moon, Star, UserIcon } from "lucide-react";
import heroImage from "@/assets/hero-baby-sleep.jpg";
import { AuthModal } from "@/components/AuthModal";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

export const HeroSection = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isAuthenticated } = useSupabaseAuth();

  const handleEnrollClick = () => {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSignInClick = () => {
    setShowAuthModal(true);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Peaceful sleeping baby" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-hero/40"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-pulse opacity-30">
        <Moon className="w-8 h-8 text-primary-foreground" />
      </div>
      <div className="absolute top-32 right-20 animate-pulse opacity-20 delay-1000">
        <Star className="w-6 h-6 text-primary-foreground" />
      </div>
      <div className="absolute bottom-40 left-20 animate-pulse opacity-25 delay-500">
        <Star className="w-4 h-4 text-primary-foreground" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className="space-y-6 animate-fade-in">
          <h1 className="text-5xl lg:text-7xl font-bold text-primary-foreground leading-tight">
            Finally, Sleep
            <span className="block bg-gradient-to-r from-accent/90 to-secondary/90 bg-clip-text text-transparent">
              Through the Night
            </span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
            Transform your baby's sleep (and your sanity) with the science-backed 
            <strong> Sleepy Little One Method™</strong> — no cry-it-out required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button 
              size="xl" 
              variant="cta" 
              onClick={handleEnrollClick}
              className="text-lg group"
            >
              Get Instant Access - $197
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <p className="text-primary-foreground/80 text-base md:text-lg">
              ⭐ Over 10,000 families sleeping better
            </p>
          </div>

          <div className="pt-8 text-primary-foreground/70 text-sm">
            <p>✓ 3-Day Money-Back Guarantee ✓ Works for babies 5 months - 2 years</p>
          </div>

          {/* Authentication / Course Platform Link */}
          <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
            {!isAuthenticated ? (
              <Button 
                variant="outline" 
                onClick={handleSignInClick}
                className="bg-background/10 border-primary-foreground/20 text-primary-foreground hover:bg-background/20"
              >
                <UserIcon className="w-4 h-4 mr-2" />
                Sign In to Access Courses
              </Button>
            ) : (
              <a 
                href="/courses" 
                className="text-primary-foreground/60 hover:text-primary-foreground/80 text-sm underline transition-colors"
              >
                Access Your Courses →
              </a>
            )}
            
            <a 
              href="/platform" 
              className="text-primary-foreground/60 hover:text-primary-foreground/80 text-sm underline transition-colors"
            >
              View Course Platform Demo →
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary-foreground/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary-foreground/30 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>

      {/* Authentication Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </section>
  );
};