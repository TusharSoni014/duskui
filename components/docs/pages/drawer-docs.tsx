import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import DrawerBasicDemo from "@/components/demos/drawer/drawer-basic";
import DrawerDirectionsDemo from "@/components/demos/drawer/drawer-directions";
import ResponsiveDialogDemo from "@/components/demos/drawer/responsive-dialog-demo";
import SnapDrawerDemo from "@/components/demos/drawer/snap-drawer-demo";

const demo = (file: string) => `components/demos/drawer/${file}`;
const block = (file: string) => `components/dusk/drawer/${file}`;

const config: DocConfig = {
  title: "Drawer",
  intro:
    "A draggable React drawer built on shadcn/ui and vaul: swipe-to-dismiss bottom sheets and side drawers with a handle bar and dimmed backdrop, plus a responsive dialog that becomes a drawer on phones and an Apple Maps-style snap-points sheet.",
  tags: ["Drop-in shadcn API", "vaul", "Drag to dismiss", "Snap points", "Responsive dialog"],
  hero: { Demo: SnapDrawerDemo, file: demo("snap-drawer-demo.tsx"), minHeight: 260 },
  install: {
    registry: "drawer",
    source: "components/ui/drawer.tsx",
    deps: "vaul",
    note: (
      <>
        Adds <Code>components/ui/drawer.tsx</Code> with the shadcn exports. vaul injects its slide keyframes
        as unlayered CSS; the reduced-motion fade override uses <Code>!important</Code> utilities for that
        reason.
      </>
    ),
  },
  usage: {
    filename: "goal-drawer.tsx",
    code: `import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

export function GoalDrawer() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Move goal</DrawerTitle>
          <DrawerDescription>Set your daily activity goal.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button>Done</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}`,
  },
  examples: [
    {
      id: "default",
      title: "Default",
      description: (
        <>
          A bottom drawer with the handle bar. Drag it down past the threshold (or flick it) to dismiss, or
          use Escape, the backdrop or a <Code>DrawerClose</Code> button.
        </>
      ),
      Demo: DrawerBasicDemo,
      file: demo("drawer-basic.tsx"),
      minHeight: 220,
    },
    {
      id: "directions",
      title: "Directions",
      description: (
        <>
          Set <Code>direction</Code> on <Code>Drawer</Code> to <Code>top</Code>, <Code>right</Code>,{" "}
          <Code>bottom</Code> or <Code>left</Code>. Side drawers are three quarters wide on phones and cap
          at <Code>max-w-sm</Code>.
        </>
      ),
      Demo: DrawerDirectionsDemo,
      file: demo("drawer-directions.tsx"),
      minHeight: 220,
    },
  ],
  blocks: [
    {
      id: "responsive-dialog",
      title: "Responsive Dialog",
      registry: "responsive-dialog",
      source: block("responsive-dialog.tsx"),
      deps: "motion vaul @radix-ui/react-dialog",
      description: (
        <>
          A centered Dialog on desktop and a drag-to-dismiss Drawer on phones, from one set of parts. A{" "}
          <Code>useSyncExternalStore</Code> media-query hook keeps server and client markup identical, and
          the open state lives in the block so resizing swaps the surface without closing it. Header, body
          and footer rise in with a short stagger on both surfaces.
        </>
      ),
      Demo: ResponsiveDialogDemo,
      file: demo("responsive-dialog-demo.tsx"),
      minHeight: 240,
      props: [
        { name: "open / defaultOpen / onOpenChange", type: "boolean", default: "false", description: "On ResponsiveDialog: controlled or uncontrolled state, shared by both surfaces." },
        { name: "desktopQuery", type: "string", default: '"(min-width: 768px)"', description: "Media query that switches to the Dialog." },
        { name: "showCloseButton", type: "boolean", default: "true", description: "On ResponsiveDialogContent: the X button on desktop." },
        { name: "Trigger / Close", type: "asChild button props", description: "Open and close from either surface." },
        { name: "Header / Title / Description / Body / Footer", type: "parts", description: "Mirror the Dialog API; Body pads itself on phones." },
        { name: "useMediaQuery(query, serverValue?)", type: "hook", description: "The hydration-safe matchMedia hook, exported for reuse." },
      ],
    },
    {
      id: "snap-drawer",
      title: "Snap Drawer",
      registry: "snap-drawer",
      source: block("snap-drawer.tsx"),
      deps: "motion vaul",
      description: (
        <>
          A bottom sheet with snap points, like Apple Maps: drag between resting heights, flick to skip one,
          or tap the indicator dots — a pill glides between them and the handle widens as the sheet grows.
          The backdrop fades in from the second point, and content only scrolls at full height so dragging
          never fights scrolling. <Code>nonModal</Code> keeps the page usable behind it.
        </>
      ),
      Demo: SnapDrawerDemo,
      file: demo("snap-drawer-demo.tsx"),
      minHeight: 260,
      props: [
        { name: "trigger", type: "ReactElement", description: "Element that opens the drawer. Omit when controlling `open`." },
        { name: "open / defaultOpen / onOpenChange", type: "boolean", default: "false", description: "Controlled or uncontrolled state." },
        { name: "snapPoints", type: "(number | string)[]", default: "[0.3, 0.6, 1]", description: "Resting heights, smallest first: screen fractions or \"160px\"." },
        { name: "snap / onSnapChange", type: "number | string | null", description: "Controlled resting point." },
        { name: "snapLabels", type: "string[]", description: "Accessible names for the indicator buttons." },
        { name: "title / description", type: "ReactNode", description: "Dialog title and description." },
        { name: "peek", type: "ReactNode", description: "Row shown at every height, under the title." },
        { name: "nonModal", type: "boolean", default: "false", description: "No backdrop; the page stays interactive." },
      ],
    },
  ],
  api: {
    intro: (
      <>
        Same parts as shadcn/ui: <Code>Drawer</Code>, <Code>DrawerTrigger</Code>, <Code>DrawerPortal</Code>,{" "}
        <Code>DrawerOverlay</Code>, <Code>DrawerContent</Code>, <Code>DrawerHeader</Code>,{" "}
        <Code>DrawerFooter</Code>, <Code>DrawerTitle</Code>, <Code>DrawerDescription</Code> and{" "}
        <Code>DrawerClose</Code>. <Code>Drawer</Code> takes every vaul <Code>Root</Code> prop.
      </>
    ),
    props: [
      { name: "direction", type: '"top" | "right" | "bottom" | "left"', default: '"bottom"', description: "On Drawer: the edge it slides from." },
      { name: "snapPoints / activeSnapPoint / setActiveSnapPoint", type: "(number | string)[]", description: "On Drawer: resting heights and the controlled current one." },
      { name: "dismissible", type: "boolean", default: "true", description: "On Drawer: allow drag, Escape and backdrop to close it." },
      { name: "handleOnly", type: "boolean", default: "false", description: "On Drawer: only vaul's Drawer.Handle starts a drag." },
      { name: "shouldScaleBackground", type: "boolean", default: "false", description: "On Drawer: scale a [data-vaul-drawer-wrapper] element behind it." },
      { name: "showHandle", type: "boolean", default: "true", description: "On DrawerContent: the handle bar on bottom drawers." },
    ],
  },
  accessibility: [
    "Built on vaul, which uses Radix Dialog: focus is trapped inside, Escape closes, and the title and description are wired to aria-labelledby / aria-describedby.",
    "Dragging is a pointer enhancement — every drawer can also be closed with Escape, the backdrop or a close button.",
    "The snap drawer's indicator dots are labelled buttons with aria-pressed, so keyboard users can change its height.",
    "Under prefers-reduced-motion drawers fade in and out instead of sliding, and snap changes jump.",
  ],
};

export function DrawerDocs() {
  return <ComponentDocs config={config} />;
}
