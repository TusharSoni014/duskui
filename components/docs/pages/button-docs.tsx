import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import ButtonVariantsDemo from "@/components/demos/button/button-variants";
import ButtonSizesDemo from "@/components/demos/button/button-sizes";
import ButtonIconsDemo from "@/components/demos/button/button-icons";
import ButtonLoadingDemo from "@/components/demos/button/button-loading";
import ButtonAsChildDemo from "@/components/demos/button/button-as-child";
import ShimmerButtonDemo from "@/components/demos/button/shimmer-button-demo";
import MagneticButtonDemo from "@/components/demos/button/magnetic-button-demo";
import SpotlightButtonDemo from "@/components/demos/button/spotlight-button-demo";
import StatusButtonDemo from "@/components/demos/button/status-button-demo";
import HoldToConfirmDemo from "@/components/demos/button/hold-to-confirm-demo";
import CopyButtonDemo from "@/components/demos/button/copy-button-demo";

const demo = (file: string) => `components/demos/button/${file}`;
const block = (file: string) => `components/dusk/button/${file}`;

const config: DocConfig = {
  title: "Button",
  intro:
    "The shadcn/ui Button, upgraded with Motion: a width-stable loading state, tactile press feedback and reduced-motion support — plus six animated blocks built on top of it.",
  tags: ["Drop-in shadcn API", "Motion", "Keyboard & screen-reader friendly", "prefers-reduced-motion"],
  hero: { Demo: ButtonLoadingDemo, file: demo("button-loading.tsx") },
  install: {
    registry: "button",
    source: "components/ui/button.tsx",
    deps: "motion @radix-ui/react-slot class-variance-authority lucide-react",
    note: (
      <>
        Already using shadcn/ui? This file replaces <Code>components/ui/button.tsx</Code> and keeps the
        same API, so existing buttons keep working.
      </>
    ),
  },
  usage: {
    filename: "save-button.tsx",
    code: `import { Button } from "@/components/ui/button"

export function SaveButton() {
  const [saving, setSaving] = React.useState(false)

  return (
    <Button loading={saving} onClick={() => setSaving(true)}>
      Save
    </Button>
  )
}`,
  },
  examples: [
    {
      id: "variants",
      title: "Variants",
      description: (
        <>
          All six shadcn variants plus <Code>soft</Code>, a tinted primary for secondary actions that
          still need the brand color.
        </>
      ),
      Demo: ButtonVariantsDemo,
      file: demo("button-variants.tsx"),
    },
    {
      id: "sizes",
      title: "Sizes",
      description: (
        <>
          Text sizes <Code>sm</Code>, <Code>default</Code>, <Code>lg</Code> and square icon sizes. Always
          give icon-only buttons an <Code>aria-label</Code>.
        </>
      ),
      Demo: ButtonSizesDemo,
      file: demo("button-sizes.tsx"),
    },
    {
      id: "with-icons",
      title: "With icons",
      description:
        "Drop any Lucide icon in as a child. Icons are auto-sized, and a group class makes trailing arrows nudge on hover.",
      Demo: ButtonIconsDemo,
      file: demo("button-icons.tsx"),
    },
    {
      id: "loading",
      title: "Loading",
      description: (
        <>
          <Code>loading</Code> crossfades the label into a spinner without changing the width, so nothing
          around it jumps. Clicks are blocked, but the button stays focusable and announces{" "}
          <Code>aria-busy</Code>. Add <Code>loadingText</Code> to show a label next to the spinner.
        </>
      ),
      Demo: ButtonLoadingDemo,
      file: demo("button-loading.tsx"),
    },
    {
      id: "as-child",
      title: "As link",
      description: (
        <>
          <Code>asChild</Code> merges the button styles onto its child, e.g. a Next.js <Code>Link</Code>.
        </>
      ),
      Demo: ButtonAsChildDemo,
      file: demo("button-as-child.tsx"),
    },
  ],
  blocks: [
    {
      id: "status-button",
      title: "Status Button",
      registry: "status-button",
      source: block("status-button.tsx"),
      deps: "motion lucide-react",
      description: (
        <>
          Walks through idle → loading → success / error in place. The width springs between labels, the
          check mark draws itself and errors shake. Pair it with the <Code>useStatusAction</Code> hook to
          wire any async function.
        </>
      ),
      Demo: StatusButtonDemo,
      file: demo("status-button-demo.tsx"),
      props: [
        { name: "status", type: '"idle" | "loading" | "success" | "error"', default: '"idle"', description: "Current state. Idle renders children." },
        { name: "labels", type: "Partial<Record<status, ReactNode>>", default: "Saving / Saved / Try again", description: "Labels for the non-idle states." },
      ],
    },
    {
      id: "hold-to-confirm",
      title: "Hold to Confirm",
      registry: "hold-to-confirm-button",
      source: block("hold-to-confirm-button.tsx"),
      deps: "motion",
      description:
        "A safer alternative to a confirm dialog for destructive actions. A fill wipes across while held; releasing early springs it back. Works with mouse, touch, Space and Enter.",
      Demo: HoldToConfirmDemo,
      file: demo("hold-to-confirm-demo.tsx"),
      props: [
        { name: "onConfirm", type: "() => void", description: "Called once the hold completes." },
        { name: "holdDuration", type: "number", default: "1200", description: "Hold time in milliseconds." },
        { name: "fillClassName", type: "string", default: '"bg-destructive text-white"', description: "Classes for the fill layer." },
      ],
    },
    {
      id: "shimmer-button",
      title: "Shimmer Button",
      registry: "shimmer-button",
      source: block("shimmer-button.tsx"),
      deps: "motion",
      description:
        "A light sheen sweeps across on hover, or on a slow loop with idle. Best kept to one primary call to action per screen.",
      Demo: ShimmerButtonDemo,
      file: demo("shimmer-button-demo.tsx"),
      props: [
        { name: "idle", type: "boolean", default: "false", description: "Sweep on a loop instead of only on hover." },
        { name: "interval", type: "number", default: "2.5", description: "Seconds between idle sweeps." },
      ],
    },
    {
      id: "magnetic-button",
      title: "Magnetic Button",
      registry: "magnetic-button",
      source: block("magnetic-button.tsx"),
      deps: "motion",
      description:
        "Pulled toward the cursor on spring physics, with the label moving slightly further for depth. Mouse only; static for touch and reduced motion.",
      Demo: MagneticButtonDemo,
      file: demo("magnetic-button-demo.tsx"),
      props: [{ name: "strength", type: "number", default: "0.35", description: "How far the button follows the cursor (0–1)." }],
    },
    {
      id: "spotlight-button",
      title: "Spotlight Button",
      registry: "spotlight-button",
      source: block("spotlight-button.tsx"),
      deps: "motion",
      description:
        "A soft light tracks the cursor along the border and surface. Uses motion values, so moving the mouse never re-renders React.",
      Demo: SpotlightButtonDemo,
      file: demo("spotlight-button-demo.tsx"),
      props: [
        { name: "radius", type: "number", default: "80", description: "Radius of the light in px." },
        { name: "color", type: "string", default: '"var(--color-primary)"', description: "Any CSS color." },
      ],
    },
    {
      id: "copy-button",
      title: "Copy Button",
      registry: "copy-button",
      source: block("copy-button.tsx"),
      deps: "motion lucide-react",
      description: "Copies text and morphs the icon into a check mark. It powers every copy button in these docs.",
      Demo: CopyButtonDemo,
      file: demo("copy-button-demo.tsx"),
      props: [
        { name: "value", type: "string", description: "Text written to the clipboard." },
        { name: "onCopied", type: "(value: string) => void", description: "Called after a successful copy." },
        { name: "timeout", type: "number", default: "1600", description: "How long the check stays, in ms." },
      ],
    },
  ],
  api: {
    intro: (
      <>
        Accepts every native <Code>&lt;button&gt;</Code> prop. Also exports <Code>MotionButton</Code> (the
        Button with Motion props) and <Code>buttonVariants</Code> for styling other elements.
      </>
    ),
    props: [
      { name: "variant", type: '"default" | "secondary" | "soft" | "outline" | "ghost" | "destructive" | "link"', default: '"default"', description: "Visual style." },
      { name: "size", type: '"sm" | "default" | "lg" | "icon" | "icon-sm" | "icon-lg"', default: '"default"', description: "Height and padding." },
      { name: "loading", type: "boolean", default: "false", description: "Shows a spinner, blocks clicks, keeps width and focus." },
      { name: "loadingText", type: "ReactNode", description: "Optional label next to the spinner." },
      { name: "loaderIcon", type: "ComponentType<{ className?: string }>", default: "Loader2", description: "Custom spinner icon." },
      { name: "asChild", type: "boolean", default: "false", description: "Render the child element instead (Radix Slot). Loading is ignored." },
    ],
  },
  accessibility: [
    <>While loading the button uses <Code>aria-disabled</Code> and <Code>aria-busy</Code> instead of <Code>disabled</Code>, so focus is never lost.</>,
    <>The spinner has a screen-reader label; status changes in Status Button are announced with <Code>aria-live</Code>.</>,
    <>Visible focus ring on keyboard focus only (<Code>focus-visible</Code>).</>,
    "Movement is removed when the user prefers reduced motion; opacity fades remain.",
  ],
};

export function ButtonDocs() {
  return <ComponentDocs config={config} />;
}
