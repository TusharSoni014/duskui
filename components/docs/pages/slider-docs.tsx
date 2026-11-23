import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import SliderBasicDemo from "@/components/demos/slider/slider-basic";
import SliderRangeDemo from "@/components/demos/slider/slider-range";
import ValueSliderDemo from "@/components/demos/slider/value-slider-demo";
import SteppedSliderDemo from "@/components/demos/slider/stepped-slider-demo";

const demo = (file: string) => `components/demos/slider/${file}`;
const block = (file: string) => `components/dusk/slider/${file}`;

const config: DocConfig = {
  title: "Slider",
  intro:
    "The shadcn/ui Slider with a thumb that grows slightly while you drag it and range-slider labels for screen readers — plus two animated React slider blocks built with Motion and Radix: a slider with a floating value tooltip that leans slightly as you drag, and a stepped slider with tick marks that light up.",
  tags: ["Drop-in shadcn API", "Range & vertical", "Keyboard accessible", "Motion blocks"],
  hero: { Demo: ValueSliderDemo, file: demo("value-slider-demo.tsx"), minHeight: 260 },
  install: {
    registry: "slider",
    source: "components/ui/slider.tsx",
    deps: "@radix-ui/react-slider",
    note: (
      <>
        Replaces <Code>components/ui/slider.tsx</Code> with the same API. The drag feedback is CSS, so
        the base needs no Motion; the root gets <Code>data-dragging</Code> while a pointer is down if
        you want to style around it.
      </>
    ),
  },
  usage: {
    filename: "volume.tsx",
    code: `import { Slider } from "@/components/ui/slider"

export function Volume() {
  return <Slider defaultValue={[60]} max={100} step={1} aria-label="Volume" />
}`,
  },
  examples: [
    {
      id: "default",
      title: "Default",
      description:
        "Press and drag a thumb and it grows a little to show it's held. Arrow keys, Page Up/Down and Home/End work once it's focused.",
      Demo: SliderBasicDemo,
      file: demo("slider-basic.tsx"),
      minHeight: 180,
    },
    {
      id: "range",
      title: "Range & vertical",
      description: (
        <>
          Pass two values for a range; <Code>minStepsBetweenThumbs</Code> keeps the thumbs apart and
          they&apos;re announced as “Price, minimum” and “Price, maximum”. Set{" "}
          <Code>orientation=&quot;vertical&quot;</Code> and give it a height for a vertical slider.
        </>
      ),
      Demo: SliderRangeDemo,
      file: demo("slider-range.tsx"),
      minHeight: 220,
    },
  ],
  blocks: [
    {
      id: "value-slider",
      title: "Value Slider",
      registry: "value-slider",
      source: block("value-slider.tsx"),
      deps: "motion @radix-ui/react-slider",
      description: (
        <>
          A value bubble rides on each thumb. It springs up on hover, keyboard focus or drag, leans
          into the direction you&apos;re dragging (driven by the value&apos;s velocity, so nothing
          re-renders per frame) and settles upright when you stop. Format it with{" "}
          <Code>formatValue</Code>; the same text is announced via <Code>aria-valuetext</Code>.
        </>
      ),
      Demo: ValueSliderDemo,
      file: demo("value-slider-demo.tsx"),
      minHeight: 260,
      props: [
        { name: "value / defaultValue", type: "number[]", description: "One value for a single thumb, two for a range." },
        { name: "onValueChange", type: "(value: number[]) => void", description: "Called on every change." },
        { name: "formatValue", type: "(value: number) => string", description: "Text in the bubble and for screen readers." },
        { name: "showBubble", type: '"interacting" | "always"', default: '"interacting"', description: "Show the bubble only on hover, focus and drag, or all the time." },
        { name: "aria-label", type: "string", description: "Accessible name; range thumbs get minimum / maximum appended." },
        { name: "...props", type: "Radix Slider props", description: "min, max, step, minStepsBetweenThumbs, disabled, onValueCommit…" },
      ],
    },
    {
      id: "stepped-slider",
      title: "Stepped Slider",
      registry: "stepped-slider",
      source: block("stepped-slider.tsx"),
      deps: "motion @radix-ui/react-slider",
      description: (
        <>
          A slider that snaps between named steps — plans, sizes, levels. Tick marks light up as the
          range passes them, the selected tick stretches, and clicking a label jumps to it.
          Values are strings, and <Code>name</Code> submits the selected step with a form.
        </>
      ),
      Demo: SteppedSliderDemo,
      file: demo("stepped-slider-demo.tsx"),
      minHeight: 300,
      props: [
        { name: "steps", type: "(string | { value: string; label: ReactNode; valueText?: string })[]", description: "The choices, in order. Required." },
        { name: "value / defaultValue", type: "string", description: "The selected step's value." },
        { name: "onValueChange / onValueCommit", type: "(value: string) => void", description: "Called on change, and when the user finishes changing it." },
        { name: "name", type: "string", description: "Submits the selected value with a form." },
        { name: "hideLabels", type: "boolean", default: "false", description: "Show only the tick marks." },
        { name: "aria-label", type: "string", description: "Accessible name for the slider." },
      ],
    },
  ],
  api: {
    intro: (
      <>
        Same as shadcn/ui: a single <Code>Slider</Code> that renders one thumb per value and forwards
        the Radix Slider props.
      </>
    ),
    props: [
      { name: "value / defaultValue", type: "number[]", description: "One value per thumb." },
      { name: "onValueChange / onValueCommit", type: "(value: number[]) => void", description: "Called while dragging / when the drag or key press ends." },
      { name: "min / max / step", type: "number", default: "0 / 100 / 1", description: "Range and increment." },
      { name: "minStepsBetweenThumbs", type: "number", default: "0", description: "Minimum gap between range thumbs, in steps." },
      { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Give vertical sliders a height." },
      { name: "aria-label / aria-labelledby", type: "string", description: "Forwarded to the thumbs (role=\"slider\")." },
    ],
  },
  accessibility: [
    <>Built on Radix Slider: each thumb is a <Code>role=&quot;slider&quot;</Code> with <Code>aria-valuemin</Code>, <Code>-max</Code> and <Code>-now</Code>, operable with arrows, Page Up/Down and Home/End.</>,
    <>Label sliders with <Code>aria-label</Code> or <Code>aria-labelledby</Code>; the base and blocks move the label onto the thumbs, where screen readers look for it.</>,
    <>Value Slider and Stepped Slider set <Code>aria-valuetext</Code> to the formatted value or step label, so “$240” or “50,000 requests” is read instead of a raw number.</>,
    "Under prefers-reduced-motion thumbs resize instantly, the value bubble fades without leaning and ticks change without animating.",
  ],
};

export function SliderDocs() {
  return <ComponentDocs config={config} />;
}
