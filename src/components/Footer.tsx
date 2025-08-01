import { Heart, Instagram, Facebook, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Heart className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold">Sleepy Little One</span>
            </div>
            <p className="text-background/80 leading-relaxed">
              Helping exhausted parents transform their baby's sleep with gentle, 
              science-backed methods that honor the parent-child bond.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://instagram.com/sleepylittleone" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-background/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://facebook.com/sleepylittleone" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-background/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="mailto:support@sleepylittleone.com"
                className="w-10 h-10 bg-background/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-background/80">
              <li>
                <a 
                  href="https://buy.stripe.com/14AfZj2SF0pi6ml9jCc7u00" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  Enroll Now
                </a>
              </li>
              <li>
                <a href="#founder" className="hover:text-primary transition-colors">
                  About Sarah
                </a>
              </li>
              <li>
                <Link to="/blog" className="hover:text-primary transition-colors">
                  Sleep Blog
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Get Support</h3>
            <div className="space-y-3 text-background/80">
              <p>
                Questions about the program?<br />
                <a 
                  href="mailto:support@sleepylittleone.com" 
                  className="text-primary hover:underline"
                >
                  support@sleepylittleone.com
                </a>
              </p>
              <p className="text-sm">
                We typically respond within 24 hours
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-background/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-background/60 text-sm">
              © 2024 Sleepy Little One. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-background/60">
              <a href="#" className="hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Refund Policy
              </a>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-12 text-center">
          <p className="text-background/80 mb-4">
            Ready to transform your family's sleep?
          </p>
          <a 
            href="https://buy.stripe.com/14AfZj2SF0pi6ml9jCc7u00" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
          >
            Get Started Now
          </a>
        </div>
      </div>
    </footer>
  );
};