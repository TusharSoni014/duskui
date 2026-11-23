"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Github } from "lucide-react";

import { Logo, LogoMark } from "@/components/brand/logo";
import { GlobalSearch } from "@/components/global-search";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CopyButton } from "@/components/dusk/button/copy-button";
import { StatusButton, useStatusAction } from "@/components/dusk/button/status-button";
import { TerminalWindow, type TerminalLine } from "@/components/dusk/hacker/terminal-window";

import HoldToConfirmDemo from "@/components/demos/button/hold-to-confirm-demo";
import OTPInputDemo from "@/components/demos/input/otp-input-demo";
import DockDemo from "@/components/demos/dock/dock-demo";
import AnimatedListDemo from "@/components/demos/animated-list/animated-list-demo";
import IconSwitchDemo from "@/components/demos/switch/icon-switch-demo";
import SegmentedControlDemo from "@/components/demos/tabs/segmented-control-demo";

import { componentHref, components } from "@/lib/components-data";
import { siteConfig } from "@/lib/site";

const INSTALL = "npx shadcn@latest add https://duskui.com/r/button.json";

/* ----------------------------------------------------------------------------
 * Header
 * ------------------------------------------------------------------------- */

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          aria-label="DuskUI home"
          className="rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <Logo markClassName="size-7" />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-6 text-sm text-white/60 md:flex">
          <Link href="/components" className="transition-colors hover:text-white">
            Components
          </Link>
          <Link href="#install" className="transition-colors hover:text-white">
            Install
          </Link>
          <Link
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-white"
          >
            GitHub
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <GlobalSearch />
          </div>
          <Button asChild size="sm">
            <Link href="/components">Browse</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

/* ----------------------------------------------------------------------------
 * Hero — copy on the left, a small working screen built from DuskUI on the right
 * ------------------------------------------------------------------------- */

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function LivePanel() {
  const save = useStatusAction(() => wait(1200));
  const [previews, setPreviews] = React.useState(true);
  const [alerts, setAlerts] = React.useState(false);

  return (
    <div className="rounded-xl border border-white/10 bg-card shadow-2xl shadow-black/40">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
        <p className="text-sm font-medium text-white">Project settings</p>
        <span className="text-xs text-white/40">acme-web</span>
      </div>

      <Tabs defaultValue="general" className="p-5">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="deploys">Deploys</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-5 space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="live-name">Project name</Label>
            <Input id="live-name" defaultValue="acme-web" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="live-domain">Domain</Label>
            <Input id="live-domain" defaultValue="acme.dev" />
          </div>
        </TabsContent>

        <TabsContent value="deploys" className="mt-5 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Label htmlFor="live-previews">Preview deployments</Label>
              <p className="mt-1 text-xs text-white/50">A URL for every pull request.</p>
            </div>
            <Switch id="live-previews" checked={previews} onCheckedChange={setPreviews} />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <Label htmlFor="live-alerts">Failure alerts</Label>
              <p className="mt-1 text-xs text-white/50">Email the team when a build fails.</p>
            </div>
            <Switch id="live-alerts" checked={alerts} onCheckedChange={setAlerts} />
          </div>
        </TabsContent>

        <div className="mt-6 flex items-center justify-end gap-2 border-t border-white/[0.06] pt-4">
          <Button variant="ghost" size="sm">
            Cancel
          </Button>
          <StatusButton size="sm" status={save.status} onClick={save.run}>
            Save changes
          </StatusButton>
        </div>
      </Tabs>
    </div>
  );
}

