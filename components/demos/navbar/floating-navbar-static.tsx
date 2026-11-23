"use client";

import * as React from "react";
import { Github } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FloatingNavbar } from "@/components/dusk/navbar/floating-navbar";

const links = [
  { label: "Docs", href: "#docs" },
  { label: "Components", href: "#components" },
  { label: "Showcase", href: "#showcase" },
];

export default function FloatingNavbarStaticDemo() {
  return (
    <div className="w-full">
      <FloatingNavbar
        hideOnScroll={false}
        className="static"
        links={links}
        defaultActiveHref="#components"
        onNavigate={(_, event) => event.preventDefault()}
        logo={<span className="font-semibold tracking-tight">dusk.ui</span>}
        actions={
          <Button variant="ghost" size="icon-sm" aria-label="GitHub">
            <Github />
          </Button>
        }
      />
    </div>
  );
}
