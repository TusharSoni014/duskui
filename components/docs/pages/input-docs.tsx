import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import InputBasicDemo from "@/components/demos/input/input-basic";
import InputWithLabelDemo from "@/components/demos/input/input-with-label";
import InputInvalidDemo from "@/components/demos/input/input-invalid";
import InputStatesDemo from "@/components/demos/input/input-states";
import FloatingLabelDemo from "@/components/demos/input/floating-label-demo";
import PasswordInputDemo from "@/components/demos/input/password-input-demo";
import SearchInputDemo from "@/components/demos/input/search-input-demo";
import OTPInputDemo from "@/components/demos/input/otp-input-demo";
import ShimmerInputDemo from "@/components/demos/input/shimmer-input-demo";

const demo = (file: string) => `components/demos/input/${file}`;
const block = (file: string) => `components/dusk/input/${file}`;

const config: DocConfig = {
  category: "Shadcn+",
  title: "Input",
  intro:
    "The shadcn/ui Input with a hover state, softer focus ring, clear invalid state and on-theme autofill — plus five Motion blocks: floating label, password with strength meter, search, one-time code and a shimmering AI prompt field.",
  tags: ["Drop-in shadcn API", "Server Component friendly", "Motion blocks", "Autofill-safe"],
  hero: { Demo: OTPInputDemo, file: demo("otp-input-demo.tsx") },
  install: {
    registry: "input",
    source: "components/ui/input.tsx",
    deps: "",
    note: (
      <>
        Replaces <Code>components/ui/input.tsx</Code> with the same API. The base Input is CSS-only — no
        <Code>&quot;use client&quot;</Code> needed.
      </>
    ),
  },
  usage: {
    filename: "newsletter.tsx",
    code: `import { Input } from "@/components/ui/input"

export function Newsletter() {
  return <Input type="email" placeholder="you@example.com" aria-label="Email" />
}`,
  },
  examples: [
    {
      id: "default",
      title: "Default",
      description: "Hover to see the border warm up; focus for the soft ring.",
      Demo: InputBasicDemo,
      file: demo("input-basic.tsx"),
      minHeight: 160,
    },
    {
      id: "with-label",
      title: "With label & hint",
      description: (
        <>
          Always pair an input with a <Code>&lt;label&gt;</Code>, and link hints with{" "}
          <Code>aria-describedby</Code>.
        </>
      ),
      Demo: InputWithLabelDemo,
      file: demo("input-with-label.tsx"),
      minHeight: 180,
    },
    {
      id: "invalid",
      title: "Invalid",
      description: (
        <>
          Set <Code>aria-invalid</Code> for the red state. The error message animates its height in and
          out so the form below doesn&apos;t jump.
        </>
      ),
      Demo: InputInvalidDemo,
      file: demo("input-invalid.tsx"),
      minHeight: 180,
    },
    {
      id: "states",
      title: "Disabled, read-only & file",
      description: "Each native state has its own styling, including a tidy file picker.",
      Demo: InputStatesDemo,
      file: demo("input-states.tsx"),
      minHeight: 220,
    },
  ],
  blocks: [
    {
      id: "otp-input",
      title: "OTP Input",
      registry: "otp-input",
      source: block("otp-input.tsx"),
      deps: "motion",
      description: (
        <>
          A one-time-code field where the active ring glides between slots, digits pop in and a wrong
          code shakes. It&apos;s one real input under the hood, so paste, SMS autofill (
          <Code>autocomplete=&quot;one-time-code&quot;</Code>) and backspace just work.
        </>
      ),
      Demo: OTPInputDemo,
      file: demo("otp-input-demo.tsx"),
      props: [
        { name: "length", type: "number", default: "6", description: "Number of slots." },
        { name: "value / onValueChange", type: "string / (v: string) => void", description: "Controlled value." },
        { name: "onComplete", type: "(v: string) => void", description: "Fires once all slots are filled." },
        { name: "invalid", type: "boolean", default: "false", description: "Shake and show the error color." },
        { name: "groupSize", type: "number", default: "3", description: "Separator every N slots; 0 to hide." },
        { name: "pattern", type: "string", default: '"[0-9]"', description: "Regex for one allowed character." },
      ],
    },
    {
      id: "floating-label",
      title: "Floating Label",
      registry: "floating-label-input",
      source: block("floating-label-input.tsx"),
      deps: "motion",
      description:
        "The label rests inside the field and springs up on focus or once filled — including browser autofill. It's a real <label>, so it stays accessible.",
      Demo: FloatingLabelDemo,
      file: demo("floating-label-demo.tsx"),
      props: [{ name: "label", type: "string", description: "Label text. Required." }],
    },
    {
      id: "password-input",
      title: "Password Input",
      registry: "password-input",
      source: block("password-input.tsx"),
      deps: "motion lucide-react",
      description: (
        <>
          Show/hide toggle with a morphing eye icon and an optional four-step strength meter that fills
          with springs. The scoring helper <Code>passwordScore</Code> is exported so you can reuse it.
        </>
      ),
      Demo: PasswordInputDemo,
      file: demo("password-input-demo.tsx"),
      props: [{ name: "showStrength", type: "boolean", default: "false", description: "Render the strength meter." }],
    },
    {
      id: "search-input",
      title: "Search Input",
      registry: "search-input",
      source: block("search-input.tsx"),
      deps: "motion lucide-react",
      description:
        "The search icon turns into a spinner while results load, a clear button pops in once you type, Escape clears, and an optional ⌘ shortcut focuses the field from anywhere.",
      Demo: SearchInputDemo,
      file: demo("search-input-demo.tsx"),
      props: [
        { name: "value / onValueChange", type: "string / (v: string) => void", description: "Controlled value." },
        { name: "loading", type: "boolean", default: "false", description: "Show the spinner." },
        { name: "shortcut", type: "string", description: "Key used with ⌘/Ctrl to focus, e.g. \"k\"." },
      ],
    },
    {
      id: "shimmer-input",
      title: "Shimmer Input",
      registry: "shimmer-input",
      source: block("shimmer-input.tsx"),
      deps: "motion",
      description:
        "A beam of light travels around the border while loading — perfect for AI prompt fields while a response streams. Submit the demo to see it.",
      Demo: ShimmerInputDemo,
      file: demo("shimmer-input-demo.tsx"),
      props: [
        { name: "loading", type: "boolean", default: "false", description: "Run the border beam." },
        { name: "wrapperClassName", type: "string", description: "Classes for the border wrapper." },
      ],
    },
  ],
  api: {
    intro: (
      <>
        The base Input accepts every native <Code>&lt;input&gt;</Code> prop; styling hooks off native
        attributes like <Code>disabled</Code>, <Code>readOnly</Code> and <Code>aria-invalid</Code>.
      </>
    ),
    props: [
      { name: "type", type: "string", default: '"text"', description: "Any native input type." },
      { name: "aria-invalid", type: "boolean", description: "Shows the destructive border and ring." },
      { name: "className", type: "string", description: "Merged with tailwind-merge, so overrides win." },
    ],
  },
  accessibility: [
    <>Blocks never replace the native <Code>&lt;input&gt;</Code>, so autofill, password managers and screen readers keep working.</>,
    "Floating labels are real <label> elements linked with htmlFor.",
    "Password strength and OTP status are announced via aria-live; the visibility toggle uses aria-pressed.",
    "Spinners, rings and shakes respect prefers-reduced-motion.",
  ],
};

export function InputDocs() {
  return <ComponentDocs config={config} />;
}
