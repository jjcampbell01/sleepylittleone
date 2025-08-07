import { SEO } from "@/components/SEO";
import { StructuredData } from "@/components/StructuredData";
import { BackButton } from "@/components/ui/back-button";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Award, Users, Heart } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <SEO
        title="About Sleepy Little One"
        description="Learn about Sleepy Little One's gentle, science-backed approach to baby sleep."
        canonical="https://www.sleepylittleone.com/about"
        keywords="About Sleepy Little One, baby sleep consultant, gentle sleep training"
      />

      <StructuredData
        type="BreadcrumbList"
        data={{
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://www.sleepylittleone.com"
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "About",
              item: "https://www.sleepylittleone.com/about"
            }
          ]
        }}
      />

      {/* Hero Section with Navigation */}
      <div className="relative py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <BackButton />
          </div>
          
          <div className="text-center text-white space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              About Sleepy Little One
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              We help exhausted parents transform their baby's sleep with gentle, research-backed methods that
              respect attachment and your family's values.
            </p>
          </div>
        </div>
      </div>

      {/* Our Approach Section */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-4xl font-bold text-foreground">Our Approach</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              No cry-it-out. No harsh schedules. Just a structured, compassionate framework that works with your
              baby's biology. Parents typically see big improvements in 3–7 days.
            </p>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 bg-gradient-primary">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image Placeholder */}
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <div className="text-white/60 text-center">
                  <Users className="h-16 w-16 mx-auto mb-4" />
                  <p className="text-lg">Sarah Williams Photo</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6 text-white">
              <div>
                <h2 className="text-4xl font-bold mb-2">Meet Sarah Williams</h2>
                <p className="text-xl text-white/90">
                  Once a Sleepless Mom — Now a Trusted Baby Sleep Specialist
                </p>
              </div>

              <div className="space-y-4 text-white/90 text-lg leading-relaxed">
                <p>
                  Three years ago, I was exactly where you are now. My daughter Lily hadn't
                  slept through the night in 14 months. I was running on 3 hours of broken
                  sleep, my marriage was strained, and I felt like I was failing as a mother.
                </p>
                <p>
                  After trying every method out there—and failing—I dove deep into sleep
                  science research. I discovered that most approaches only address behavior,
                  not the underlying biological systems that control sleep.
                </p>
                <p className="text-white font-semibold text-xl">
                  That's when I developed the Triple-Alignment Framework. Within one week,
                  Lily was sleeping 12 hours straight. Within two weeks, our entire family
                  was transformed.
                </p>
                <p>
                  Since then, I've helped over 10,000 families achieve the same results—without
                  cry-it-out methods, without breaking attachment bonds, and without compromising
                  your values.
                </p>
              </div>

              {/* Credentials */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <Award className="h-8 w-8 mx-auto mb-2 text-white" />
                  <p className="font-semibold text-white">5+ Years</p>
                  <p className="text-sm text-white/80">Experience</p>
                </div>
                <div className="text-center">
                  <Users className="h-8 w-8 mx-auto mb-2 text-white" />
                  <p className="font-semibold text-white">10,000+</p>
                  <p className="text-sm text-white/80">Families Helped</p>
                </div>
                <div className="text-center">
                  <Heart className="h-8 w-8 mx-auto mb-2 text-white" />
                  <p className="font-semibold text-white">98%</p>
                  <p className="text-sm text-white/80">Success Rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="space-y-8">
            <h3 className="text-3xl font-bold text-foreground">Ready to Transform Your Family's Sleep?</h3>
            <p className="text-xl text-muted-foreground">
              Take our 60-second quiz to discover your personalized sleep plan.
            </p>
            <Button
              asChild
              variant="default"
              size="lg"
              className="bg-primary hover:bg-primary-hover text-primary-foreground px-8 py-4 text-lg shadow-soft hover:shadow-floating transition-all duration-300"
            >
              <a href="https://preview--sleepylittleone.lovable.app/sleep-quiz">
                Take the Sleep Quiz →
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;