import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import DropdownMenuBasicDemo from "@/components/demos/dropdown-menu/dropdown-menu-basic";
import DropdownMenuCheckboxesDemo from "@/components/demos/dropdown-menu/dropdown-menu-checkboxes";
import AnimatedDropdownDemo from "@/components/demos/dropdown-menu/animated-dropdown-demo";

const demo = (file: string) => `components/demos/dropdown-menu/${file}`;
const block = (file: string) => `components/dusk/dropdown-menu/${file}`;

const config: DocConfig = {
  title: "Dropdown Menu",
  intro:
    "The shadcn/ui Dropdown Menu with menus that grow out of their trigger, smooth item highlights and indicators that pop in — plus an animated React dropdown menu block built with Motion and Radix, with staggered items and a highlight pill that glides between them.",
  tags: ["Drop-in shadcn API", "Radix keyboard & typeahead", "Sub-menus", "Motion block"],
  hero: { Demo: AnimatedDropdownDemo, file: demo("animated-dropdown-demo.tsx"), minHeight: 360 },
  install: {
    registry: "dropdown-menu",
    source: "components/ui/dropdown-menu.tsx",
    deps: "@radix-ui/react-dropdown-menu lucide-react",
    note: (
      <>
        Replaces <Code>components/ui/dropdown-menu.tsx</Code> with the same exports and props
        (including <Code>inset</Code> and <Code>variant=&quot;destructive&quot;</Code>). Animations are
        CSS (tw-animate-css), so the base needs no Motion.
      </>
    ),
  },
  usage: {
    filename: "account-menu.tsx",
    code: `import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function AccountMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Account</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}`,
  },
  examples: [
    {
      id: "default",
      title: "Default",
      description: (
        <>
          The menu scales out of the trigger (using Radix&apos;s transform origin) and slides in from
          the side it opens on, then closes faster than it opened. Includes groups, shortcuts, a
          disabled item, a sub-menu whose chevron nudges open, and a destructive item.
        </>
      ),
      Demo: DropdownMenuBasicDemo,
      file: demo("dropdown-menu-basic.tsx"),
      minHeight: 380,
    },
    {
      id: "checkboxes-radio",
      title: "Checkboxes & radio group",
      description: (
        <>
          Check marks and radio dots pop in with a little overshoot when selected. Call{" "}
          <Code>event.preventDefault()</Code> in <Code>onSelect</Code> to keep the menu open while
          toggling several options.
        </>
      ),
      Demo: DropdownMenuCheckboxesDemo,
      file: demo("dropdown-menu-checkboxes.tsx"),
      minHeight: 340,
    },
  ],
  blocks: [
    {
      id: "animated-dropdown",
      title: "Animated Dropdown",
      registry: "animated-dropdown",
      source: block("animated-dropdown.tsx"),
      deps: "motion @radix-ui/react-dropdown-menu",
      description: (
        <>
          A dropdown that springs open from its trigger&apos;s side while items cascade in. A
          highlight pill glides between items as you hover or arrow through them (a shared Motion{" "}
          <Code>layoutId</Code>), the hovered item&apos;s icon lights up, and separators draw in. It&apos;s
          still Radix underneath: focus, typeahead, arrow keys, Escape and aria all work.
        </>
      ),
      Demo: AnimatedDropdownDemo,
      file: demo("animated-dropdown-demo.tsx"),
      minHeight: 360,
      props: [
        { name: "open / defaultOpen / onOpenChange", type: "boolean / boolean / (open: boolean) => void", description: "Open state (on AnimatedDropdown)." },
        { name: "AnimatedDropdownTrigger", type: "Radix Trigger props", description: "Use asChild to render your own Button." },
        { name: "AnimatedDropdownContent", type: "Radix Content props & { stagger?: number }", description: "side, align, sideOffset… stagger is the delay between items in seconds (default 0.035)." },
        { name: "AnimatedDropdownItem", type: "Radix Item props & { icon?, shortcut?, variant? }", description: "An action. variant=\"destructive\" tints it red." },
        { name: "AnimatedDropdownLabel / Separator / Group", type: "Radix props", description: "Headings, dividers and groups that animate with the items." },
      ],
    },
  ],
  api: {
    intro: (
      <>
        Same parts as shadcn/ui: <Code>DropdownMenu</Code>, <Code>Trigger</Code>, <Code>Content</Code>,{" "}
        <Code>Item</Code>, <Code>CheckboxItem</Code>, <Code>RadioGroup</Code>, <Code>RadioItem</Code>,{" "}
        <Code>Label</Code>, <Code>Separator</Code>, <Code>Shortcut</Code>, <Code>Group</Code>,{" "}
        <Code>Portal</Code>, <Code>Sub</Code>, <Code>SubTrigger</Code> and <Code>SubContent</Code> (all
        prefixed <Code>DropdownMenu</Code>). Each forwards the Radix props.
      </>
    ),
    props: [
      { name: "open / onOpenChange", type: "boolean / (open: boolean) => void", description: "Controlled state (on DropdownMenu)." },
      { name: "side / align / sideOffset", type: "string / string / number", default: '"bottom" / "center" / 6', description: "Placement (on DropdownMenuContent)." },
      { name: "onSelect", type: "(event: Event) => void", description: "Fires on click, Enter or Space; preventDefault() keeps the menu open (on items)." },
      { name: "variant", type: '"default" | "destructive"', default: '"default"', description: "Red destructive item (on DropdownMenuItem)." },
      { name: "inset", type: "boolean", description: "Indent to align with items that have an indicator (Item, Label, SubTrigger)." },
      { name: "checked / onCheckedChange", type: "boolean / (checked: boolean) => void", description: "On DropdownMenuCheckboxItem." },
    ],
  },
  accessibility: [
    <>Built on Radix Dropdown Menu: <Code>role=&quot;menu&quot;</Code> with menuitem, menuitemcheckbox and menuitemradio roles, roving focus, typeahead, and focus returned to the trigger on close.</>,
    "Arrow keys move between items, Right/Left open and close sub-menus, Enter/Space select and Escape closes.",
    "In the Animated Dropdown the highlight pill follows keyboard focus as well as the pointer, so keyboard users see the same feedback.",
    "Under prefers-reduced-motion menus only fade, the item cascade is removed and the highlight jumps instead of gliding.",
  ],
};

export function DropdownMenuDocs() {
  return <ComponentDocs config={config} />;
}
