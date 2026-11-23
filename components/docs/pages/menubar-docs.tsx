import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import MenubarBasicDemo from "@/components/demos/menubar/menubar-basic";
import MenubarCheckboxesDemo from "@/components/demos/menubar/menubar-checkboxes";
import AnimatedMenubarDemo from "@/components/demos/menubar/animated-menubar-demo";

const demo = (file: string) => `components/demos/menubar/${file}`;
const block = (file: string) => `components/dusk/menubar/${file}`;

const config: DocConfig = {
  title: "Menubar",
  intro:
    "An animated React menubar built on shadcn/ui and Radix: the drop-in Menubar gives you desktop-app menus with sub-menus, checkbox and radio items and keyboard shortcuts, plus a Motion menubar block whose highlight glides between File, Edit and View while menus spring open.",
  tags: ["Drop-in shadcn API", "Radix Menubar", "Sub-menus", "Checkbox & radio items", "Motion block"],
  hero: { Demo: AnimatedMenubarDemo, file: demo("animated-menubar-demo.tsx"), minHeight: 380 },
  install: {
    registry: "menubar",
    source: "components/ui/menubar.tsx",
    deps: "@radix-ui/react-menubar lucide-react",
    note: (
      <>
        Adds <Code>components/ui/menubar.tsx</Code> with the shadcn exports and props (including{" "}
        <Code>inset</Code> and <Code>variant=&quot;destructive&quot;</Code> on items). Animations are CSS
        (tw-animate-css), so the base needs no Motion.
      </>
    ),
  },
  usage: {
    filename: "app-menubar.tsx",
    code: `import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"

export function AppMenubar() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New tab <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Print…</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}`,
  },
  examples: [
    {
      id: "default",
      title: "Default",
      description: (
        <>
          Menus with shortcuts, a disabled item, a sub-menu and a destructive action. Once a menu is open,
          hovering another trigger switches to it, and the left / right arrow keys move between menus.
        </>
      ),
      Demo: MenubarBasicDemo,
      file: demo("menubar-basic.tsx"),
      minHeight: 340,
    },
    {
      id: "checkboxes-and-radios",
      title: "Checkbox and radio items",
      description: (
        <>
          <Code>MenubarCheckboxItem</Code> toggles view options and <Code>MenubarRadioGroup</Code> picks one
          value. Indicators pop in with a small overshoot when an item turns on.
        </>
      ),
      Demo: MenubarCheckboxesDemo,
      file: demo("menubar-checkboxes.tsx"),
      minHeight: 340,
    },
  ],
  blocks: [
    {
      id: "animated-menubar",
      title: "Animated Menubar",
      registry: "animated-menubar",
      source: block("animated-menubar.tsx"),
      deps: "motion @radix-ui/react-menubar lucide-react",
      description: (
        <>
          A desktop-app style menubar. A highlight glides between top-level triggers as you hover or arrow
          across them and follows the open menu as you sweep from menu to menu (a shared{" "}
          <Code>layoutId</Code>). Menus spring open from their trigger, items cascade in and a pill glides
          between items. Check marks spring in, and sub-menus use the DuskUI <Code>MenubarSubContent</Code>.
        </>
      ),
      Demo: AnimatedMenubarDemo,
      file: demo("animated-menubar-demo.tsx"),
      minHeight: 380,
      props: [
        { name: "value / defaultValue / onValueChange", type: "string", default: '""', description: "On AnimatedMenubar: the open menu's value, \"\" when closed." },
        { name: "value", type: "string", description: "On AnimatedMenubarMenu: identifies the menu. Generated when omitted." },
        { name: "stagger", type: "number", default: "0.025", description: "On AnimatedMenubarContent: delay between items cascading in, in seconds." },
        { name: "icon", type: "ReactNode", description: "On AnimatedMenubarItem / SubTrigger: leading icon; turns mint under the pill." },
        { name: "shortcut", type: "ReactNode", description: "On items: trailing keyboard hint. Visual only." },
        { name: "variant", type: '"default" | "destructive"', default: '"default"', description: "On AnimatedMenubarItem: tints the item and its pill red." },
        { name: "checked / onCheckedChange", type: "boolean / (checked: boolean) => void", description: "On AnimatedMenubarCheckboxItem." },
        { name: "Label / Separator / Group / Sub / SubTrigger / SubContent", type: "Radix Menubar parts", description: "Animated equivalents; Separator draws in from the left." },
      ],
    },
  ],
  api: {
    intro: (
      <>
        Same parts as shadcn/ui: <Code>Menubar</Code>, <Code>MenubarMenu</Code>, <Code>MenubarTrigger</Code>,{" "}
        <Code>MenubarContent</Code>, <Code>MenubarItem</Code>, <Code>MenubarCheckboxItem</Code>,{" "}
        <Code>MenubarRadioGroup</Code>, <Code>MenubarRadioItem</Code>, <Code>MenubarLabel</Code>,{" "}
        <Code>MenubarSeparator</Code>, <Code>MenubarShortcut</Code>, <Code>MenubarGroup</Code>,{" "}
        <Code>MenubarPortal</Code>, <Code>MenubarSub</Code>, <Code>MenubarSubTrigger</Code> and{" "}
        <Code>MenubarSubContent</Code>, each forwarding its Radix props.
      </>
    ),
    props: [
      { name: "value / defaultValue / onValueChange", type: "string", description: "On Menubar: the open menu (controlled or not)." },
      { name: "loop", type: "boolean", default: "true", description: "On Menubar: arrow keys wrap from the last trigger to the first." },
      { name: "align / alignOffset / sideOffset", type: '"start" | "center" | "end" / number / number', default: '"start" / -4 / 8', description: "On MenubarContent: placement under the trigger." },
      { name: "inset", type: "boolean", default: "false", description: "On items, labels and sub-triggers: indent to line up with indicators." },
      { name: "variant", type: '"default" | "destructive"', default: '"default"', description: "On MenubarItem: tints the item red." },
      { name: "checked / onCheckedChange", type: "boolean | \"indeterminate\"", description: "On MenubarCheckboxItem." },
      { name: "value / onValueChange", type: "string", description: "On MenubarRadioGroup: the selected radio item." },
    ],
  },
  accessibility: [
    "Built on Radix Menubar: role=\"menubar\" with roving focus; left / right arrows move between menus, Enter, Space or ↓ open one, Escape closes it and returns focus to its trigger.",
    "Items support typeahead, Home / End and arrow keys; checkbox and radio items expose aria-checked.",
    "Shortcuts are visual hints only (MenubarShortcut) — wire the actual key handlers yourself.",
    "Under prefers-reduced-motion menus only fade; in the Motion block the gliding highlights jump instead of sliding.",
  ],
};

export function MenubarDocs() {
  return <ComponentDocs config={config} />;
}
