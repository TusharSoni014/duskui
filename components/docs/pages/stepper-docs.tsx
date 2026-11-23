import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import StepperDemo from "@/components/demos/stepper/stepper-demo";
import StepperVerticalDemo from "@/components/demos/stepper/stepper-vertical";
import StepperCustomControlsDemo from "@/components/demos/stepper/stepper-custom-controls";

const demo = (file: string) => `components/demos/stepper/${file}`;

const config: DocConfig = {
  title: "Stepper",
  intro:
    "A multi-step form and wizard component for React, built with Tailwind CSS and Motion: a progress line fills between steps, completed steps draw a check mark, and content panels slide in from the direction you're travelling while the container springs to the new height. Back, Next and Finish are wired up for you, with optional sync or async validation per step, horizontal or vertical layouts and a useStepper hook for custom controls.",
  tags: ["Content panels", "Per-step validation", "Async validate", "Direction-aware slides", "Horizontal / vertical", "useStepper hook", "Focus management"],
  hero: { Demo: StepperDemo, file: demo("stepper-demo.tsx"), minHeight: 420 },
  install: {
    registry: "stepper",
    source: "components/dusk/stepper/stepper.tsx",
    deps: "motion lucide-react",
    note: (
      <>
        Looking for a progress indicator only, without panels or navigation? Use the Stepper Progress block on the{" "}
        Progress page.
      </>
    ),
  },
  usage: {
    filename: "checkout.tsx",
    code: `"use client"

import {
  Stepper,
  StepperControls,
  StepperNav,
  StepperPanel,
  StepperPanels,
} from "@/components/dusk/stepper/stepper"

const steps = [
  { title: "Cart" },
  { title: "Shipping", validate: () => isAddressValid() || "Add a shipping address." },
  { title: "Payment" },
]

export function Checkout() {
  return (
    <Stepper steps={steps} onComplete={placeOrder}>
      <StepperNav label="Checkout" />
      <StepperPanels>
        <StepperPanel index={0}>…</StepperPanel>
        <StepperPanel index={1}>…</StepperPanel>
        <StepperPanel index={2}>…</StepperPanel>
      </StepperPanels>
      <StepperControls completeLabel="Place order" />
    </Stepper>
  )
}`,
  },
  examples: [
    {
      id: "vertical",
      title: "Vertical",
      description: (
        <>
          <Code>orientation=&quot;vertical&quot;</Code> puts the markers in a column beside the content (stacked on small
          screens) and slides panels vertically. Wrap the panels and controls in one element so they share the second
          column. <Code>StepperCompleted</Code> replaces the panels after the last step.
        </>
      ),
      Demo: StepperVerticalDemo,
      file: demo("stepper-vertical.tsx"),
      minHeight: 400,
    },
    {
      id: "custom-controls",
      title: "Custom controls",
      description: (
        <>
          Skip <Code>StepperNav</Code> and <Code>StepperControls</Code> and build your own with <Code>useStepper()</Code>.
          With <Code>linear={"{false}"}</Code> any step can be reached directly.
        </>
      ),
      Demo: StepperCustomControlsDemo,
      file: demo("stepper-custom-controls.tsx"),
      minHeight: 360,
    },
  ],
  api: {
    intro: (
      <>
        Props of <Code>Stepper</Code>; it also accepts any div attribute. <Code>StepperPanel</Code> takes an{" "}
        <Code>index</Code>, <Code>StepperNav</Code> a <Code>label</Code>, and <Code>StepperControls</Code> takes{" "}
        <Code>backLabel</Code>, <Code>nextLabel</Code>, <Code>completeLabel</Code> and <Code>restartLabel</Code> (null
        hides it). <Code>useStepper()</Code> returns the index, count, direction, completed, pending and error state plus{" "}
        <Code>next</Code>, <Code>back</Code>, <Code>goTo</Code> and <Code>reset</Code>.
      </>
    ),
    props: [
      { name: "steps", type: "{ title; description?; validate? }[]", description: "The steps. validate() may return false, an error message, or a Promise of either to block moving forward." },
      { name: "value", type: "number", description: "Controlled step index." },
      { name: "defaultValue", type: "number", default: "0", description: "Starting step when uncontrolled." },
      { name: "onValueChange", type: "(index: number) => void", description: "Called when the step changes." },
      { name: "onComplete", type: "() => void", description: "Called after the last step validates." },
      { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Markers above the content, or in a column beside it." },
      { name: "linear", type: "boolean", default: "true", description: "Only steps already reached can be jumped to from the markers." },
    ],
  },
  accessibility: [
    <>The markers are an ordered list inside a <Code>nav</Code>; the current one has <Code>aria-current=&quot;step&quot;</Code> and each spells out “completed”, “current step” or “not started” for screen readers.</>,
    <>Steps you can&apos;t reach yet are <Code>aria-disabled</Code> buttons, so they stay discoverable without doing anything.</>,
    <>Each panel is a group labelled by its step; when the step changes, focus moves to the new panel so the next Tab lands on its first field.</>,
    "Step changes, validation errors and completion are announced through a polite live region.",
    <>While async validation runs, Next is <Code>aria-busy</Code> and <Code>aria-disabled</Code> rather than disabled, so focus isn&apos;t lost.</>,
    "With prefers-reduced-motion, panels cross-fade in place and the progress line and check mark appear without animating.",
  ],
};

export function StepperDocs() {
  return <ComponentDocs config={config} />;
}
