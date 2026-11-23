import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import AuroraTextColors from "@/components/demos/aurora-text/aurora-text-colors";
import AuroraTextDemo from "@/components/demos/aurora-text/aurora-text-demo";

const demo = (file: string) => `components/demos/aurora-text/${file}`;

const config: DocConfig = {
  title: "Aurora Text",
  intro:
    "An aurora gradient text effect for React and Tailwind CSS: soft blobs of color drift slowly through the letters like northern lights. It's a gradient clipped to real, selectable text, with props for the colors and the speed, and it holds still under reduced motion.",
  tags: ["background-clip: text", "Custom colors", "Speed control", "Real, selectable text", "prefers-reduced-motion"],
  hero: { Demo: AuroraTextDemo, file: demo("aurora-text-demo.tsx") },
  install: {
    registry: "aurora-text",
    source: "components/dusk/aurora-text/aurora-text.tsx",
    deps: "motion",
  },
  usage: {
    filename: "hero-title.tsx",
    code: `import { AuroraText } from "@/components/dusk/aurora-text/aurora-text"

export function HeroTitle() {
  return (
    <h1 className="text-6xl font-bold">
      Meet the <AuroraText>night shift</AuroraText>
    </h1>
  )
}`,
  },
  examples: [
    {
      id: "colors",
      title: "Colors and speed",
      description: (
        <>
          Pass two or more CSS colors in <Code>colors</Code>; each becomes a drifting blob. <Code>speed</Code> is a
          multiplier on the 14-second loop.
        </>
      ),
      Demo: AuroraTextColors,
      file: demo("aurora-text-colors.tsx"),
      minHeight: 280,
    },
  ],
  api: {
    intro: <>Also accepts any HTML attribute for the rendered element.</>,
    props: [
      { name: "as", type: '"span" | "p" | "div" | "strong" | "em" | "h1" … "h6"', default: '"span"', description: "Element to render. Use a heading level for titles." },
      { name: "colors", type: "string[]", default: "[primary, sky, indigo]", description: "Aurora colors, at least two. Each becomes a soft drifting blob." },
      { name: "speed", type: "number", default: "1", description: "Speed multiplier. 1 is one loop every 14 seconds." },
    ],
  },
  accessibility: [
    "It's one real text element, so headings stay selectable, translatable and indexable.",
    "The server renders the same gradient, standing still, so there's no flash or hydration mismatch.",
    "Selected text switches to the solid foreground color so it stays legible, and forced-colors modes fall back to the system text color.",
    "The drift pauses off-screen and in hidden tabs. With prefers-reduced-motion the gradient holds still.",
    "Check contrast: every color in the palette should be readable against your background.",
  ],
};

export function AuroraTextDocs() {
  return <ComponentDocs config={config} />;
}
