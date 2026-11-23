import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import ResizableBasicDemo from "@/components/demos/resizable/resizable-basic";
import ResizableVerticalDemo from "@/components/demos/resizable/resizable-vertical";
import ResizableLayoutDemo from "@/components/demos/resizable/resizable-layout-demo";

const demo = (file: string) => `components/demos/resizable/${file}`;
const block = (file: string) => `components/dusk/resizable/${file}`;

const config: DocConfig = {
  title: "Resizable",
  intro:
    "Resizable React panels built on shadcn/ui and react-resizable-panels v4: drag or keyboard-resize split views with a handle that glows mint while you drag it, plus an IDE-style layout block with a collapsible sidebar that tweens into an icon rail.",
  tags: ["Drop-in shadcn API", "react-resizable-panels v4", "Keyboard resizing", "Collapsible panels", "Glowing handle"],
  hero: { Demo: ResizableLayoutDemo, file: demo("resizable-layout-demo.tsx"), minHeight: 460 },
  install: {
    registry: "resizable",
    source: "components/ui/resizable.tsx",
    deps: "react-resizable-panels",
    note: (
      <>
        Adds <Code>components/ui/resizable.tsx</Code> for react-resizable-panels v4. In v4 numeric sizes are{" "}
        <strong>pixels</strong> and strings without a unit are percentages, so write{" "}
        <Code>defaultSize=&quot;25&quot;</Code> for a quarter. The group prop is <Code>orientation</Code>; the v2{" "}
        <Code>direction</Code> prop is still accepted.
      </>
    ),
  },
  usage: {
    filename: "split-view.tsx",
    code: `import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

export function SplitView() {
  return (
    <ResizablePanelGroup orientation="horizontal" className="rounded-xl border">
      <ResizablePanel defaultSize="30" minSize={180}>Sidebar</ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel>Content</ResizablePanel>
    </ResizablePanelGroup>
  )
}`,
  },
  examples: [
    {
      id: "default",
      title: "Default",
      description: (
        <>
          A horizontal group with a nested vertical group. The line warms up on hover; while you drag (or
          while the handle has keyboard focus) it glows mint and the grip pill lights up.
        </>
      ),
      Demo: ResizableBasicDemo,
      file: demo("resizable-basic.tsx"),
      minHeight: 320,
    },
    {
      id: "vertical",
      title: "Vertical with live sizes",
      description: (
        <>
          <Code>orientation=&quot;vertical&quot;</Code> stacks panels. <Code>onLayoutChange</Code> reports a
          map of panel <Code>id</Code> to percentage on every move — use <Code>onLayoutChanged</Code> to
          persist only after the pointer is released.
        </>
      ),
      Demo: ResizableVerticalDemo,
      file: demo("resizable-vertical.tsx"),
      minHeight: 360,
    },
  ],
  blocks: [
    {
      id: "resizable-layout",
      title: "Resizable Layout",
      registry: "resizable-layout",
      source: block("resizable-layout.tsx"),
      deps: "motion react-resizable-panels lucide-react",
      description: (
        <>
          An IDE-style shell: a collapsible sidebar, a main area and an optional bottom panel. Drag the
          sidebar below its minimum and it snaps into an icon rail; the toggle button (or{" "}
          <Code>useResizableLayout().toggle</Code>) collapses and expands it with a 320&nbsp;ms tween that
          only runs for the toggle, so dragging stays one-to-one. Pass <Code>sidebar</Code> as a function to
          render a different layout when collapsed.
        </>
      ),
      Demo: ResizableLayoutDemo,
      file: demo("resizable-layout-demo.tsx"),
      minHeight: 460,
      props: [
        { name: "sidebar", type: "ReactNode | ({ collapsed }) => ReactNode", description: "Sidebar contents; the function form can render an icon rail." },
        { name: "children", type: "ReactNode", description: "The main area." },
        { name: "bottom", type: "ReactNode", description: "Optional bottom panel under the main area (collapsible by dragging)." },
        { name: "sidebarDefaultSize", type: "number | string", default: '"24"', description: "Initial sidebar size. Numbers are px, unitless strings are %." },
        { name: "sidebarMinSize / sidebarMaxSize", type: "number | string", default: '180 / "40"', description: "Limits while open; dragging below the minimum collapses it." },
        { name: "collapsedSize", type: "number | string", default: "52", description: "Width of the collapsed rail. 0 hides the sidebar." },
        { name: "defaultCollapsed / onCollapsedChange", type: "boolean / (collapsed) => void", default: "false", description: "Initial state and change callback." },
        { name: "sidebarLabel", type: "string", default: '"Sidebar"', description: "Accessible name of the sidebar region and its resize handle." },
        { name: "ResizableLayoutToggle", type: "button props", description: "Toggle button with aria-expanded / aria-controls wired up." },
      ],
    },
  ],
  api: {
    intro: (
      <>
        Same parts as shadcn/ui: <Code>ResizablePanelGroup</Code> (v4 <Code>Group</Code>),{" "}
        <Code>ResizablePanel</Code> (<Code>Panel</Code>) and <Code>ResizableHandle</Code> (
        <Code>Separator</Code>), each forwarding the react-resizable-panels v4 props.
      </>
    ),
    props: [
      { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "On ResizablePanelGroup. `direction` is accepted as an alias." },
      { name: "defaultLayout / onLayoutChange / onLayoutChanged", type: "Record<string, number>", description: "On ResizablePanelGroup: initial and reported layouts, keyed by panel id." },
      { name: "groupRef", type: "Ref<GroupImperativeHandle>", description: "On ResizablePanelGroup: getLayout() / setLayout()." },
      { name: "defaultSize / minSize / maxSize", type: "number | string", description: "On ResizablePanel. Numbers are px; \"25\" or \"25%\" are percentages; rem / vh work too." },
      { name: "collapsible / collapsedSize", type: "boolean / number | string", default: 'false / "0%"', description: "On ResizablePanel: snap shut below minSize." },
      { name: "panelRef", type: "Ref<PanelImperativeHandle>", description: "On ResizablePanel: collapse(), expand(), resize(), getSize(), isCollapsed()." },
      { name: "withHandle", type: "boolean", default: "false", description: "On ResizableHandle: show the grip pill." },
      { name: "disabled", type: "boolean", default: "false", description: "On the group, a panel or a handle." },
    ],
  },
  accessibility: [
    "Each ResizableHandle is a focusable role=\"separator\" with aria-valuenow / min / max and aria-controls, maintained by react-resizable-panels.",
    "Arrow keys resize from the focused handle; Home and End jump to the limits. Focus shows the same mint glow as dragging.",
    "Give handles an aria-label (\"Resize sidebar\") when there are several; the layout block labels its sidebar region and handle for you.",
    "The sidebar toggle exposes aria-expanded and aria-controls; under prefers-reduced-motion it snaps instead of tweening.",
  ],
};

export function ResizableDocs() {
  return <ComponentDocs config={config} />;
}
