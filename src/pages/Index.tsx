import { HeroSection } from "@/components/HeroSection";
import { ProblemSection } from "@/components/ProblemSection";
import { TransformationSection } from "@/components/TransformationSection";
import { SolutionSection } from "@/components/SolutionSection";
import { VideoSection } from "@/components/VideoSection";
import { ProgramSection } from "@/components/ProgramSection";
import { FounderSection } from "@/components/FounderSection";
import { PricingSection } from "@/components/PricingSection";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <ProblemSection />
      <TransformationSection />
      <SolutionSection />
      <VideoSection />
      <ProgramSection />
      <FounderSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
