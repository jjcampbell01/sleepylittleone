import { SEO } from "@/components/SEO";
import { StructuredData } from "@/components/StructuredData";

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="About Sleepy Little One"
        description="Learn about Sleepy Little One’s gentle, science-backed approach to baby sleep."
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

      <main className="max-w-4xl mx-auto px-6 py-16">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">About Sleepy Little One</h1>
          <p className="mt-4 text-muted-foreground">
            We help exhausted parents transform their baby’s sleep with gentle, research-backed methods that
            respect attachment and your family’s values.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Our Approach</h2>
          <p className="text-muted-foreground">
            No cry-it-out. No harsh schedules. Just a structured, compassionate framework that works with your
            baby’s biology. Parents typically see big improvements in 3–7 days.
          </p>
        </section>

        <section id="founder" className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">Meet Sarah</h2>
          <p className="text-muted-foreground">
            Sarah is the creator of the Sleepy Little One method and a passionate advocate for responsive sleep
            support. She blends the latest sleep science with practical, judgment-free coaching.
          </p>
        </section>
      </main>
    </div>
  );
};

export default AboutPage;
