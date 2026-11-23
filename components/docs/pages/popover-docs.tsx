import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import PopoverBasicDemo from "@/components/demos/popover/popover-basic";
import PopoverSidesDemo from "@/components/demos/popover/popover-sides";
import AnimatedPopoverDemo from "@/components/demos/popover/animated-popover-demo";
import FeedbackPopoverDemo from "@/components/demos/popover/feedback-popover-demo";

const demo = (file: string) => `components/demos/popover/${file}`;
const block = (file: string) => `components/dusk/popover/${file}`;

const config: DocConfig = {
  title: "Popover",
  intro:
    "The shadcn/ui Popover that grows out of its trigger with a softer, faster animation and a layered surface — plus two animated React popover blocks built with Motion and Radix: a spring popover that scales from the trigger's origin, and a feedback button that morphs into a form.",
  tags: ["Drop-in shadcn API", "Radix positioning", "Motion blocks", "prefers-reduced-motion"],
  hero: { Demo: FeedbackPopoverDemo, file: demo("feedback-popover-demo.tsx"), minHeight: 340 },
  install: {
    registry: "popover",
    source: "components/ui/popover.tsx",
    deps: "@radix-ui/react-popover",
    note: (
      <>
        Replaces <Code>components/ui/popover.tsx</Code> with the same exports and props, plus{" "}
        <Code>PopoverClose</Code>. Animations are CSS (tw-animate-css), so the base needs no Motion.
      </>
    ),
  },
  usage: {
    filename: "layer-settings.tsx",
    code: `import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function LayerSettings() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Dimensions</Button>
      </PopoverTrigger>
      <PopoverContent>{/* form */}</PopoverContent>
    </Popover>
  )
}`,
  },
  examples: [
    {
      id: "default",
      title: "Default",
      description:
        "Scales and slides out of the trigger on an expo-out curve and closes quicker than it opened. Focus moves into the popover; Escape or a click outside closes it and focus returns to the trigger.",
      Demo: PopoverBasicDemo,
      file: demo("popover-basic.tsx"),
      minHeight: 320,
    },
    {
      id: "sides",
      title: "Sides",
      description: (
        <>
          The scale origin comes from <Code>--radix-popover-content-transform-origin</Code>, so the
          popover always grows from the edge facing its trigger — including after Radix flips it to
          stay on screen.
        </>
      ),
      Demo: PopoverSidesDemo,
      file: demo("popover-sides.tsx"),
      minHeight: 260,
    },
  ],
  blocks: [
    {
      id: "animated-popover",
      title: "Animated Popover",
      registry: "animated-popover",
      source: block("animated-popover.tsx"),
      deps: "motion @radix-ui/react-popover",
      description: (
        <>
          A Motion-powered popover that springs out of its trigger&apos;s transform origin with a touch
          of blur, then fades its content up a beat later; the exit is short and crisp. Optional{" "}
          <Code>showArrow</Code> draws an arrow that follows Radix&apos;s placement.
        </>
      ),
      Demo: AnimatedPopoverDemo,
      file: demo("animated-popover-demo.tsx"),
      minHeight: 300,
      props: [
        { name: "open / defaultOpen / onOpenChange", type: "boolean / boolean / (open: boolean) => void", description: "Open state (on AnimatedPopover)." },
        { name: "AnimatedPopoverTrigger / Anchor / Close", type: "Radix props", description: "Use asChild to render your own elements." },
        { name: "AnimatedPopoverContent", type: "Radix Content props & { showArrow?: boolean }", description: "side, align (default center), sideOffset (default 8)…" },
      ],
    },
    {
      id: "feedback-popover",
      title: "Feedback Popover",
      registry: "feedback-popover",
      source: block("feedback-popover.tsx"),
      deps: "motion lucide-react",
      description: (
        <>
          A pill button that morphs into a feedback form: the surface, icon and label share Motion{" "}
          <Code>layoutId</Code>s, so the pill stretches into the panel and the label flies into the
          title. Return a promise from <Code>onSubmit</Code> for a loading state; throw to show an
          error inline (type “error” in the demo). On success it shows a check, then shrinks back into
          the button. It renders inline rather than in a portal so the morph can be measured, so leave
          room around it.
        </>
      ),
      Demo: FeedbackPopoverDemo,
      file: demo("feedback-popover-demo.tsx"),
      minHeight: 340,
      props: [
        { name: "onSubmit", type: "(message: string) => unknown | Promise<unknown>", description: "Runs on submit. Throw to keep the panel open with an error." },
        { name: "label", type: "string", default: '"Feedback"', description: "Button text and panel title." },
        { name: "icon", type: "ReactNode | null", description: "Leading icon. null hides it." },
        { name: "placeholder", type: "string", description: "Textarea placeholder." },
        { name: "successMessage", type: "ReactNode", description: "Shown after a successful submit." },
        { name: "successDuration", type: "number", default: "1600", description: "Milliseconds to show the success state before closing." },
        { name: "maxLength", type: "number", description: "Character limit; shows a counter." },
        { name: "side / align", type: '"top" | "bottom" / "start" | "end"', default: '"bottom" / "start"', description: "Open downward or upward, from the left or right edge." },
        { name: "open / defaultOpen / onOpenChange", type: "boolean / boolean / (open: boolean) => void", description: "Open state." },
        { name: "panelClassName", type: "string", description: "Classes for the open panel, e.g. a width." },
      ],
    },
  ],
  api: {
    intro: (
      <>
        Same parts as shadcn/ui: <Code>Popover</Code>, <Code>PopoverTrigger</Code>,{" "}
        <Code>PopoverContent</Code> and <Code>PopoverAnchor</Code>, plus <Code>PopoverClose</Code>.
        Each forwards the Radix Popover props.
      </>
    ),
    props: [
      { name: "open / onOpenChange", type: "boolean / (open: boolean) => void", description: "Controlled state (on Popover)." },
      { name: "modal", type: "boolean", default: "false", description: "Trap focus and block outside interaction (on Popover)." },
      { name: "side / align / sideOffset", type: "string / string / number", default: '"bottom" / "center" / 6', description: "Placement (on PopoverContent)." },
      { name: "onOpenAutoFocus / onEscapeKeyDown / onInteractOutside", type: "(event) => void", description: "Radix hooks on PopoverContent; call preventDefault() to override." },
    ],
  },
  accessibility: [
    <>Built on Radix Popover: the trigger has <Code>aria-expanded</Code> and <Code>aria-controls</Code>, the content is a <Code>role=&quot;dialog&quot;</Code>, Escape and outside clicks close it and focus returns to the trigger.</>,
    <>Feedback Popover follows the same pattern by hand: <Code>aria-expanded</Code> / <Code>aria-haspopup=&quot;dialog&quot;</Code> on the button, a labelled dialog, focus on the textarea, Escape to close, and errors and success announced via <Code>role=&quot;alert&quot;</Code> / <Code>role=&quot;status&quot;</Code>.</>,
    "Under prefers-reduced-motion popovers only fade and the feedback button crossfades instead of morphing.",
  ],
};

export function PopoverDocs() {
  return <ComponentDocs config={config} />;
}
