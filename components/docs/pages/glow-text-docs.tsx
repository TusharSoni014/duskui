import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import GlowTextDemo from "@/components/demos/glow-text/glow-text-demo";
import GlowTextAnimationsDemo from "@/components/demos/glow-text/glow-text-animations";
import GlowTextColorsDemo from "@/components/demos/glow-text/glow-text-colors";
import GlowTextInlineDemo from "@/components/demos/glow-text/glow-text-inline";

const demo = (file: string) => `components/demos/glow-text/${file}`;

const config: DocConfig = {
  category: "Neon",
  title: "Glow Text",
  intro:
    "A neon text effect for React and Tailwind CSS: layered text-shadow glow with optional breathing or flickering animation, any color and any heading level. It stays real, selectable text, so headings remain readable by search engines and screen readers.",
  tags: ["SEO-friendly real text", "Heading levels via as", "Breathe & flicker", "No re-renders", "prefers-reduced-motion"],
  hero: { Demo: GlowTextDemo, file: demo("glow-text-demo.tsx") },
  install: {
    registry: "glow-text",
    source: "components/dusk/neon/glow-text.tsx",
    deps: "motion",
  },
  usage: {
    filename: "page-title.tsx",
    code: `import { GlowText } from "@/components/dusk/neon/glow-text"

export function PageTitle() {
  return (
    <GlowText as="h1" color="#22d3ee" className="text-5xl font-bold">
      Night Market
    </GlowText>
  )
}`,
  },
  examples: [
    {
      id: "animations",
      title: "Animations",
      description: (
        <>
          <Code>breathe</Code> (default) slowly swells the glow; <Code>flicker</Code> holds steady and
          occasionally stutters like an old sign; <Code>none</Code> keeps it static. Tune the cycle with{" "}
          <Code>speed</Code>.
        </>
      ),
      Demo: GlowTextAnimationsDemo,
      file: demo("glow-text-animations.tsx"),
      minHeight: 180,
    },
    {
      id: "colors",
      title: "Colors & intensity",
      description: (
        <>
          Any CSS color works. <Code>intensity</Code> scales all five shadow layers, and the font is
          entirely yours.
        </>
      ),
      Demo: GlowTextColorsDemo,
      file: demo("glow-text-colors.tsx"),
      minHeight: 180,
    },
    {
      id: "inline",
      title: "Inline",
      description: (
        <>
          Render it as <Code>strong</Code> or <Code>span</Code> to highlight a word inside running text.
        </>
      ),
      Demo: GlowTextInlineDemo,
      file: demo("glow-text-inline.tsx"),
      minHeight: 160,
    },
  ],
  api: {
    intro: <>Also accepts any HTML attribute for the rendered element.</>,
    props: [
      { name: "as", type: '"h1" … "h6" | "p" | "span" | "div" | "strong"', default: '"span"', description: "Element to render. Use a heading level for titles." },
      { name: "color", type: "string", default: "var(--color-primary)", description: "Any CSS color for the glow; the letters use a hot, whiter tint of it." },
      { name: "intensity", type: "number", default: "1", description: "Glow strength multiplier. 0 removes the glow." },
      { name: "animation", type: '"none" | "breathe" | "flicker"', default: '"breathe"', description: "Glow animation. Always none with reduced motion." },
      { name: "speed", type: "number", default: "3.2 (breathe) / 4 (flicker)", description: "Seconds per cycle. Flicker is clamped to at least 2s." },
      { name: "className", type: "string", description: "Font size, weight and other text styles." },
    ],
  },
  accessibility: [
    "The text is a single real element with no duplicated or aria-hidden copies, so it is selectable, translatable and indexed like any heading.",
    <>Use <Code>as</Code> to keep the correct heading level in the document outline.</>,
    "Only the glow animates; the letters never blink. Flicker produces at most two soft dips per second, under the WCAG 3-flashes threshold.",
    "With prefers-reduced-motion the glow is static.",
    "Letters are rendered as a light tint of the color for strong contrast on dark backgrounds.",
  ],
};

export function GlowTextDocs() {
  return <ComponentDocs config={config} />;
}
