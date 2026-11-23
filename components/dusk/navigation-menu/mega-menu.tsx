"use client";

import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion, type Transition } from "motion/react";
import { ArrowUpRight, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

export type MegaMenuLink = {
  title: string;
  href: string;
  description?: string;
  icon?: React.ReactNode;
  /** Small tag next to the title, e.g. "New". */
  badge?: string;
};

export type MegaMenuColumn = {
  heading?: string;
  links: MegaMenuLink[];
};

export type MegaMenuItem = {
  label: string;
  /** A plain link in the bar. Ignored when the item has a panel. */
  href?: string;
  /** Highlighted card on the left of the panel. */
  featured?: { eyebrow?: string; title: string; description?: string; href: string };
  /** Link columns in the panel. */
  columns?: MegaMenuColumn[];
};

export interface MegaMenuProps extends Omit<React.ComponentProps<typeof NavigationMenuPrimitive.Root>, "children"> {
  items: MegaMenuItem[];
  /**
   * Component used for links, e.g. Next.js `Link`. Must forward its ref and
   * props to an anchor. Defaults to `"a"`.
   */
  linkAs?: React.ElementType;
}

const pillSpring: Transition = { type: "spring", stiffness: 480, damping: 38, mass: 0.7 };
const surfaceSpring: Transition = { type: "spring", duration: 0.25, bounce: 0 };

/**
 * A mega menu for site headers. A highlight glides between bar items as you
 * hover, panels open in one shared viewport that morphs its width and height
 * to fit each panel, the incoming panel slides in from the side you're moving
 * toward while the old one leaves the other way, and links stagger in. An
 * arrow glides under the open item. Built on Radix Navigation Menu: hover
 * intent, keyboard (Tab, arrows, Escape), focus and aria are handled. Under
 * reduced motion panels fade and nothing slides or resizes.
 */
export function MegaMenu({
  items,
  linkAs: LinkAs = "a",
  value: valueProp,
  defaultValue = "",
  onValueChange,
  className,
  delayDuration = 120,
  ...props
}: MegaMenuProps) {
  const id = React.useId();
  const reduceMotion = useReducedMotion() ?? false;
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const value = valueProp ?? internalValue;
  const [hovered, setHovered] = React.useState<string | null>(null);
  // The pill follows the pointer and falls back to the open item.
  const pillOn = hovered ?? (value || null);

  return (
    <NavigationMenuPrimitive.Root
      value={value}
      onValueChange={(next) => {
        if (valueProp === undefined) setInternalValue(next);
        onValueChange?.(next);
      }}
      delayDuration={delayDuration}
      className={cn("relative z-20 flex justify-center", className)}
      {...props}
    >
      <LayoutGroup id={id}>
        <NavigationMenuPrimitive.List
          className="flex list-none items-center gap-0.5 rounded-full border bg-background p-1"
          onPointerLeave={() => setHovered(null)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setHovered(null);
          }}
        >
          {items.map((item) => {
            const hasPanel = !!(item.featured || item.columns?.length);
            const pill = pillOn === item.label && (
              <motion.span
                aria-hidden
                layoutId="mega-menu-pill"
                transition={reduceMotion ? { duration: 0 } : pillSpring}
                className="absolute inset-0 -z-10 rounded-full bg-accent"
              />
            );
            const barItem = cn(
              "group relative isolate inline-flex h-8 items-center gap-1 rounded-full px-3.5 text-sm font-medium text-foreground/75 outline-none select-none",
              "transition-colors duration-150 hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[state=open]:text-foreground"
            );
            const track = {
              onPointerEnter: () => setHovered(item.label),
              onFocus: () => setHovered(item.label),
            };

            return (
              <NavigationMenuPrimitive.Item key={item.label} value={item.label}>
                {hasPanel ? (
                  <>
                    <NavigationMenuPrimitive.Trigger className={barItem} {...track}>
                      {pill}
                      {item.label}
                      <ChevronDown
                        aria-hidden
                        className="size-3.5 text-muted-foreground transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-data-[state=open]:rotate-180 group-data-[state=open]:text-foreground motion-reduce:transition-none"
                      />
                    </NavigationMenuPrimitive.Trigger>
                    <NavigationMenuPrimitive.Content
                      className={cn(
                        "absolute top-0 left-0 ease-[cubic-bezier(0.16,1,0.3,1)]",
                        "data-[motion^=from-]:animate-in data-[motion^=from-]:fade-in-0 data-[motion^=to-]:animate-out data-[motion^=to-]:fade-out-0 data-[motion]:duration-200",
                        "data-[motion=from-end]:slide-in-from-right-2 data-[motion=from-start]:slide-in-from-left-2 data-[motion=to-end]:slide-out-to-right-2 data-[motion=to-start]:slide-out-to-left-2",
                        "motion-reduce:data-[motion=from-end]:slide-in-from-right-0 motion-reduce:data-[motion=from-start]:slide-in-from-left-0 motion-reduce:data-[motion=to-end]:slide-out-to-right-0 motion-reduce:data-[motion=to-start]:slide-out-to-left-0"
                      )}
                    >
                      <Panel item={item} LinkAs={LinkAs} reduceMotion={reduceMotion} />
                    </NavigationMenuPrimitive.Content>
                  </>
                ) : (
                  <NavigationMenuPrimitive.Link asChild>
                    <LinkAs href={item.href ?? "#"} className={barItem} {...track}>
                      {pill}
                      {item.label}
                    </LinkAs>
                  </NavigationMenuPrimitive.Link>
                )}
              </NavigationMenuPrimitive.Item>
            );
          })}

          <NavigationMenuPrimitive.Indicator
            className={cn(
              "top-full z-10 flex h-2.5 items-end justify-center overflow-hidden",
              "transition-[transform,width,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] starting:opacity-0 motion-reduce:transition-opacity"
            )}
          >
            <span className="relative top-[70%] size-2.5 rotate-45 rounded-tl-[3px] border-t border-l bg-popover" />
          </NavigationMenuPrimitive.Indicator>
        </NavigationMenuPrimitive.List>
      </LayoutGroup>

      <div className="absolute top-full left-1/2 flex -translate-x-1/2 justify-center pt-2 perspective-[1600px]">
        <AnimatePresence>
          {value && (
            // forceMount hands mounting to AnimatePresence so the close animation can play;
            // Radix keeps the last panel inside while it fades out.
            <NavigationMenuPrimitive.Viewport forceMount asChild>
              <motion.div
                className={cn(
                  "relative h-(--radix-navigation-menu-viewport-height) w-(--radix-navigation-menu-viewport-width) origin-top overflow-hidden rounded-xl border bg-popover text-popover-foreground",
                  "shadow-lg",
                  // The morph between panels: Radix updates the size variables, CSS eases them.
                  "transition-[width,height] duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                )}
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: -4 }}
                animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
                exit={
                  reduceMotion
                    ? { opacity: 0, transition: { duration: 0.1 } }
                    : { opacity: 0, scale: 0.98, y: -4, transition: { duration: 0.12, ease: "easeIn" } }
                }
                transition={surfaceSpring}
              />
            </NavigationMenuPrimitive.Viewport>
          )}
        </AnimatePresence>
      </div>
    </NavigationMenuPrimitive.Root>
  );
}

