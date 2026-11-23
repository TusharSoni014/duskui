import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import GlassCardDemo from "@/components/demos/glass-card/glass-card-demo";
import GlassCardProfile from "@/components/demos/glass-card/glass-card-profile";
import GlassCardBlur from "@/components/demos/glass-card/glass-card-blur";

const demo = (file: string) => `components/demos/glass-card/${file}`;

const config: DocConfig = {
  category: "Glassmorphism",
  title: "Glass Card",
  intro:
    "A glassmorphism card for React built with Tailwind CSS and Motion: real backdrop blur and saturation, a gradient hairline border, film grain and a specular highlight that follows the pointer — with optional 3D tilt and a readable fallback where backdrop-filter isn't supported.",
  tags: ["Backdrop blur", "Pointer highlight", "3D tilt", "No re-renders", "prefers-reduced-motion"],
  hero: { Demo: GlassCardDemo, file: demo("glass-card-demo.tsx"), minHeight: 360 },
  install: {
    registry: "glass-card",
    source: "components/dusk/glass/glass-card.tsx",
    deps: "motion",
    note: (
      <>
        Glass only looks like glass over something colorful. Put the card above an image, gradient or
        moving shapes — the demos use a small <Code>GlassBackdrop</Code> of drifting gradient orbs.
      </>
    ),
  },
  usage: {
    filename: "plan-card.tsx",
    code: `import { GlassCard } from "@/components/dusk/glass/glass-card"

export function PlanCard() {
  return (
    <GlassCard tilt className="max-w-sm">
      <h3 className="font-semibold">Pro plan</h3>
      <p className="text-sm text-white/70">Everything you need to ship.</p>
    </GlassCard>
  )
}`,
  },
  examples: [
    {
      id: "profile",
      title: "Profile card",
      description: (
        <>
          Interactive content works as usual. When something inside the card receives keyboard focus,
          the hairline border switches to the primary color so the card&apos;s edge stays visible.
        </>
      ),
      Demo: GlassCardProfile,
      file: demo("glass-card-profile.tsx"),
      minHeight: 420,
    },
    {
      id: "blur-levels",
      title: "Blur & tint",
      description: (
        <>
          <Code>blur</Code> sets the backdrop blur in px and <Code>tint</Code> takes any translucent CSS
          color. The default tint is a smoky mix of the page background, which keeps white text readable
          over bright colors.
        </>
      ),
      Demo: GlassCardBlur,
      file: demo("glass-card-blur.tsx"),
      minHeight: 300,
    },
  ],
  api: {
    intro: (
      <>
        Also accepts every <Code>&lt;div&gt;</Code> prop. Padding defaults to <Code>p-6</Code>; override
        it with <Code>className</Code>.
      </>
    ),
    props: [
      { name: "blur", type: "number", default: "16", description: "Backdrop blur in px." },
      { name: "saturation", type: "number", default: "160", description: "Backdrop saturation in percent. Above 100 makes colors behind the glass glow." },
      { name: "tint", type: "string", default: '"color-mix(in oklab, var(--background) 35%, transparent)"', description: "Glass fill. Any translucent CSS color." },
      { name: "highlight", type: "boolean", default: "true", description: "Specular light that follows the pointer across the surface and border." },
      { name: "tilt", type: "boolean | number", default: "false", description: "3D tilt towards the pointer. true = 8°, or pass the max angle." },
      { name: "noise", type: "boolean", default: "true", description: "Subtle film-grain texture on the glass." },
    ],
  },
  accessibility: [
    "Decorative layers (grain, border, highlight) are aria-hidden and ignore the pointer, so the card's content is exactly what assistive tech reads.",
    "Where backdrop-filter isn't supported the card falls back to an almost opaque fill, so text contrast never depends on the blur.",
    "A visible primary edge appears when anything inside the card has keyboard focus.",
    "Tilt is disabled for touch input and when the user prefers reduced motion; the highlight runs on motion values and never re-renders.",
  ],
};

export function GlassCardDocs() {
  return <ComponentDocs config={config} />;
}
