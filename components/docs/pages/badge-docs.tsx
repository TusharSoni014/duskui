import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import BadgeVariantsDemo from "@/components/demos/badge/badge-variants";
import BadgeDotIconsDemo from "@/components/demos/badge/badge-dot-icons";
import PulseBadgeDemo from "@/components/demos/badge/pulse-badge-demo";
import AnimatedCountBadgeDemo from "@/components/demos/badge/animated-count-badge-demo";
import ShimmerBadgeDemo from "@/components/demos/badge/shimmer-badge-demo";

const demo = (file: string) => `components/demos/badge/${file}`;
const block = (file: string) => `components/dusk/badge/${file}`;

const config: DocConfig = {
  title: "Badge",
  intro:
    "The shadcn/ui Badge with soft, success, warning and info variants, three sizes and a status dot — plus three animated React badge blocks built with Motion: a pulsing live status badge, a notification count that rolls like an odometer and a shimmering “New” badge.",
  tags: ["Drop-in shadcn API", "Server Component friendly", "Motion blocks", "prefers-reduced-motion"],
  hero: { Demo: AnimatedCountBadgeDemo, file: demo("animated-count-badge-demo.tsx"), minHeight: 260 },
  install: {
    registry: "badge",
    source: "components/ui/badge.tsx",
    deps: "@radix-ui/react-slot class-variance-authority",
    note: (
      <>
        Replaces <Code>components/ui/badge.tsx</Code>; every shadcn variant and{" "}
        <Code>badgeVariants</Code> still work. CSS only — no <Code>&quot;use client&quot;</Code> needed.
      </>
    ),
  },
  usage: {
    filename: "status.tsx",
    code: `import { Badge } from "@/components/ui/badge"

export function Status() {
  return (
    <Badge variant="success" dot>
      Operational
    </Badge>
  )
}`,
  },
  examples: [
    {
      id: "variants",
      title: "Variants",
      description: (
        <>
          The four shadcn variants plus <Code>soft</Code>, <Code>success</Code>, <Code>warning</Code> and{" "}
          <Code>info</Code> — tinted fills with a hairline border that read well on dark backgrounds.
        </>
      ),
      Demo: BadgeVariantsDemo,
      file: demo("badge-variants.tsx"),
      minHeight: 160,
    },
    {
      id: "dot-icons-sizes",
      title: "Dot, icons, sizes & links",
      description: (
        <>
          <Code>dot</Code> adds a leading status dot in the text color, icons are sized automatically,{" "}
          <Code>size</Code> picks sm, default or lg, and <Code>asChild</Code> turns a badge into a link with
          a hover state.
        </>
      ),
      Demo: BadgeDotIconsDemo,
      file: demo("badge-dot-icons.tsx"),
      minHeight: 160,
    },
  ],
  blocks: [
    {
      id: "pulse-badge",
      title: "Pulse Badge",
      registry: "pulse-badge",
      source: block("pulse-badge.tsx"),
      deps: "motion",
      description: (
        <>
          A status badge whose dot emits an expanding ring — for “Live”, “Online” or “Deploying”. The
          standalone <Code>PulseDot</Code> is exported too, e.g. for avatar presence. The ring stops under
          reduced motion; the solid dot stays.
        </>
      ),
      Demo: PulseBadgeDemo,
      file: demo("pulse-badge-demo.tsx"),
      minHeight: 160,
      props: [
        { name: "tone", type: '"primary" | "success" | "warning" | "danger" | "info" | "muted"', default: '"success"', description: "Dot color." },
        { name: "pulse", type: "boolean", default: "true", description: "Emit the ring. Turn off for idle states." },
        { name: "speed", type: "number", default: "2", description: "Seconds per pulse; lower feels more urgent." },
        { name: "variant / size", type: "Badge props", default: '"outline"', description: "Any Badge variant and size." },
      ],
    },
    {
      id: "animated-count-badge",
      title: "Animated Count Badge",
      registry: "animated-count-badge",
      source: block("animated-count-badge.tsx"),
      deps: "motion",
      description: (
        <>
          A count whose digits roll like an odometer when the value changes. Each digit is its own
          spring, new digits slide in as the number grows, the badge bumps on increases and{" "}
          <Code>max</Code> caps it at e.g. “99+”. Screen readers get plain text via <Code>label</Code>.
        </>
      ),
      Demo: AnimatedCountBadgeDemo,
      file: demo("animated-count-badge-demo.tsx"),
      minHeight: 260,
      props: [
        { name: "value", type: "number", description: "The count. Negative numbers show as 0. Required." },
        { name: "max", type: "number", default: "99", description: "Above this, show max+." },
        { name: "bump", type: "boolean", default: "true", description: "Bump the badge slightly when the count goes up." },
        { name: "label", type: "(value: number) => string", description: "Screen-reader text, e.g. “3 unread messages”." },
      ],
    },
    {
      id: "shimmer-badge",
      title: "Shimmer Badge",
      registry: "shimmer-badge",
      source: block("shimmer-badge.tsx"),
      deps: "motion",
      description:
        "A band of light sweeps across the badge every few seconds — eye-catching for New, Beta or Pro labels without blinking. Static under reduced motion.",
      Demo: ShimmerBadgeDemo,
      file: demo("shimmer-badge-demo.tsx"),
      minHeight: 160,
      props: [
        { name: "duration", type: "number", default: "1.4", description: "Seconds for one sweep." },
        { name: "delay", type: "number", default: "4", description: "Pause between sweeps in seconds." },
        { name: "variant / size", type: "Badge props", default: '"soft"', description: "Any Badge variant and size." },
      ],
    },
  ],
  api: {
    intro: (
      <>
        Accepts every <Code>&lt;span&gt;</Code> prop. Also exports <Code>badgeVariants</Code> to style other
        elements as badges.
      </>
    ),
    props: [
      { name: "variant", type: '"default" | "secondary" | "destructive" | "outline" | "soft" | "success" | "warning" | "info"', default: '"default"', description: "Visual style." },
      { name: "size", type: '"sm" | "default" | "lg"', default: '"default"', description: "Height, padding and text size." },
      { name: "dot", type: "boolean", default: "false", description: "Leading dot in the current text color." },
      { name: "asChild", type: "boolean", default: "false", description: "Render the child element instead (Radix Slot), e.g. a Link." },
    ],
  },
  accessibility: [
    "Color is never the only signal: dots and pulses are aria-hidden decoration next to a text label.",
    <>Animated Count Badge hides the rolling digits from assistive tech and exposes the value through <Code>label</Code>. Put the full context (“3 unread”) on the control it decorates.</>,
    <>Badges rendered as links via <Code>asChild</Code> get a visible focus-visible ring.</>,
    "Pulses, shimmers and the count bump stop under prefers-reduced-motion; the count updates instantly.",
  ],
};

export function BadgeDocs() {
  return <ComponentDocs config={config} />;
}
