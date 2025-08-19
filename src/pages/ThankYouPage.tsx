import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Download, Home, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";

const ThankYouPage = () => {
  const pdfUrl = "https://drive.google.com/file/d/1HXD_eSvfSwvXhs3_GT0KXuEc0YFYECVl/view?usp=sharing";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
      <SEO 
        title="Thank You - Your Free Sleep Guide | Sleepy Little One"
        description="Thank you for downloading our free baby sleep guide. Get instant access to '5 Steps to Help Your Baby Sleep 10–12 Hours in Their Crib'."
        canonical="https://www.sleepylittleone.com/thank-you"
      />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full mb-8">
            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>

          {/* Main Content */}
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Thank You!
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8">
            Your free sleep guide is ready for download. Get instant access to:
          </p>

          {/* Guide Details */}
          <Card className="shadow-floating border-border/50 mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">
                "5 Steps to Help Your Baby Sleep 10–12 Hours in Their Crib"
              </CardTitle>
              <CardDescription className="text-lg">
                (Without Tears or Stress)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-left space-y-2 max-w-md mx-auto">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Gentle, no-cry sleep methods</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Step-by-step implementation guide</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Age-appropriate sleep strategies</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Troubleshooting common sleep issues</span>
                </div>
              </div>
              
              {/* Download Button */}
              <div className="pt-6">
                <Button 
                  asChild 
                  size="lg" 
                  variant="cta" 
                  className="gap-2"
                >
                  <a 
                    href={pdfUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Download className="h-5 w-5" />
                    Download Your Free Guide Now
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <div className="space-y-6">
            <div className="bg-accent/30 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-3">
                Next Best Step
              </h2>
              <p className="text-muted-foreground mb-4">
                Now that you’ve got the guide, get your personalized plan in 60 seconds.
              </p>
              <Button asChild variant="cta" className="gap-2">
                <Link to="/sleep-planner">
                  Plan My Baby’s Sleep
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="bg-accent/30 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-3">
                What's Next?
              </h2>
              <p className="text-muted-foreground mb-4">
                Ready to take your baby's sleep to the next level? Our complete program includes personalized support and advanced strategies.
              </p>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => window.open('https://buy.stripe.com/14AfZj2SF0pi6ml9jCc7u00', '_blank')}
              >
                View Our Complete Program
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="ghost" className="gap-2">
                <Link to="/">
                  <Home className="h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Having trouble accessing your guide? Contact us at{" "}
              <a 
                href="mailto:support@sleepylittleone.com" 
                className="text-primary hover:underline"
              >
                support@sleepylittleone.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;