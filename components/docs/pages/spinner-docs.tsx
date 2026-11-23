import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import SpinnerBasicDemo from "@/components/demos/spinner/spinner-basic";
import SpinnerUsageDemo from "@/components/demos/spinner/spinner-usage";
import LoadersDemo from "@/components/demos/spinner/loaders-demo";
import LoadersInlineDemo from "@/components/demos/spinner/loaders-inline-demo";

const demo = (file: string) => `components/demos/spinner/${file}`;
const block = (file: string) => `components/dusk/spinner/${file}`;

const config: DocConfig = {
  title: "Spinner",
  intro:
    "An accessible React loading spinner with role=\"status\", a screen-reader label and four sizes — plus five animated loaders built with Motion: bouncing dots, equalizer bars, a gradient ring, an orbit and a radar pulse, all respecting reduced motion.",
  tags: ["role=\"status\"", "Server Component friendly", "currentColor", "prefers-reduced-motion"],
  hero: { Demo: LoadersDemo, file: demo("loaders-demo.tsx"), minHeight: 260 },
  install: {
    registry: "spinner",
    source: "components/ui/spinner.tsx",
    deps: "class-variance-authority",
    note: (
      <>
        Adds <Code>components/ui/spinner.tsx</Code>. CSS only, colored with <Code>currentColor</Code>, so
        it inherits the text color of buttons and badges.
      </>
    ),
  },
  usage: {
    filename: "loading.tsx",
    code: `import { Spinner } from "@/components/ui/spinner"

export function Loading() {
  return <Spinner size="lg" className="text-primary" label="Loading projects" />
}`,
  },
  examples: [
    {
      id: "sizes",
      title: "Sizes & colors",
      description: (
        <>
          <Code>size</Code> is sm, default, lg or xl, and <Code>text-*</Code> classes recolor it.
        </>
      ),
      Demo: SpinnerBasicDemo,
      file: demo("spinner-basic.tsx"),
      minHeight: 160,
    },
    {
      id: "in-context",
      title: "In buttons, badges & rows",
      description: (
        <>
          When the surrounding text already says what&apos;s happening (&quot;Saving…&quot;), add{" "}
          <Code>aria-hidden</Code> to the spinner so it isn&apos;t announced twice. Keep busy buttons
          focusable with <Code>aria-disabled</Code> and <Code>aria-busy</Code>.
        </>
      ),
      Demo: SpinnerUsageDemo,
      file: demo("spinner-usage.tsx"),
      minHeight: 220,
    },
  ],
  blocks: [
    {
      id: "loaders",
      title: "Animated Loaders",
      registry: "loaders",
      source: block("loaders.tsx"),
      deps: "motion",
      description: (
        <>
          Five loaders from one file: <Code>DotsLoader</Code>, <Code>BarsLoader</Code>,{" "}
          <Code>RingLoader</Code>, <Code>OrbitLoader</Code> and <Code>PulseLoader</Code>. Each is a{" "}
          <Code>role=&quot;status&quot;</Code> box with a hidden label, drawn in <Code>currentColor</Code>{" "}
          and sized in pixels. Under reduced motion they stop moving and fade in turn instead.
        </>
      ),
      Demo: LoadersDemo,
      file: demo("loaders-demo.tsx"),
      minHeight: 260,
      props: [
        { name: "size", type: "number", default: "32", description: "Width and height in pixels." },
        { name: "label", type: "string", default: '"Loading"', description: "Text announced to screen readers." },
        { name: "speed", type: "number", description: "Seconds per loop; lower is faster. Each loader has its own default." },
        { name: "bars", type: "number", default: "5", description: "BarsLoader only. Number of bars." },
        { name: "thickness", type: "number", default: "3", description: "RingLoader only. Ring thickness in pixels." },
        { name: "rings", type: "number", default: "2", description: "PulseLoader only. Number of ripples." },
      ],
    },
    {
      id: "loaders-in-context",
      title: "Loaders in context",
      registry: "loaders",
      source: block("loaders.tsx"),
      deps: "motion",
      description: (
        <>
          Dots for a typing indicator, a pulse for a live connection, a thin ring inside a button. Recolor
          any loader with <Code>text-*</Code>.
        </>
      ),
      Demo: LoadersInlineDemo,
      file: demo("loaders-inline-demo.tsx"),
      minHeight: 260,
    },
  ],
  api: {
    intro: (
      <>
        <Code>Spinner</Code> renders a <Code>&lt;span role=&quot;status&quot;&gt;</Code> and forwards span
        props.
      </>
    ),
    props: [
      { name: "size", type: '"sm" | "default" | "lg" | "xl"', default: '"default"', description: "Spinner size." },
      { name: "label", type: "string", default: '"Loading"', description: "Screen-reader text inside the status region." },
    ],
  },
  accessibility: [
    <>Every spinner and loader is a <Code>role=&quot;status&quot;</Code> live region with visually hidden text, so the loading state is announced instead of being a silent icon.</>,
    <>Pass a specific <Code>label</Code> (&quot;Loading invoices&quot;) when several things can load at once.</>,
    <>Mark the busy container with <Code>aria-busy=&quot;true&quot;</Code> while content loads, and remove the spinner when it&apos;s done.</>,
    "Under prefers-reduced-motion the Spinner turns slowly and the loaders fade instead of moving, so progress is still visible without motion.",
  ],
};

export function SpinnerDocs() {
  return <ComponentDocs config={config} />;
}
