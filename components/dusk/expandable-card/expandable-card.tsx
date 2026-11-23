"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion, type Transition } from "motion/react";
import { ArrowUpRight, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const morph: Transition = { type: "spring", bounce: 0.12, duration: 0.5 };
const fade: Transition = { duration: 0.2, ease: "easeOut" };

export interface ExpandableCardItem {
  /** Stable, unique id. */
  id: string;
  title: string;
  /** Small line under the title (author, category, date…). */
  subtitle?: string;
  /** Short summary. Clamped to two lines on the card, shown in full when expanded. */
  description: string;
  /** Artwork shared by the card and the panel: an `<img>`, an illustration or a gradient. */
  media?: React.ReactNode;
  /** Extra content that only appears in the expanded panel. */
  content?: React.ReactNode;
  /** Action rendered at the bottom of the panel, e.g. a button or link. */
  action?: React.ReactNode;
}

export interface ExpandableCardProps extends Omit<React.ComponentProps<"div">, "children"> {
  items: ExpandableCardItem[];
  /** `grid` shows media-first tiles; `list` shows compact rows with a thumbnail. */
  layout?: "grid" | "list";
  /** Called with the expanded item's id, or `null` when it closes. */
  onActiveChange?: (id: string | null) => void;
  /** Classes for each card. */
  cardClassName?: string;
  /** Classes for the expanded panel. */
  panelClassName?: string;
}

/**
 * A grid or list of cards. Clicking one expands it into a larger panel: the
 * card surface, artwork, title and summary share Motion `layoutId`s, so they
 * fly into place, while extra content fades in after the morph.
 *
 * Built on Radix Dialog: focus is trapped inside the panel, Escape and outside
 * clicks close it, the page behind is inert and focus returns to the card that
 * opened it. Under reduced motion the panel simply fades.
 */
export function ExpandableCard({
  items,
  layout = "grid",
  onActiveChange,
  cardClassName,
  panelClassName,
  className,
  ...props
}: ExpandableCardProps) {
  const baseId = React.useId();
  const reduceMotion = useReducedMotion() ?? false;
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const opener = React.useRef<HTMLButtonElement | null>(null);
  const active = items.find((item) => item.id === activeId) ?? null;

  const layoutId = (id: string, part: string) => (reduceMotion ? undefined : `${baseId}-${id}-${part}`);

  const setActive = (id: string | null) => {
    setActiveId(id);
    onActiveChange?.(id);
  };

  const list = layout === "list";

  return (
    <LayoutGroup id={baseId}>
      <div
        data-slot="expandable-card"
        className={cn(
          list ? "flex w-full flex-col gap-2" : "grid w-full grid-cols-[repeat(auto-fill,minmax(min(100%,13rem),1fr))] gap-4",
          className
        )}
        {...props}
      >
        {items.map((item) => (
          <motion.button
            key={item.id}
            type="button"
            layoutId={layoutId(item.id, "surface")}
            transition={morph}
            aria-haspopup="dialog"
            aria-expanded={activeId === item.id}
            onClick={(event) => {
              opener.current = event.currentTarget;
              setActive(item.id);
            }}
            // borderRadius lives in style so Motion keeps the corners round while scaling.
            style={{ borderRadius: list ? 14 : 18 }}
            className={cn(
              "group/card relative flex overflow-hidden border bg-card text-left text-card-foreground outline-none",
              "transition-colors duration-150 hover:border-foreground/20",
              "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40",
              list ? "items-center gap-4 p-2.5 pr-4" : "flex-col",
              cardClassName
            )}
          >
            {item.media && (
              <motion.span
                layoutId={layoutId(item.id, "media")}
                transition={morph}
                style={{ borderRadius: list ? 10 : 0 }}
                className={cn(
                  "relative block shrink-0 overflow-hidden [&_img]:size-full [&_img]:object-cover",
                  list ? "size-14" : "aspect-[4/3] w-full"
                )}
              >
                {item.media}
              </motion.span>
            )}
            <span className={cn("block min-w-0 flex-1", !list && "p-4")}>
              <motion.span
                layoutId={layoutId(item.id, "title")}
                layout="position"
                transition={morph}
                className="block truncate font-semibold tracking-tight"
              >
                {item.title}
              </motion.span>
              {item.subtitle && (
                <motion.span
                  layoutId={layoutId(item.id, "subtitle")}
                  layout="position"
                  transition={morph}
                  className="block truncate text-xs text-muted-foreground"
                >
                  {item.subtitle}
                </motion.span>
              )}
              {!list && (
                <motion.span
                  layoutId={layoutId(item.id, "description")}
                  layout="position"
                  transition={morph}
                  className="mt-2 line-clamp-2 block text-sm text-muted-foreground"
                >
                  {item.description}
                </motion.span>
              )}
            </span>
            {list && (
              <ArrowUpRight
                aria-hidden
                className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5 group-hover/card:text-foreground motion-reduce:transition-none"
              />
            )}
          </motion.button>
        ))}
      </div>

      <DialogPrimitive.Root open={active !== null} onOpenChange={(open) => !open && setActive(null)}>
        <AnimatePresence>
          {active && (
            // forceMount hands mounting to AnimatePresence so the exit morph can play.
            <DialogPrimitive.Portal key={active.id} forceMount>
              <DialogPrimitive.Overlay forceMount asChild>
                <motion.div
                  className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={fade}
                />
              </DialogPrimitive.Overlay>
              <div className="pointer-events-none fixed inset-0 z-50 grid place-items-center p-4">
                <DialogPrimitive.Content
                  forceMount
                  asChild
                  // Return focus to the exact card that opened the panel.
                  onCloseAutoFocus={(event) => {
                    event.preventDefault();
                    opener.current?.focus();
                  }}
                >
                  <motion.div
                    layoutId={layoutId(active.id, "surface")}
                    transition={morph}
                    initial={reduceMotion ? { opacity: 0 } : undefined}
                    animate={reduceMotion ? { opacity: 1 } : undefined}
                    exit={reduceMotion ? { opacity: 0 } : undefined}
                    style={{ borderRadius: 24 }}
                    className={cn(
                      "pointer-events-auto relative flex max-h-[calc(100dvh-2rem)] w-full max-w-lg flex-col overflow-y-auto overflow-x-hidden border bg-card text-card-foreground outline-none",
                      "shadow-lg",
                      panelClassName
                    )}
                  >
                    {active.media && (
                      <motion.div
                        layoutId={layoutId(active.id, "media")}
                        transition={morph}
                        style={{ borderRadius: 0 }}
                        className="relative h-56 w-full shrink-0 overflow-hidden sm:h-64 [&_img]:size-full [&_img]:object-cover"
                      >
                        {active.media}
                      </motion.div>
                    )}
                    <div className="p-6">
                      <DialogPrimitive.Title asChild>
                        <motion.h2
                          layoutId={layoutId(active.id, "title")}
                          layout="position"
                          transition={morph}
                          className="pr-8 text-xl font-semibold tracking-tight"
                        >
                          {active.title}
                        </motion.h2>
                      </DialogPrimitive.Title>
                      {active.subtitle && (
                        <motion.p
                          layoutId={layoutId(active.id, "subtitle")}
                          layout="position"
                          transition={morph}
                          className="text-sm text-muted-foreground"
                        >
                          {active.subtitle}
                        </motion.p>
                      )}
                      <DialogPrimitive.Description asChild>
                        <motion.p
                          layoutId={list ? undefined : layoutId(active.id, "description")}
                          layout="position"
                          transition={morph}
                          initial={list ? { opacity: 0 } : undefined}
                          animate={list ? { opacity: 1, transition: { ...fade, delay: 0.1 } } : undefined}
                          exit={list ? { opacity: 0, transition: { duration: 0.1 } } : undefined}
                          className="mt-3 text-sm leading-relaxed text-muted-foreground"
                        >
                          {active.description}
                        </motion.p>
                      </DialogPrimitive.Description>
                      {(active.content || active.action) && (
                        <motion.div
                          className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground"
                          initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
                          animate={{ opacity: 1, y: 0, transition: { ...fade, delay: reduceMotion ? 0 : 0.15 } }}
                          exit={{ opacity: 0, y: reduceMotion ? 0 : 4, transition: { duration: 0.1 } }}
                        >
                          {active.content}
                          {active.action && <div className="pt-2">{active.action}</div>}
                        </motion.div>
                      )}
                    </div>
                    <DialogPrimitive.Close asChild>
                      <motion.button
                        type="button"
                        className={cn(
                          "absolute top-3 right-3 z-10 inline-flex size-8 items-center justify-center rounded-full bg-black/40 text-white/80 outline-none backdrop-blur",
                          "transition-colors hover:bg-black/60 hover:text-white focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        )}
                        initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.96 }}
                        animate={{ opacity: 1, scale: 1, transition: { duration: 0.2, ease: "easeOut", delay: reduceMotion ? 0 : 0.15 } }}
                        exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.96, transition: { duration: 0.1 } }}
                      >
                        <XIcon className="size-4" aria-hidden />
                        <span className="sr-only">Close</span>
                      </motion.button>
                    </DialogPrimitive.Close>
                  </motion.div>
                </DialogPrimitive.Content>
              </div>
            </DialogPrimitive.Portal>
          )}
        </AnimatePresence>
      </DialogPrimitive.Root>
    </LayoutGroup>
  );
}
