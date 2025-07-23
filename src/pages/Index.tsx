import { HeroSection } from "@/components/HeroSection";
import { ProblemSection } from "@/components/ProblemSection";
import { SolutionSection } from "@/components/SolutionSection";
import { VideoSection } from "@/components/VideoSection";
import { TransformationSection } from "@/components/TransformationSection";
import { FounderSection } from "@/components/FounderSection";
import { PricingSection } from "@/components/PricingSection";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <VideoSection />
      <TransformationSection />
      <FounderSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;