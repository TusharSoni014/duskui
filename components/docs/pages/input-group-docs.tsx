import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import InputGroupBasicDemo from "@/components/demos/input-group/input-group-basic";
import InputGroupButtonDemo from "@/components/demos/input-group/input-group-button";
import InputGroupTextareaDemo from "@/components/demos/input-group/input-group-textarea";
import CopyInputDemo from "@/components/demos/input-group/copy-input-demo";
import UrlInputDemo from "@/components/demos/input-group/url-input-demo";

const demo = (file: string) => `components/demos/input-group/${file}`;
const block = (file: string) => `components/dusk/input-group/${file}`;

const config: DocConfig = {
  title: "Input Group",
  intro:
    "A React input group built on shadcn/ui: attach icons, prefixes, units, keyboard hints and buttons to an input or textarea, with one shared hover border, focus ring and invalid state — plus Motion blocks for a copy-to-clipboard field with a morphing check and a URL input whose protocol addon rolls between https and http.",
  tags: ["Drop-in shadcn API", "Input & textarea", "Inline and block addons", "Group focus ring", "Motion blocks"],
  hero: { Demo: CopyInputDemo, file: demo("copy-input-demo.tsx"), minHeight: 220 },
  install: {
    registry: "input-group",
    source: "components/ui/input-group.tsx",
    deps: "class-variance-authority",
    note: (
      <>
        Builds on the DuskUI <Code>Button</Code>, <Code>Input</Code> and <Code>Textarea</Code>, which the CLI installs
        for you.
      </>
    ),
  },
  usage: {
    filename: "search.tsx",
    code: `import { SearchIcon } from "lucide-react"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"

export function Search() {
  return (
    <InputGroup>
      <InputGroupInput placeholder="Search…" aria-label="Search" />
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
    </InputGroup>
  )
}`,
  },
  examples: [
    {
      id: "addons",
      title: "Icons, text & keys",
      description: (
        <>
          Addons go on <Code>inline-start</Code> (the default) or <Code>inline-end</Code>. Put the addon after the
          input in the markup — CSS order places it — so focus order stays natural. Icons brighten while the field is
          focused, and <Code>aria-invalid</Code> on the input turns the whole group red.
        </>
      ),
      Demo: InputGroupBasicDemo,
      file: demo("input-group-basic.tsx"),
      minHeight: 260,
    },
    {
      id: "button",
      title: "With a button",
      description: (
        <>
          <Code>InputGroupButton</Code> is a compact DuskUI Button, so <Code>loading</Code> keeps its width while it
          shows a spinner.
        </>
      ),
      Demo: InputGroupButtonDemo,
      file: demo("input-group-button.tsx"),
      minHeight: 160,
    },
    {
      id: "textarea",
      title: "Textarea with a toolbar",
      description: (
        <>
          <Code>block-end</Code> stacks the addon under the control — handy for toolbars and counters. The textarea
          still grows with its content.
        </>
      ),
      Demo: InputGroupTextareaDemo,
      file: demo("input-group-textarea.tsx"),
      minHeight: 240,
    },
  ],
  blocks: [
    {
      id: "copy-input",
      title: "Copy Input",
      registry: "copy-input",
      source: block("copy-input.tsx"),
      deps: "motion lucide-react",
      description:
        "A read-only field for API keys, invite links and install commands. On copy the icon spins into a check, the label rolls to “Copied” without changing the button's width, and a mint sweep crosses the field. Focus selects the whole value.",
      Demo: CopyInputDemo,
      file: demo("copy-input-demo.tsx"),
      minHeight: 220,
      props: [
        { name: "value", type: "string", description: "The text to show and copy. Required." },
        { name: "onCopy", type: "(value: string) => void", description: "Fires after a successful copy." },
        { name: "timeout", type: "number", default: "2000", description: "How long the copied state lasts (ms)." },
        { name: "addon", type: "ReactNode", description: "Leading icon or text." },
        { name: "copyLabel / copiedLabel", type: "string", default: '"Copy" / "Copied"', description: 'Button labels. copyLabel="" makes it icon-only.' },
      ],
    },
    {
      id: "url-input",
      title: "URL Input",
      registry: "url-input",
      source: block("url-input.tsx"),
      deps: "motion lucide-react",
      description:
        "Paste a full address and the protocol lifts out of the text into the addon. Click the addon to switch between https and http — the padlock unlocks and the protocol rolls over — and a check or warning pops in as you type. The value always includes the protocol.",
      Demo: UrlInputDemo,
      file: demo("url-input-demo.tsx"),
      minHeight: 200,
      props: [
        { name: "value / onValueChange", type: "string / (url: string) => void", description: "Full URL with protocol; empty string when empty." },
        { name: "showStatus", type: "boolean", default: "true", description: "Show the valid / invalid icon." },
        { name: "name", type: "string", description: "Submits the full URL with a hidden input." },
        { name: "groupClassName", type: "string", description: "Classes for the group; className goes to the input." },
      ],
    },
  ],
  api: {
    intro: "Each part accepts the props of the element it renders.",
    props: [
      {
        name: "InputGroupAddon align",
        type: '"inline-start" | "inline-end" | "block-start" | "block-end"',
        default: '"inline-start"',
        description: "Where the addon sits relative to the control.",
      },
      {
        name: "InputGroupButton size",
        type: '"xs" | "sm" | "icon-xs" | "icon-sm"',
        default: '"xs"',
        description: "Compact sizes that fit inside the group. variant defaults to ghost.",
      },
      { name: "InputGroup data-disabled", type: "boolean", description: "Dims the whole group." },
      { name: "InputGroupInput / InputGroupTextarea", type: "input / textarea props", description: "The DuskUI controls with their own border and ring removed." },
    ],
  },
  accessibility: [
    <>The group has <Code>role=&quot;group&quot;</Code>; still give the control a <Code>&lt;label&gt;</Code> or <Code>aria-label</Code>.</>,
    "Icon-only buttons need an aria-label. Clicking an addon focuses the control.",
    "Copy Input and URL Input announce their result through a polite live region; the protocol toggle says which protocol it switches to.",
    "Icon swaps and the copy sweep respect prefers-reduced-motion.",
  ],
};

export function InputGroupDocs() {
  return <ComponentDocs config={config} />;
}
