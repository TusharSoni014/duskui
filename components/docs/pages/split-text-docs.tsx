import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import SplitTextDemo from "@/components/demos/split-text/split-text-demo";
import SplitTextEffectsDemo from "@/components/demos/split-text/split-text-effects";
import SplitTextWordsDemo from "@/components/demos/split-text/split-text-words";

const demo = (file: string) => `components/demos/split-text/${file}`;

const config: DocConfig = {
  title: "Split Text",
  intro:
    "A split text animation for React and Tailwind CSS: letters or words stagger in with a rise, drop, blur or fade when the text scrolls into view. The finished text is server-rendered for SEO, lines only break between words, and screen readers get the whole string.",
  tags: ["Letters or words", "Stagger on view", "Server-rendered text", "No re-renders", "prefers-reduced-motion"],
  hero: { Demo: SplitTextDemo, file: demo("split-text-demo.tsx") },
  install: {
    registry: "split-text",
    source: "components/dusk/text/split-text.tsx",
    deps: "motion",
  },
  usage: {
    filename: "headline.tsx",
    code: `import { SplitText } from "@/components/dusk/text/split-text"

export function Headline() {
  return (
    <SplitText as="h1" effect="rise" className="text-6xl font-bold">
      Hello, night shift.
    </SplitText>
  )
}`,
  },
  examples: [
    {
      id: "effects",
      title: "Effects",
      description: (
        <>
          <Code>effect</Code> picks how each piece enters: <Code>rise</Code>, <Code>drop</Code>, <Code>blur</Code> or{" "}
          <Code>fade</Code>. Tune the rhythm with <Code>stagger</Code>, <Code>duration</Code> and <Code>delay</Code>.
        </>
      ),
      Demo: SplitTextEffectsDemo,
      file: demo("split-text-effects.tsx"),
      minHeight: 220,
    },
    {
      id: "words",
      title: "Words, replayed",
      description: (
        <>
          <Code>by=&quot;words&quot;</Code> animates whole words, which suits paragraphs. With{" "}
          <Code>once={"{false}"}</Code> it replays every time it scrolls back into view.
        </>
      ),
      Demo: SplitTextWordsDemo,
      file: demo("split-text-words.tsx"),
      minHeight: 200,
    },
  ],
  api: {
    intro: <>Also accepts any HTML attribute for the rendered element.</>,
    props: [
      { name: "children", type: "string", description: "The text to animate. Plain text only." },
      { name: "as", type: '"span" | "p" | "div" | "strong" | "h1" … "h6"', default: '"span"', description: "Element to render. Use a heading level for titles." },
      { name: "by", type: '"letters" | "words"', default: '"letters"', description: "Animate each letter or each word." },
      { name: "effect", type: '"rise" | "drop" | "blur" | "fade"', default: '"rise"', description: "How each piece enters." },
      { name: "stagger", type: "number", default: "0.03 (letters) / 0.07 (words)", description: "Seconds between pieces." },
      { name: "delay", type: "number", default: "0", description: "Seconds before the first piece." },
      { name: "duration", type: "number", default: "0.6", description: "Seconds each piece takes." },
      { name: "once", type: "boolean", default: "true", description: "Play only the first time. When false it replays on every entry." },
      { name: "amount", type: "number", default: "0.4", description: "How much of the element must be visible to start (0–1)." },
    ],
  },
  accessibility: [
    "The server renders the finished text, so crawlers and no-JS visitors always see it; pieces are hidden just before the first client paint.",
    "In word mode the words are the real text. In letter mode a visually hidden copy carries the string and the letters are aria-hidden, because some screen readers read split letters one at a time.",
    "Letters are grouped per word, so lines only ever break between words. Letters are split by grapheme, so emoji and accents stay intact.",
    "Pieces animate with Motion directly on the DOM, with no React state per letter.",
    "With prefers-reduced-motion the text is shown immediately.",
  ],
};

export function SplitTextDocs() {
  return <ComponentDocs config={config} />;
}
