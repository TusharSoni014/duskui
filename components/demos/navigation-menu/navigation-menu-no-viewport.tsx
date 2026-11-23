"use client";

import { CircleCheck, CircleDashed, CircleDot } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export default function NavigationMenuNoViewportDemo() {
  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Status</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-48 gap-0.5">
              <li>
                <NavigationMenuLink asChild className="flex-row items-center gap-2">
                  <a href="#backlog">
                    <CircleDashed />
                    Backlog
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild className="flex-row items-center gap-2">
                  <a href="#in-progress">
                    <CircleDot />
                    In progress
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild active className="flex-row items-center gap-2">
                  <a href="#done">
                    <CircleCheck />
                    Done
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Team</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-56 gap-0.5">
              {["Design", "Engineering", "Marketing"].map((team) => (
                <li key={team}>
                  <NavigationMenuLink asChild>
                    <a href={`#${team.toLowerCase()}`}>
                      <span className="font-medium">{team}</span>
                      <span className="text-xs text-muted-foreground">View the {team.toLowerCase()} board</span>
                    </a>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
