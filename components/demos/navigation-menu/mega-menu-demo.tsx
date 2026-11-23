"use client";

import {
  BarChart3,
  Blocks,
  BookOpen,
  Boxes,
  Building2,
  Code2,
  GraduationCap,
  LifeBuoy,
  Rocket,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { MegaMenu, type MegaMenuItem } from "@/components/dusk/navigation-menu/mega-menu";

const items: MegaMenuItem[] = [
  {
    label: "Product",
    featured: {
      eyebrow: "New",
      title: "Dusk Edge",
      description: "Deploy animated UIs to 300+ regions in one push.",
      href: "#edge",
    },
    columns: [
      {
        heading: "Platform",
        links: [
          { title: "Components", href: "#components", description: "60+ animated, accessible pieces.", icon: <Blocks /> },
          { title: "Motion engine", href: "#motion", description: "Springs, layout and gestures.", icon: <Zap /> },
          { title: "Analytics", href: "#analytics", description: "See what users interact with.", icon: <BarChart3 />, badge: "Beta" },
        ],
      },
      {
        heading: "Security",
        links: [
          { title: "Access control", href: "#access", description: "Roles, SSO and audit logs.", icon: <ShieldCheck /> },
          { title: "Integrations", href: "#integrations", description: "Connect the tools you use.", icon: <Boxes /> },
        ],
      },
    ],
  },
  {
    label: "Solutions",
    columns: [
      {
        links: [
          { title: "Startups", href: "#startups", description: "Ship a polished MVP fast.", icon: <Rocket /> },
          { title: "Enterprise", href: "#enterprise", description: "Scale with governance.", icon: <Building2 /> },
        ],
      },
      {
        links: [
          { title: "Design systems", href: "#design-systems", description: "Start from tokens, not scratch.", icon: <Sparkles /> },
          { title: "Developers", href: "#developers", description: "Typed APIs, copy-paste code.", icon: <Code2 /> },
        ],
      },
    ],
  },
  {
    label: "Resources",
    columns: [
      {
        heading: "Learn",
        links: [
          { title: "Docs", href: "#docs", description: "Guides and API reference.", icon: <BookOpen /> },
          { title: "Academy", href: "#academy", description: "Video courses on motion.", icon: <GraduationCap /> },
          { title: "Support", href: "#support", description: "Talk to a human.", icon: <LifeBuoy /> },
        ],
      },
    ],
  },
  { label: "Pricing", href: "#pricing" },
];

export default function MegaMenuDemo() {
  return (
    <div className="flex h-full w-full justify-center pt-2">
      <MegaMenu items={items} />
    </div>
  );
}
