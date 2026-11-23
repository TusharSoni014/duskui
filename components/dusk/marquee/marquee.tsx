"use client";

import * as React from "react";
import {
  animate,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";

import { cn } from "@/lib/utils";

type MarqueeDirection = "left" | "right" | "up" | "down";

export interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The items to scroll. Rendered once, then cloned (aria-hidden) as many times as needed to fill the loop. */
  children: React.ReactNode;
  /** Which way the content travels. `up` / `down` make a vertical marquee: give it a height. */
  direction?: MarqueeDirection;
  /** Speed in pixels per second. */
  speed?: number;
  /** Space between items (and between the last item and the next copy), in px. */
  gap?: number;
  /** Ease to a stop while the pointer is over the marquee or something inside it has focus. */
  pauseOnHover?: boolean;
  /** Stop the marquee, e.g. from your own pause button. */
  paused?: boolean;
  /** Fade the leading and trailing edges with a mask. `true` = 64px, or a size in px. */
  fade?: boolean | number;
  /** Classes for each copy of the content (the flex row/column that holds the items). */
  groupClassName?: string;
}

const subscribe = () => () => {};
/** `false` on the server and during hydration, `true` afterwards. */
function useHydrated() {
  return React.useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}

/**
 * An infinitely scrolling row (or column) for logos, testimonials and tags.
 *
 * The content is measured and cloned just enough times to cover the viewport
 * plus one copy, then the track is moved with a single transform that wraps
 * by exactly one copy's length, so the loop is seamless at any width and
 * never re-renders React while it runs. The clones are `aria-hidden` and
 * `inert`, so screen readers and the Tab key only meet the original items.
 *
 * It eases to a stop on hover and while focus is inside, pauses off-screen,
 * and under reduced motion becomes a static, scrollable row.
 */
export function Marquee({
  children,
  direction = "left",
  speed = 40,
  gap = 16,
  pauseOnHover = true,
  paused = false,
  fade = true,
  groupClassName,
  className,
  style,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  ...props
}: MarqueeProps) {
  const vertical = direction === "up" || direction === "down";
  const forward = direction === "left" || direction === "up";

  const hydrated = useHydrated();
  const reduceMotion = (useReducedMotion() ?? false) && hydrated;

  const rootRef = React.useRef<HTMLDivElement>(null);
  const groupRef = React.useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { margin: "100px" });

  // Length of one copy (content + trailing gap), in px.
  const size = React.useRef(0);
  const [copies, setCopies] = React.useState(2);

  React.useLayoutEffect(() => {
    const root = rootRef.current;
    const group = groupRef.current;
    if (!root || !group || reduceMotion) return;
    const measure = () => {
      const groupLength = vertical ? group.offsetHeight : group.offsetWidth;
      const rootLength = vertical ? root.clientHeight : root.clientWidth;
      size.current = groupLength;
      if (groupLength > 0) setCopies(Math.max(2, Math.ceil(rootLength / groupLength) + 1));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    observer.observe(group);
    return () => observer.disconnect();
  }, [vertical, reduceMotion]);

  // Distance travelled within the current copy, 0 → size.
  const offset = useMotionValue(0);
  // 1 = full speed, 0 = stopped. Eased so hovering slows down instead of snapping.
  const rate = useMotionValue(paused ? 0 : 1);
  // Pointer over / focus inside, tracked separately so one ending doesn't cancel the other.
  const holds = React.useRef({ pointer: false, focus: false });

  const updateRate = React.useCallback(() => {
    const held = pauseOnHover && (holds.current.pointer || holds.current.focus);
    animate(rate, paused || held ? 0 : 1, { duration: 0.5, ease: "easeOut" });
  }, [paused, pauseOnHover, rate]);

  React.useEffect(() => {
    updateRate();
  }, [updateRate]);

  useAnimationFrame((_, delta) => {
    const length = size.current;
    if (!length || !inView || reduceMotion) return;
    const r = rate.get();
    if (r === 0) return;
    // Clamp delta so a backgrounded tab doesn't jump on return.
    const next = (offset.get() + (speed * Math.min(delta, 64) * r) / 1000) % length;
    offset.set(next);
  });

  const translate = useTransform(offset, (o) => (forward ? -o : o - size.current));

  const hold = (source: "pointer" | "focus", value: boolean) => {
    if (holds.current[source] === value) return;
    holds.current[source] = value;
    updateRate();
  };

  const fadeSize = fade === true ? 64 : typeof fade === "number" ? fade : 0;
  const mask =
    fadeSize > 0 && !reduceMotion
      ? `linear-gradient(to ${vertical ? "bottom" : "right"}, transparent, #000 ${fadeSize}px, #000 calc(100% - ${fadeSize}px), transparent)`
      : undefined;

  const group = (index: number) => (
    <div
      key={index}
      ref={index === 0 ? groupRef : undefined}
      aria-hidden={index > 0 || undefined}
      inert={index > 0 || undefined}
      className={cn("flex shrink-0", vertical ? "flex-col" : "items-center", groupClassName)}
      style={vertical ? { gap, paddingBottom: gap } : { gap, paddingRight: gap }}
    >
      {children}
    </div>
  );

  if (reduceMotion) {
    return (
      <div
        ref={rootRef}
        data-slot="marquee"
        data-direction={direction}
        className={cn(
          "flex [scrollbar-width:thin]",
          vertical ? "flex-col overflow-y-auto" : "overflow-x-auto",
          className
        )}
        style={style}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onFocus={onFocus}
        onBlur={onBlur}
        {...props}
      >
        {group(0)}
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      data-slot="marquee"
      data-direction={direction}
      className={cn("flex overflow-hidden", vertical && "flex-col", className)}
      style={{ maskImage: mask, WebkitMaskImage: mask, ...style }}
      onPointerEnter={(event) => {
        onPointerEnter?.(event);
        if (event.pointerType !== "touch") hold("pointer", true);
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event);
        hold("pointer", false);
      }}
      onFocus={(event) => {
        onFocus?.(event);
        hold("focus", true);
      }}
      onBlur={(event) => {
        onBlur?.(event);
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) hold("focus", false);
      }}
      {...props}
    >
      <motion.div
        className={cn("flex shrink-0 will-change-transform", vertical ? "h-max flex-col" : "w-max")}
        style={vertical ? { y: translate } : { x: translate }}
      >
        {Array.from({ length: copies }, (_, i) => group(i))}
      </motion.div>
    </div>
  );
}
