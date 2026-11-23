"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
  type Variants,
} from "motion/react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

export type BreadcrumbEntry = {
  label: string;
  /** Omit for the current page (usually the last item). */
  href?: string;
  icon?: React.ReactNode;
};

const itemSpring: Transition = { type: "spring", bounce: 0, duration: 0.35 };

export interface CollapsibleBreadcrumbProps
  extends Omit<React.ComponentProps<"nav">, "children"> {
  /** The trail, root first. The last item is rendered as the current page. */
  items: BreadcrumbEntry[];
  /** Always collapse when there are more items than this. Width-based collapsing still applies. */
  maxItems?: number;
  /** Items always shown before the "…" menu. */
  itemsBeforeCollapse?: number;
  /** Items always shown after the "…" menu (including the current page). */
  itemsAfterCollapse?: number;
  /** Component used for links, e.g. Next.js `Link`. Defaults to `<a>`. */
  linkAs?: React.ElementType;
  /** Custom separator. Defaults to a chevron. */
  separator?: React.ReactNode;
}

/**
 * A breadcrumb that never wraps. When the trail doesn't fit its container (or
 * is longer than `maxItems`), the middle items fold into a "…" button one by
 * one, sliding out as they go; the button opens an animated menu with the
 * hidden pages. Widths are measured off-screen before paint, so there is no
 * flash or layout shift, and it re-fits on resize.
 *
 * Built on the DuskUI Breadcrumb primitive and Radix Dropdown Menu, so the
 * menu has full keyboard support (arrows, typeahead, Escape).
 */
