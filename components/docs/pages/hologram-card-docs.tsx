import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import HologramCardDemo from "@/components/demos/hologram-card/hologram-card-demo";
import HologramCardProfile from "@/components/demos/hologram-card/hologram-card-profile";
import HologramCardMinimal from "@/components/demos/hologram-card/hologram-card-minimal";

const demo = (file: string) => `components/demos/hologram-card/${file}`;

const config: DocConfig = {
  title: "Hologram Card",
  intro:
    "A holographic card for React: a faint iridescent sheen and a soft 1px rim that shift as the card tilts gently in 3D. Built with Motion springs and Tailwind CSS, for event passes, profile cards and collectibles.",
  tags: ["3D tilt", "Iridescent foil", "Motion values", "Mouse only", "Reduced-motion safe"],
  hero: { Demo: HologramCardDemo, file: demo("hologram-card-demo.tsx"), minHeight: 360 },
  install: {
    registry: "hologram-card",
    source: "components/dusk/techy/hologram-card.tsx",
    deps: "motion",
  },
  usage: {
    filename: "pass.tsx",
    code: `import { HologramCard } from "@/components/dusk/techy/hologram-card"

export function Pass() {
  return (
    <HologramCard className="w-80">
      <p className="text-lg font-semibold">Dusk Conf 2026</p>
      <p className="text-sm text-white/60">All-access pass</p>
    </HologramCard>
  )
}`,
  },
  examples: [
    {
      id: "profile",
      title: "Profile card",
      description: (
        <>
          The card is a plain container, so any content works: avatars, stats, badges.
        </>
      ),
      Demo: HologramCardProfile,
      file: demo("hologram-card-profile.tsx"),
      minHeight: 380,
    },
    {
      id: "subtle",
      title: "Subtle & flat",
      description: (
        <>
          Use a smaller <Code>maxTilt</Code>, or <Code>0</Code> for a flat card. <Code>scanlines</Code> adds faint
          static lines over the foil.
        </>
      ),
      Demo: HologramCardMinimal,
      file: demo("hologram-card-minimal.tsx"),
      minHeight: 240,
    },
  ],
  api: {
    intro: (
      <>
        Accepts every <Code>motion.div</Code> prop. Your <Code>onPointerMove</Code> and{" "}
        <Code>onPointerLeave</Code> handlers still run; <Code>style</Code> is merged after the tilt.
      </>
    ),
    props: [
      { name: "maxTilt", type: "number", default: "6", description: "Maximum tilt in degrees; 0 disables it." },
      { name: "scanlines", type: "boolean", default: "false", description: "Show faint, static scanlines over the foil." },
      { name: "className", type: "string", description: "Merged onto the card; set width, padding and layout here." },
    ],
  },
  accessibility: [
    "Every effect layer is aria-hidden and pointer-events-none; only your content is exposed to assistive tech.",
    "Effects sit behind the content at low opacity, so text contrast is preserved.",
    "Tilt follows a mouse only; touch users scroll normally without the card moving.",
    "With prefers-reduced-motion the card is fully static: no tilt and no foil shift.",
  ],
};

export function HologramCardDocs() {
  return <ComponentDocs config={config} />;
}
