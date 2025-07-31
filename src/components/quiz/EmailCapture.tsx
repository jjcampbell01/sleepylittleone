import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";

interface EmailCaptureProps {
  onSubmit: (name: string, email: string) => void;
  isLoading?: boolean;
}

export const EmailCapture = ({ onSubmit, isLoading = false }: EmailCaptureProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim()) {
      onSubmit(name.trim(), email.trim());
    }
  };

  const isValid = name.trim().length > 0 && email.includes("@");

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-background flex items-center justify-center p-4">
      <div className="max-w-lg mx-auto w-full">
        {/* Progress indicator */}
        <div className="mb-8 text-center">
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden mb-2">
            <div className="h-full bg-primary w-full rounded-full" />
          </div>
          <span className="text-sm text-muted-foreground">Almost done!</span>
        </div>

        <Card className="p-8 shadow-soft border-border/50 bg-card/80 backdrop-blur-sm">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              Your personalized plan is ready! 🎉
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We've matched your answers to a custom sleep profile. Enter your name + email to unlock your baby's 3-step sleep improvement plan.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                First Name
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your first name"
                className="h-12 rounded-xl"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="h-12 rounded-xl"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={!isValid || isLoading}
              variant="cta"
              size="lg"
              className="w-full gap-2"
            >
              {isLoading ? 'Processing...' : '→ Show My Results'}
              {!isLoading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </Card>
      </div>
    </div>
  );
};