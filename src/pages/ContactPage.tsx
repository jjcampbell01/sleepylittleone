import { SEO } from "@/components/SEO";
import { StructuredData } from "@/components/StructuredData";

const ContactPage = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Contact Sleepy Little One"
        description="Get in touch with Sleepy Little One for support, questions, or media inquiries."
        canonical="https://www.sleepylittleone.com/contact"
        keywords="Contact Sleepy Little One, baby sleep support, customer support"
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
              name: "Contact",
              item: "https://www.sleepylittleone.com/contact"
            }
          ]
        }}
      />

      <main className="max-w-3xl mx-auto px-6 py-16">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Contact Sleepy Little One</h1>
          <p className="mt-4 text-muted-foreground">
            We’re here to help. Reach out and we’ll get back within 24 hours on weekdays.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Email</h2>
          <p className="text-muted-foreground">
            For support and general inquiries, email
            {" "}
            <a href="mailto:support@sleepylittleone.com" className="text-primary underline-offset-4 hover:underline">
              support@sleepylittleone.com
            </a>
            .
          </p>
        </section>

        <section className="space-y-3 mt-8">
          <h2 className="text-xl font-semibold">Response Times</h2>
          <p className="text-muted-foreground">Monday–Friday: 9am–5pm (local time)</p>
        </section>
      </main>
    </div>
  );
};

export default ContactPage;
