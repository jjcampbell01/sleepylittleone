import { HeroSection } from "@/components/HeroSection";
import { ProblemSection } from "@/components/ProblemSection";
import { SolutionSection } from "@/components/SolutionSection";
import { VideoSection } from "@/components/VideoSection";
import { TransformationSection } from "@/components/TransformationSection";
import { FounderSection } from "@/components/FounderSection";
import { LeadMagnetForm } from "@/components/LeadMagnetForm";
import { PricingSection } from "@/components/PricingSection";
import { CTASection } from "@/components/CTASection";
import { HomeFAQSection } from "@/components/HomeFAQSection";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { OrganizationStructuredData, WebSiteStructuredData } from "@/components/StructuredData";
import { StickyQuizBanner } from "@/components/StickyQuizBanner";
import { ExitIntentPopup } from "@/components/ExitIntentPopup";

const Index = () => {
  return (
    <div className="min-h-screen">
      <SEO 
        title="Sleepy Little One | Baby Sleep Without Tears"
        description="Finally a baby sleep solution that works. No cry-it-out. Learn the Sleepy Little One method that transforms nights in just a few days."
        canonical="https://www.sleepylittleone.com"
      />
      <OrganizationStructuredData />
      <WebSiteStructuredData />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <VideoSection />
      <TransformationSection />
      <FounderSection />
      <LeadMagnetForm />
      <PricingSection />
      <CTASection />
      <HomeFAQSection />
      <Footer />
      <StickyQuizBanner />
      <ExitIntentPopup />
    </div>
  );
};

export default Index;