function Panel({
  item,
  LinkAs,
  reduceMotion,
}: {
  item: MegaMenuItem;
  LinkAs: React.ElementType;
  reduceMotion: boolean;
}) {
  const columns = item.columns ?? [];
  const cols = columns.length + (item.featured ? 1 : 0);
  let index = 0;
  // Each link fades up a beat after the previous one.
  const enter = () => {
    const delay = index++ * 0.015;
    return {
      initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 4 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.2, ease: "easeOut", delay },
    } as const;
  };

  return (
    <div
      className={cn(
        "grid w-[min(var(--mega-width),calc(100vw-2rem))] gap-2 p-2",
        cols >= 3 ? "[--mega-width:680px] sm:grid-cols-3" : cols === 2 ? "[--mega-width:520px] sm:grid-cols-2" : "[--mega-width:300px]"
      )}
    >
      {item.featured && (
        <motion.div {...enter()}>
          <NavigationMenuPrimitive.Link asChild>
            <LinkAs
              href={item.featured.href}
              className={cn(
                "group/featured relative flex h-full min-h-40 flex-col justify-end overflow-hidden rounded-lg border bg-muted/50 p-4 outline-none",
                "transition-colors duration-150 hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50"
              )}
            >
              <ArrowUpRight
                aria-hidden
                className="absolute top-3 right-3 size-4 text-muted-foreground transition-colors duration-150 group-hover/featured:text-foreground"
              />
              {item.featured.eyebrow && (
                <span className="mb-2 w-fit rounded-full border px-2 py-px text-xs text-muted-foreground">
                  {item.featured.eyebrow}
                </span>
              )}
              <span className="font-semibold tracking-tight">{item.featured.title}</span>
              {item.featured.description && (
                <span className="mt-1 text-sm leading-snug text-muted-foreground">{item.featured.description}</span>
              )}
            </LinkAs>
          </NavigationMenuPrimitive.Link>
        </motion.div>
      )}
      {columns.map((column, c) => (
        <div key={column.heading ?? c} className="flex flex-col gap-0.5">
          {column.heading && (
            <motion.p {...enter()} className="px-2.5 pt-1.5 pb-1 text-xs font-medium text-muted-foreground">
              {column.heading}
            </motion.p>
          )}
          <ul className="flex flex-col gap-0.5">
            {column.links.map((link) => (
              <motion.li key={link.href + link.title} {...enter()}>
                <NavigationMenuPrimitive.Link asChild>
                  <LinkAs
                    href={link.href}
                    className={cn(
                      "group/link flex items-start gap-3 rounded-md p-2.5 outline-none",
                      "transition-colors duration-150 hover:bg-accent focus-visible:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    )}
                  >
                    {link.icon && (
                      <span
                        aria-hidden
                        className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border bg-white/[0.03] text-muted-foreground transition-colors duration-150 group-hover/link:text-foreground group-focus-visible/link:text-foreground [&_svg]:size-4"
                      >
                        {link.icon}
                      </span>
                    )}
                    <span className="min-w-0">
                      <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                        {link.title}
                        {link.badge && (
                          <span className="rounded-full border px-1.5 py-px text-[0.65rem] font-medium text-muted-foreground">
                            {link.badge}
                          </span>
                        )}
                      </span>
                      {link.description && (
                        <span className="mt-0.5 line-clamp-2 block text-xs leading-snug text-muted-foreground">
                          {link.description}
                        </span>
                      )}
                    </span>
                  </LinkAs>
                </NavigationMenuPrimitive.Link>
              </motion.li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
