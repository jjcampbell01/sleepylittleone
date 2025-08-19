// src/components/MainNav.tsx
"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

// Optional: centralize your links here
const links = [
  { href: "/", label: "Home" },
  { href: "/sleep-planner", label: "Sleep Planner" },
  { href: "/guides", label: "Guides" },
  { href: "/contact", label: "Contact" },
];

export default function MainNav() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {links.map((l) => (
          <NavigationMenuItem key={l.href}>
            <Link href={l.href} legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                {l.label}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
