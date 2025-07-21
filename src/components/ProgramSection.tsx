import { BookOpen, Video, Users, CheckCircle, Clock } from "lucide-react";

export const ProgramSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            What's Inside the Program
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A comprehensive, step-by-step system designed to transform your baby's sleep 
            in just 7-14 days. Everything you need is included.
          </p>
        </div>

        {/* Program Overview */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-card p-8 rounded-2xl shadow-soft border border-border/50 hover:shadow-floating transition-all duration-300">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold text-card-foreground mb-4">
              Module 1: Foundation
            </h3>
            <p className="text-muted-foreground mb-4">
              Understanding your baby's unique sleep personality and creating the 
              optimal sleep environment.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center"><CheckCircle className="w-4 h-4 text-primary mr-2" />Sleep Assessment Quiz</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 text-primary mr-2" />Room Setup Guide</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 text-primary mr-2" />Circadian Rhythm Reset</li>
            </ul>
          </div>

          <div className="bg-card p-8 rounded-2xl shadow-soft border border-border/50 hover:shadow-floating transition-all duration-300">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Video className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold text-card-foreground mb-4">
              Module 2: Implementation
            </h3>
            <p className="text-muted-foreground mb-4">
              The gentle, proven techniques to guide your baby into independent 
              sleep without tears.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center"><CheckCircle className="w-4 h-4 text-primary mr-2" />7-Day Sleep Plan</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 text-primary mr-2" />Video Demonstrations</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 text-primary mr-2" />Troubleshooting Guide</li>
            </ul>
          </div>

          <div className="bg-card p-8 rounded-2xl shadow-soft border border-border/50 hover:shadow-floating transition-all duration-300">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold text-card-foreground mb-4">
              Module 3: Mastery
            </h3>
            <p className="text-muted-foreground mb-4">
              Long-term strategies, handling regressions, and maintaining 
              healthy sleep habits as your baby grows.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center"><CheckCircle className="w-4 h-4 text-primary mr-2" />Regression Toolkit</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 text-primary mr-2" />Travel Sleep Guide</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 text-primary mr-2" />Age-Progression Plans</li>
            </ul>
          </div>
        </div>

        {/* Bonus Materials */}
        <div className="bg-gradient-trust p-8 rounded-2xl mb-12">
          <h3 className="text-2xl font-semibold text-foreground text-center mb-8">
            Exclusive Bonus Materials (Value: $297)
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Clock className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Quick-Start Guide</h4>
                <p className="text-sm text-muted-foreground">See results in just 3 nights with our emergency sleep protocol</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Video className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Video Library</h4>
                <p className="text-sm text-muted-foreground">Over 2 hours of step-by-step video demonstrations</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <BookOpen className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Sleep Tracking Templates</h4>
                <p className="text-sm text-muted-foreground">Printable charts and digital tracking tools</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Users className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Private Community Access</h4>
                <p className="text-sm text-muted-foreground">Connect with other parents and get ongoing support</p>
              </div>
            </div>
          </div>
        </div>

        {/* Program Stats */}
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div className="bg-card p-6 rounded-2xl shadow-soft">
            <div className="text-3xl font-bold text-primary mb-2">7-14</div>
            <p className="text-sm text-muted-foreground">Days to transformation</p>
          </div>
          <div className="bg-card p-6 rounded-2xl shadow-soft">
            <div className="text-3xl font-bold text-primary mb-2">3</div>
            <p className="text-sm text-muted-foreground">Comprehensive modules</p>
          </div>
          <div className="bg-card p-6 rounded-2xl shadow-soft">
            <div className="text-3xl font-bold text-primary mb-2">2+</div>
            <p className="text-sm text-muted-foreground">Hours of video content</p>
          </div>
          <div className="bg-card p-6 rounded-2xl shadow-soft">
            <div className="text-3xl font-bold text-primary mb-2">24/7</div>
            <p className="text-sm text-muted-foreground">Lifetime access</p>
          </div>
        </div>
      </div>
    </section>
  );
};