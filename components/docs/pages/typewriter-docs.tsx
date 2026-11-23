import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import TypewriterDemo from "@/components/demos/typewriter/typewriter-demo";
import TypewriterCursorsDemo from "@/components/demos/typewriter/typewriter-cursors";
import TypewriterOnceDemo from "@/components/demos/typewriter/typewriter-once";
import TypewriterWrappingDemo from "@/components/demos/typewriter/typewriter-wrapping";

const demo = (file: string) => `components/demos/typewriter/${file}`;

const config: DocConfig = {
  title: "Typewriter",
  intro:
    "A typewriter text effect for React and Tailwind CSS that types and deletes a list of phrases with a blinking caret. It reserves the space of its longest phrase so nothing shifts, pauses off-screen, and keeps every phrase in the DOM for search engines and screen readers.",
  tags: ["SEO-friendly real text", "No layout shift", "Bar, block & underscore carets", "Pauses off-screen", "prefers-reduced-motion"],
  hero: { Demo: TypewriterDemo, file: demo("typewriter-demo.tsx") },
  install: {
    registry: "typewriter",
    source: "components/dusk/text/typewriter.tsx",
    deps: "motion",
  },
  usage: {
    filename: "hero.tsx",
    code: `import { Typewriter } from "@/components/dusk/text/typewriter"

export function Hero() {
  return (
    <h1 className="text-5xl font-bold">
      Ship{" "}
      <Typewriter
        phrases={["faster", "safer", "together"]}
        className="text-muted-foreground"
      />
    </h1>
  )
}`,
  },
  examples: [
    {
      id: "cursors",
      title: "Caret styles",
      description: (
        <>
          <Code>cursor</Code> picks a <Code>bar</Code>, <Code>block</Code> or <Code>underscore</Code> caret (or{" "}
          <Code>none</Code>). Color it with <Code>cursorClassName</Code>. The caret stays solid while typing and blinks
          while idle.
        </>
      ),
      Demo: TypewriterCursorsDemo,
      file: demo("typewriter-cursors.tsx"),
      minHeight: 220,
    },
    {
      id: "once",
      title: "Play once",
      description: (
        <>
          With <Code>loop={"{false}"}</Code> it stops on the last phrase. <Code>typeFirst</Code> types the first
          phrase from an empty line instead of starting with it already written.
        </>
      ),
      Demo: TypewriterOnceDemo,
      file: demo("typewriter-once.tsx"),
      minHeight: 180,
    },
    {
      id: "wrapping",
      title: "Wrapping without layout shift",
      description: (
        <>
          Every phrase is stacked invisibly in the same grid cell, so the element is always as wide and tall as the
          longest one. Long phrases wrap naturally and the content below never jumps.
        </>
      ),
      Demo: TypewriterWrappingDemo,
      file: demo("typewriter-wrapping.tsx"),
      minHeight: 260,
    },
  ],
  api: {
    intro: <>Also accepts any HTML attribute for the rendered element.</>,
    props: [
      { name: "phrases", type: "string[]", description: "Phrases to type, in order. Inline arrays are fine; it restarts only when the content changes." },
      { name: "as", type: '"span" | "p" | "div" | "strong" | "h1" … "h6"', default: '"span"', description: "Element to render. span sits inline in a sentence." },
      { name: "typeSpeed", type: "number", default: "70", description: "Milliseconds per typed character, slightly varied so it feels human." },
      { name: "deleteSpeed", type: "number", default: "38", description: "Milliseconds per deleted character." },
      { name: "pause", type: "number", default: "1800", description: "How long a finished phrase stays before it is deleted, in ms." },
      { name: "startDelay", type: "number", default: "400", description: "Delay before the first keystroke, in ms." },
      { name: "loop", type: "boolean", default: "true", description: "Cycle forever. When false it stops on the last phrase." },
      { name: "typeFirst", type: "boolean", default: "false", description: "Type the first phrase from an empty line. By default it is already written (and server-rendered)." },
      { name: "cursor", type: '"bar" | "block" | "underscore" | "none"', default: '"bar"', description: "Caret style." },
      { name: "cursorClassName", type: "string", description: "Extra classes for the caret, e.g. a background color." },
      { name: "startOnView", type: "boolean", default: "true", description: "Wait until the text scrolls into view before typing." },
      { name: "label", type: "string", default: "phrases joined with \", \"", description: "Text for screen readers and search engines." },
    ],
  },
  accessibility: [
    <>All phrases are in the DOM as visually hidden text (override with <Code>label</Code>), so screen readers hear the full list once instead of a stream of keystrokes, and crawlers index every phrase.</>,
    "The animated copy is aria-hidden; the hidden size-reserving copies are invisible and unselectable.",
    "The element reserves the size of its longest phrase, so it causes no layout shift (CLS) while typing.",
    "Typing pauses while the element is off-screen or the tab is hidden.",
    "With prefers-reduced-motion no typing happens: a finished phrase is shown and the caret stops blinking.",
  ],
};

export function TypewriterDocs() {
  return <ComponentDocs config={config} />;
}
