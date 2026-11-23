import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import WordRotateDemo from "@/components/demos/word-rotate/word-rotate-demo";
import WordRotateStylesDemo from "@/components/demos/word-rotate/word-rotate-styles";
import WordRotatePoliteDemo from "@/components/demos/word-rotate/word-rotate-polite";

const demo = (file: string) => `components/demos/word-rotate/${file}`;

const config: DocConfig = {
  title: "Word Rotate",
  intro:
    "A rotating word animation for React and Tailwind CSS: words swap with a vertical slide and blur while the container's width springs between them, so the sentence around it glides instead of jumping. Every word stays readable by search engines and screen readers.",
  tags: ["SEO-friendly real text", "Springy width", "AnimatePresence popLayout", "Pause on hover", "prefers-reduced-motion"],
  hero: { Demo: WordRotateDemo, file: demo("word-rotate-demo.tsx") },
  install: {
    registry: "word-rotate",
    source: "components/dusk/text/word-rotate.tsx",
    deps: "motion",
  },
  usage: {
    filename: "tagline.tsx",
    code: `import { WordRotate } from "@/components/dusk/text/word-rotate"

export function Tagline() {
  return (
    <h1 className="text-5xl font-bold">
      Made for{" "}
      <WordRotate
        words={["builders", "designers", "teams"]}
      />
    </h1>
  )
}`,
  },
  examples: [
    {
      id: "styles",
      title: "Motion & styling",
      description: (
        <>
          <Code>distance</Code> sets the slide (0 for a pure blur swap), <Code>blur</Code> the blur radius and{" "}
          <Code>interval</Code> how long each word stays. Style the words with <Code>wordClassName</Code>.
        </>
      ),
      Demo: WordRotateStylesDemo,
      file: demo("word-rotate-styles.tsx"),
      minHeight: 280,
    },
    {
      id: "polite",
      title: "Announced updates",
      description: (
        <>
          For live status text, <Code>announce=&quot;polite&quot;</Code> turns the word into a polite live region so
          screen readers announce each change instead of hearing the whole list once.
        </>
      ),
      Demo: WordRotatePoliteDemo,
      file: demo("word-rotate-polite.tsx"),
      minHeight: 160,
    },
  ],
  api: {
    intro: <>Also accepts any HTML attribute for the rendered element.</>,
    props: [
      { name: "words", type: "string[]", description: "Words or short phrases to cycle through. The first is server-rendered." },
      { name: "interval", type: "number", default: "2400", description: "Milliseconds each word stays on screen (minimum 1000)." },
      { name: "as", type: '"span" | "strong" | "em" | "p" | "div" | "h1" … "h6"', default: '"span"', description: "Element to render." },
      { name: "distance", type: "number", default: "0.6", description: "Slide distance as a fraction of the word height. 0 for blur/fade only." },
      { name: "blur", type: "number", default: "4", description: "Blur of incoming and outgoing words, in px." },
      { name: "pauseOnHover", type: "boolean", default: "true", description: "Pause the rotation while the pointer is over it." },
      { name: "announce", type: '"all" | "polite"', default: '"all"', description: "all exposes every word once as hidden text; polite announces each change." },
      { name: "wordClassName", type: "string", description: "Classes for each word, e.g. a color." },
    ],
  },
  accessibility: [
    <>By default every word is in the DOM once as visually hidden text and the animated copy is aria-hidden, so screen readers read the full sentence and crawlers index all words.</>,
    <>With <Code>announce=&quot;polite&quot;</Code> the visible word is a polite live region instead, for content that is genuinely live.</>,
    "Rotation pauses off-screen, in hidden tabs and on hover, which also gives readers time with a word.",
    "Width changes are animated, so surrounding text moves smoothly instead of jumping.",
    "With prefers-reduced-motion the first word stays put and nothing rotates.",
  ],
};

export function WordRotateDocs() {
  return <ComponentDocs config={config} />;
}
