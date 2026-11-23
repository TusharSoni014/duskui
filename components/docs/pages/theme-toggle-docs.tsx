import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import ThemeToggleDemo from "@/components/demos/theme-toggle/theme-toggle-demo";
import ThemeToggleSizesDemo from "@/components/demos/theme-toggle/theme-toggle-sizes";
import ThemeToggleControlledDemo from "@/components/demos/theme-toggle/theme-toggle-controlled";

const demo = (file: string) => `components/demos/theme-toggle/${file}`;

const config: DocConfig = {
  title: "Theme Toggle",
  intro:
    "An animated dark mode toggle for React and Tailwind CSS: the icon morphs from a sun into a moon and the new theme is revealed with a circle that grows out of the button, using the View Transitions API. It works with any theme setup (next-themes, a class on <html>, or a single panel) and falls back to an instant switch.",
  tags: ["View Transitions API", "Sun ↔ moon morph", "Works with next-themes", "Scoped to any element", "prefers-reduced-motion"],
  hero: { Demo: ThemeToggleDemo, file: demo("theme-toggle-demo.tsx"), minHeight: 380 },
  install: {
    registry: "theme-toggle",
    source: "components/dusk/theme-toggle/theme-toggle.tsx",
    deps: "motion",
    note: (
      <>
        On its own it toggles a <Code>dark</Code> class and <Code>color-scheme</Code> on{" "}
        <Code>&lt;html&gt;</Code>. Using next-themes? Pass its state in and set{" "}
        <Code>applyClass=&#123;false&#125;</Code> so next-themes stays in charge of the class.
      </>
    ),
  },
  usage: {
    filename: "site-header.tsx",
    code: `"use client"

import { useTheme } from "next-themes"
import { ThemeToggle } from "@/components/dusk/theme-toggle/theme-toggle"

export function SiteHeaderToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <ThemeToggle
      theme={resolvedTheme === "light" ? "light" : "dark"}
      onThemeChange={setTheme}
      applyClass={false}
    />
  )
}`,
  },
  examples: [
    {
      id: "sizes",
      title: "Sizes, variants & speed",
      description: (
        <>
          Three <Code>size</Code>s, an <Code>outline</Code> or <Code>ghost</Code> look and a{" "}
          <Code>duration</Code> for the reveal. Each tile is its own <Code>target</Code>, so only that tile
          switches.
        </>
      ),
      Demo: ThemeToggleSizesDemo,
      file: demo("theme-toggle-sizes.tsx"),
      minHeight: 220,
    },
    {
      id: "controlled",
      title: "Controlled",
      description: (
        <>
          Drive it with <Code>theme</Code> and <Code>onThemeChange</Code>. Clicks on the toggle get the
          circular reveal; changes made elsewhere apply instantly.
        </>
      ),
      Demo: ThemeToggleControlledDemo,
      file: demo("theme-toggle-controlled.tsx"),
      minHeight: 300,
    },
  ],
  api: {
    intro: <>Also accepts any <Code>&lt;button&gt;</Code> attribute except <Code>onClick</Code>.</>,
    props: [
      { name: "theme", type: '"light" | "dark"', description: "Current theme (controlled)." },
      { name: "defaultTheme", type: '"light" | "dark"', default: '"dark"', description: "Initial theme when uncontrolled." },
      { name: "onThemeChange", type: "(theme) => void", description: "Called with the next theme, inside the view transition so the new snapshot includes it." },
      { name: "target", type: "RefObject<HTMLElement> | HTMLElement | () => HTMLElement", default: "document.documentElement", description: "Element that receives the dark class and is revealed. Pass a ref to scope the switch to one panel." },
      { name: "applyClass", type: "boolean", default: "true", description: "Toggle darkClass and color-scheme on the target. Turn off when a theme library manages the class." },
      { name: "darkClass", type: "string", default: '"dark"', description: "Class added to the target in dark mode." },
      { name: "transition", type: '"circle" | "none"', default: '"circle"', description: "Circular reveal from the button, or an instant switch." },
      { name: "duration", type: "number", default: "600", description: "Reveal duration in milliseconds." },
      { name: "easing", type: "string", default: '"cubic-bezier(0.65, 0, 0.35, 1)"', description: "CSS easing for the reveal." },
      { name: "size", type: '"sm" | "default" | "lg"', default: '"default"', description: "Button size." },
      { name: "variant", type: '"outline" | "ghost"', default: '"outline"', description: "Button style. Colors follow currentColor, so they adapt to either theme." },
      { name: "label", type: "string", default: '"Dark mode"', description: "Accessible name of the button." },
    ],
  },
  accessibility: [
    <>It is a real <Code>&lt;button&gt;</Code> with <Code>aria-pressed</Code>, so screen readers announce “Dark mode, toggle button, pressed” when dark mode is on.</>,
    "Fully keyboard operable with Enter and Space, with a visible focus ring.",
    "With prefers-reduced-motion the theme switches instantly, with no circular reveal.",
    "Browsers without the View Transitions API get the same instant switch; nothing breaks.",
    <>Setting <Code>color-scheme</Code> on the target keeps native controls and scrollbars in the matching theme.</>,
  ],
};

export function ThemeToggleDocs() {
  return <ComponentDocs config={config} />;
}