function Hero() {
  return (
    <section className="px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:pb-28">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <Link
            href="/components"
            className="group inline-flex items-center gap-1.5 text-sm text-white/55 transition-colors hover:text-white"
          >
            {components.length} components, free and open source
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>

          <h1 className="mt-5 max-w-xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
            Components with the motion already done.
          </h1>

          <p className="mt-5 max-w-lg text-pretty text-base leading-relaxed text-white/60 sm:text-lg">
            shadcn/ui primitives with loading states, transitions and micro-interactions built in.
            Copy the source, or add any component with the shadcn CLI.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg" className="group">
              <Link href="/components">
                Browse components
                <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <div className="flex h-10 items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] pl-3 pr-1 font-mono text-[13px] text-white/70">
              <span className="truncate">npx shadcn add …/button.json</span>
              <CopyButton value={INSTALL} className="ml-auto" aria-label="Copy install command" />
            </div>
          </div>

          <p className="mt-8 text-sm text-white/40">
            React 19 · Tailwind CSS v4 · Motion · Radix UI · TypeScript
          </p>
        </div>

        <LivePanel />
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * Showcase
 * ------------------------------------------------------------------------- */

type Tile = {
  slug: string;
  title: string;
  text: string;
  Demo: React.ComponentType;
  className?: string;
  demoClassName?: string;
};

const tiles: Tile[] = [
  {
    slug: "animated-list",
    title: "Animated List",
    text: "New items arrive at the top; older ones make room.",
    Demo: AnimatedListDemo,
    className: "lg:row-span-2",
    demoClassName: "items-start",
  },
  {
    slug: "input",
    title: "OTP Input",
    text: "Paste and SMS autofill work. Try 123456.",
    Demo: OTPInputDemo,
    demoClassName: "max-sm:[&>div]:scale-[0.82]",
  },
  {
    slug: "tabs",
    title: "Segmented Control",
    text: "The thumb follows your selection.",
    Demo: SegmentedControlDemo,
  },
  {
    slug: "dock",
    title: "Dock",
    text: "Icons grow toward the pointer.",
    Demo: DockDemo,
    className: "sm:col-span-2",
    demoClassName: "[&>div]:h-28 max-sm:[&>div]:scale-[0.72]",
  },
  {
    slug: "button",
    title: "Hold to Confirm",
    text: "Press and hold before something destructive happens.",
    Demo: HoldToConfirmDemo,
  },
  {
    slug: "switch",
    title: "Icon Switch",
    text: "A theme toggle that shows its state.",
    Demo: IconSwitchDemo,
    className: "lg:col-span-2",
  },
];

function Showcase() {
  return (
    <section aria-labelledby="showcase-title" className="border-t border-white/[0.06] px-4 py-20 sm:px-6 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <h2 id="showcase-title" className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Try them here
          </h2>
          <p className="mt-3 text-base text-white/55 sm:text-lg">
            These are the real components, not recordings. Each one installs on its own.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tiles.map(({ slug, title, text, Demo, className, demoClassName }) => (
            <article
              key={title}
              className={`flex min-w-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-card/60 ${className ?? ""}`}
            >
              <div
                className={`flex min-h-52 min-w-0 flex-1 flex-wrap items-center justify-center gap-3 p-6 ${demoClassName ?? ""}`}
              >
                <Demo />
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-white/[0.06] px-5 py-4">
                <div className="min-w-0">
                  <h3 className="text-sm font-medium text-white">{title}</h3>
                  <p className="mt-0.5 text-sm text-white/50">{text}</p>
                </div>
                <Link
                  href={componentHref(slug)}
                  aria-label={`${title} documentation`}
                  className="shrink-0 rounded-md p-1.5 text-white/40 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <ArrowUpRight className="size-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * Install
 * ------------------------------------------------------------------------- */

const session: TerminalLine[] = [
  { type: "command", text: "npx shadcn@latest add https://duskui.com/r/status-button.json" },
  "✔ Checking registry.",
  "✔ Installing dependencies.",
  "✔ Created components/ui/button.tsx",
  "✔ Created components/dusk/button/status-button.tsx",
];

const steps = [
  { title: "Find a component", text: "Browse the list, or press ⌘K anywhere on the site." },
  { title: "Add it", text: "Run one shadcn command, or copy the file. Either way it lives in your repo." },
  { title: "Use it like shadcn/ui", text: "Same API and class names, so existing code keeps working." },
];

function Install() {
  return (
    <section
      id="install"
      aria-labelledby="install-title"
      className="scroll-mt-16 border-t border-white/[0.06] px-4 py-20 sm:px-6 lg:py-28"
    >
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 id="install-title" className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            One command, no lock-in
          </h2>
          <p className="mt-3 max-w-lg text-base text-white/55 sm:text-lg">
            DuskUI is a shadcn registry. Components arrive as plain TypeScript and Tailwind that
            you can change.
          </p>
          <ol className="mt-8 space-y-5">
            {steps.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-white/15 text-xs font-medium text-white/70">
                  {i + 1}
                </span>
                <div>
                  <p className="font-medium text-white">{step.title}</p>
                  <p className="mt-0.5 text-sm text-white/50">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <TerminalWindow title="~/acme-web" lines={session} startOnView className="w-full min-w-0" />
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * Principles + full component index
 * ------------------------------------------------------------------------- */

const principles = [
  { title: "Accessible", text: "Built on Radix, with keyboard support and screen reader announcements." },
  { title: "Reduced motion", text: "Movement switches off when the system asks. Fades remain." },
  { title: "No layout shift", text: "Loading, copied and error states never move the page around." },
  { title: "Server friendly", text: "Real text in the HTML, rendered on the server, with no hydration warnings." },
];

function Principles() {
  return (
    <section aria-labelledby="principles-title" className="border-t border-white/[0.06] px-4 py-20 sm:px-6 lg:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_2fr]">
        <h2 id="principles-title" className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Motion that behaves
        </h2>
        <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {principles.map((p) => (
            <div key={p.title} className="border-l border-white/10 pl-5">
              <dt className="font-medium text-white">{p.title}</dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-white/55">{p.text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function ComponentIndex() {
  return (
    <section aria-labelledby="index-title" className="border-t border-white/[0.06] px-4 py-20 sm:px-6 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="index-title" className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            All {components.length} components
          </h2>
          <Link
            href="/components"
            className="group inline-flex items-center gap-1.5 text-sm text-white/60 transition-colors hover:text-white"
          >
            Open the catalog
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>
        <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm sm:grid-cols-3 lg:grid-cols-5">
          {components.map((c) => (
            <li key={c.slug}>
              <Link href={componentHref(c.slug)} className="text-white/55 transition-colors hover:text-white">
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * Closing + footer
 * ------------------------------------------------------------------------- */

function Closing() {
  return (
    <section className="border-t border-white/[0.06] px-4 py-20 sm:px-6 lg:py-28">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Start with one component</h2>
          <p className="mt-3 text-base text-white/55">Free, open source and meant to be copied.</p>
        </div>
        <div className="flex gap-3">
          <Button asChild size="lg">
            <Link href="/components">Browse components</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href={siteConfig.links.github} target="_blank" rel="noreferrer">
              <Github />
              GitHub
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/[0.06] px-4 py-8 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-white/40 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <LogoMark className="size-5" />
          <span>DuskUI</span>
        </div>
        <nav aria-label="Footer" className="flex gap-6">
          <Link href="/components" className="transition-colors hover:text-white">Components</Link>
          <Link href={siteConfig.links.github} className="transition-colors hover:text-white">GitHub</Link>
          <Link href="/sitemap.xml" className="transition-colors hover:text-white">Sitemap</Link>
        </nav>
      </div>
    </footer>
  );
}

export function HomeView() {
  return (
    <div className="min-h-screen overflow-x-clip bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <Header />
      <main>
        <Hero />
        <Showcase />
        <Install />
        <Principles />
        <ComponentIndex />
        <Closing />
      </main>
      <Footer />
    </div>
  );
}
