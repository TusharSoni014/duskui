import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import HighlighterActions from "@/components/demos/highlighter/highlighter-actions";
import HighlighterDemo from "@/components/demos/highlighter/highlighter-demo";
import HighlighterMultiline from "@/components/demos/highlighter/highlighter-multiline";

const demo = (file: string) => `components/demos/highlighter/${file}`;

const config: DocConfig = {
  title: "Highlighter",
  intro:
    "A hand-drawn text highlighter for React and Tailwind CSS: a marker highlight, underline, circle, strike-through or box draws itself around inline text when it scrolls into view. Strokes are SVG paths measured from the text's own lines, so highlights and underlines wrap across line breaks, and several highlighters in a paragraph draw one after another.",
  tags: ["5 actions", "Wraps across lines", "Draws in sequence", "Hand-drawn SVG", "prefers-reduced-motion"],
  hero: { Demo: HighlighterDemo, file: demo("highlighter-demo.tsx"), minHeight: 240 },
  install: {
    registry: "highlighter",
    source: "components/dusk/highlighter/highlighter.tsx",
    deps: "motion",
  },
  usage: {
    filename: "pitch.tsx",
    code: `import { Highlighter } from "@/components/dusk/highlighter/highlighter"

export function Pitch() {
  return (
    <p>
      Set up in{" "}
      <Highlighter as="mark" action="highlight">
        under a minute
      </Highlighter>
      , no{" "}
      <Highlighter action="strike-through" color="#f87171">
        config files
      </Highlighter>
      .
    </p>
  )
}`,
  },
  examples: [
    {
      id: "actions",
      title: "Actions",
      description: (
        <>
          <Code>action</Code> picks the annotation. Tune it with <Code>color</Code>, <Code>strokeWidth</Code>,{" "}
          <Code>iterations</Code> (pen passes), <Code>padding</Code> and <Code>duration</Code>.
        </>
      ),
      Demo: HighlighterActions,
      file: demo("highlighter-actions.tsx"),
      minHeight: 300,
    },
    {
      id: "multiline",
      title: "Across line breaks",
      description: (
        <>
          Highlights and underlines get one stroke per visual line, drawn line after line, and redraw when the text
          rewraps.
        </>
      ),
      Demo: HighlighterMultiline,
      file: demo("highlighter-multiline.tsx"),
      minHeight: 300,
    },
  ],
  api: {
    intro: <>Also accepts any HTML attribute for the rendered element.</>,
    props: [
      { name: "children", type: "ReactNode", description: "Inline content to annotate. It can wrap across lines." },
      { name: "as", type: '"span" | "mark" | "strong" | "em" | "b" | "i"', default: '"span"', description: "Element to render. mark suits highlights." },
      { name: "action", type: '"highlight" | "underline" | "circle" | "strike-through" | "box"', default: '"highlight"', description: "How the annotation is drawn." },
      { name: "color", type: "string", default: "primary (28% for highlight)", description: "Stroke color, any CSS color." },
      { name: "strokeWidth", type: "number", default: "2", description: "Line thickness in px. Ignored by highlight, which follows the text height." },
      { name: "iterations", type: "number", default: "1 (highlight) / 2", description: "How many hand-drawn passes." },
      { name: "duration", type: "number", default: "0.9", description: "Seconds to draw the whole annotation, every line and pass." },
      { name: "delay", type: "number", default: "0", description: "Seconds to wait once its turn comes." },
      { name: "padding", type: "number", default: "3", description: "Extra room around the text, in px." },
      { name: "sequence", type: "boolean", default: "true", description: "Wait for highlighters that entered the view earlier, so they draw one after another." },
      { name: "seed", type: "number", description: "Change the hand-drawn wobble. Defaults to a hash of the text." },
    ],
  },
  accessibility: [
    "The text stays ordinary, selectable markup; the drawing is an aria-hidden SVG behind it (strike-through sits on top). Use as=\"mark\" when the highlight carries meaning.",
    "Nothing is drawn on the server and the wobble comes from a seeded generator inside effects, so there's no hydration mismatch.",
    "Strokes are measured from the text's line boxes and redraw on resize and font load, so they never drift from the words.",
    "With prefers-reduced-motion the annotation appears fully drawn, with no animation.",
  ],
};

export function HighlighterDocs() {
  return <ComponentDocs config={config} />;
}
