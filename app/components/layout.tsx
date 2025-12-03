"use client";

import React, { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronDown,
  Home,
  Search,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
  useSidebar,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GlobalSearch } from "@/components/global-search";
import { categories } from "@/lib/components-data";

// Memoized category item to prevent unnecessary re-renders
const AnimatedCategory = React.memo(function AnimatedCategory({
  category,
  index,
  isOpen,
  onToggle,
  isCollapsed,
  currentPath,
}: {
  category: (typeof categories)[0];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  isCollapsed: boolean;
  currentPath: string;
}) {
  const Icon = category.icon;

  return (
    <div>
      <SidebarMenuItem>
        <motion.button
          onClick={onToggle}
          className={`
            flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-left text-sm
            transition-colors hover:bg-white/5
            ${isCollapsed ? "justify-center" : ""}
          `}
          whileTap={{ scale: 0.98 }}
        >
          <Icon className="w-4 h-4 text-primary shrink-0" />
          {!isCollapsed && (
            <>
              <span className="flex-1 text-white/80">{category.name}</span>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-3.5 h-3.5 text-white/30" />
              </motion.div>
            </>
          )}
        </motion.button>

        {/* Animated dropdown */}
        <AnimatePresence initial={false}>
          {isOpen && !isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                height: { duration: 0.2 },
                opacity: { duration: 0.15 },
              }}
              className="overflow-hidden"
            >
              <div className="relative ml-[7px] pl-3 py-1 mt-0.5">
                {/* Vertical line inside the dropdown */}
                <div className="absolute left-0 top-0 bottom-0 w-px bg-white/10" />

                {category.components.map((component) => {
                  const isActive = currentPath === component.href;
                  return (
                    <Link
                      key={component.slug}
                      href={component.href}
                      className={`block px-2 py-1.5 text-[13px] rounded transition-colors ${
                        isActive
                          ? "text-primary bg-primary/10"
                          : "text-white/50 hover:text-white"
                      }`}
                    >
                      {component.name}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </SidebarMenuItem>
    </div>
  );
});

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

// Memoized sidebar component
const AppSidebar = React.memo(function AppSidebar({
  currentPath,
  openCategories,
  toggleCategory,
}: {
  currentPath: string;
  openCategories: string[];
  toggleCategory: (name: string) => void;
}) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-white/10">
      <SidebarHeader className="p-2">
        <Link href="/" className="flex items-center gap-2 px-1">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
            <span className="font-bold text-black">D</span>
          </div>
          <span
            className={`font-semibold text-lg tracking-tight whitespace-nowrap transition-all duration-200 ${isCollapsed ? "hidden" : "block"}`}
          >
            DuskUI
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-2">
        <SidebarGroup>
          {/* Search bar */}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, filter: "blur(8px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(8px)" }}
                transition={{ duration: 0.2 }}
                className="mb-3"
              >
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                  <Input
                    placeholder="Search..."
                    className="pl-8 h-8 text-sm bg-white/5 border-white/10 focus:border-primary/50"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {categories.map((category, index) => (
                <AnimatedCategory
                  key={category.slug}
                  category={category}
                  index={index}
                  isOpen={openCategories.includes(category.name)}
                  onToggle={() => toggleCategory(category.name)}
                  isCollapsed={isCollapsed}
                  currentPath={currentPath}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
});

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

  // Find which category contains the current path
  const activeCategory = useMemo(
    () =>
      categories.find((cat) =>
        cat.components.some((comp) => comp.href === pathname)
      ),
    [pathname]
  );

  // Initialize with the active category open, or first category
  const [openCategories, setOpenCategories] = useState<string[]>(() =>
    activeCategory ? [activeCategory.name] : [categories[0]?.name || ""]
  );

  // Memoized toggle function
  const toggleCategory = useCallback((name: string) => {
    setOpenCategories((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  }, []);

  // Auto-open category when navigating to a component in a different category
  React.useEffect(() => {
    if (activeCategory && !openCategories.includes(activeCategory.name)) {
      setOpenCategories((prev) => [...prev, activeCategory.name]);
    }
  }, [activeCategory, openCategories]);

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex w-full">
        <AppSidebar
          currentPath={pathname}
          openCategories={openCategories}
          toggleCategory={toggleCategory}
        />
        <SidebarInset className="flex-1">
          <ComponentsHeader />
          <main className="p-6 md:p-10">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
