import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import ScratchToRevealDemo from "@/components/demos/scratch-to-reveal/scratch-to-reveal-demo";
import ScratchToRevealGrid from "@/components/demos/scratch-to-reveal/scratch-to-reveal-grid";
import ScratchToRevealHolo from "@/components/demos/scratch-to-reveal/scratch-to-reveal-holo";

const demo = (file: string) => `components/demos/scratch-to-reveal/${file}`;

const config: DocConfig = {
  title: "Scratch to Reveal",
  intro:
    "A scratch card component for React and Tailwind CSS: visitors scratch a canvas foil with a mouse, pen or finger to uncover a coupon, prize or secret, and the rest dissolves once enough is gone. Sharp on retina screens, with a real Reveal button for keyboard and screen reader users.",
  tags: ["Canvas foil", "Mouse, pen & touch", "onComplete callback", "Keyboard alternative", "High-DPI"],
  hero: { Demo: ScratchToRevealDemo, file: demo("scratch-to-reveal-demo.tsx"), minHeight: 300 },
  install: {
    registry: "scratch-to-reveal",
    source: "components/dusk/scratch-to-reveal/scratch-to-reveal.tsx",
    deps: "motion lucide-react",
  },
  usage: {
    filename: "coupon.tsx",
    code: `"use client"

import { ScratchToReveal } from "@/components/dusk/scratch-to-reveal/scratch-to-reveal"

export function Coupon() {
  return (
    <ScratchToReveal
      className="h-40 w-72"
      minScratchPercentage={50}
      onComplete={() => console.log("revealed")}
    >
      <div className="grid size-full place-items-center bg-card text-2xl font-bold">
        FREE SHIPPING
      </div>
    </ScratchToReveal>
  )
}`,
  },
  examples: [
    {
      id: "foil",
      title: "Custom foil",
      description: (
        <>
          Pass any CSS colors to <Code>gradientColors</Code> for the foil; <Code>pattern</Code> adds a fine
          hatch and glints. <Code>showRevealButton</Code> keeps the Reveal button visible for everyone.
        </>
      ),
      Demo: ScratchToRevealHolo,
      file: demo("scratch-to-reveal-holo.tsx"),
      minHeight: 300,
    },
    {
      id: "tiles",
      title: "Brush & threshold",
      description: (
        <>
          A smaller <Code>brushSize</Code> and a lower <Code>minScratchPercentage</Code> suit small tiles.{" "}
          <Code>hint={"{null}"}</Code> hides the overlay label.
        </>
      ),
      Demo: ScratchToRevealGrid,
      file: demo("scratch-to-reveal-grid.tsx"),
      minHeight: 240,
    },
  ],
  api: {
    intro: (
      <>
        Also accepts any HTML attribute for the wrapper. It fills the size you give it with{" "}
        <Code>className</Code> (or the size of its content).
      </>
    ),
    props: [
      { name: "children", type: "ReactNode", description: "The hidden content." },
      { name: "brushSize", type: "number", default: "22", description: "Brush radius in CSS px." },
      { name: "minScratchPercentage", type: "number", default: "50", description: "Percentage of the foil (0–100) to scratch before the rest dissolves." },
      { name: "onComplete", type: "() => void", description: "Called once when fully revealed, by scratching or by the button." },
      { name: "gradientColors", type: "string[]", default: "mint foil", description: "Two or more CSS colors for the diagonal foil gradient." },
      { name: "pattern", type: "boolean", default: "true", description: "Overlay a fine hatch and glints on the foil." },
      { name: "hint", type: "ReactNode | null", default: '"Scratch to reveal"', description: "Label over the foil until scratching starts. null hides it." },
      { name: "revealLabel", type: "string", default: '"Reveal"', description: "Text of the reveal button." },
      { name: "showRevealButton", type: "boolean", default: "false", description: "Keep the reveal button visible. By default it appears on keyboard focus." },
      { name: "aria-label", type: "string", default: '"Scratch card"', description: "Accessible name of the card group." },
    ],
  },
  accessibility: [
    "A real Reveal button sits in the tab order and appears when focused; activating it reveals the content and moves focus to it.",
    "The hidden content is inert until revealed, so it is neither focusable nor announced early, but it is in the HTML from the start.",
    "The canvas and hint are aria-hidden decorations; a CSS copy of the foil covers the content in server HTML so it never flashes before hydration.",
    "The reveal animation is instant with prefers-reduced-motion.",
    "touch-action: none applies only to the foil, so the page scrolls normally once the card is revealed.",
  ],
};

export function ScratchToRevealDocs() {
  return <ComponentDocs config={config} />;
}
