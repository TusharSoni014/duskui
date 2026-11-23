import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import DataStreamDemo from "@/components/demos/data-stream/data-stream-demo";
import DataStreamDivider from "@/components/demos/data-stream/data-stream-divider";
import DataStreamMonitor from "@/components/demos/data-stream/data-stream-monitor";

const demo = (file: string) => `components/demos/data-stream/${file}`;

const config: DocConfig = {
  title: "Data Stream",
  intro:
    "A flowing data visualization effect for React: packets stream along horizontal lanes at different speeds, with thin fading tails and short data blocks. Drawn on a high-DPI canvas, a lightweight hero accent for real-time, networking and AI products.",
  tags: ["Background", "Canvas", "High-DPI", "Pauses off-screen", "Reduced-motion safe"],
  hero: { Demo: DataStreamDemo, file: demo("data-stream-demo.tsx"), minHeight: 360 },
  install: {
    registry: "data-stream",
    source: "components/dusk/techy/data-stream.tsx",
    deps: "motion",
    note: (
      <>
        The stream fills its nearest positioned parent. Give the parent <Code>relative</Code> and a height,
        then place content after it with <Code>relative</Code>.
      </>
    ),
  },
  usage: {
    filename: "hero.tsx",
    code: `import { DataStream } from "@/components/dusk/techy/data-stream"

export function Hero() {
  return (
    <section className="relative h-96 overflow-hidden">
      <DataStream lanes={14} />
      <div className="relative">{/* your content */}</div>
    </section>
  )
}`,
  },
  examples: [
    {
      id: "divider",
      title: "Section divider",
      description: (
        <>
          A short container with a few lanes makes an animated divider. <Code>direction=&quot;left&quot;</Code>{" "}
          reverses the flow.
        </>
      ),
      Demo: DataStreamDivider,
      file: demo("data-stream-divider.tsx"),
      minHeight: 200,
    },
    {
      id: "monitor",
      title: "Network monitor",
      description: (
        <>
          Push <Code>lanes</Code>, <Code>speed</Code> and <Code>density</Code> up for a busy, dashboard-style
          traffic view.
        </>
      ),
      Demo: DataStreamMonitor,
      file: demo("data-stream-monitor.tsx"),
      minHeight: 320,
    },
  ],
  api: {
    intro: <>Any other <Code>div</Code> prop is passed to the root.</>,
    props: [
      { name: "color", type: "string", default: '"var(--color-primary)"', description: "Packet color. Any CSS color, including variables and oklch()." },
      { name: "lanes", type: "number", default: "10", description: "Number of horizontal lanes." },
      { name: "speed", type: "number", default: "1", description: "Speed multiplier; each lane also gets its own random speed." },
      { name: "density", type: "number", default: "0.35", description: "How busy each lane is, from 0 to 1." },
      { name: "direction", type: '"left" | "right"', default: '"right"', description: "Which way the data flows." },
      { name: "fade", type: "boolean", default: "true", description: "Fade the stream out at both ends." },
      { name: "className", type: "string", description: "Merged onto the absolutely positioned root." },
    ],
  },
  accessibility: [
    <>Decorative only: the root is <Code>aria-hidden</Code> and <Code>pointer-events-none</Code>.</>,
    "With prefers-reduced-motion a single still frame is drawn instead of the animation.",
    "The animation loop stops while the stream is off-screen or the tab is hidden, and is cancelled on unmount.",
    "The canvas is sized for the device pixel ratio and follows its container with a ResizeObserver, so there is no layout shift.",
  ],
};

export function DataStreamDocs() {
  return <ComponentDocs config={config} />;
}
