import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import TagInputDemo from "@/components/demos/tag-input/tag-input-demo";
import TagInputSuggestionsDemo from "@/components/demos/tag-input/tag-input-suggestions";
import TagInputFormDemo from "@/components/demos/tag-input/tag-input-form";

const demo = (file: string) => `components/demos/tag-input/${file}`;

const config: DocConfig = {
  title: "Tag Input",
  intro:
    "An accessible React tag input (chip input): type and press Enter or comma to add tags as chips, Backspace twice to remove, paste a comma-separated list to add many at once, with duplicate detection, validation, a max count, optional suggestions and form submission — animated with Motion and styled with Tailwind CSS.",
  tags: ["Chips", "Paste lists", "Duplicate shake", "Suggestions", "Live announcements", "Form-ready"],
  hero: { Demo: TagInputDemo, file: demo("tag-input-demo.tsx"), minHeight: 200 },
  install: {
    registry: "tag-input",
    source: "components/dusk/tag-input/tag-input.tsx",
    deps: "motion lucide-react",
  },
  usage: {
    filename: "post-tags.tsx",
    code: `"use client"

import * as React from "react"
import { TagInput } from "@/components/dusk/tag-input/tag-input"

export function PostTags() {
  const [tags, setTags] = React.useState<string[]>([])
  return <TagInput aria-label="Tags" value={tags} onValueChange={setTags} max={5} />
}`,
  },
  examples: [
    {
      id: "suggestions",
      title: "With suggestions",
      description: (
        <>
          Pass <Code>suggestions</Code> and the field becomes a combobox: matches filter as you type (prefix matches
          first), Arrow keys move a gliding highlight and Enter picks. Tags already added are hidden from the list.
        </>
      ),
      Demo: TagInputSuggestionsDemo,
      file: demo("tag-input-suggestions.tsx"),
      minHeight: 340,
    },
    {
      id: "validation",
      title: "Validation, limit & forms",
      description: (
        <>
          <Code>transform</Code> normalizes each tag, <Code>validate</Code> can reject it with a message, and{" "}
          <Code>onReject</Code> lets you show that message in a <Code>FieldError</Code>. With <Code>max</Code> a counter
          appears; with <Code>name</Code> every tag is submitted. Paste{" "}
          <Code>ada@dusk.dev, grace@dusk.dev</Code> to add both.
        </>
      ),
      Demo: TagInputFormDemo,
      file: demo("tag-input-form.tsx"),
      minHeight: 280,
    },
  ],
  api: {
    props: [
      { name: "value / onValueChange", type: "string[] / (tags: string[]) => void", description: "Controlled tags." },
      { name: "defaultValue", type: "string[]", default: "[]", description: "Uncontrolled initial tags." },
      { name: "max", type: "number", description: "Maximum number of tags. Shows an n/max counter." },
      { name: "suggestions", type: "string[]", description: "Options shown in a filtered list while typing." },
      { name: "separators", type: "string[]", default: '[","]', description: "Characters that commit a tag besides Enter. Pastes also split on new lines and tabs." },
      { name: "allowDuplicates", type: "boolean", default: "false", description: "Allow the same tag twice (compared case-insensitively)." },
      { name: "validate", type: "(tag, tags) => boolean | string", description: "Return false or an error message to reject a tag." },
      { name: "transform", type: "(tag: string) => string", default: "trim", description: "Normalize a tag before it's checked." },
      { name: "onReject", type: '(tag, reason: "duplicate" | "invalid" | "max", message) => void', description: "Fires when a tag is refused." },
      { name: "name", type: "string", description: "Submit each tag with its own hidden input." },
      { name: "placeholder", type: "string", default: '"Add a tag…"', description: "Shown while there are no tags." },
      { name: "id / aria-label / aria-describedby / aria-invalid", type: "string / boolean", description: "Forwarded to the text input." },
    ],
  },
  accessibility: [
    "Every add, removal and rejection is announced through a polite live region, including the running count when there's a max.",
    "Backspace in the empty field first highlights the last chip and announces it; a second press removes it, so tags are never deleted by accident.",
    "Each chip has a labelled remove button (“Remove react”). Instructions are linked to the input with aria-describedby.",
    <>With suggestions, the input follows the combobox pattern: <Code>role=&quot;combobox&quot;</Code>, <Code>aria-expanded</Code>, <Code>aria-controls</Code> and <Code>aria-activedescendant</Code>.</>,
    "An empty Enter still submits the surrounding form. Chips fade instead of popping under prefers-reduced-motion, and shakes are skipped.",
  ],
};

export function TagInputDocs() {
  return <ComponentDocs config={config} />;
}
