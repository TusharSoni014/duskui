"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion, type Transition } from "motion/react";

import { cn } from "@/lib/utils";

const layoutSpring: Transition = { type: "spring", duration: 0.35, bounce: 0.1 };

export interface AnimatedListProps
  extends Omit<React.HTMLAttributes<HTMLUListElement>, "children" | "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart"> {
  /** Keyed elements, newest first. Each one becomes a list item. */
  children: React.ReactNode;
  /** How many items to show. Older ones animate out. */
  max?: number;
  /** List element to render. */
  as?: "ul" | "ol";
  /** Announce new items to screen readers through a polite live region. */
  announce?: boolean;
  /** Text read before each announced item, e.g. `"New notification:"`. */
  announcePrefix?: string;
  /** Classes for each `<li>` wrapper. */
  itemClassName?: string;
}

/**
 * A notification-style list. Put the newest item first: it fades in at the
 * top while the items below glide down to make room (shared layout
 * animation), and anything past `max` fades out without taking up space
 * (`AnimatePresence` in `popLayout` mode).
 *
 * Give every child a stable `key`. Items present on the first render don't
 * animate, so server and client output match. New items are read out by a
 * separate polite live region (their text content), so screen readers hear
 * each arrival once, without the list itself re-announcing on reorder.
 */
export function AnimatedList({
  children,
  max = 5,
  as = "ul",
  announce = true,
  announcePrefix = "",
  itemClassName,
  className,
  ...props
}: AnimatedListProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const List = as === "ol" ? motion.ol : motion.ul;

  const items = React.Children.toArray(children)
    .filter(React.isValidElement)
    .slice(0, Math.max(0, max));

  const liveRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLUListElement & HTMLOListElement>(null);
  const seen = React.useRef<Set<React.Key> | null>(null);
  const keySignature = items.map((item) => String(item.key)).join("|");

  // Announce keys we haven't seen before. The first run only records what's there.
  React.useEffect(() => {
    const keys = keySignature ? keySignature.split("|") : [];
    if (seen.current === null) {
      seen.current = new Set(keys);
      return;
    }
    const fresh = keys.filter((key) => !seen.current!.has(key));
    keys.forEach((key) => seen.current!.add(key));
    if (!announce || !fresh.length || !liveRef.current || !listRef.current) return;
    const text = fresh
      .map((key) => listRef.current!.querySelector<HTMLElement>(`[data-key="${CSS.escape(key)}"]`)?.textContent?.trim())
      .filter(Boolean)
      .map((t) => (announcePrefix ? `${announcePrefix} ${t}` : t))
      .join(". ");
    if (text) liveRef.current.textContent = text;
  }, [keySignature, announce, announcePrefix]);

  return (
    <>
      <List ref={listRef} data-slot="animated-list" className={cn("relative flex flex-col gap-3", className)} {...props}>
        <AnimatePresence initial={false} mode="popLayout">
          {items.map((item) => (
            <motion.li
              key={item.key}
              data-key={String(item.key)}
              layout={reduceMotion ? false : "position"}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={
                reduceMotion
                  ? { opacity: 0, transition: { duration: 0.15 } }
                  : { opacity: 0, scale: 0.97, transition: { duration: 0.15, ease: "easeIn" } }
              }
              transition={{ ...layoutSpring, opacity: { duration: 0.25 } }}
              className={cn("origin-top", itemClassName)}
            >
              {item}
            </motion.li>
          ))}
        </AnimatePresence>
      </List>
      {announce && <div ref={liveRef} aria-live="polite" aria-atomic="true" className="sr-only" />}
    </>
  );
}

export interface UseListStreamOptions {
  /** Milliseconds between new items. */
  interval?: number;
  /** How many items are kept (newest first). Keep it at or above the list's `max`. */
  limit?: number;
  /** How many items from the source to show right away (rendered on the server too). */
  initial?: number;
  /** Stop adding items. */
  paused?: boolean;
  /** Start over from the first source item after the last one. */
  loop?: boolean;
}

export interface StreamItem<T> {
  /** Unique, increasing id. Use it as the React key. */
  id: number;
  item: T;
}

/**
 * Feeds an `AnimatedList` from a fixed array on a timer, for demos and
 * landing pages. Returns the items newest first plus `push` to add one now.
 * Timers start after mount and are cleared on unmount or pause.
 */
export function useListStream<T>(
  source: readonly T[],
  { interval = 2200, limit = 12, initial = 0, paused = false, loop = true }: UseListStreamOptions = {}
) {
  const [state, setState] = React.useState(() => {
    const count = Math.min(initial, source.length);
    const items: StreamItem<T>[] = [];
    for (let i = 0; i < count; i++) items.unshift({ id: i, item: source[i] });
    return { items, next: count };
  });

  const push = React.useCallback(() => {
    setState((prev) => {
      if (!source.length || (!loop && prev.next >= source.length)) return prev;
      const entry = { id: prev.next, item: source[prev.next % source.length] };
      return { items: [entry, ...prev.items].slice(0, limit), next: prev.next + 1 };
    });
  }, [source, loop, limit]);

  React.useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(push, interval);
    return () => window.clearInterval(timer);
  }, [paused, interval, push]);

  return { items: state.items, push };
}
