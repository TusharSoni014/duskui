"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Home,
  Search,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarProvider,
  SidebarInset,
  useSidebar,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/brand/logo";
import { GlobalSearch } from "@/components/global-search";
import { componentHref, searchComponents } from "@/lib/components-data";

// Custom sidebar trigger with animation
function AnimatedSidebarTrigger() {
  const { toggleSidebar, state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      className="text-white/60 hover:text-white hover:bg-white/5 relative"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isCollapsed ? "collapsed" : "expanded"}
          initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
          transition={{ duration: 0.2 }}
        >
          {isCollapsed ? (
            <PanelLeft className="w-5 h-5" />
          ) : (
            <PanelLeftClose className="w-5 h-5" />
          )}
        </motion.div>
      </AnimatePresence>
    </Button>
  );
}

// Flat, alphabetical component list — no categories.
const AppSidebar = React.memo(function AppSidebar({
  currentPath,
}: {
  currentPath: string;
}) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [query, setQuery] = useState("");
  const visible = useMemo(() => searchComponents(query), [query]);
  const activeRef = React.useRef<HTMLAnchorElement>(null);

  // Keep the current page in view when landing deep in the list.
  React.useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest" });
  }, [currentPath]);

  const linkClass = (active: boolean) =>
    `relative block rounded-md px-2.5 py-1.5 text-[13px] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ${
      active ? "text-primary" : "text-white/55 hover:text-white"
    }`;

  return (
    <Sidebar collapsible="icon" className="border-r border-white/10">
      <SidebarHeader className="p-2">
        <Link href="/" aria-label="DuskUI home" className="flex items-center gap-2 px-1">
          <LogoMark className="size-8" />
          <span
            className={`font-semibold text-lg tracking-tight whitespace-nowrap transition-all duration-200 ${isCollapsed ? "hidden" : "block"}`}
          >
            Dusk<span className="text-primary">UI</span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className={`px-2 py-2 ${isCollapsed ? "hidden" : ""}`}>
        <SidebarGroup className="p-0">
          <div className="relative mb-3">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Escape" && setQuery("")}
              placeholder="Filter components..."
              aria-label="Filter components"
              className="pl-8 h-8 text-sm bg-white/5 border-white/10 focus:border-primary/50"
            />
          </div>

          <nav aria-label="Components">
            <Link href="/components" className={linkClass(currentPath === "/components")}>
              {currentPath === "/components" && <ActivePill />}
              <span className="relative">Overview</span>
            </Link>

            <p className="mt-4 mb-1.5 flex items-center justify-between px-2.5 text-[11px] font-medium uppercase tracking-wider text-white/35">
              Components
              <span className="tabular-nums">{visible.length}</span>
            </p>

            <ul className="space-y-px">
              {visible.map((component) => {
                const href = componentHref(component.slug);
                const active = currentPath === href;
                return (
                  <li key={component.slug}>
                    <Link
                      ref={active ? activeRef : undefined}
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={linkClass(active)}
                    >
                      {active && <ActivePill />}
                      <span className="relative">{component.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            {visible.length === 0 && (
              <p className="px-2.5 py-3 text-xs text-white/40">No components match “{query}”.</p>
            )}
          </nav>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
});

function ActivePill() {
  return (
    <motion.span
      layoutId="sidebar-active"
      className="absolute inset-0 rounded-md bg-primary/10"
      transition={{ type: "spring", duration: 0.3, bounce: 0.15 }}
    />
  );
}

function ComponentsHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-white/10 bg-background/80 backdrop-blur-md px-6">
      <AnimatedSidebarTrigger />
      <div className="flex-1" />
      <div className="flex items-center gap-4">
        <GlobalSearch />
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
        >
          <Home className="w-4 h-4" />
          <span className="hidden sm:inline">Home</span>
        </Link>
      </div>
    </header>
  );
}

export default function ComponentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex w-full">
        <AppSidebar currentPath={pathname} />
        <SidebarInset className="flex-1">
          <ComponentsHeader />
          <main className="p-6 md:p-10">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
