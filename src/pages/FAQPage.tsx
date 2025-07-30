import { SEO } from "@/components/SEO";
import { StructuredData } from "@/components/StructuredData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FAQEntry {
  question: string;
  answer: string;
}

const FAQPage = () => {
  // Sample FAQ entries - you can replace these with your content
  const faqEntries: FAQEntry[] = [
    {
      question: "Sample Question 1",
      answer: "Sample answer content goes here. You can replace this with your actual FAQ content."
    },
    {
      question: "Sample Question 2", 
      answer: "Another sample answer. This structure allows for easy content management."
    }
  ];

  // Structured data for FAQPage schema
  const faqStructuredData = {
    mainEntity: faqEntries.map(entry => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: entry.answer
      }
    }))
  };

  return (
    <>
      <SEO
        title="Frequently Asked Questions"
        description="Get answers to common questions about gentle baby sleep methods, techniques, and the Sleepy Little One approach."
        canonical="https://www.sleepylittleone.com/faq"
      />
      
      <StructuredData
        type="FAQPage"
        data={faqStructuredData}
      />

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-muted-foreground">
              Find answers to common questions about gentle baby sleep methods
            </p>
          </div>

          <div className="space-y-6">
            {faqEntries.map((entry, index) => (
              <Card key={index} className="border shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-foreground">
                    {entry.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {entry.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQPage;