import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import AnimatedBeamDemo from "@/components/demos/animated-beam/animated-beam-demo";
import AnimatedBeamBidirectional from "@/components/demos/animated-beam/animated-beam-bidirectional";
import AnimatedBeamFanOut from "@/components/demos/animated-beam/animated-beam-fan-out";

const demo = (file: string) => `components/demos/animated-beam/${file}`;

const config: DocConfig = {
  title: "Animated Beam",
  intro:
    "An animated SVG beam for React that connects two elements with a curved path and sends a glowing gradient pulse along it. Ideal for integration diagrams, data-flow illustrations and \"how it works\" sections; it measures the elements itself and redraws whenever the layout changes.",
  tags: ["Connects any two refs", "Curved paths", "ResizeObserver", "No re-renders while animating", "prefers-reduced-motion"],
  hero: { Demo: AnimatedBeamDemo, file: demo("animated-beam-demo.tsx"), minHeight: 360 },
  install: {
    registry: "animated-beam",
    source: "components/dusk/animated-beam/animated-beam.tsx",
    deps: "motion",
  },
  usage: {
    filename: "integration.tsx",
    code: `"use client"

import { useRef } from "react"
import { AnimatedBeam } from "@/components/dusk/animated-beam/animated-beam"

export function Integration() {
  const containerRef = useRef<HTMLDivElement>(null)
  const appRef = useRef<HTMLDivElement>(null)
  const apiRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={containerRef} className="relative flex justify-between p-10">
      <div ref={appRef} className="relative z-10 size-12 rounded-full bg-card" />
      <div ref={apiRef} className="relative z-10 size-12 rounded-full bg-card" />
      <AnimatedBeam containerRef={containerRef} fromRef={appRef} toRef={apiRef} curvature={-40} />
    </div>
  )
}`,
  },
  examples: [
    {
      id: "bidirectional",
      title: "Two-way traffic",
      description: (
        <>
          Two beams between the same pair: one bends up, one bends down with <Code>reverse</Code> and its own colors.
          <Code>fromOffset</Code> / <Code>toOffset</Code> aim at the icons rather than the centre of each block.
        </>
      ),
      Demo: AnimatedBeamBidirectional,
      file: demo("animated-beam-bidirectional.tsx"),
      minHeight: 260,
    },
    {
      id: "fan-out",
      title: "Fan-out",
      description: (
        <>
          One source, several targets. Stagger the pulses with <Code>delay</Code> and give each beam a different{" "}
          <Code>curvature</Code>.
        </>
      ),
      Demo: AnimatedBeamFanOut,
      file: demo("animated-beam-fan-out.tsx"),
      minHeight: 320,
    },
  ],
  api: {
    intro: (
      <>
        Render the beam inside the positioned container that holds both elements, and give the elements{" "}
        <Code>relative z-10</Code> so they sit above it. Also accepts SVG attributes for the root{" "}
        <Code>{"<svg>"}</Code>.
      </>
    ),
    props: [
      { name: "containerRef", type: "RefObject<HTMLElement>", description: "The positioned element both ends live in. The SVG fills it." },
      { name: "fromRef", type: "RefObject<HTMLElement>", description: "Element the beam starts from (its centre)." },
      { name: "toRef", type: "RefObject<HTMLElement>", description: "Element the beam ends at (its centre)." },
      { name: "curvature", type: "number", default: "0", description: "Bend in px, perpendicular to the straight line. Negative bends the other way." },
      { name: "reverse", type: "boolean", default: "false", description: "Send the pulse from to back to from." },
      { name: "duration", type: "number", default: "3", description: "Seconds for the pulse to travel the beam." },
      { name: "delay", type: "number", default: "0", description: "Seconds before the first pulse." },
      { name: "repeatDelay", type: "number", default: "0.6", description: "Seconds of rest between pulses." },
      { name: "pathColor", type: "string", default: '"#ffffff"', description: "Color of the resting track." },
      { name: "pathWidth", type: "number", default: "2", description: "Stroke width of the track and pulse." },
      { name: "pathOpacity", type: "number", default: "0.12", description: "Opacity of the resting track." },
      { name: "gradientStartColor", type: "string", default: "var(--color-primary)", description: "Pulse color at the from end." },
      { name: "gradientStopColor", type: "string", default: '"#22d3ee"', description: "Pulse color at the to end." },
      { name: "pulseLength", type: "number", default: "0.25", description: "Pulse length as a fraction of the beam (0.05–0.6)." },
      { name: "fromOffset", type: "{ x?: number; y?: number }", description: "Nudge the start point in px." },
      { name: "toOffset", type: "{ x?: number; y?: number }", description: "Nudge the end point in px." },
    ],
  },
  accessibility: [
    "The SVG is aria-hidden and ignores the pointer; it never sits on top of interactive content.",
    "A beam is decoration. Label the connected elements themselves (visible text, or sr-only text inside icon nodes) so the relationship is conveyed without it.",
    "The pulse is driven by a motion value, so React does not re-render while it travels.",
    "With prefers-reduced-motion there is no pulse; the beam is drawn as a still gradient line.",
  ],
};

export function AnimatedBeamDocs() {
  return <ComponentDocs config={config} />;
}
