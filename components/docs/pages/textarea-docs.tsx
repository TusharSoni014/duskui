import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import TextareaBasicDemo from "@/components/demos/textarea/textarea-basic";
import TextareaWithLabelDemo from "@/components/demos/textarea/textarea-with-label";
import TextareaStatesDemo from "@/components/demos/textarea/textarea-states";
import AutoResizeTextareaDemo from "@/components/demos/textarea/auto-resize-textarea-demo";
import ChatInputDemo from "@/components/demos/textarea/chat-input-demo";

const demo = (file: string) => `components/demos/textarea/${file}`;
const block = (file: string) => `components/dusk/textarea/${file}`;

const config: DocConfig = {
  title: "Textarea",
  intro:
    "An auto-growing React textarea built on shadcn/ui: the drop-in Textarea sizes itself to its content with a soft focus ring and clear invalid state — plus Motion blocks for a textarea that springs to fit with a character-limit counter, and an AI chat input with Enter to send and a loading state.",
  tags: ["Drop-in shadcn API", "Server Component friendly", "Auto-resize", "Character counter", "Motion blocks"],
  hero: { Demo: ChatInputDemo, file: demo("chat-input-demo.tsx"), minHeight: 320 },
  install: {
    registry: "textarea",
    source: "components/ui/textarea.tsx",
    deps: "",
    note: (
      <>
        Replaces <Code>components/ui/textarea.tsx</Code> with the same API. The base Textarea is CSS-only — no{" "}
        <Code>&quot;use client&quot;</Code> needed. It grows with <Code>field-sizing: content</Code>; browsers
        without it keep a fixed height.
      </>
    ),
  },
  usage: {
    filename: "feedback.tsx",
    code: `import { Textarea } from "@/components/ui/textarea"

export function Feedback() {
  return <Textarea aria-label="Feedback" placeholder="What can we improve?" className="max-h-48" />
}`,
  },
  examples: [
    {
      id: "default",
      title: "Default",
      description: (
        <>
          Start typing: the field grows with its content. Cap it with a <Code>max-h-*</Code> class and it
          scrolls from there.
        </>
      ),
      Demo: TextareaBasicDemo,
      file: demo("textarea-basic.tsx"),
      minHeight: 180,
    },
    {
      id: "with-label",
      title: "With label & hint",
      description: (
        <>
          Pair the field with a <Code>&lt;label&gt;</Code> and link hints with <Code>aria-describedby</Code>.
        </>
      ),
      Demo: TextareaWithLabelDemo,
      file: demo("textarea-with-label.tsx"),
      minHeight: 240,
    },
    {
      id: "states",
      title: "Invalid, disabled & fixed",
      description: (
        <>
          <Code>aria-invalid</Code> turns the border red, <Code>disabled</Code> dims it, and{" "}
          <Code>field-sizing-fixed</Code> with <Code>rows</Code> gives a classic fixed-height box.
        </>
      ),
      Demo: TextareaStatesDemo,
      file: demo("textarea-states.tsx"),
      minHeight: 340,
    },
  ],
  blocks: [
    {
      id: "auto-resize-textarea",
      title: "Auto-resize Textarea",
      registry: "auto-resize-textarea",
      source: block("auto-resize-textarea.tsx"),
      deps: "motion",
      description: (
        <>
          Springs to fit its content instead of jumping a line at a time, between <Code>minRows</Code> and{" "}
          <Code>maxRows</Code>. With <Code>maxLength</Code>, a ring fills as you type and turns amber near the
          limit, then red, with the characters left sliding in. It measures an invisible twin with a
          ResizeObserver, so it works in every browser.
        </>
      ),
      Demo: AutoResizeTextareaDemo,
      file: demo("auto-resize-textarea-demo.tsx"),
      minHeight: 260,
      props: [
        { name: "value / onValueChange", type: "string / (value: string) => void", description: "Controlled text." },
        { name: "defaultValue", type: "string", default: '""', description: "Uncontrolled initial text." },
        { name: "minRows", type: "number", default: "2", description: "Height when empty, in lines." },
        { name: "maxRows", type: "number", default: "8", description: "Grows up to this many lines, then scrolls." },
        { name: "maxLength", type: "number", description: "Character limit; shows the counter ring." },
        { name: "warnAt", type: "number", default: "0.8", description: "Fraction of maxLength where the counter turns amber." },
        { name: "enforceLimit", type: "boolean", default: "true", description: "false lets people type past the limit and marks the field invalid instead." },
        { name: "containerClassName", type: "string", description: "Classes for the wrapper. `className` styles the textarea." },
      ],
    },
    {
      id: "chat-input",
      title: "Chat Input",
      registry: "chat-input",
      source: block("chat-input.tsx"),
      deps: "motion lucide-react",
      description: (
        <>
          A composer for chat and AI prompts. Enter sends, Shift+Enter adds a line, and IME composition is
          never interrupted. The send button wakes up with a spring once there is text, and swaps to a
          spinner without changing size while <Code>onSubmit</Code>&apos;s promise is pending (the DuskUI
          Button <Code>loading</Code> prop). If the promise rejects, the text comes back. Put attach or
          model buttons in <Code>actions</Code>.
        </>
      ),
      Demo: ChatInputDemo,
      file: demo("chat-input-demo.tsx"),
      minHeight: 320,
      props: [
        { name: "onSubmit", type: "(message: string) => void | Promise", description: "Called with the trimmed text. Return a promise to show loading until it settles." },
        { name: "value / onValueChange", type: "string / (value: string) => void", description: "Controlled text. Uncontrolled inputs clear themselves on send." },
        { name: "defaultValue", type: "string", default: '""', description: "Uncontrolled initial text." },
        { name: "loading", type: "boolean", default: "false", description: "Show the spinner and block sending, e.g. while a reply streams." },
        { name: "actions", type: "ReactNode", description: "Extra controls on the left of the toolbar." },
        { name: "sendLabel", type: "string", default: '"Send message"', description: "Accessible name of the send button." },
        { name: "containerClassName", type: "string", description: "Classes for the outer box. `className` styles the textarea (e.g. max-h-*)." },
      ],
    },
  ],
  api: {
    intro: (
      <>
        <Code>Textarea</Code> takes every native <Code>&lt;textarea&gt;</Code> prop, exactly like shadcn/ui.
      </>
    ),
    props: [
      { name: "className", type: "string", description: "Add max-h-* to cap the auto-grow; field-sizing-fixed to turn it off." },
      { name: "rows", type: "number", description: "Initial height when field-sizing-fixed is set." },
      { name: "aria-invalid", type: "boolean", description: "Red border and ring for validation errors." },
      { name: "disabled / readOnly", type: "boolean", description: "Dimmed, or a muted surface without a focus ring." },
    ],
  },
  accessibility: [
    "It is a native <textarea>: name it with a <label htmlFor> or aria-label, and link hints and errors with aria-describedby.",
    "Auto-resize Textarea links the counter with aria-describedby and announces only threshold changes (\"20 characters left\", \"Character limit reached\") through a polite live region, not every keystroke.",
    "Chat Input explains Enter / Shift+Enter in an sr-only hint linked to the field, sets enterKeyHint=\"send\" for mobile keyboards, and keeps the send button focusable while loading (aria-busy + aria-disabled).",
    "Under prefers-reduced-motion the height changes instantly and the counter and send button only fade.",
  ],
};

export function TextareaDocs() {
  return <ComponentDocs config={config} />;
}
