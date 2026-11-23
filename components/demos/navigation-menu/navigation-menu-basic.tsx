"use client";

import * as React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const components = [
  { title: "Dialog", href: "#dialog", description: "A window overlaid on the page that traps focus." },
  { title: "Hover Card", href: "#hover-card", description: "Preview content behind a link on hover." },
  { title: "Progress", href: "#progress", description: "Shows how far along a task is." },
  { title: "Tabs", href: "#tabs", description: "Layered panels shown one at a time." },
];

function ListItem({ title, href, children }: { title: string; href: string; children: React.ReactNode }) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a href={href}>
          <span className="text-sm font-medium leading-none">{title}</span>
          <span className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</span>
        </a>
      </NavigationMenuLink>
    </li>
  );
}

export default function NavigationMenuBasicDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-1 p-1 sm:w-[440px] sm:grid-cols-[0.8fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink
                  asChild
                  className="h-full justify-end rounded-md bg-muted/50 p-4"
                >
                  <a href="#intro">
                    <span className="text-base font-semibold">DuskUI</span>
                    <span className="text-sm leading-snug text-muted-foreground">
                      Animated components on shadcn/ui and Motion.
                    </span>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem title="Introduction" href="#introduction">
                What DuskUI is and how it fits with shadcn/ui.
              </ListItem>
              <ListItem title="Installation" href="#installation">
                Add components with the shadcn CLI.
              </ListItem>
              <ListItem title="Theming" href="#theming">
                Tokens, colors and reduced motion.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Components</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-1 p-1 sm:w-[520px] sm:grid-cols-2">
              {components.map((component) => (
                <ListItem key={component.title} title={component.title} href={component.href}>
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <a href="#docs">Docs</a>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuIndicator />
      </NavigationMenuList>
    </NavigationMenu>
  );
}
