import { SEO } from "@/components/SEO";
import { StructuredData } from "@/components/StructuredData";

const TermsPage = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Terms of Service | Sleepy Little One"
        description="Read the Sleepy Little One Terms of Service covering usage, payments, and refunds."
        canonical="https://www.sleepylittleone.com/terms"
        keywords="Sleepy Little One terms of service, refunds, payments"
      />

      <StructuredData
        type="BreadcrumbList"
        data={{
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.sleepylittleone.com" },
            { "@type": "ListItem", position: 2, name: "Terms of Service", item: "https://www.sleepylittleone.com/terms" }
          ]
        }}
      />

      <main className="max-w-3xl mx-auto px-6 py-16">
        <article className="prose prose-neutral dark:prose-invert">
          <header>
            <h1>Terms of Service</h1>
            <p className="text-muted-foreground">Effective date: 2025-01-01</p>
          </header>

          <h2>Overview</h2>
          <p>
            By accessing or using Sleepy Little One, you agree to these Terms. If you do not agree, please do not use
            our services.
          </p>

          <h2>Payments</h2>
          <p>Payments are processed securely by our payment partners. Taxes may apply based on your location.</p>

          <h2 id="refunds">Refunds</h2>
          <p>
            We want you to be satisfied. If you’re not, contact us within 14 days of purchase at
            {" "}
            <a href="mailto:support@sleepylittleone.com">support@sleepylittleone.com</a>
            {" "}
            and we’ll review your request.
          </p>

          <h2>Disclaimers</h2>
          <p>
            Our content is educational and not medical advice. Always consult your pediatrician for medical concerns.
          </p>

          <h2>Contact</h2>
          <p>Questions about these Terms? Email support@sleepylittleone.com.</p>
        </article>
      </main>
    </div>
  );
};

export default TermsPage;
