import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import TabsBasicDemo from "@/components/demos/tabs/tabs-basic";
import TabsLineDemo from "@/components/demos/tabs/tabs-line";
import TabsVerticalDemo from "@/components/demos/tabs/tabs-vertical";
import AnimatedTabsDemo from "@/components/demos/tabs/animated-tabs-demo";
import AnimatedTabsUnderlineDemo from "@/components/demos/tabs/animated-tabs-underline-demo";
import SegmentedControlDemo from "@/components/demos/tabs/segmented-control-demo";

const demo = (file: string) => `components/demos/tabs/${file}`;
const block = (file: string) => `components/dusk/tabs/${file}`;

const config: DocConfig = {
  title: "Tabs",
  intro:
    "Animated React tabs built on shadcn/ui and Radix: the drop-in Tabs adds a line variant, vertical layout and panels that fade in — plus Motion blocks for tabs with a gliding active indicator and direction-aware panel transitions, and an iOS-style segmented control.",
  tags: ["Drop-in shadcn API", "Radix Tabs", "Motion layoutId", "Keyboard accessible", "prefers-reduced-motion"],
  hero: { Demo: AnimatedTabsDemo, file: demo("animated-tabs-demo.tsx"), minHeight: 300 },
  install: {
    registry: "tabs",
    source: "components/ui/tabs.tsx",
    deps: "@radix-ui/react-tabs class-variance-authority",
    note: (
      <>
        Replaces <Code>components/ui/tabs.tsx</Code> with the same parts and <Code>data-slot</Code>{" "}
        attributes, so existing tabs keep working. The base Tabs animates with CSS only (tw-animate-css).
      </>
    ),
  },
  usage: {
    filename: "settings-tabs.tsx",
    code: `import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function SettingsTabs() {
  return (
    <Tabs defaultValue="account">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">Edit your profile.</TabsContent>
      <TabsContent value="password">Change your password.</TabsContent>
    </Tabs>
  )
}`,
  },
  examples: [
    {
      id: "default",
      title: "Default",
      description:
        "A segmented trigger row with a raised active tab. Panels fade and rise in, and show a focus ring when reached with Tab.",
      Demo: TabsBasicDemo,
      file: demo("tabs-basic.tsx"),
      minHeight: 260,
    },
    {
      id: "line",
      title: "Line variant",
      description: (
        <>
          <Code>variant=&quot;line&quot;</Code> on <Code>TabsList</Code> swaps the surface for an underline
          that grows from the center of the active trigger. Icons size themselves.
        </>
      ),
      Demo: TabsLineDemo,
      file: demo("tabs-line.tsx"),
      minHeight: 180,
    },
    {
      id: "vertical",
      title: "Vertical",
      description: (
        <>
          Set <Code>orientation=&quot;vertical&quot;</Code> on <Code>Tabs</Code> for settings-style
          navigation. Up and Down arrows move between triggers; with the line variant the indicator
          becomes a side bar.
        </>
      ),
      Demo: TabsVerticalDemo,
      file: demo("tabs-vertical.tsx"),
      minHeight: 200,
    },
  ],
  blocks: [
    {
      id: "animated-tabs",
      title: "Animated Tabs",
      registry: "animated-tabs",
      source: block("animated-tabs.tsx"),
      deps: "motion @radix-ui/react-tabs",
      description: (
        <>
          The active indicator (a glowing pill or an underline) glides between triggers via a shared
          Motion <Code>layoutId</Code>, and panels slide and un-blur in from the direction you&apos;re
          travelling while the old panel leaves the other way. <Code>AnimatedTabsPanels</Code> springs to
          the new panel&apos;s height so nothing below jumps. Same composition as shadcn Tabs.
        </>
      ),
      Demo: AnimatedTabsDemo,
      file: demo("animated-tabs-demo.tsx"),
      minHeight: 300,
      props: [
        { name: "indicator", type: '"pill" | "underline"', default: '"pill"', description: "Shape of the gliding indicator (on AnimatedTabs)." },
        { name: "value / onValueChange", type: "string / (value: string) => void", description: "Controlled active tab (on AnimatedTabs)." },
        { name: "defaultValue", type: "string", description: "Uncontrolled initial tab." },
        { name: "orientation / dir / activationMode", type: "Radix Tabs props", description: "Forwarded to the Radix root." },
        { name: "AnimatedTabsList / AnimatedTabsTrigger", type: "TabsList / TabsTrigger props", description: "The trigger row and its buttons." },
        { name: "AnimatedTabsPanels", type: "div props", description: "Wrap the panels: stacks them for crossfades and animates height." },
        { name: "AnimatedTabsContent", type: "Radix TabsContent props", description: "A panel. Put it directly inside AnimatedTabsPanels." },
      ],
    },
    {
      id: "animated-tabs-underline",
      title: "Animated Tabs — underline",
      registry: "animated-tabs",
      source: block("animated-tabs.tsx"),
      deps: "motion @radix-ui/react-tabs",
      description: (
        <>
          The same block with <Code>indicator=&quot;underline&quot;</Code>: a glowing mint line slides
          under the active trigger. Panels of different heights resize smoothly.
        </>
      ),
      Demo: AnimatedTabsUnderlineDemo,
      file: demo("animated-tabs-underline-demo.tsx"),
      minHeight: 220,
    },
    {
      id: "segmented-control",
      title: "Segmented Control",
      registry: "segmented-control",
      source: block("segmented-control.tsx"),
      deps: "motion",
      description: (
        <>
          An iOS-style picker for a single value — view mode, billing period, units. A raised thumb
          springs between options. It is a native radio group, so arrow keys work, the value submits
          with forms via <Code>name</Code>, and screen readers announce it as radio buttons. Use Animated
          Tabs when each option shows its own panel.
        </>
      ),
      Demo: SegmentedControlDemo,
      file: demo("segmented-control-demo.tsx"),
      minHeight: 220,
      props: [
        { name: "options", type: "{ value, label, icon?, disabled? }[]", description: "The segments. `icon` is an element, e.g. <List />." },
        { name: "value / onValueChange", type: "string / (value: string) => void", description: "Controlled selection." },
        { name: "defaultValue", type: "string", default: "first option", description: "Uncontrolled initial selection." },
        { name: "name", type: "string", description: "Form field name; the selected value is submitted." },
        { name: "size", type: '"sm" | "default" | "lg"', default: '"default"', description: "Height and text size." },
        { name: "fullWidth", type: "boolean", default: "false", description: "Stretch to the container with equal segments." },
        { name: "disabled", type: "boolean", default: "false", description: "Disable every option." },
        { name: "aria-label", type: "string", description: "Names the radio group. Required unless labelled elsewhere." },
      ],
    },
  ],
  api: {
    intro: (
      <>
        Same parts as shadcn/ui: <Code>Tabs</Code>, <Code>TabsList</Code>, <Code>TabsTrigger</Code> and{" "}
        <Code>TabsContent</Code>, each forwarding its Radix Tabs props. The additions are below.
      </>
    ),
    props: [
      { name: "variant", type: '"default" | "line"', default: '"default"', description: "On TabsList: segmented surface or underline." },
      { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "On Tabs: lays out the list beside the panels and switches arrow keys to Up / Down." },
      { name: "value / onValueChange", type: "string / (value: string) => void", description: "Controlled active tab (on Tabs)." },
      { name: "activationMode", type: '"automatic" | "manual"', default: '"automatic"', description: "Activate on focus, or only on Enter / Space." },
      { name: "tabsListVariants / tabsTriggerVariants", type: "cva", description: "Exported class builders for custom triggers." },
    ],
  },
  accessibility: [
    "Built on Radix Tabs: triggers are a tablist with roving focus (arrow keys, Home, End) and panels are linked with aria-controls / aria-labelledby.",
    "Panels are focusable and show a focus-visible ring, so keyboard users can Tab from the trigger into the content.",
    "The gliding indicators are decorative, aria-hidden and pointer-events-none; the active state is conveyed by aria-selected.",
    "Segmented Control uses native radio inputs inside a radiogroup — label it with aria-label or aria-labelledby.",
    "Under prefers-reduced-motion panels only fade, the indicator jumps instead of gliding and the height change is instant.",
  ],
};

export function TabsDocs() {
  return <ComponentDocs config={config} />;
}
