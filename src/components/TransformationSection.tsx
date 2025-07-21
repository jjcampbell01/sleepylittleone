import { Star, Heart, CheckCircle } from "lucide-react";
import testimonialBg from "@/assets/testimonial-bg.jpg";

export const TransformationSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Imagine This Instead...
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real families, real transformations. Here's what life looks like after 
            implementing the Sleepy Little One Method™.
          </p>
        </div>

        {/* Main Testimonial */}
        <div className="relative bg-card rounded-3xl overflow-hidden shadow-floating mb-12">
          <div className="absolute inset-0 z-0">
            <img 
              src={testimonialBg} 
              alt="Happy mother with sleeping baby" 
              className="w-full h-full object-cover opacity-20"
            />
          </div>
          <div className="relative z-10 p-12 bg-gradient-trust/80">
            <div className="flex items-center mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-500 fill-current" />
              ))}
            </div>
            <blockquote className="text-2xl text-foreground mb-6 leading-relaxed">
              "In just 7 days, Emma went from waking up 6+ times a night to sleeping 
              11 hours straight. I actually had to check if she was breathing the first 
              time it happened! Now our whole family is happier, healthier, and I feel 
              like myself again."
            </blockquote>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Jessica M.</p>
                <p className="text-sm text-muted-foreground">Mother of 8-month-old Emma</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-2xl shadow-soft border border-border/50">
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
              ))}
            </div>
            <p className="text-foreground mb-4">
              "Finally slept 8 hours straight for the first time in 10 months!"
            </p>
            <p className="text-sm text-muted-foreground">— Maria K.</p>
          </div>

          <div className="bg-card p-6 rounded-2xl shadow-soft border border-border/50">
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
              ))}
            </div>
            <p className="text-foreground mb-4">
              "No more 2 AM battles. Lucas sleeps from 7 PM to 6 AM consistently."
            </p>
            <p className="text-sm text-muted-foreground">— David & Amy R.</p>
          </div>

          <div className="bg-card p-6 rounded-2xl shadow-soft border border-border/50">
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
              ))}
            </div>
            <p className="text-foreground mb-4">
              "Gentle method that actually works. No crying, just peaceful sleep."
            </p>
            <p className="text-sm text-muted-foreground">— Sarah L.</p>
          </div>
        </div>

        {/* Benefits List */}
        <div className="mt-16 bg-gradient-calm p-8 rounded-2xl">
          <h3 className="text-2xl font-semibold text-foreground text-center mb-8">
            What Families Experience After Just One Week:
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "12-hour nights of uninterrupted sleep",
              "Faster bedtime routines (15 minutes vs 2 hours)",
              "No more middle-of-the-night battles",
              "Better mood and energy for the whole family",
              "Consistent nap schedules that actually work",
              "Confidence in your parenting abilities"
            ].map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
                <span className="text-foreground">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};