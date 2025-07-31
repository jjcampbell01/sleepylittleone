import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { StructuredData } from "@/components/StructuredData";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const faqData = [
  {
    question: "Will this work without letting my baby cry for hours?",
    answer: "Absolutely! The Sleepy Little One method is designed to be gentle and responsive. We don't use traditional cry-it-out approaches. Instead, you'll learn how to help your baby develop healthy sleep skills while staying connected and nurturing throughout the process."
  },
  {
    question: "Is this approach right for sensitive babies?",
    answer: "Yes! This program includes specialized tools and modifications specifically for sensitive, spirited, or high-needs babies. We understand that every baby is unique, and the course provides temperament-specific strategies to ensure success for even the most sensitive little ones."
  },
  {
    question: "What age is this course for?",
    answer: "The Sleepy Little One method is designed for babies aged 5-24 months. The techniques are adapted and customized based on your baby's developmental stage, ensuring age-appropriate strategies that work with your baby's natural sleep patterns."
  }
];

export const HomeFAQSection = () => {
  const structuredFAQData = {
    mainEntity: faqData.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };

  return (
    <>
      <StructuredData type="FAQPage" data={structuredFAQData} />
      <section className="py-16 bg-gradient-to-b from-soft via-soft/50 to-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Quick Answers to Common Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Get instant clarity on how our gentle approach works
            </p>
          </div>
          
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 shadow-soft overflow-hidden">
            <Accordion type="single" collapsible className="w-full">
              {faqData.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-border/30">
                  <AccordionTrigger className="px-6 py-4 text-left font-semibold text-foreground hover:text-primary hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          
          <div className="text-center mt-8">
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link to="/faq">
                View All Questions
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};