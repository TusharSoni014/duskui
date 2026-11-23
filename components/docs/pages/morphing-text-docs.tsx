import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import MorphingTextDemo from "@/components/demos/morphing-text/morphing-text-demo";
import MorphingTextHeadlineDemo from "@/components/demos/morphing-text/morphing-text-headline";
import MorphingTextVariantsDemo from "@/components/demos/morphing-text/morphing-text-variants";

const demo = (file: string) => `components/demos/morphing-text/${file}`;

const config: DocConfig = {
  title: "Morphing Text",
  intro:
    "A morphing text animation for React and Tailwind CSS: words melt into each other with a gooey SVG threshold filter or a soft blur crossfade. Ideal for hero headlines, it reserves the widest word so nothing shifts, keeps every word as real text for screen readers and SEO, and stays still for reduced-motion users.",
  tags: ["Gooey SVG filter", "Blur crossfade", "No layout shift", "SEO-friendly real text", "prefers-reduced-motion"],
  hero: { Demo: MorphingTextDemo, file: demo("morphing-text-demo.tsx"), minHeight: 260 },
  install: {
    registry: "morphing-text",
    source: "components/dusk/morphing-text/morphing-text.tsx",
    deps: "motion",
  },
  usage: {
    filename: "hero.tsx",
    code: `import { MorphingText } from "@/components/dusk/morphing-text/morphing-text"

export function Hero() {
  return (
    <h1 className="text-5xl font-bold">
      Build{" "}
      <MorphingText words={["faster", "smarter", "together"]} align="start" className="text-primary" />
    </h1>
  )
}`,
  },
  examples: [
    {
      id: "headline",
      title: "Inside a headline",
      description: (
        <>
          Rendered as a <Code>span</Code> it sits inline in a sentence. <Code>align=&quot;start&quot;</Code>{" "}
          keeps short words next to the text before them, and the reserved width stops the line from
          reflowing.
        </>
      ),
      Demo: MorphingTextHeadlineDemo,
      file: demo("morphing-text-headline.tsx"),
      minHeight: 220,
    },
    {
      id: "variants",
      title: "Gooey vs blur",
      description: (
        <>
          <Code>gooey</Code> fuses the letters into liquid shapes and works best with bold, solid-color
          type. <Code>blur</Code> is a plain blur crossfade that also suits thin weights and gradient text.
        </>
      ),
      Demo: MorphingTextVariantsDemo,
      file: demo("morphing-text-variants.tsx"),
      minHeight: 220,
    },
  ],
  api: {
    intro: <>Also accepts any HTML attribute for the rendered element.</>,
    props: [
      { name: "words", type: "string[]", description: "Words or short phrases to cycle through. The first is server-rendered." },
      { name: "interval", type: "number", default: "3000", description: "Milliseconds from one word to the next, morph included." },
      { name: "morphDuration", type: "number", default: "1000", description: "Length of the morph in milliseconds." },
      { name: "variant", type: '"gooey" | "blur"', default: '"gooey"', description: "Threshold-filter melt, or a soft blur crossfade." },
      { name: "as", type: '"span" | "p" | "div" | "h1" … "h6" | "strong" | "em"', default: '"span"', description: "Element to render." },
      { name: "align", type: '"start" | "center" | "end"', default: '"center"', description: "Alignment of shorter words inside the reserved width." },
      { name: "reserveSpace", type: "boolean", default: "true", description: "Reserve the widest word's width so surrounding content never moves." },
      { name: "announce", type: '"all" | "polite"', default: '"all"', description: "Expose every word once as hidden text, or announce each new word in a polite live region." },
      { name: "wordClassName", type: "string", description: "Classes for each word, e.g. a color or gradient." },
    ],
  },
  accessibility: [
    <>By default every word is in the page once as visually hidden text and the animated copies are <Code>aria-hidden</Code>, so screen readers read a stable sentence and search engines index all words.</>,
    <>With <Code>announce=&quot;polite&quot;</Code> the current word is announced each time it changes instead.</>,
    "With prefers-reduced-motion only the first word is shown and nothing animates.",
    "The cycle pauses when the text is off-screen or the tab is hidden, and the filter is removed between morphs so resting text is crisp.",
    "Each word is shown for at least 600 ms before the next morph starts.",
  ],
};

export function MorphingTextDocs() {
  return <ComponentDocs config={config} />;
}
