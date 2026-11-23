import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import GlitchTextDemo from "@/components/demos/glitch-text/glitch-text-demo";
import GlitchTextHoverDemo from "@/components/demos/glitch-text/glitch-text-hover";
import GlitchTextInViewDemo from "@/components/demos/glitch-text/glitch-text-in-view";

const demo = (file: string) => `components/demos/glitch-text/${file}`;

const config: DocConfig = {
  category: "Hacker",
  title: "Glitch Text",
  intro:
    "A React glitch text effect for cyberpunk and hacker designs: RGB-split copies of your text jump around in clipped horizontal slices for a short burst — on hover, on a loop or once when scrolled into view. The text stays real, selectable and accessible. Built with Tailwind CSS and Motion.",
  tags: ["RGB split + clip-path slices", "Hover, loop or in-view", "Selectable text", "No strobing", "prefers-reduced-motion"],
  hero: { Demo: GlitchTextDemo, file: demo("glitch-text-demo.tsx"), minHeight: 260 },
  install: {
    registry: "glitch-text",
    source: "components/dusk/hacker/glitch-text.tsx",
    deps: "motion",
  },
  usage: {
    filename: "hero-title.tsx",
    code: `import { GlitchText } from "@/components/dusk/hacker/glitch-text"

export function HeroTitle() {
  return (
    <GlitchText as="h1" trigger="loop" className="text-6xl font-black">
      System Breach
    </GlitchText>
  )
}`,
  },
  examples: [
    {
      id: "hover",
      title: "On hover",
      description: (
        <>
          The default <Code>trigger=&quot;hover&quot;</Code> glitches on pointer enter, and on keyboard focus
          when the text wraps a link. It works inline inside a paragraph; <Code>intensity</Code> sets how far
          the layers jump.
        </>
      ),
      Demo: GlitchTextHoverDemo,
      file: demo("glitch-text-hover.tsx"),
      minHeight: 200,
    },
    {
      id: "in-view",
      title: "Once in view",
      description: (
        <>
          <Code>trigger=&quot;inView&quot;</Code> plays a single burst the first time the text scrolls into
          view. Pick any two <Code>colors</Code> for the split and a longer <Code>duration</Code> for drama.
        </>
      ),
      Demo: GlitchTextInViewDemo,
      file: demo("glitch-text-in-view.tsx"),
      minHeight: 200,
    },
  ],
  api: {
    intro: <>Also accepts any HTML attribute. Font, size and color are regular classes.</>,
    props: [
      { name: "children", type: "ReactNode", description: "The text. It's rendered three times, so keep it to text and inline formatting." },
      { name: "as", type: '"span" | "p" | "div" | "strong" | "h1"–"h6"', default: '"span"', description: "Element to render." },
      { name: "trigger", type: '"hover" | "loop" | "inView"', default: '"hover"', description: "What starts a glitch burst." },
      { name: "interval", type: "number", default: "3200", description: "Milliseconds between bursts in loop mode (minimum 1000)." },
      { name: "duration", type: "number", default: "450", description: "Length of one burst, in ms." },
      { name: "intensity", type: "number", default: "4", description: "Maximum horizontal offset of the color layers, in px." },
      { name: "colors", type: "[string, string]", default: '["#ff2bd6", "#00e5ff"]', description: "Colors of the two split layers." },
      { name: "disabled", type: "boolean", default: "false", description: "Stop all glitching." },
    ],
  },
  accessibility: [
    "The real text is a normal element — selectable, translatable and read once by screen readers. The two colored copies are aria-hidden and ignore the pointer.",
    "Bursts are throttled to at most one per second and the layers stay on for the whole burst, keeping it far below the 3-flashes-per-second limit.",
    "Loop mode pauses while the text is off-screen or the tab is hidden.",
    "With prefers-reduced-motion the text never glitches.",
    "Use a heading tag through as for titles so the document outline stays correct.",
  ],
};

export function GlitchTextDocs() {
  return <ComponentDocs config={config} />;
}
