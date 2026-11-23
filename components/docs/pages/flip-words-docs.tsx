import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import FlipWordsDemo from "@/components/demos/flip-words/flip-words-demo";
import FlipWordsInline from "@/components/demos/flip-words/flip-words-inline";
import FlipWordsStyles from "@/components/demos/flip-words/flip-words-styles";

const demo = (file: string) => `components/demos/flip-words/${file}`;

const config: DocConfig = {
  title: "Flip Words",
  intro:
    "A flip words animation for React and Tailwind CSS: one word in a sentence flips over in 3D to the next on a timer, its letters flipping up one after another while the width springs smoothly between words. It pauses on hover and focus, and every word stays available to screen readers and search engines.",
  tags: ["3D rotateX flip", "Letter stagger", "Width spring", "Pauses on hover / focus", "prefers-reduced-motion"],
  hero: { Demo: FlipWordsDemo, file: demo("flip-words-demo.tsx") },
  install: {
    registry: "flip-words",
    source: "components/dusk/flip-words/flip-words.tsx",
    deps: "motion",
  },
  usage: {
    filename: "tagline.tsx",
    code: `import { FlipWords } from "@/components/dusk/flip-words/flip-words"

export function Tagline() {
  return (
    <h1 className="text-5xl font-bold">
      Ship <FlipWords words={["faster", "calmer", "together"]} className="text-primary" />
    </h1>
  )
}`,
  },
  examples: [
    {
      id: "styles",
      title: "Styles and timing",
      description: (
        <>
          Style the word with <Code>className</Code>; the flip runs inside it. Set the pace with <Code>interval</Code>{" "}
          and the letter cascade with <Code>letterStagger</Code>.
        </>
      ),
      Demo: FlipWordsStyles,
      file: demo("flip-words-styles.tsx"),
      minHeight: 220,
    },
    {
      id: "inline",
      title: "Inside a paragraph",
      description: (
        <>
          Words of very different lengths are fine: the surrounding sentence glides as the width springs. Hover or focus
          pauses it (<Code>pauseOnHover</Code>).
        </>
      ),
      Demo: FlipWordsInline,
      file: demo("flip-words-inline.tsx"),
      minHeight: 180,
    },
  ],
  api: {
    intro: <>Also accepts any HTML attribute for the rendered element.</>,
    props: [
      { name: "words", type: "string[]", description: "Words or short phrases to flip through. The first is server-rendered." },
      { name: "interval", type: "number", default: "3000", description: "Milliseconds each word stays before flipping (minimum 1200)." },
      { name: "as", type: '"span" | "strong" | "em" | "p" | "div" | "h1" … "h6"', default: '"span"', description: "Element to render. span sits inline in a sentence." },
      { name: "letterStagger", type: "number", default: "0.035", description: "Seconds between letters of the incoming word." },
      { name: "pauseOnHover", type: "boolean", default: "true", description: "Pause while the pointer is over the word or focus is inside it." },
      { name: "wordClassName", type: "string", description: "Classes for each word." },
    ],
  },
  accessibility: [
    "Every word is exposed once as visually hidden text, so screen readers and crawlers get the full list instead of a word that keeps changing; the animated copy is aria-hidden.",
    "The first word is server-rendered with no entrance animation, so there's no flash or hydration mismatch.",
    "The rotation pauses on hover and focus, while off-screen and in hidden tabs.",
    "With prefers-reduced-motion it doesn't rotate at all: the first word stays put.",
  ],
};

export function FlipWordsDocs() {
  return <ComponentDocs config={config} />;
}
