import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import SheetBasicDemo from "@/components/demos/sheet/sheet-basic";
import SheetSidesDemo from "@/components/demos/sheet/sheet-sides";
import StackedSheetDemo from "@/components/demos/sheet/stacked-sheet-demo";
import SidePanelDemo from "@/components/demos/sheet/side-panel-demo";

const demo = (file: string) => `components/demos/sheet/${file}`;
const block = (file: string) => `components/dusk/sheet/${file}`;

const config: DocConfig = {
  title: "Sheet",
  intro:
    "The shadcn/ui Sheet (side drawer) with a smoother slide, blurred backdrop and scrollable content — plus two animated React sheet blocks built with Motion and Radix: stacked sheets where the parent scales back as a new one opens, and a side panel you can drag closed.",
  tags: ["Drop-in shadcn API", "Four sides", "Radix focus trap", "Drag to close", "Motion blocks"],
  hero: { Demo: StackedSheetDemo, file: demo("stacked-sheet-demo.tsx"), minHeight: 240 },
  install: {
    registry: "sheet",
    source: "components/ui/sheet.tsx",
    deps: "@radix-ui/react-dialog lucide-react",
    note: (
      <>
        Replaces <Code>components/ui/sheet.tsx</Code> with the same exports and props (including{" "}
        <Code>side</Code>), so the shadcn Sidebar&apos;s mobile drawer keeps working. Adds an optional{" "}
        <Code>showCloseButton</Code> and exports <Code>SheetPortal</Code> / <Code>SheetOverlay</Code>.
        Animations are CSS (tw-animate-css), so the base needs no Motion.
      </>
    ),
  },
  usage: {
    filename: "filters-sheet.tsx",
    code: `import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function FiltersSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Filters</Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Narrow down the results.</SheetDescription>
        </SheetHeader>
        {/* … */}
      </SheetContent>
    </Sheet>
  )
}`,
  },
  examples: [
    {
      id: "default",
      title: "Default",
      description: (
        <>
          Slides in on an expo-out curve over a blurred backdrop and closes faster than it opened. The
          footer stays pinned to the bottom, long content scrolls inside the sheet, and the close
          button has proper hover and focus states.
        </>
      ),
      Demo: SheetBasicDemo,
      file: demo("sheet-basic.tsx"),
      minHeight: 200,
    },
    {
      id: "sides",
      title: "Sides",
      description: (
        <>
          Use <Code>side</Code> to slide in from <Code>top</Code>, <Code>right</Code> (default),{" "}
          <Code>bottom</Code> or <Code>left</Code>. Each side respects the safe-area inset on notched
          phones and casts its shadow away from its edge.
        </>
      ),
      Demo: SheetSidesDemo,
      file: demo("sheet-sides.tsx"),
      minHeight: 200,
    },
  ],
  blocks: [
    {
      id: "stacked-sheet",
      title: "Stacked Sheet",
      registry: "stacked-sheet",
      source: block("stacked-sheet.tsx"),
      deps: "motion @radix-ui/react-dialog lucide-react",
      description: (
        <>
          Nest a <Code>StackedSheet</Code> inside another one&apos;s content and the new sheet slides
          over it while the one underneath scales back, shifts aside and dims — three levels deep in
          this demo. Nested sheets get a back button, and closing one brings the sheet below forward
          again. Escape and outside clicks close only the top sheet.
        </>
      ),
      Demo: StackedSheetDemo,
      file: demo("stacked-sheet-demo.tsx"),
      minHeight: 240,
      props: [
        { name: "open / defaultOpen / onOpenChange", type: "boolean / boolean / (open: boolean) => void", description: "Open state (on StackedSheet)." },
        { name: "side", type: '"right" | "left"', default: '"right"', description: "Edge the sheets slide from. Nested sheets inherit it." },
        { name: "StackedSheetTrigger / StackedSheetClose", type: "Radix Trigger / Close props", description: "Use asChild to render your own Button." },
        { name: "title / description", type: "ReactNode", description: "Accessible title and description (on StackedSheetContent)." },
        { name: "footer", type: "ReactNode", description: "Actions pinned to the bottom (on StackedSheetContent)." },
        { name: "showCloseButton", type: "boolean", default: "true", description: "Render the X button (on StackedSheetContent)." },
      ],
    },
    {
      id: "side-panel",
      title: "Side Panel",
      registry: "side-panel",
      source: block("side-panel.tsx"),
      deps: "motion @radix-ui/react-dialog lucide-react",
      description: (
        <>
          A side sheet you can drag closed. Grab the edge handle or the header and pull toward the
          edge: a flick or a drag past <Code>closeThreshold</Code> dismisses it, anything less springs
          back, and the backdrop fades as you drag. The drag is a separate motion value from the
          slide-in, so the two never fight.
        </>
      ),
      Demo: SidePanelDemo,
      file: demo("side-panel-demo.tsx"),
      minHeight: 200,
      props: [
        { name: "trigger", type: "ReactElement", description: "Element that opens the panel." },
        { name: "open / defaultOpen / onOpenChange", type: "boolean / boolean / (open: boolean) => void", description: "Open state." },
        { name: "title / description", type: "ReactNode", description: "Accessible title and description." },
        { name: "children / footer", type: "ReactNode", description: "Scrollable body and pinned actions." },
        { name: "side", type: '"right" | "left"', default: '"right"', description: "Edge the panel slides from and drags toward." },
        { name: "closeThreshold", type: "number", default: "0.35", description: "Fraction of the width it must be dragged to close." },
        { name: "showCloseButton", type: "boolean", default: "true", description: "Render the X button." },
      ],
    },
  ],
  api: {
    intro: (
      <>
        Same parts as shadcn/ui: <Code>Sheet</Code>, <Code>SheetTrigger</Code>, <Code>SheetClose</Code>,{" "}
        <Code>SheetContent</Code>, <Code>SheetHeader</Code>, <Code>SheetFooter</Code>,{" "}
        <Code>SheetTitle</Code> and <Code>SheetDescription</Code>, plus <Code>SheetPortal</Code> and{" "}
        <Code>SheetOverlay</Code>. Each forwards the Radix Dialog props.
      </>
    ),
    props: [
      { name: "open / defaultOpen / onOpenChange", type: "boolean / boolean / (open: boolean) => void", description: "Open state (on Sheet)." },
      { name: "side", type: '"top" | "right" | "bottom" | "left"', default: '"right"', description: "Edge the sheet slides in from (on SheetContent)." },
      { name: "showCloseButton", type: "boolean", default: "true", description: "Render the X button (on SheetContent)." },
      { name: "onOpenAutoFocus / onEscapeKeyDown / onPointerDownOutside", type: "(event) => void", description: "Radix hooks; preventDefault() to customise (on SheetContent)." },
    ],
  },
  accessibility: [
    <>Built on Radix Dialog: <Code>role=&quot;dialog&quot;</Code> with <Code>aria-modal</Code>, labelled by its title and described by its description.</>,
    "Focus moves into the sheet, is trapped while it's open and returns to the trigger on close; the page behind can't scroll.",
    "Escape, the backdrop and the close button close it. In Stacked Sheet they close only the top sheet, and nested sheets have a labelled Back button.",
    "Side Panel's drag handle is a pointer enhancement — keyboard and screen reader users close it with Escape or the close button.",
    "Under prefers-reduced-motion sheets fade instead of sliding, and stacked sheets don't scale.",
  ],
};

export function SheetDocs() {
  return <ComponentDocs config={config} />;
}
