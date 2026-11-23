import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import FloatingNavbarDemo from "@/components/demos/navbar/floating-navbar-demo";
import FloatingNavbarMobileDemo from "@/components/demos/navbar/floating-navbar-mobile";
import FloatingNavbarStaticDemo from "@/components/demos/navbar/floating-navbar-static";

const demo = (file: string) => `components/demos/navbar/${file}`;

const config: DocConfig = {
  title: "Navbar",
  intro:
    "A floating, glassy React navbar built with Motion and Tailwind CSS that hides when you scroll down and reappears when you scroll up. A pill glides to the active link, a hover highlight slides between links, and on narrow layouts it becomes an animated mobile menu — all keyboard accessible.",
  tags: ["Hide on scroll", "Motion layoutId pill", "Animated mobile menu", "Container queries", "Scroll container support", "prefers-reduced-motion"],
  hero: { Demo: FloatingNavbarDemo, file: demo("floating-navbar-demo.tsx"), minHeight: 500 },
  install: {
    registry: "floating-navbar",
    source: "components/dusk/navbar/floating-navbar.tsx",
    deps: "motion",
    note: (
      <>
        It is <Code>sticky top-0</Code> by default; override with <Code>className</Code> (e.g.{" "}
        <Code>fixed inset-x-0</Code>). It collapses below a 42rem container width using a Tailwind container
        query, so it adapts to the space it&apos;s given rather than the viewport.
      </>
    ),
  },
  usage: {
    filename: "site-header.tsx",
    code: `"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FloatingNavbar } from "@/components/dusk/navbar/floating-navbar"

const links = [
  { label: "Home", href: "/" },
  { label: "Docs", href: "/docs" },
  { label: "Pricing", href: "/pricing" },
]

export function SiteHeader() {
  const pathname = usePathname()
  return (
    <FloatingNavbar
      links={links}
      activeHref={pathname}
      linkAs={Link}
      logo={<Link href="/">Acme</Link>}
    />
  )
}`,
  },
  examples: [
    {
      id: "mobile",
      title: "Mobile menu",
      description: (
        <>
          In a narrow container the links move into a menu. The button morphs into a close icon, the panel
          springs open with its links cascading in, and it closes on Escape (returning focus), on an
          outside click or when a link is chosen. The navbar won&apos;t hide while the menu is open.
        </>
      ),
      Demo: FloatingNavbarMobileDemo,
      file: demo("floating-navbar-mobile.tsx"),
      minHeight: 460,
    },
    {
      id: "static",
      title: "Always visible",
      description: (
        <>
          <Code>hideOnScroll={"{false}"}</Code> keeps it in place — useful for short pages. Put buttons on the
          right with <Code>actions</Code>; they stay visible at every size.
        </>
      ),
      Demo: FloatingNavbarStaticDemo,
      file: demo("floating-navbar-static.tsx"),
      minHeight: 160,
    },
  ],
  api: {
    intro: <>Also accepts any div prop for the sticky wrapper.</>,
    props: [
      { name: "links", type: "{ label: string; href: string }[]", description: "The navigation links." },
      { name: "activeHref", type: "string", description: "Controlled active link, e.g. usePathname()." },
      { name: "defaultActiveHref", type: "string", default: "first link", description: "Uncontrolled initial active link; clicking a link activates it." },
      { name: "onNavigate", type: "(href, event) => void", description: "Called on link click. Call event.preventDefault() to handle navigation yourself." },
      { name: "logo / actions", type: "ReactNode", description: "Brand on the left and buttons on the right." },
      { name: "container", type: "RefObject<HTMLElement>", description: "Scroll container to watch. Defaults to the page." },
      { name: "hideOnScroll", type: "boolean", default: "true", description: "Hide on scroll down, show on scroll up." },
      { name: "revealAt", type: "number", default: "64", description: "Always shown above this scroll offset, in px." },
      { name: "threshold", type: "number", default: "8", description: "Scroll distance in one direction before toggling, in px." },
      { name: "linkAs", type: "ElementType", default: '"a"', description: "Link component, e.g. Next.js Link." },
      { name: "aria-label", type: "string", default: '"Main"', description: "Names the navigation landmark." },
    ],
  },
  accessibility: [
    "Links live in a header › nav landmark (labelled “Main” by default) as a list; the active one carries aria-current=\"page\".",
    "Keyboard focus anywhere in the navbar reveals it instantly, so a hidden bar can never trap focus off-screen.",
    "The menu button exposes aria-expanded and aria-controls, switches its label between “Open menu” and “Close menu”, and Escape closes the menu and returns focus to it.",
    "The gliding pill and hover highlight are decorative and aria-hidden; hover effects only follow a mouse.",
    "Under prefers-reduced-motion the bar fades out and in instead of sliding, and the menu only fades.",
  ],
};

export function NavbarDocs() {
  return <ComponentDocs config={config} />;
}
