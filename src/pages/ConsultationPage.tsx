import { SEO } from "@/components/SEO";

const ConsultationPage = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Consultation"
        description="Schedule a consultation with Sleepy Little One."
        canonical="https://www.sleepylittleone.com/consultation"
        keywords="consultation"
      />
      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold tracking-tight">Consultation</h1>
        <p className="mt-4 text-muted-foreground">Coming soon.</p>
      </main>
    </div>
  );
};

export default ConsultationPage;
