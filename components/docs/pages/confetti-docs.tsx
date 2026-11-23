import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import ConfettiDemo from "@/components/demos/confetti/confetti-demo";
import ConfettiCustom from "@/components/demos/confetti/confetti-custom";
import ConfettiFireworks from "@/components/demos/confetti/confetti-fireworks";
import ConfettiSideCannons from "@/components/demos/confetti/confetti-side-cannons";

const demo = (file: string) => `components/demos/confetti/${file}`;

const config: DocConfig = {
  title: "Confetti",
  intro:
    "Dependency-free canvas confetti for React: an imperative confetti() helper with origin, angle, spread, gravity, colors and shapes, plus a ConfettiButton that bursts from itself on click. Every burst shares one full-viewport canvas that is created on demand and removed the moment the last piece lands.",
  tags: ["Zero dependencies", "Canvas, DPR aware", "Created on demand", "Promise per burst", "prefers-reduced-motion"],
  hero: { Demo: ConfettiDemo, file: demo("confetti-demo.tsx"), minHeight: 220 },
  install: {
    registry: "confetti",
    source: "components/dusk/confetti/confetti.tsx",
    deps: "",
    note: (
      <>
        The CLI also installs the DuskUI <Code>Button</Code> for <Code>ConfettiButton</Code>. The{" "}
        <Code>confetti()</Code> helper itself has no dependencies and can be called from any client-side code.
      </>
    ),
  },
  usage: {
    filename: "checkout-success.tsx",
    code: `"use client"

import { ConfettiButton, confetti } from "@/components/dusk/confetti/confetti"

export function Success() {
  return <ConfettiButton>Celebrate</ConfettiButton>
}

// Or fire it from anywhere, e.g. after a save resolves:
async function onSaved() {
  await confetti({ particleCount: 120, spread: 80, origin: { y: 0.7 } })
}`,
  },
  examples: [
    {
      id: "side-cannons",
      title: "Side cannons",
      description: (
        <>
          Call <Code>confetti()</Code> twice with mirrored <Code>angle</Code>s and <Code>origin</Code>s at the screen
          edges. <Code>origin</Code> is a fraction of the viewport.
        </>
      ),
      Demo: ConfettiSideCannons,
      file: demo("confetti-side-cannons.tsx"),
      minHeight: 200,
    },
    {
      id: "fireworks",
      title: "Fireworks",
      description: (
        <>
          A <Code>spread</Code> of 360 makes a ring; a handful fired on an interval with low <Code>gravity</Code> reads
          as fireworks. The interval is cleared on unmount.
        </>
      ),
      Demo: ConfettiFireworks,
      file: demo("confetti-fireworks.tsx"),
      minHeight: 200,
    },
    {
      id: "custom",
      title: "Shapes, colors & physics",
      description: (
        <>
          Pick from <Code>square</Code>, <Code>circle</Code>, <Code>star</Code> and <Code>ribbon</Code>, pass any CSS
          colors (theme variables included), and tune <Code>gravity</Code>, <Code>drift</Code> and{" "}
          <Code>scalar</Code>. <Code>ConfettiButton</Code> takes them through <Code>options</Code>.
        </>
      ),
      Demo: ConfettiCustom,
      file: demo("confetti-custom.tsx"),
      minHeight: 200,
    },
  ],
  api: {
    intro: (
      <>
        <Code>confetti(options)</Code> returns a promise that resolves when that burst has settled;{" "}
        <Code>confetti.reset()</Code> clears the screen. <Code>ConfettiButton</Code> accepts every DuskUI{" "}
        <Code>Button</Code> prop plus <Code>options</Code>; calling <Code>event.preventDefault()</Code> in its{" "}
        <Code>onClick</Code> skips the burst. <Code>originFromElement(el)</Code> turns an element into an origin.
      </>
    ),
    props: [
      { name: "origin", type: "{ x?: number; y?: number }", default: "{ x: 0.5, y: 0.6 }", description: "Start point as fractions of the viewport. ConfettiButton defaults it to its own centre." },
      { name: "angle", type: "number", default: "90", description: "Launch direction in degrees. 90 is up, 0 is right, 270 is down." },
      { name: "spread", type: "number", default: "60", description: "Width of the fan in degrees. 360 is a full ring." },
      { name: "particleCount", type: "number", default: "80", description: "Pieces in the burst." },
      { name: "startVelocity", type: "number", default: "22", description: "Launch speed in px per 60 fps frame." },
      { name: "gravity", type: "number", default: "0.55", description: "Downward pull per frame." },
      { name: "decay", type: "number", default: "0.93", description: "Share of velocity kept each frame (air resistance)." },
      { name: "drift", type: "number", default: "0", description: "Constant sideways push, like wind." },
      { name: "ticks", type: "number", default: "200", description: "Lifetime in frames. Pieces fade over the last third." },
      { name: "colors", type: "string[]", default: "primary plus muted zinc, blue, sand and lilac", description: "Any CSS colors, including var(--…)." },
      { name: "shapes", type: '("square" | "circle" | "star" | "ribbon")[]', default: '["square", "circle", "ribbon"]', description: "Shapes picked at random." },
      { name: "scalar", type: "number", default: "1", description: "Size multiplier." },
      { name: "zIndex", type: "number", default: "100", description: "z-index of the shared canvas." },
      { name: "disableForReducedMotion", type: "boolean", default: "true", description: "Skip the burst when the user prefers reduced motion." },
    ],
  },
  accessibility: [
    "The canvas is aria-hidden, ignores the pointer and is removed from the DOM as soon as the last piece settles, so it never blocks clicks or lingers in the accessibility tree.",
    "With prefers-reduced-motion nothing is drawn at all. The button and your click handler work exactly the same.",
    "Confetti is decoration: pair it with a visible or announced success message rather than relying on it to communicate the result.",
    "Physics is time-based, so it runs at the same speed on 60 Hz and 120 Hz screens, and the canvas is sharp on high-DPI displays.",
  ],
};

export function ConfettiDocs() {
  return <ComponentDocs config={config} />;
}
