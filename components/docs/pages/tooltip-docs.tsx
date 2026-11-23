import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import TooltipBasicDemo from "@/components/demos/tooltip/tooltip-basic";
import TooltipSidesDemo from "@/components/demos/tooltip/tooltip-sides";
import AnimatedTooltipDemo from "@/components/demos/tooltip/animated-tooltip-demo";
import AvatarTooltipGroupDemo from "@/components/demos/tooltip/avatar-tooltip-group-demo";

const demo = (file: string) => `components/demos/tooltip/${file}`;
const block = (file: string) => `components/dusk/tooltip/${file}`;

const config: DocConfig = {
  title: "Tooltip",
  intro:
    "An animated React tooltip built on shadcn/ui and Radix: the drop-in Tooltip opens from its trigger with a scale, slide and blur on an elevated dark surface — plus Motion blocks for a spring tooltip with a one-line API and an overlapping avatar group whose name cards tilt toward the cursor.",
  tags: ["Drop-in shadcn API", "Radix Tooltip", "Spring animation", "Motion values", "prefers-reduced-motion"],
  hero: { Demo: AvatarTooltipGroupDemo, file: demo("avatar-tooltip-group-demo.tsx"), minHeight: 220 },
  install: {
    registry: "tooltip",
    source: "components/ui/tooltip.tsx",
    deps: "@radix-ui/react-tooltip",
    note: (
      <>
        Replaces <Code>components/ui/tooltip.tsx</Code> with the same parts and props, so the shadcn
        Sidebar and any existing tooltips keep working. CSS only (tw-animate-css).
      </>
    ),
  },
  usage: {
    filename: "copy-button.tsx",
    code: `import { Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export function CopyButton() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Copy link">
          <Copy />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Copy link</TooltipContent>
    </Tooltip>
  )
}`,
  },
  examples: [
    {
      id: "default",
      title: "Default",
      description:
        "Hover or Tab to an icon button. The tooltip grows out of the trigger and closes faster than it opens.",
      Demo: TooltipBasicDemo,
      file: demo("tooltip-basic.tsx"),
      minHeight: 180,
    },
    {
      id: "sides",
      title: "Sides",
      description: (
        <>
          <Code>side</Code> on <Code>TooltipContent</Code> picks where it opens; it slides in from that side
          and flips automatically near the viewport edge.
        </>
      ),
      Demo: TooltipSidesDemo,
      file: demo("tooltip-sides.tsx"),
      minHeight: 200,
    },
  ],
  blocks: [
    {
      id: "animated-tooltip",
      title: "Animated Tooltip",
      registry: "animated-tooltip",
      source: block("animated-tooltip.tsx"),
      deps: "motion @radix-ui/react-tooltip",
      description: (
        <>
          A spring tooltip with a one-line API: wrap any trigger and pass <Code>content</Code>. It scales up
          from the Radix transform origin, travels a few pixels away from the side it opens on and
          un-blurs, then shrinks back on exit thanks to <Code>AnimatePresence</Code> and{" "}
          <Code>forceMount</Code>.
        </>
      ),
      Demo: AnimatedTooltipDemo,
      file: demo("animated-tooltip-demo.tsx"),
      minHeight: 200,
      props: [
        { name: "content", type: "ReactNode", description: "What the tooltip says. Required." },
        { name: "children", type: "ReactElement", description: "The trigger; must accept a ref (button, link, Button)." },
        { name: "side", type: '"top" | "right" | "bottom" | "left"', default: '"top"', description: "Preferred side; flips on collision." },
        { name: "sideOffset", type: "number", default: "2 (8 without arrow)", description: "Distance from the trigger in px." },
        { name: "delayDuration", type: "number", default: "150", description: "Hover delay before opening, in ms." },
        { name: "showArrow", type: "boolean", default: "true", description: "Render the arrow." },
        { name: "open / defaultOpen / onOpenChange", type: "boolean / (open: boolean) => void", description: "Controlled or initial state." },
        { name: "align / collisionPadding / className…", type: "Radix TooltipContent props", description: "Forwarded to the content." },
      ],
    },
    {
      id: "avatar-tooltip-group",
      title: "Avatar Tooltip Group",
      registry: "avatar-tooltip-group",
      source: block("avatar-tooltip-group.tsx"),
      deps: "motion @radix-ui/react-tooltip",
      description: (
        <>
          Overlapping avatars for teams and collaborators. Hovering one lifts it above its neighbours and
          springs open a name card that tilts and leans toward the cursor as you move across the face —
          driven by motion values, so it never re-renders React. Extra members collapse into a “+N” chip
          whose tooltip lists them. Uses plain <Code>&lt;img&gt;</Code> or generated initials.
        </>
      ),
      Demo: AvatarTooltipGroupDemo,
      file: demo("avatar-tooltip-group-demo.tsx"),
      minHeight: 220,
      props: [
        { name: "items", type: "{ name, role?, src?, initials? }[]", description: "The people. Without src, initials sit on a gradient derived from the name." },
        { name: "max", type: "number", default: "5", description: "Avatars shown before the +N chip." },
        { name: "size", type: "number", default: "40", description: "Avatar diameter in px." },
        { name: "onAvatarClick", type: "(item) => void", description: "Called when an avatar is clicked." },
        { name: "aria-label", type: "string", description: "Names the group, e.g. “Project members”." },
      ],
    },
  ],
  api: {
    intro: (
      <>
        Same parts as shadcn/ui: <Code>TooltipProvider</Code>, <Code>Tooltip</Code>,{" "}
        <Code>TooltipTrigger</Code> and <Code>TooltipContent</Code>, each forwarding its Radix Tooltip
        props. Like shadcn, <Code>Tooltip</Code> wraps itself in a provider so it works anywhere.
      </>
    ),
    props: [
      { name: "side / align", type: '"top" | "right" | "bottom" | "left" / "start" | "center" | "end"', default: '"top" / "center"', description: "On TooltipContent." },
      { name: "sideOffset", type: "number", default: "0", description: "On TooltipContent: distance from the trigger (the arrow adds its own height)." },
      { name: "showArrow", type: "boolean", default: "true", description: "On TooltipContent: render the arrow." },
      { name: "delayDuration", type: "number", default: "0", description: "On TooltipProvider or Tooltip: hover delay in ms." },
      { name: "open / defaultOpen / onOpenChange", type: "boolean / (open: boolean) => void", description: "On Tooltip: controlled or initial state." },
    ],
  },
  accessibility: [
    "Built on Radix Tooltip: opens on hover and keyboard focus, closes on Escape and pointer-down, and links the trigger with aria-describedby.",
    "Tooltips describe, they don't name: icon-only triggers still need an aria-label.",
    "Every avatar in the group is a focusable button named after the person, and the +N chip's name lists the hidden members.",
    "Under prefers-reduced-motion tooltips only fade, and the avatar lift and tooltip tilt are turned off.",
  ],
};

export function TooltipDocs() {
  return <ComponentDocs config={config} />;
}
