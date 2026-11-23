import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import CardBasicDemo from "@/components/demos/card/card-basic";
import CardInteractiveDemo from "@/components/demos/card/card-interactive";
import GlowCardDemo from "@/components/demos/card/glow-card-demo";
import TiltCardDemo from "@/components/demos/card/tilt-card-demo";
import LoadingCardDemo from "@/components/demos/card/loading-card-demo";

const demo = (file: string) => `components/demos/card/${file}`;
const block = (file: string) => `components/dusk/card/${file}`;

const config: DocConfig = {
  title: "Card",
  intro:
    "The shadcn/ui Card with smooth border and shadow transitions and an interactive mode for clickable cards — plus three animated React card blocks built with Motion: a subtle cursor-aware border highlight, a gentle 3D tilt card, and a loading card that crossfades from a shimmer skeleton.",
  tags: ["Drop-in shadcn API", "Server Component friendly", "Motion blocks", "prefers-reduced-motion"],
  hero: { Demo: GlowCardDemo, file: demo("glow-card-demo.tsx"), minHeight: 300 },
  install: {
    registry: "card",
    source: "components/ui/card.tsx",
    deps: "@radix-ui/react-slot",
    note: (
      <>
        Replaces <Code>components/ui/card.tsx</Code> with the same parts and <Code>data-slot</Code>{" "}
        attributes, so existing cards keep working. The base Card is CSS-only — no{" "}
        <Code>&quot;use client&quot;</Code> needed.
      </>
    ),
  },
  usage: {
    filename: "plan-card.tsx",
    code: `import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function PlanCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pro plan</CardTitle>
        <CardDescription>For teams shipping every day.</CardDescription>
      </CardHeader>
      <CardContent>$24 / month</CardContent>
      <CardFooter>
        <Button>Upgrade</Button>
      </CardFooter>
    </Card>
  )
}`,
  },
  examples: [
    {
      id: "default",
      title: "Default",
      description: (
        <>
          Header, title, description, an optional <Code>CardAction</Code> slot in the top-right,
          content and footer — the exact shadcn/ui structure.
        </>
      ),
      Demo: CardBasicDemo,
      file: demo("card-basic.tsx"),
      minHeight: 400,
    },
    {
      id: "interactive",
      title: "Interactive link cards",
      description: (
        <>
          Add <Code>interactive</Code> for clickable cards: a subtle border and background change on hover
          and a focus-visible ring. Combine it with <Code>asChild</Code> to render a real link, so the whole
          card is one keyboard stop.
        </>
      ),
      Demo: CardInteractiveDemo,
      file: demo("card-interactive.tsx"),
    },
  ],
  blocks: [
    {
      id: "glow-card",
      title: "Glow Card",
      registry: "glow-card",
      source: block("glow-card.tsx"),
      deps: "motion",
      description: (
        <>
          The 1px border catches a faint highlight where the cursor is, with a barely visible tint on
          the surface. The highlight follows the pointer through motion values, so it never re-renders
          React, and it also shows when a child receives keyboard focus.
        </>
      ),
      Demo: GlowCardDemo,
      file: demo("glow-card-demo.tsx"),
      minHeight: 300,
      props: [
        { name: "radius", type: "number", default: "160", description: "Radius of the highlight in px." },
        { name: "color", type: "string", default: '"#ffffff"', description: "Any CSS color, mixed in at low opacity." },
      ],
    },
    {
      id: "tilt-card",
      title: "Tilt Card",
      registry: "tilt-card",
      source: block("tilt-card.tsx"),
      deps: "motion",
      description: (
        <>
          A gentle 3D tilt toward the cursor on damped springs, with an optional, barely visible glare.
          Give elements inside the card parts <Code>[transform:translateZ(24px)]</Code> to lift them
          off the surface. Mouse
          only (never hijacks touch scrolling) and completely still under reduced motion.
        </>
      ),
      Demo: TiltCardDemo,
      file: demo("tilt-card-demo.tsx"),
      minHeight: 340,
      props: [
        { name: "maxTilt", type: "number", default: "6", description: "Maximum rotation in degrees." },
        { name: "hoverScale", type: "number", default: "1", description: "Scale while hovered; 1 disables it." },
        { name: "glare", type: "boolean", default: "false", description: "Show a faint light reflection that follows the cursor." },
        { name: "perspective", type: "number", default: "900", description: "CSS perspective in px. Lower is more dramatic." },
        { name: "containerClassName", type: "string", description: "Classes for the wrapper that receives pointer events." },
      ],
    },
    {
      id: "loading-card",
      title: "Loading Card",
      registry: "loading-card",
      source: block("loading-card.tsx"),
      deps: "motion",
      description: (
        <>
          Shows a shimmering skeleton while <Code>loading</Code>, then crossfades the real content in
          while the height springs to fit — nothing below the card jumps. Build custom placeholders
          with the exported <Code>Shimmer</Code> block. Press Reload to replay.
        </>
      ),
      Demo: LoadingCardDemo,
      file: demo("loading-card-demo.tsx"),
      minHeight: 380,
      props: [
        { name: "loading", type: "boolean", default: "false", description: "Show the skeleton instead of children." },
        { name: "skeleton", type: "ReactNode", default: "<CardSkeleton />", description: "Custom placeholder built from <Shimmer />." },
        { name: "loadingLabel", type: "string", default: '"Loading"', description: "Announced to screen readers while loading." },
      ],
    },
  ],
  api: {
    intro: (
      <>
        <Code>Card</Code> accepts every <Code>&lt;div&gt;</Code> prop plus the two below. The other parts
        (<Code>CardHeader</Code>, <Code>CardTitle</Code>, <Code>CardDescription</Code>,{" "}
        <Code>CardAction</Code>, <Code>CardContent</Code>, <Code>CardFooter</Code>) are styled{" "}
        <Code>&lt;div&gt;</Code>s, identical to shadcn/ui.
      </>
    ),
    props: [
      { name: "interactive", type: "boolean", default: "false", description: "Subtle hover border and background, plus a focus ring, for clickable cards." },
      { name: "asChild", type: "boolean", default: "false", description: "Render the child element instead (Radix Slot), e.g. a Link." },
      { name: "className", type: "string", description: "Merged with tailwind-merge, so overrides win." },
    ],
  },
  accessibility: [
    <>Interactive cards should be a single link or button (<Code>asChild</Code>) so the whole card is one focus stop with a visible focus ring.</>,
    "Highlight and glare layers are aria-hidden and pointer-events-none; they never intercept clicks or reach screen readers.",
    <>Loading Card sets <Code>aria-busy</Code>, hides the skeleton from assistive tech and announces the loading label politely.</>,
    "Tilt Card ignores touch and stays still with prefers-reduced-motion; the skeleton shimmer stops too.",
  ],
};

export function CardDocs() {
  return <ComponentDocs config={config} />;
}
