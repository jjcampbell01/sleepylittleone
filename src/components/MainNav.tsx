// src/components/MainNav.tsx
"use client";

import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

// Shared navigation links
export const links = [
  { href: "/", label: "Home" },
  { href: "/sleep-planner", label: "Sleep Planner" },
  { href: "/guides", label: "Guides" },
  { href: "/contact", label: "Contact" },
];

export default function MainNav() {
  return (
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
  );
}
