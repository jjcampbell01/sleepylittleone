import { Heart, Award, Users } from "lucide-react";

export const FounderSection = () => {
  return (
    <section id="founder" className="py-20 bg-gradient-calm">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Meet Sarah Williams
              <span className="text-primary block text-2xl font-normal mt-2">
                Exhausted Mom Turned Sleep Expert
              </span>
            </h2>
            
            <div className="space-y-6 text-lg text-muted-foreground">
              <p>
                Three years ago, I was exactly where you are now. My daughter Lily hadn't 
                slept through the night in 14 months. I was running on 3 hours of broken 
                sleep, my marriage was strained, and I felt like I was failing as a mother.
              </p>
              
              <p>
                After trying every method out there—and failing—I dove deep into sleep 
                science research. I discovered that most approaches only address behavior, 
                not the underlying biological systems that control sleep.
              </p>
              
              <p className="text-foreground font-semibold">
                That's when I developed the Triple-Alignment Framework. Within one week, 
                Lily was sleeping 12 hours straight. Within two weeks, our entire family 
                was transformed.
              </p>
              
              <p>
                Since then, I've helped over 10,000 families achieve the same results—without 
                cry-it-out methods, without breaking attachment bonds, and without compromising 
                your values.
              </p>
            </div>

            {/* Credentials */}
            <div className="mt-8 grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground">5+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground">10,000+</div>
                <div className="text-sm text-muted-foreground">Families Helped</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground">98%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Image/Testimonial */}
          <div className="space-y-6">
            {/* Founder photo */}
            <div className="bg-card p-8 rounded-2xl shadow-soft border border-border/50">
              <div className="w-32 h-32 mx-auto mb-6 overflow-hidden rounded-full">
                <img 
                  src="/lovable-uploads/0ed837c2-2eee-4681-9a9c-5df0fbbf83ec.png" 
                  alt="Sarah Williams - Founder of Sleepy Little One"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground text-center mb-4">
                Sarah Williams
              </h3>
              <p className="text-center text-muted-foreground mb-4">
                Child Development Specialist<br />
                Mother of Two
              </p>
            </div>

            {/* Mission Statement */}
            <div className="bg-accent/30 p-6 rounded-2xl border-l-4 border-primary">
              <blockquote className="text-lg italic text-foreground mb-4">
                "My mission is simple: to help exhausted parents reclaim their nights 
                and transform their families—using gentle, science-backed methods that 
                honor the parent-child bond."
              </blockquote>
              <p className="text-sm text-muted-foreground">
                — Sarah Williams, Creator of Sleepy Little One
              </p>
            </div>

            {/* Personal Touch */}
            <div className="bg-card p-6 rounded-2xl shadow-soft">
              <h4 className="font-semibold text-card-foreground mb-3">
                Why I'm Passionate About Gentle Sleep Methods:
              </h4>
              <p className="text-muted-foreground text-sm">
                "As a mother, I understand the pressure to 'just let them cry it out.' 
                But I also know that there's a better way—one that builds trust, 
                preserves attachment, and still gets results. Every family deserves 
                peaceful nights and confident days."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};