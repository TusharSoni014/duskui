import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import ProgressBasicDemo from "@/components/demos/progress/progress-basic";
import ProgressIndeterminateDemo from "@/components/demos/progress/progress-indeterminate";
import CircularProgressDemo from "@/components/demos/progress/circular-progress-demo";
import StepperProgressDemo from "@/components/demos/progress/stepper-progress-demo";
import SegmentedProgressDemo from "@/components/demos/progress/segmented-progress-demo";

const demo = (file: string) => `components/demos/progress/${file}`;
const block = (file: string) => `components/dusk/progress/${file}`;

const config: DocConfig = {
  title: "Progress",
  intro:
    "The shadcn/ui Progress bar with a spring-animated indicator and an indeterminate loading state — plus three animated React progress blocks built with Motion and Radix: a circular progress ring with a counting number, a multi-step stepper and a segmented progress bar for chunked uploads.",
  tags: ["Drop-in shadcn API", "Radix Progress", "Spring physics", "prefers-reduced-motion"],
  hero: { Demo: CircularProgressDemo, file: demo("circular-progress-demo.tsx"), minHeight: 300 },
  install: {
    registry: "progress",
    source: "components/ui/progress.tsx",
    deps: "@radix-ui/react-progress motion",
    note: (
      <>
        Replaces <Code>components/ui/progress.tsx</Code> with the same API, plus{" "}
        <Code>indicatorClassName</Code>. Following Radix, a missing or <Code>null</Code> value now
        means indeterminate; pass <Code>value={"{0}"}</Code> for an empty bar.
      </>
    ),
  },
  usage: {
    filename: "upload-status.tsx",
    code: `import { Progress } from "@/components/ui/progress"

export function UploadStatus({ percent }: { percent: number }) {
  return <Progress value={percent} aria-label="Upload progress" />
}`,
  },
  examples: [
    {
      id: "default",
      title: "Default",
      description:
        "The bar fills in from empty when it mounts and springs to every new value, so quick jumps settle naturally instead of snapping. Use the buttons to change it.",
      Demo: ProgressBasicDemo,
      file: demo("progress-basic.tsx"),
      minHeight: 200,
    },
    {
      id: "indeterminate",
      title: "Indeterminate",
      description: (
        <>
          When you don&apos;t know how long something will take, pass <Code>value={"{null}"}</Code> and a
          highlight sweeps across the track. Radix sets <Code>data-state=&quot;indeterminate&quot;</Code>{" "}
          and leaves out <Code>aria-valuenow</Code>.
        </>
      ),
      Demo: ProgressIndeterminateDemo,
      file: demo("progress-indeterminate.tsx"),
      minHeight: 160,
    },
  ],
  blocks: [
    {
      id: "circular-progress",
      title: "Circular Progress",
      registry: "circular-progress",
      source: block("circular-progress.tsx"),
      deps: "motion @radix-ui/react-progress",
      description: (
        <>
          An SVG ring that springs to its value while the number in the middle counts along. Both are
          driven by one spring motion value, so they never drift apart and React doesn&apos;t re-render
          per frame. Recolor it with <Code>text-*</Code> classes on the indicator and track.
        </>
      ),
      Demo: CircularProgressDemo,
      file: demo("circular-progress-demo.tsx"),
      minHeight: 300,
      props: [
        { name: "value", type: "number", description: "Current value, 0 to max. Required." },
        { name: "max", type: "number", default: "100", description: "Maximum value." },
        { name: "size", type: "number", default: "120", description: "Diameter in pixels." },
        { name: "strokeWidth", type: "number", default: "10", description: "Ring thickness in pixels." },
        { name: "showValue", type: "boolean", default: "true", description: "Show the counting number." },
        { name: "formatValue", type: "(value: number, max: number) => string", description: "Formats the number. Defaults to a whole percentage." },
        { name: "caption", type: "ReactNode", description: "Small text under the number." },
        { name: "glow", type: "boolean", default: "true", description: "Soft glow under the arc." },
        { name: "indicatorClassName / trackClassName", type: "string", description: "Classes for the arc and the track (use text-*)." },
      ],
    },
    {
      id: "stepper-progress",
      title: "Stepper Progress",
      registry: "stepper-progress",
      source: block("stepper-progress.tsx"),
      deps: "motion",
      description: (
        <>
          A stepper for onboarding, checkout or any multi-step form. Connectors fill with a spring as
          you advance, finished steps draw a check mark and the current step breathes. Set{" "}
          <Code>current</Code> to <Code>steps.length</Code> to mark everything complete.
        </>
      ),
      Demo: StepperProgressDemo,
      file: demo("stepper-progress-demo.tsx"),
      minHeight: 240,
      props: [
        { name: "steps", type: "(string | { title: string; description?: string })[]", description: "The steps, in order. Required." },
        { name: "current", type: "number", description: "Index of the step in progress; earlier steps are complete. Required." },
        { name: "label", type: "string", default: '"Progress"', description: "Accessible name for the list." },
      ],
    },
    {
      id: "segmented-progress",
      title: "Segmented Progress",
      registry: "segmented-progress",
      source: block("segmented-progress.tsx"),
      deps: "motion @radix-ui/react-progress",
      description: (
        <>
          A bar split into segments that fill one after another, for chunked uploads, quotas or
          checklists. A single spring drives the whole bar and each segment takes its slice of it, so
          the fill flows from segment to segment, and the segment being filled glows.
        </>
      ),
      Demo: SegmentedProgressDemo,
      file: demo("segmented-progress-demo.tsx"),
      minHeight: 200,
      props: [
        { name: "value", type: "number", description: "Current value, 0 to max. Required." },
        { name: "max", type: "number", default: "100", description: "Maximum value." },
        { name: "segments", type: "number", description: "Segment count. Defaults to max when it's 12 or less, otherwise 10." },
        { name: "segmentClassName / indicatorClassName", type: "string", description: "Classes for each segment's track and fill." },
      ],
    },
  ],
  api: {
    intro: (
      <>
        Same as shadcn/ui: a single <Code>Progress</Code> component that forwards the Radix Progress
        props.
      </>
    ),
    props: [
      { name: "value", type: "number | null", description: "Current value. null or undefined shows the indeterminate sweep." },
      { name: "max", type: "number", default: "100", description: "Maximum value." },
      { name: "getValueLabel", type: "(value: number, max: number) => string", description: "Text for aria-valuetext. Defaults to a percentage." },
      { name: "indicatorClassName", type: "string", description: "Classes for the moving bar, e.g. a different color." },
    ],
  },
  accessibility: [
    <>Built on Radix Progress: <Code>role=&quot;progressbar&quot;</Code> with <Code>aria-valuemin</Code>, <Code>aria-valuemax</Code>, <Code>aria-valuenow</Code> and a readable value text.</>,
    <>Give every bar a name with <Code>aria-label</Code> or <Code>aria-labelledby</Code> pointing at its visible label.</>,
    <>The circular ring&apos;s counting number is hidden from screen readers; the progressbar value is announced instead.</>,
    <>Stepper Progress is an ordered list with <Code>aria-current=&quot;step&quot;</Code> and each step&apos;s state (completed, current, not started) spelled out.</>,
    "Under prefers-reduced-motion bars, rings and segments jump to their value, the indeterminate sweep becomes a pulse and the stepper halo stops.",
  ],
};

export function ProgressDocs() {
  return <ComponentDocs config={config} />;
}
