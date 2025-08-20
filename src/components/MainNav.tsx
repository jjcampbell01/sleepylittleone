// src/components/MainNav.tsx
"use client";

import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";

// Shared navigation links
export const links = [
  { href: "/", label: "Home" },
  { href: "/sleep-planner", label: "Sleep Planner" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export default function MainNav() {
  return (
    <nav className="border-b bg-background">
      <div className="container flex h-14 items-center justify-between">
        <NavigationMenu className="hidden md:block">
          <NavigationMenuList>
            {links.map((l) => (
              <NavigationMenuItem key={l.href}>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link to={l.href}>{l.label}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-4">
              {links.map((l) => (
                <Link key={l.href} to={l.href} className="text-lg font-semibold">
                  {l.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
