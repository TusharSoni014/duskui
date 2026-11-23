import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import KbdBasicDemo from "@/components/demos/kbd/kbd-basic";
import KbdButtonDemo from "@/components/demos/kbd/kbd-button";
import ShortcutKbdDemo from "@/components/demos/kbd/shortcut-kbd-demo";
import ShortcutListDemo from "@/components/demos/kbd/shortcut-list-demo";

const demo = (file: string) => `components/demos/kbd/${file}`;
const block = (file: string) => `components/dusk/kbd/${file}`;

const config: DocConfig = {
  title: "Kbd",
  intro:
    "Keyboard keys for React styled as real keycaps, with a pressed state that sinks and glows — plus an animated shortcut block that lights up each key as you press the combo, knows ⌘ from Ctrl without hydration mismatches, and ships a useShortcut hook.",
  tags: ["shadcn API", "Server Component friendly", "Mac / Windows aware", "No hydration mismatch"],
  hero: { Demo: ShortcutKbdDemo, file: demo("shortcut-kbd-demo.tsx"), minHeight: 240 },
  install: {
    registry: "kbd",
    source: "components/ui/kbd.tsx",
    deps: "class-variance-authority",
    note: (
      <>
        Adds <Code>components/ui/kbd.tsx</Code> with shadcn&apos;s <Code>Kbd</Code> and{" "}
        <Code>KbdGroup</Code>, plus <Code>size</Code> and <Code>pressed</Code>. CSS only.
      </>
    ),
  },
  usage: {
    filename: "search-hint.tsx",
    code: `import { Kbd, KbdGroup } from "@/components/ui/kbd"

export function SearchHint() {
  return (
    <p className="text-sm text-muted-foreground">
      Press{" "}
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>{" "}
      to search
    </p>
  )
}`,
  },
  examples: [
    {
      id: "default",
      title: "Keycaps",
      description: (
        <>
          Three sizes, icons sized automatically, and <Code>KbdGroup</Code> for combinations. Add{" "}
          <Code>pressed</Code> to show a key held down. Keys sit nicely inside running text too.
        </>
      ),
      Demo: KbdBasicDemo,
      file: demo("kbd-basic.tsx"),
      minHeight: 220,
    },
    {
      id: "in-buttons",
      title: "In buttons",
      description: "Hint the shortcut right on the control it triggers. Kbd flattens itself inside tooltips.",
      Demo: KbdButtonDemo,
      file: demo("kbd-button.tsx"),
      minHeight: 160,
    },
  ],
  blocks: [
    {
      id: "shortcut-kbd",
      title: "Shortcut Kbd",
      registry: "shortcut-kbd",
      source: block("shortcut-kbd.tsx"),
      deps: "motion class-variance-authority",
      description: (
        <>
          Keycaps that listen. Each cap sinks while its key is held; when the full combination lands they
          flash mint with a quick bounce and <Code>onTrigger</Code> runs. <Code>mod</Code> shows ⌘ on Apple
          devices and Ctrl elsewhere — the platform is read with <Code>useSyncExternalStore</Code>, so the
          server HTML and first client render always match. Letters match by physical key, so ⌥ and ⇧
          can&apos;t change them. The file also exports <Code>useShortcut</Code> and{" "}
          <Code>usePlatform</Code> for your own UI.
        </>
      ),
      Demo: ShortcutKbdDemo,
      file: demo("shortcut-kbd-demo.tsx"),
      minHeight: 240,
      props: [
        { name: "keys", type: "string[]", description: 'The combination, e.g. ["mod", "k"]. Modifiers: mod, ctrl, shift, alt (option), meta (cmd). Required.' },
        { name: "onTrigger", type: "(event: KeyboardEvent) => void", description: "Called when the full combination is pressed." },
        { name: "enabled", type: "boolean", default: "true", description: "Listen for the shortcut." },
        { name: "preventDefault", type: "boolean", default: "true", description: "Stop the browser's own action for the combo." },
        { name: "enableInInputs", type: "boolean", description: "Fire while typing in a field. Defaults to true for combos with mod / ctrl / meta / alt, false for plain keys." },
        { name: "size", type: '"sm" | "default" | "lg"', default: '"default"', description: "Keycap size." },
        { name: "keyClassName", type: "string", description: "Classes for each keycap." },
      ],
    },
    {
      id: "shortcut-list",
      title: "Shortcut cheat sheet",
      registry: "shortcut-kbd",
      source: block("shortcut-kbd.tsx"),
      deps: "motion class-variance-authority",
      description: (
        <>
          Several <Code>ShortcutKbd</Code>s make a live cheat sheet: every row lights up as you try it.
          Plain keys like <Code>J</Code> and <Code>/</Code> pause while you type in a field, so
          they never steal input.
        </>
      ),
      Demo: ShortcutListDemo,
      file: demo("shortcut-list-demo.tsx"),
      minHeight: 340,
    },
  ],
  api: {
    intro: (
      <>
        <Code>Kbd</Code> renders a <Code>&lt;kbd&gt;</Code>; <Code>KbdGroup</Code> renders a wrapping{" "}
        <Code>&lt;kbd&gt;</Code> so nested keys read as one shortcut.
      </>
    ),
    props: [
      { name: "size", type: '"sm" | "default" | "lg"', default: '"default"', description: "Kbd. Keycap size." },
      { name: "pressed", type: "boolean", default: "false", description: "Kbd. Shows the key held down: it sinks a pixel and lights up mint." },
    ],
  },
  accessibility: [
    <>Keys use the semantic <Code>&lt;kbd&gt;</Code> element, and a group of keys is nested in another <Code>&lt;kbd&gt;</Code>, the HTML pattern for a key combination.</>,
    <>Give symbol keys a spoken name: pair <Code>⌘</Code> or an icon with <Code>&lt;span className=&quot;sr-only&quot;&gt;Command&lt;/span&gt;</Code>. Shortcut Kbd does this for you (Command, Control, Shift, Option…).</>,
    "Shortcut Kbd only listens; announce the result of a shortcut yourself, e.g. with a polite live region as in the demos.",
    "Avoid single-key shortcuts for destructive actions; they are paused inside text fields by default, but can still be pressed by accident.",
    "Under prefers-reduced-motion the trigger flash is a color change only, without the bounce.",
  ],
};

export function KbdDocs() {
  return <ComponentDocs config={config} />;
}
