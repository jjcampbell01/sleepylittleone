import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Share2, ArrowRight, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

interface QuizResultProps {
  resultType: string;
  userName: string;
}

const resultData = {
  "nap-fighter": {
    title: "The Nap Fighter 💤",
    emoji: "💤",
    summary: "Based on your answers, your baby may be overtired or under-stimulated at nap time — leading to short naps, fussiness, or skipped naps altogether.",
    tips: [
      "Extend wake windows by 10–15 minutes",
      "Cap the last nap to protect bedtime", 
      "Use a consistent pre-nap routine to cue sleepiness"
    ],
    ctaText: "Struggling with naps is common — but fixable. Our course Understanding Naps inside Sleepy Little One walks you step-by-step through nap transitions, routines, and rescue techniques."
  },
  "frequent-waker": {
    title: "The Frequent Waker 🌙",
    emoji: "🌙", 
    summary: "Your baby is waking multiple times a night — often due to sleep associations, overtiredness, or feeding habits that interrupt deep sleep.",
    tips: [
      "Focus on a calm, consistent bedtime routine",
      "Look for signs of overtiredness before bed",
      "Support your baby to fall asleep in their crib without props"
    ],
    ctaText: "Inside Sleepy Little One, we teach you how to reduce night wakings gently — without harsh methods or sleep deprivation."
  },
  "early-riser": {
    title: "The Early Riser 🌅", 
    emoji: "🌅",
    summary: "Waking up before 6 a.m. is often caused by too-early bedtimes, short naps, or too much light/noise in the early morning.",
    tips: [
      "Cap the last nap and adjust bedtime",
      "Use blackout curtains + white noise",
      "Delay your response by a few minutes to encourage self-settling"
    ],
    ctaText: "We'll help you gently shift your baby's sleep rhythm without chaos. You'll learn exactly how inside our Early Waking module."
  },
  "confused-routine": {
    title: "The Confused Routine Baby 😵",
    emoji: "😵",
    summary: "When naps are inconsistent, bedtimes unpredictable, and wake-ups all over the place, your baby may be missing the rhythm they need to sleep well.",
    tips: [
      "Start with a consistent wake-up time each day", 
      "Focus on one nap \"anchor\"",
      "Use visual cues for sleep/wake transitions"
    ],
    ctaText: "The Sleepy Little One course gives you the exact daily rhythm and transitions to get your baby sleeping better in just a few days."
  },
  "sensitive-soul": {
    title: "The Sensitive Soul 🐣",
    emoji: "🐣",
    summary: "You're likely a responsive, thoughtful parent — and your baby may be more sensitive to change or separation. You need a gentle, trust-based approach.",
    tips: [
      "Keep routines predictable and soothing",
      "Use gradual changes, not abrupt ones", 
      "Build confidence by responding consistently"
    ],
    ctaText: "Sleepy Little One is built for sensitive babies and responsive parents. No harsh methods — just clear steps, real results, and a whole lot of grace."
  }
};

export const QuizResult = ({ resultType, userName }: QuizResultProps) => {
  const { toast } = useToast();
  const result = resultData[resultType as keyof typeof resultData];
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showDelayedMessage, setShowDelayedMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasInteracted) {
        setShowDelayedMessage(true);
      }
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, [hasInteracted]);

  if (!result) {
    return <div>Result not found</div>;
  }

  const handleCTAClick = () => {
    setHasInteracted(true);
  };

  const handleShare = async () => {
    const shareText = `I just discovered my baby is "${result.title}"! Take the Sleepy Little One quiz to find your baby's sleep type.`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Baby Sleep Quiz Result',
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        // Fallback to clipboard
        await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        toast({
          title: "Link copied!",
          description: "Share this with other parents who need better sleep.",
        });
      }
    } else {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      toast({
        title: "Link copied!",
        description: "Share this with other parents who need better sleep.",
      });
    }
  };

  const handlePurchase = () => {
    window.open('https://buy.stripe.com/14AfZj2SF0pi6ml9jCc7u00', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-background p-4">
      <div className="max-w-2xl mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{result.emoji}</div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Hey {userName}!
          </h1>
          <h2 className="text-2xl font-semibold text-primary">
            {result.title}
          </h2>
        </div>

        {/* Result Summary */}
        <Card className="p-8 shadow-soft border-border/50 bg-card/80 backdrop-blur-sm mb-6">
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            {result.summary}
          </p>

          <h3 className="text-xl font-semibold mb-4 text-foreground">
            Your 3-Step Action Plan:
          </h3>
          <div className="space-y-3 mb-6">
            {result.tips.map((tip, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">
                  {index + 1}
                </div>
                <p className="text-foreground">{tip}</p>
              </div>
            ))}
          </div>

          {/* Share buttons */}
          <div className="flex gap-3 justify-center border-t border-border pt-6">
            <Button variant="outline" onClick={handleShare} className="gap-2">
              <Share2 className="h-4 w-4" />
              Share Result
            </Button>
          </div>
        </Card>

        {/* CTA Section */}
        <Card className="p-8 shadow-soft border-border/50 bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="text-center space-y-6">
            <h3 className="text-2xl font-semibold text-foreground">
              Ready for Better Sleep?
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {result.ctaText}
            </p>
            
            {/* Primary CTA */}
            <div className="space-y-4">
              <Link to="/courses" onClick={handleCTAClick}>
                <Button 
                  variant="cta" 
                  size="lg" 
                  className="text-lg px-8 py-4 w-full sm:w-auto gap-2"
                >
                  🎯 Get Your Full Sleep Plan – $197
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              
              {/* Secondary CTA */}
              <div>
                <Link to="/" onClick={handleCTAClick}>
                  <Button 
                    variant="gentle" 
                    size="lg" 
                    className="gap-2 w-full sm:w-auto"
                  >
                    🧭 Learn more about Sleepy Little One
                    <Home className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">
              30-day money-back guarantee • Gentle, proven methods
            </p>
          </div>
        </Card>

        {/* Delayed Message */}
        {showDelayedMessage && (
          <Card className="p-6 shadow-soft border-border/30 bg-accent/5 mt-6 animate-fade-in">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                Want to learn more? You can explore the rest of Sleepy Little One here.
              </p>
              <Link to="/" onClick={handleCTAClick}>
                <Button variant="outline" className="gap-2">
                  👉 Visit Main Site
                </Button>
              </Link>
            </div>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center mt-8 pb-8">
          <p className="text-sm text-muted-foreground">
            Want to help other parents? Share your result and help them find their baby's sleep solution too!
          </p>
        </div>
      </div>
    </div>
  );
};