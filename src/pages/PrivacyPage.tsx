import { SEO } from "@/components/SEO";
import { StructuredData } from "@/components/StructuredData";

const PrivacyPage = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Privacy Policy | Sleepy Little One"
        description="Read the Sleepy Little One Privacy Policy to understand how we collect, use, and protect your data."
        canonical="https://www.sleepylittleone.com/privacy"
        keywords="Sleepy Little One privacy policy, data protection, cookies"
      />

      <StructuredData
        type="BreadcrumbList"
        data={{
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.sleepylittleone.com" },
            { "@type": "ListItem", position: 2, name: "Privacy Policy", item: "https://www.sleepylittleone.com/privacy" }
          ]
        }}
      />

      <main className="max-w-3xl mx-auto px-6 py-16">
        <article className="prose prose-neutral dark:prose-invert">
          <header>
            <h1>Privacy Policy</h1>
            <p className="text-muted-foreground">Effective date: 2025-01-01</p>
          </header>

          <h2>Information We Collect</h2>
          <p>
            We collect information you provide directly (like your name and email) and usage data to improve our
            services. We do not sell your personal information.
          </p>

          <h2>How We Use Information</h2>
          <p>
            We use your data to provide and improve our program, respond to inquiries, process purchases, and send
            relevant updates with your consent.
          </p>

          <h2>Cookies</h2>
          <p>
            We use cookies and similar technologies for analytics and to enhance your experience. You can control
            cookies in your browser settings.
          </p>

          <h2>Data Retention</h2>
          <p>
            We retain personal data only as long as necessary to provide our services and comply with legal
            obligations.
          </p>

          <h2>Contact</h2>
          <p>
            Questions? Email
            {" "}
            <a href="mailto:support@sleepylittleone.com">support@sleepylittleone.com</a>.
          </p>
        </article>
      </main>
    </div>
  );
};

export default PrivacyPage;