export function CollapsibleBreadcrumb({
  items,
  maxItems,
  itemsBeforeCollapse = 1,
  itemsAfterCollapse = 1,
  linkAs,
  separator,
  className,
  ...props
}: CollapsibleBreadcrumbProps) {
  const reduceMotion = useReducedMotion();
  const navRef = React.useRef<HTMLElement>(null);
  const measureRef = React.useRef<HTMLOListElement>(null);

  const count = items.length;
  const before = Math.min(Math.max(0, itemsBeforeCollapse), count);
  const after = Math.min(Math.max(1, itemsAfterCollapse), count - before);
  const collapsible = Math.max(0, count - before - after);
  // With maxItems, the "…" takes one of the slots.
  const minCollapsed =
    maxItems !== undefined && count > maxItems ? Math.min(collapsible, count - maxItems + 1) : 0;

  const [collapsed, setCollapsed] = React.useState(minCollapsed);
  // The first fit happens before paint and must not animate.
  const [fitted, setFitted] = React.useState(false);
  const shown = Math.max(collapsed, minCollapsed);

  React.useLayoutEffect(() => {
    const nav = navRef.current;
    const measure = measureRef.current;
    if (!nav || !measure) return;

    const fit = () => {
      const available = nav.clientWidth;
      const gap = parseFloat(getComputedStyle(measure).columnGap) || 0;
      const nodes = Array.from(measure.children) as HTMLElement[];
      const widths = nodes.slice(0, count).map((n) => n.offsetWidth);
      const sepWidth = nodes[count]?.offsetWidth ?? 0;
      const ellipsisWidth = nodes[count + 1]?.offsetWidth ?? 0;

      const required = (c: number) => {
        const visible = widths.filter((_, i) => i < before || i >= before + c);
        const parts = visible.length + (c > 0 ? 1 : 0);
        const content = visible.reduce((a, b) => a + b, 0) + (c > 0 ? ellipsisWidth : 0);
        // Each part after the first is preceded by a separator; every node adds a gap.
        return content + (parts - 1) * sepWidth + Math.max(0, parts * 2 - 2) * gap;
      };

      let next = collapsible;
      for (let c = minCollapsed; c <= collapsible; c++) {
        if (required(c) <= available + 0.5) {
          next = c;
          break;
        }
      }
      setCollapsed((prev) => (prev === next ? prev : next));
      setFitted(true);
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(nav);
    observer.observe(measure);
    return () => observer.disconnect();
  }, [count, before, collapsible, minCollapsed]);

  const hidden = items.slice(before, before + shown);
  const Link = linkAs ?? "a";

  const enter = reduceMotion ? { opacity: 0 } : { opacity: 0, x: -6 };
  const visibleState = { opacity: 1, x: 0 };

  const renderItem = (item: BreadcrumbEntry, index: number) =>
    index === count - 1 || !item.href ? (
      <BreadcrumbPage className={cn(index === count - 1 && "min-w-0")}>
        {item.icon}
        <span className="truncate">{item.label}</span>
      </BreadcrumbPage>
    ) : (
      <BreadcrumbLink asChild>
        <Link href={item.href}>
          {item.icon}
          {item.label}
        </Link>
      </BreadcrumbLink>
    );

  type Part = { key: string; node: React.ReactNode; grow?: boolean };
  const parts: Part[] = [];
  items.forEach((item, index) => {
    if (index === before && shown > 0) {
      parts.push({
        key: "ellipsis",
        node: <BreadcrumbMenu items={hidden} linkAs={Link} reduceMotion={!!reduceMotion} />,
      });
    }
    if (index >= before && index < before + shown) return;
    parts.push({ key: `item-${index}`, node: renderItem(item, index), grow: index === count - 1 });
  });

  return (
    <Breadcrumb ref={navRef} className={cn("relative min-w-0", className)} {...props}>
      <BreadcrumbList className="relative flex-nowrap whitespace-nowrap">
        {/* Remounting once after the first fit drops items without exit animations. */}
        <AnimatePresence key={fitted ? "fitted" : "initial"} initial={false} mode="popLayout">
          {parts.flatMap((part, i) => {
            const nodes = [];
            if (i > 0) {
              nodes.push(
                <motion.li
                  key={`sep-${part.key}`}
                  data-slot="breadcrumb-separator"
                  layout="position"
                  role="presentation"
                  aria-hidden="true"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={itemSpring}
                  className="text-muted-foreground/60 [&>svg]:size-3.5"
                >
                  {separator ?? <ChevronRight />}
                </motion.li>
              );
            }
            nodes.push(
              <motion.li
                key={part.key}
                data-slot="breadcrumb-item"
                layout="position"
                initial={enter}
                animate={visibleState}
                exit={enter}
                transition={itemSpring}
                className={cn("inline-flex items-center gap-1.5", part.grow && "min-w-0")}
              >
                {part.node}
              </motion.li>
            );
            return nodes;
          })}
        </AnimatePresence>
      </BreadcrumbList>

      {/* Off-screen copy used only to measure natural widths. */}
      <BreadcrumbList
        ref={measureRef}
        aria-hidden
        inert
        className="pointer-events-none invisible absolute top-0 left-0 flex-nowrap whitespace-nowrap"
      >
        {items.map((item, index) => (
          <BreadcrumbItem key={index}>
            {index === count - 1 || !item.href ? (
              <BreadcrumbPage>
                {item.icon}
                {item.label}
              </BreadcrumbPage>
            ) : (
              <BreadcrumbLink asChild>
                <span>
                  {item.icon}
                  {item.label}
                </span>
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
        ))}
        <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>
        <BreadcrumbItem>
          <span className="flex size-7 items-center justify-center" />
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

const menuItemVariants: Variants = {
  closed: { opacity: 0, x: -4 },
  open: { opacity: 1, x: 0 },
};

function BreadcrumbMenu({
  items,
  linkAs: Link,
  reduceMotion,
}: {
  items: BreadcrumbEntry[];
  linkAs: React.ElementType;
  reduceMotion: boolean;
}) {
  const [open, setOpen] = React.useState(false);

  const variants: Variants = reduceMotion
    ? {
        closed: { opacity: 0, transition: { duration: 0.1 } },
        open: { opacity: 1, transition: { duration: 0.15 } },
      }
    : {
        closed: { opacity: 0, scale: 0.96, y: -4, transition: { duration: 0.12, ease: "easeIn" } },
        open: {
          opacity: 1,
          scale: 1,
          y: 0,
          transition: { type: "spring", duration: 0.25, bounce: 0, staggerChildren: 0.02, delayChildren: 0.02 },
        },
      };

  return (
    <DropdownMenuPrimitive.Root open={open} onOpenChange={setOpen}>
      <DropdownMenuPrimitive.Trigger
        aria-label={`Show ${items.length} more ${items.length === 1 ? "page" : "pages"}`}
        className={cn(
          "flex size-7 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors duration-200",
          "hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50",
          "data-[state=open]:bg-accent data-[state=open]:text-foreground"
        )}
      >
        <MoreHorizontal className="size-4" aria-hidden />
      </DropdownMenuPrimitive.Trigger>
      <AnimatePresence>
        {open && (
          // forceMount hands mounting to AnimatePresence so the exit animation can play.
          <DropdownMenuPrimitive.Portal forceMount>
            <DropdownMenuPrimitive.Content forceMount asChild align="start" sideOffset={6}>
              <motion.div
                variants={variants}
                initial="closed"
                animate="open"
                exit="closed"
                className={cn(
                  "z-50 min-w-44 overflow-hidden rounded-xl border bg-popover p-1.5 text-popover-foreground outline-none",
                  "origin-(--radix-dropdown-menu-content-transform-origin)",
                  "shadow-lg"
                )}
              >
                {items.map((item) => (
                  <motion.div key={item.label + item.href} variants={reduceMotion ? undefined : menuItemVariants}>
                    <DropdownMenuPrimitive.Item asChild>
                      {item.href ? (
                        <Link
                          href={item.href}
                          className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground outline-none transition-colors data-highlighted:bg-accent data-highlighted:text-foreground [&_svg]:size-3.5"
                        >
                          {item.icon}
                          {item.label}
                        </Link>
                      ) : (
                        <span className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground outline-none data-highlighted:bg-accent [&_svg]:size-3.5">
                          {item.icon}
                          {item.label}
                        </span>
                      )}
                    </DropdownMenuPrimitive.Item>
                  </motion.div>
                ))}
              </motion.div>
            </DropdownMenuPrimitive.Content>
          </DropdownMenuPrimitive.Portal>
        )}
      </AnimatePresence>
    </DropdownMenuPrimitive.Root>
  );
}
