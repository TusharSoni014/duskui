import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import HologramCardDemo from "@/components/demos/hologram-card/hologram-card-demo";
import HologramCardProfile from "@/components/demos/hologram-card/hologram-card-profile";
import HologramCardMinimal from "@/components/demos/hologram-card/hologram-card-minimal";

const demo = (file: string) => `components/demos/hologram-card/${file}`;

const config: DocConfig = {
  title: "Hologram Card",
  intro:
    "A holographic card for React with an iridescent foil, rainbow rim, CRT scanlines and a glare that follows the pointer as the card tilts in 3D. Built with Motion springs and Tailwind CSS — perfect for event passes, profile cards and collectibles.",
  tags: ["3D tilt", "Pointer glare", "Motion values", "Mouse only", "Reduced-motion safe"],
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
          A stronger <Code>maxTilt</Code> and a custom accent <Code>color</Code> for the scan beam. The card is
          a plain container, so any content works.
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
          Turn the effect down with a small <Code>maxTilt</Code>, or set it to <Code>0</Code> and drop{" "}
          <Code>glare</Code> or <Code>scanlines</Code> for a quieter foil.
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
      { name: "maxTilt", type: "number", default: "10", description: "Maximum tilt in degrees; 0 disables it." },
      { name: "glare", type: "boolean", default: "true", description: "Show the light glare that follows the pointer." },
      { name: "scanlines", type: "boolean", default: "true", description: "Show CRT scanlines and the sweeping scan beam." },
      { name: "color", type: "string", default: '"var(--color-primary)"', description: "Accent color of the scan beam. Any CSS color." },
      { name: "className", type: "string", description: "Merged onto the card; set width, padding and layout here." },
    ],
  },
  accessibility: [
    "Every effect layer is aria-hidden and pointer-events-none; only your content is exposed to assistive tech.",
    "Effects sit behind the content, and the glare uses an overlay blend, so text contrast is preserved.",
    "Tilt and glare follow a mouse only — touch users scroll normally without the card moving.",
    "With prefers-reduced-motion the card is fully static: no tilt, glare or scan beam. The beam also stops while off-screen.",
  ],
};

export function HologramCardDocs() {
  return <ComponentDocs config={config} />;
}
