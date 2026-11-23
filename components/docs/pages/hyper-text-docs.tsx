import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import HyperTextDemo from "@/components/demos/hyper-text/hyper-text-demo";
import HyperTextHover from "@/components/demos/hyper-text/hyper-text-hover";
import HyperTextTerminal from "@/components/demos/hyper-text/hyper-text-terminal";

const demo = (file: string) => `components/demos/hyper-text/${file}`;

const config: DocConfig = {
  title: "Hyper Text",
  intro:
    "A text scramble effect for React and Tailwind CSS: every letter cycles through random characters and the text decodes left to right on hover, when it scrolls into view or on mount. Each letter's width is reserved by the real glyph so nothing shifts, the server renders the plain text, and screen readers always get the real words.",
  tags: ["Scramble / decode", "No layout shift", "Seeded, no hydration mismatch", "No re-renders", "prefers-reduced-motion"],
  hero: { Demo: HyperTextDemo, file: demo("hyper-text-demo.tsx") },
  install: {
    registry: "hyper-text",
    source: "components/dusk/hyper-text/hyper-text.tsx",
    deps: "motion",
  },
  usage: {
    filename: "hero-title.tsx",
    code: `import { HyperText } from "@/components/dusk/hyper-text/hyper-text"

export function HeroTitle() {
  return (
    <HyperText as="h1" className="font-mono text-6xl font-bold">
      ACCESS GRANTED
    </HyperText>
  )
}`,
  },
  examples: [
    {
      id: "hover",
      title: "On hover",
      description: (
        <>
          <Code>trigger=&quot;hover&quot;</Code> decodes on pointer enter or keyboard focus. Inside a link or button the
          whole control triggers it, including its padding and its focus ring.
        </>
      ),
      Demo: HyperTextHover,
      file: demo("hyper-text-hover.tsx"),
      minHeight: 180,
    },
    {
      id: "terminal",
      title: "On mount, staggered",
      description: (
        <>
          <Code>trigger=&quot;mount&quot;</Code> starts before the first client paint. Offset lines with{" "}
          <Code>delay</Code>, and swap the noise with <Code>characters</Code>.
        </>
      ),
      Demo: HyperTextTerminal,
      file: demo("hyper-text-terminal.tsx"),
      minHeight: 240,
    },
  ],
  api: {
    intro: <>Also accepts any HTML attribute for the rendered element.</>,
    props: [
      { name: "children", type: "string", description: "The text to decode. Plain text only." },
      { name: "as", type: '"span" | "p" | "div" | "strong" | "code" | "h1" … "h6"', default: '"span"', description: "Element to render. Use a heading level for titles." },
      { name: "trigger", type: '"hover" | "inView" | "mount"', default: '"inView"', description: "What starts the scramble." },
      { name: "replayOnHover", type: "boolean", default: "true", description: 'Also replay on hover / focus when trigger is "inView" or "mount".' },
      { name: "duration", type: "number", default: "800", description: "Milliseconds from the first letter scrambling to the last one resolving." },
      { name: "delay", type: "number", default: "0", description: "Milliseconds of pure noise before letters start to resolve." },
      { name: "characters", type: "string", default: '"A–Z0–9"', description: "Characters the letters cycle through. Lowercase letters get lowercase noise." },
      { name: "once", type: "boolean", default: "true", description: 'In "inView" mode, play only the first time. When false it replays on every entry.' },
      { name: "seed", type: "number", default: "1", description: "Change it for a different, repeatable noise sequence." },
    ],
  },
  accessibility: [
    "The server renders the real text, and no random values are used during render, so there is never a hydration mismatch. Noise comes from a seeded generator inside effects.",
    "Screen readers get the whole string from a visually hidden copy; the scrambling letters are aria-hidden so they're never announced.",
    "Each letter cell is sized by its real glyph and the noise is drawn on top, so the line never changes width or rewraps. A monospace font gives the cleanest look.",
    "Noise repaints about 20 times a second, written straight to the DOM with no React re-renders, and is never fast enough to strobe.",
    "With prefers-reduced-motion the text simply stays put.",
  ],
};

export function HyperTextDocs() {
  return <ComponentDocs config={config} />;
}
