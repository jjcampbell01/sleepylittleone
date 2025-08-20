import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Moon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const ExitIntentPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const sessionFlag = sessionStorage.getItem("exitIntentPopupShown");
    if (sessionFlag) {
      setHasShown(true);
      return;
    }

    const showPopup = () => {
      setIsOpen(true);
      setHasShown(true);
      sessionStorage.setItem("exitIntentPopupShown", "true");
    };

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0 && scrollTop / docHeight >= 0.5 && !hasShown) {
        showPopup();
        clearTimeout(timer);
        window.removeEventListener("scroll", handleScroll);
      }
    };

    const timer = setTimeout(() => {
      if (!hasShown) {
        showPopup();
        window.removeEventListener("scroll", handleScroll);
      }
    }, 35000);

    window.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasShown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !email.trim()) {
      toast({
        title: "Please fill in all fields",
        description: "Both name and email are required.",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("lead_captures").insert([
        {
          first_name: firstName.trim(),
          email: email.toLowerCase().trim(),
        },
      ]);

      if (error) throw error;

      navigate("/thank-you");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md mx-auto bg-gradient-to-br from-background to-accent/20 border-primary/20">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="text-center space-y-6 p-2">
          <div className="text-6xl mb-4">
            <Moon className="w-16 h-16 mx-auto text-primary animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Not ready yet? Grab the Free 5-Step Baby Sleep Guide.
          </h2>
          <p className="text-muted-foreground">
            A quick checklist to start seeing longer stretches tonight.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <Label htmlFor="firstName" className="sr-only">
                Name
              </Label>
              <Input
                id="firstName"
                type="text"
                placeholder="Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
            <div>
              <Label htmlFor="email" className="sr-only">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              size="lg"
              variant="cta"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Me the Free Guide"}
            </Button>
            <Button
              onClick={() => setIsOpen(false)}
              type="button"
              variant="ghost"
              size="sm"
              className="w-full text-muted-foreground"
            >
              No thanks
            </Button>
          </form>

          <p className="text-xs text-muted-foreground">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

