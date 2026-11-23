import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import SwitchBasicDemo from "@/components/demos/switch/switch-basic";
import SwitchSizesDemo from "@/components/demos/switch/switch-sizes";
import SwitchSettingsDemo from "@/components/demos/switch/switch-settings";
import IconSwitchDemo from "@/components/demos/switch/icon-switch-demo";
import LoadingSwitchDemo from "@/components/demos/switch/loading-switch-demo";

const demo = (file: string) => `components/demos/switch/${file}`;
const block = (file: string) => `components/dusk/switch/${file}`;

const config: DocConfig = {
  title: "Switch",
  intro:
    "An animated React toggle switch built on shadcn/ui and Radix: the drop-in Switch has a spring-loaded thumb, a glowing on state and three sizes — plus Motion blocks for a sun-to-moon theme toggle and an async switch that shows a spinner while saving and springs back if the request fails.",
  tags: ["Drop-in shadcn API", "Radix Switch", "CSS spring", "Optimistic UI", "prefers-reduced-motion"],
  hero: { Demo: IconSwitchDemo, file: demo("icon-switch-demo.tsx"), minHeight: 200 },
  install: {
    registry: "switch",
    source: "components/ui/switch.tsx",
    deps: "@radix-ui/react-switch class-variance-authority",
    note: (
      <>
        Replaces <Code>components/ui/switch.tsx</Code> with the same API. The thumb&apos;s spring is a CSS{" "}
        <Code>linear()</Code> easing curve, so the base Switch runs no JavaScript per frame.
      </>
    ),
  },
  usage: {
    filename: "airplane-mode.tsx",
    code: `import { Switch } from "@/components/ui/switch"

export function AirplaneMode() {
  return (
    <div className="flex items-center gap-3">
      <Switch id="airplane-mode" />
      <label htmlFor="airplane-mode">Airplane mode</label>
    </div>
  )
}`,
  },
  examples: [
    {
      id: "default",
      title: "Default",
      description: "Click or press Space: the thumb overshoots slightly and settles, and the track lights up mint.",
      Demo: SwitchBasicDemo,
      file: demo("switch-basic.tsx"),
      minHeight: 160,
    },
    {
      id: "sizes",
      title: "Sizes",
      description: (
        <>
          <Code>size</Code> is <Code>sm</Code>, <Code>default</Code> or <Code>lg</Code>. Disabled switches
          dim and show a not-allowed cursor.
        </>
      ),
      Demo: SwitchSizesDemo,
      file: demo("switch-sizes.tsx"),
      minHeight: 160,
    },
    {
      id: "settings",
      title: "Settings list",
      description: (
        <>
          Pair each switch with a <Code>&lt;label&gt;</Code> and link its hint with{" "}
          <Code>aria-describedby</Code>.
        </>
      ),
      Demo: SwitchSettingsDemo,
      file: demo("switch-settings.tsx"),
      minHeight: 300,
    },
  ],
  blocks: [
    {
      id: "icon-switch",
      title: "Icon Switch",
      registry: "icon-switch",
      source: block("icon-switch.tsx"),
      deps: "motion",
      description: (
        <>
          A theme toggle whose thumb morphs from a sun into a crescent moon: the rays spin and retract,
          the core swells and an SVG mask bites the crescent out. Pass <Code>checkedIcon</Code> and{" "}
          <Code>uncheckedIcon</Code> to spin between any two icons instead. The morph is also exported as{" "}
          <Code>SunMoonIcon</Code>.
        </>
      ),
      Demo: IconSwitchDemo,
      file: demo("icon-switch-demo.tsx"),
      minHeight: 200,
      props: [
        { name: "checked / onCheckedChange", type: "boolean / (checked: boolean) => void", description: "Controlled state." },
        { name: "defaultChecked", type: "boolean", default: "false", description: "Uncontrolled initial state." },
        { name: "checkedIcon / uncheckedIcon", type: "ReactNode", description: "Custom icons. Omit both for the sun / moon morph." },
        { name: "size", type: '"sm" | "default" | "lg"', default: '"lg"', description: "Switch size; lg leaves room for the icon." },
        { name: "thumbClassName", type: "string", description: "Classes for the thumb, e.g. icon colors." },
      ],
    },
    {
      id: "loading-switch",
      title: "Loading Switch",
      registry: "loading-switch",
      source: block("loading-switch.tsx"),
      deps: "motion",
      description: (
        <>
          For settings that save to a server. Return a promise from <Code>onCheckedChange</Code>: the
          switch moves optimistically, shows a spinner inside the thumb and ignores clicks until it
          settles. If the promise rejects it springs back with a short shake and a red ring. The second
          row always fails.
        </>
      ),
      Demo: LoadingSwitchDemo,
      file: demo("loading-switch-demo.tsx"),
      minHeight: 260,
      props: [
        { name: "onCheckedChange", type: "(checked: boolean) => void | Promise<unknown>", description: "Return a promise to show the spinner; reject to revert." },
        { name: "checked / defaultChecked", type: "boolean", description: "Controlled or initial state. When controlled, update checked inside the handler." },
        { name: "onError", type: "(error: unknown) => void", description: "Called with the rejection reason." },
        { name: "loading", type: "boolean", default: "false", description: "Force the busy state, e.g. while initial data loads." },
        { name: "loadingLabel / errorLabel", type: "string", default: '"Saving" / "Couldn\'t save…"', description: "Announced to screen readers." },
      ],
    },
  ],
  api: {
    intro: (
      <>
        <Code>Switch</Code> forwards every Radix Switch prop (<Code>checked</Code>,{" "}
        <Code>defaultChecked</Code>, <Code>onCheckedChange</Code>, <Code>disabled</Code>,{" "}
        <Code>required</Code>, <Code>name</Code>, <Code>value</Code>) plus the additions below.
      </>
    ),
    props: [
      { name: "size", type: '"sm" | "default" | "lg"', default: '"default"', description: "Track and thumb size." },
      { name: "thumbContent", type: "ReactNode", description: "Rendered inside the thumb (an icon or spinner)." },
      { name: "thumbClassName", type: "string", description: "Classes for the thumb." },
      { name: "className", type: "string", description: "Classes for the track. Keep width = 2 × thumb + 4px so the thumb travels exactly." },
    ],
  },
  accessibility: [
    "Built on Radix Switch: a button with role=\"switch\" and aria-checked, toggled with Space or Enter, and submitted with forms through a hidden input.",
    <>Give every switch a visible <Code>&lt;label htmlFor&gt;</Code> or an <Code>aria-label</Code>.</>,
    <>Loading Switch sets <Code>aria-busy</Code>, stays focusable while saving and announces progress and failures in a polite live region.</>,
    "Under prefers-reduced-motion the thumb moves instantly, the error shake is skipped and the spinner slows down.",
  ],
};

export function SwitchDocs() {
  return <ComponentDocs config={config} />;
}
