import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import SparklesTextDemo from "@/components/demos/sparkles-text/sparkles-text-demo";
import SparklesTextColors from "@/components/demos/sparkles-text/sparkles-text-colors";
import SparklesTextDensity from "@/components/demos/sparkles-text/sparkles-text-density";
import SparklesTextInline from "@/components/demos/sparkles-text/sparkles-text-inline";

const demo = (file: string) => `components/demos/sparkles-text/${file}`;

const config: DocConfig = {
  title: "Sparkles Text",
  intro:
    "A sparkling text effect for React and Tailwind CSS: small four-point stars pop in and out around a heading or a highlighted word. Positions come from a seeded generator, so they look random but are repeatable and never cause a hydration mismatch, and the text itself stays real, selectable and indexable.",
  tags: ["SEO-friendly real text", "Seeded, repeatable", "No hydration mismatch", "Pauses off-screen", "prefers-reduced-motion"],
  hero: { Demo: SparklesTextDemo, file: demo("sparkles-text-demo.tsx") },
  install: {
    registry: "sparkles-text",
    source: "components/dusk/sparkles-text/sparkles-text.tsx",
    deps: "motion",
  },
  usage: {
    filename: "hero-title.tsx",
    code: `import { SparklesText } from "@/components/dusk/sparkles-text/sparkles-text"

export function HeroTitle() {
  return (
    <SparklesText as="h1" className="text-6xl font-bold">
      Magic, shipped
    </SparklesText>
  )
}`,
  },
  examples: [
    {
      id: "colors",
      title: "Colors",
      description: (
        <>
          Pass any CSS colors in <Code>colors</Code>; each sparkle picks one. Change <Code>seed</Code> for a different
          (but stable) pattern.
        </>
      ),
      Demo: SparklesTextColors,
      file: demo("sparkles-text-colors.tsx"),
      minHeight: 220,
    },
    {
      id: "density",
      title: "Density & size",
      description: (
        <>
          <Code>count</Code> sets how many sparkles are visible at once, <Code>size</Code> their pixel range and{" "}
          <Code>lifetime</Code> how long each one lives.
        </>
      ),
      Demo: SparklesTextDensity,
      file: demo("sparkles-text-density.tsx"),
      minHeight: 180,
    },
    {
      id: "inline",
      title: "Inline highlight",
      description: (
        <>
          Render it as <Code>strong</Code> or <Code>span</Code> to make one phrase in a sentence sparkle.
        </>
      ),
      Demo: SparklesTextInline,
      file: demo("sparkles-text-inline.tsx"),
      minHeight: 160,
    },
  ],
  api: {
    intro: <>Also accepts any HTML attribute for the rendered element.</>,
    props: [
      { name: "as", type: '"h1" … "h6" | "p" | "span" | "div" | "strong" | "em"', default: '"span"', description: "Element to render. Use a heading level for titles." },
      { name: "colors", type: "string[]", default: '["rgb(255 255 255 / 0.8)", "rgb(255 255 255 / 0.5)"]', description: "Sparkle colors; each sparkle picks one." },
      { name: "count", type: "number", default: "4", description: "Sparkles visible at once." },
      { name: "size", type: "[number, number]", default: "[6, 10]", description: "Sparkle size range in px." },
      { name: "lifetime", type: "number", default: "2", description: "Seconds each sparkle lives, from popping in to fading out." },
      { name: "seed", type: "number", default: "7", description: "Seed for the generator. The same seed always plays the same sequence." },
      { name: "className", type: "string", description: "Font size, weight, color and other text styles." },
    ],
  },
  accessibility: [
    "The text is one real element with no duplicated copies, so it is selectable, translatable and read once by screen readers.",
    "The sparkle layer is aria-hidden, ignores the pointer and cannot be selected.",
    "Sparkles are generated in an effect, after hydration, so the server HTML is just the text.",
    "The sparkle timer stops while the text is off-screen or the tab is hidden.",
    "With prefers-reduced-motion the sparkles hold still instead of popping.",
  ],
};

export function SparklesTextDocs() {
  return <ComponentDocs config={config} />;
}
