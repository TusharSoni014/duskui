import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import TextAnimateDemo from "@/components/demos/text-animate/text-animate-demo";
import TextAnimateHeading from "@/components/demos/text-animate/text-animate-heading";
import TextAnimateLines from "@/components/demos/text-animate/text-animate-lines";
import TextAnimatePresets from "@/components/demos/text-animate/text-animate-presets";

const demo = (file: string) => `components/demos/text-animate/${file}`;

const config: DocConfig = {
  title: "Text Animate",
  intro:
    "A text animation component for React and Tailwind CSS with six presets (fade in, blur in, slide up, slide down, scale up and blur in up) that animates by character, word or line, on mount or when scrolled into view. The finished text is server-rendered for SEO, line mode follows how the text really wraps, and the heading level is yours to choose.",
  tags: ["6 presets", "Character, word or line", "On mount or in view", "Server-rendered text", "prefers-reduced-motion"],
  hero: { Demo: TextAnimateDemo, file: demo("text-animate-demo.tsx") },
  install: {
    registry: "text-animate",
    source: "components/dusk/text-animate/text-animate.tsx",
    deps: "motion",
  },
  usage: {
    filename: "section-title.tsx",
    code: `import { TextAnimate } from "@/components/dusk/text-animate/text-animate"

export function SectionTitle() {
  return (
    <TextAnimate as="h2" animation="blurInUp" by="character" className="text-5xl font-bold">
      Built for the late shift.
    </TextAnimate>
  )
}`,
  },
  examples: [
    {
      id: "presets",
      title: "Presets",
      description: (
        <>
          <Code>animation</Code> picks the entrance: <Code>fadeIn</Code>, <Code>blurIn</Code>, <Code>slideUp</Code>,{" "}
          <Code>slideDown</Code>, <Code>scaleUp</Code> or <Code>blurInUp</Code>. Here they run with{" "}
          <Code>trigger=&quot;mount&quot;</Code>; remount to replay.
        </>
      ),
      Demo: TextAnimatePresets,
      file: demo("text-animate-presets.tsx"),
      minHeight: 340,
    },
    {
      id: "lines",
      title: "By line",
      description: (
        <>
          <Code>by=&quot;line&quot;</Code> measures where the text wraps when the animation starts and moves each visual
          line together. A <Code>\n</Code> in the string forces a break. With <Code>once={"{false}"}</Code> it replays on
          every entry.
        </>
      ),
      Demo: TextAnimateLines,
      file: demo("text-animate-lines.tsx"),
      minHeight: 220,
    },
    {
      id: "sequenced",
      title: "Sequenced heading",
      description: (
        <>
          Chain several blocks with <Code>delay</Code> for an eyebrow, title and subtitle. <Code>as</Code> keeps the
          real heading structure.
        </>
      ),
      Demo: TextAnimateHeading,
      file: demo("text-animate-heading.tsx"),
      minHeight: 260,
    },
  ],
  api: {
    intro: <>Also accepts any HTML attribute for the rendered element.</>,
    props: [
      { name: "children", type: "string", description: "The text to animate. Plain text; \\n starts a new line." },
      { name: "as", type: '"p" | "span" | "div" | "strong" | "em" | "blockquote" | "h1" … "h6"', default: '"p"', description: "Element to render. Use a heading level for titles." },
      { name: "animation", type: '"fadeIn" | "blurIn" | "slideUp" | "slideDown" | "scaleUp" | "blurInUp"', default: '"fadeIn"', description: "How each piece enters." },
      { name: "by", type: '"character" | "word" | "line"', default: '"word"', description: "Split into characters, words, or the visual lines the text wraps onto." },
      { name: "trigger", type: '"mount" | "inView"', default: '"inView"', description: "Start on mount or when the text scrolls into view." },
      { name: "delay", type: "number", default: "0", description: "Seconds before the first piece." },
      { name: "duration", type: "number", default: "0.45 / 0.6 / 0.75", description: "Seconds each piece takes (character / word / line)." },
      { name: "stagger", type: "number", default: "0.025 / 0.06 / 0.14", description: "Seconds between pieces (character / word / line)." },
      { name: "once", type: "boolean", default: "true", description: 'In "inView" mode, play only the first time. When false it replays on every entry.' },
      { name: "amount", type: "number", default: "0.3", description: "How much of the element must be visible to start (0–1)." },
      { name: "segmentClassName", type: "string", description: "Classes for every animated piece." },
    ],
  },
  accessibility: [
    "The server renders the finished text, so crawlers and no-JS visitors always see it; pieces are hidden just before the first client paint.",
    "In word and line mode the words are the real text. In character mode a visually hidden copy carries the string and the letters are aria-hidden, because some screen readers read split letters one at a time.",
    "Letters are grouped per word, so lines only break between words, and split by grapheme so emoji and accents stay intact.",
    "Pieces animate with Motion directly on the DOM, with no React state per piece.",
    "With prefers-reduced-motion the text is shown immediately.",
  ],
};

export function TextAnimateDocs() {
  return <ComponentDocs config={config} />;
}
