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
          <h2 className="text-2xl font-semibold">
            Meet Sarah Williams
            <span className="text-primary block text-xl font-normal mt-2">
              Once a Sleepless Mom — Now a Trusted Baby Sleep Specialist
            </span>
          </h2>
          <p className="text-muted-foreground">
            Three years ago, I was exactly where you are now. My daughter Lily hadn't
            slept through the night in 14 months. I was running on 3 hours of broken
            sleep, my marriage was strained, and I felt like I was failing as a mother.
          </p>
          <p className="text-muted-foreground">
            After trying every method out there—and failing—I dove deep into sleep
            science research. I discovered that most approaches only address behavior,
            not the underlying biological systems that control sleep.
          </p>
          <p className="text-foreground font-semibold">
            That's when I developed the Triple-Alignment Framework. Within one week,
            Lily was sleeping 12 hours straight. Within two weeks, our entire family
            was transformed.
          </p>
          <p className="text-muted-foreground">
            Since then, I've helped over 10,000 families achieve the same results—without
            cry-it-out methods, without breaking attachment bonds, and without compromising
            your values.
          </p>
        </section>

        <section className="mt-12">
          <a
            href="https://preview--sleepylittleone.lovable.app/sleep-quiz"
            className="underline text-primary"
          >
            Take the 60-second Sleep Quiz →
          </a>
        </section>
      </main>
    </div>
  );
};

export default AboutPage;
