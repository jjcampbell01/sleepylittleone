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

          {/* Large Sarah Photo */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-lg">
              <img 
                src="/lovable-uploads/bddc8f7c-e9b1-46c6-aa7a-541170d3647f.png" 
                alt="Sarah Williams - Founder of Sleepy Little One"
                className="w-full h-auto rounded-2xl shadow-soft"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};