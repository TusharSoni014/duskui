import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import ScanLineDemo from "@/components/demos/scan-line/scan-line-demo";
import ScanLineCrtDemo from "@/components/demos/scan-line/scan-line-crt";
import ScanLineMatrixDemo from "@/components/demos/scan-line/scan-line-matrix";

const demo = (file: string) => `components/demos/scan-line/${file}`;

const config: DocConfig = {
  title: "Scan Line",
  intro:
    "A CRT scan line overlay for React: wrap any element to add retro horizontal scanlines, a slowly rolling scan bar, and optional vignette, flicker and screen curvature. Pure CSS with Tailwind — no JavaScript, Server Component friendly, and it never blocks clicks.",
  tags: ["Pure CSS", "Server Component friendly", "pointer-events-none", "Retro CRT", "prefers-reduced-motion"],
  hero: { Demo: ScanLineDemo, file: demo("scan-line-demo.tsx"), minHeight: 320 },
  install: {
    registry: "scan-line",
    source: "components/dusk/hacker/scan-line.tsx",
    deps: "",
    note: (
      <>
        No dependencies and no <Code>&quot;use client&quot;</Code>. The keyframes ship in a React 19{" "}
        <Code>&lt;style precedence&gt;</Code> tag that&apos;s hoisted and de-duplicated automatically.
      </>
    ),
  },
  usage: {
    filename: "screen.tsx",
    code: `import { ScanLine } from "@/components/dusk/hacker/scan-line"

export function Screen() {
  return (
    <ScanLine className="rounded-xl bg-black p-8">
      <h2 className="font-mono text-primary">ACCESS GRANTED</h2>
    </ScanLine>
  )
}`,
  },
  examples: [
    {
      id: "crt",
      title: "Retro CRT",
      description: (
        <>
          Turn on <Code>curvature</Code> and <Code>flicker</Code>, space the lines with{" "}
          <Code>lineSpacing</Code> and <Code>lineOpacity</Code>, and tint the scan bar with{" "}
          <Code>barColor</Code> and <Code>barDuration</Code>.
        </>
      ),
      Demo: ScanLineCrtDemo,
      file: demo("scan-line-crt.tsx"),
      minHeight: 400,
    },
    {
      id: "with-matrix-rain",
      title: "Over Matrix Rain",
      description: (
        <>
          It wraps anything — including canvas backgrounds like{" "}
          <Code>MatrixRain</Code>, which fills the <Code>relative</Code> wrapper.
        </>
      ),
      Demo: ScanLineMatrixDemo,
      file: demo("scan-line-matrix.tsx"),
      minHeight: 380,
    },
  ],
  api: {
    intro: <>Also accepts any <Code>&lt;div&gt;</Code> prop. The wrapper is <Code>relative overflow-hidden</Code>.</>,
    props: [
      { name: "lines", type: "boolean", default: "true", description: "Draw horizontal scanlines." },
      { name: "lineSpacing", type: "number", default: "3", description: "Distance between scanlines, in px (min 2)." },
      { name: "lineOpacity", type: "number", default: "0.25", description: "Darkness of each scanline, 0–1." },
      { name: "bar", type: "boolean", default: "true", description: "Show the rolling scan bar." },
      { name: "barDuration", type: "number", default: "7", description: "Seconds for the bar to travel top to bottom." },
      { name: "barColor", type: "string", default: '"rgb(255 255 255)"', description: "Bar color; any CSS color." },
      { name: "vignette", type: "boolean", default: "true", description: "Darken the edges like a CRT tube." },
      { name: "flicker", type: "boolean", default: "false", description: "Subtle brightness flicker, under one blip per second." },
      { name: "curvature", type: "boolean", default: "false", description: "Rounded tube corners, inner shadow and glass glare." },
      { name: "overlayClassName", type: "string", description: "Classes for the overlay layer." },
    ],
  },
  accessibility: [
    "The overlay is aria-hidden and pointer-events-none, so links, buttons and text selection underneath keep working.",
    "The flicker is a tiny brightness change (a few percent) at well under one blip per second — far below the 3-flashes-per-second threshold.",
    "With prefers-reduced-motion the scan bar is hidden and the flicker stops; static lines and vignette remain.",
    "Scanlines and vignette darken content, so check text contrast and lower lineOpacity for small text.",
  ],
};

export function ScanLineDocs() {
  return <ComponentDocs config={config} />;
}
