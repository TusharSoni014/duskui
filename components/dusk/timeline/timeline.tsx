"use client";

import * as React from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type UseInViewOptions,
} from "motion/react";

import { cn } from "@/lib/utils";

type TimelineContextValue = {
  container?: React.RefObject<HTMLElement | null>;
  anchor: number;
  reduceMotion: boolean;
};

const TimelineContext = React.createContext<TimelineContextValue>({ anchor: 0.5, reduceMotion: false });

export interface TimelineProps extends Omit<React.HTMLAttributes<HTMLOListElement>, "children"> {
  /** `TimelineItem`s, in order. */
  children: React.ReactNode;
  /** The scrolling element, if the timeline lives in a scroll container instead of the page. */
  container?: React.RefObject<HTMLElement | null>;
  /**
   * Where the tip of the progress line sits, as a fraction of the viewport (or
   * container) height. Items light up as they cross this line. Default: the middle.
   */
  anchor?: number;
  /** Distance from the top of the viewport (or container) where dates stick on wide layouts. Any CSS length. */
  stickyTop?: string;
  /** Classes for the progress line (the bright part of the rail). */
  lineClassName?: string;
}

/**
 * A vertical timeline or changelog whose rail fills as you scroll.
 *
 * The rail's fill is a `scaleY` transform driven by `useScroll` on the list
 * itself, so the tip always sits on the `anchor` line of the viewport and
 * scrolling never re-renders React. Works on the page or in any scroll
 * container (`container`). Wide layouts (container width ≥ 36rem) put the
 * date in its own sticky column; narrow ones stack it above the title.
 *
 * Everything is fully visible on the server, for no-JS visitors and under
 * reduced motion; entries below the fold fade in as they arrive.
 */
export function Timeline({
  children,
  container,
  anchor = 0.5,
  stickyTop = "5rem",
  lineClassName,
  className,
  style,
  ...props
}: TimelineProps) {
  const ref = React.useRef<HTMLOListElement>(null);
  const reduceMotion = useReducedMotion() ?? false;
  const a = Math.min(1, Math.max(0, anchor));

  const { scrollYProgress } = useScroll({
    target: ref,
    container,
    offset: [`start ${a}`, `end ${a}`],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 260, damping: 40, restDelta: 0.001 });
  // 1 (full line) on the server and under reduced motion; follows scroll once armed.
  const armed = useMotionValue(0);
  const scaleY = useTransform([smooth, armed], ([p, on]: number[]) => (on ? p : 1));

  React.useLayoutEffect(() => {
    armed.set(reduceMotion ? 0 : 1);
  }, [reduceMotion, armed]);

  const context = React.useMemo(() => ({ container, anchor: a, reduceMotion }), [container, a, reduceMotion]);

  return (
    <TimelineContext.Provider value={context}>
      <div className="@container">
        <ol
          ref={ref}
          data-slot="timeline"
          className={cn(
            "relative [--tl-date:8.5rem] [--tl-dot:1.75rem] [--tl-gap:1.25rem] @xl:[--tl-gap:1.5rem]",
            className
          )}
          style={{ "--tl-sticky": stickyTop, ...style } as React.CSSProperties}
          {...props}
        >
          {/* Rail: a dim track with the scroll-driven fill on top. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-[calc(var(--tl-dot)/2)] left-[calc(var(--tl-dot)/2)] w-px -translate-x-1/2 bg-white/10 @xl:left-[calc(var(--tl-date)+var(--tl-gap)+var(--tl-dot)/2)]"
          >
            <motion.span
              className={cn(
                "absolute inset-0 origin-top bg-linear-to-b from-primary/20 via-primary to-primary shadow-[0_0_12px_var(--color-primary)]",
                lineClassName
              )}
              style={{ scaleY }}
            />
          </span>
          {children}
        </ol>
      </div>
    </TimelineContext.Provider>
  );
}

/** Nearest ancestor that scrolls vertically. */
function scrollParent(el: HTMLElement) {
  for (let node = el.parentElement; node; node = node.parentElement) {
    if (/(auto|scroll|overlay)/.test(getComputedStyle(node).overflowY)) return node;
  }
  return null;
}

export interface TimelineItemProps extends Omit<React.HTMLAttributes<HTMLLIElement>, "title"> {
  /** Date label, e.g. `"Mar 2026"` or `"v2.4.0"`. */
  date: React.ReactNode;
  /** Machine-readable date for the `<time>` element, e.g. `"2026-03"`. */
  dateTime?: string;
  /** Entry heading. */
  title: React.ReactNode;
  /** Heading element for the title. */
  titleAs?: "h2" | "h3" | "h4";
  /** Icon inside the rail dot. Defaults to a small dot. */
  icon?: React.ReactNode;
}

/**
 * One entry: a sticky date (wide layouts), a dot on the rail that lights up
 * when the progress line reaches it, and the content, which fades and slides
 * in the first time it scrolls into view.
 */
export function TimelineItem({
  date,
  dateTime,
  title,
  titleAs: Title = "h3",
  icon,
  className,
  children,
  ...props
}: TimelineItemProps) {
  const { container, anchor, reduceMotion } = React.useContext(TimelineContext);
  const ref = React.useRef<HTMLLIElement>(null);
  const dotRef = React.useRef<HTMLSpanElement>(null);

  // Lit while the dot is above the anchor line.
  const reached = useInView(dotRef, {
    root: container,
    margin: `9999px 0px -${Math.round((1 - anchor) * 100)}% 0px` as UseInViewOptions["margin"],
  });
  // First time the entry comes into view.
  const entered = useInView(ref, { root: container, once: true, margin: "0px 0px -10% 0px" });

  const opacity = useMotionValue(1);
  const y = useMotionValue(0);
  const hidden = React.useRef(false);

  // Before the first paint, hide only entries that are still below the fold,
  // so nothing that's already visible flashes.
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el || reduceMotion) return;
    // On mount an ancestor container's ref isn't attached yet, so fall back to the DOM.
    const root = container ? (container.current ?? scrollParent(el)) : null;
    const fold = root
      ? (() => {
          const r = root.getBoundingClientRect();
          return r.top + r.height * 0.95;
        })()
      : window.innerHeight * 0.95;
    if (el.getBoundingClientRect().top > fold) {
      hidden.current = true;
      opacity.set(0);
      y.set(24);
    }
  }, [container, reduceMotion, opacity, y]);

  React.useEffect(() => {
    if (!entered || !hidden.current) return;
    hidden.current = false;
    const a = animate(opacity, 1, { duration: 0.5, ease: "easeOut" });
    const b = animate(y, 0, { type: "spring", stiffness: 220, damping: 26 });
    return () => {
      a.stop();
      b.stop();
    };
  }, [entered, opacity, y]);

  return (
    <li
      ref={ref}
      data-slot="timeline-item"
      data-reached={reached || undefined}
      className={cn(
        "group/tl relative grid grid-cols-[var(--tl-dot)_1fr] gap-x-(--tl-gap) pb-10 last:pb-0",
        "@xl:grid-cols-[var(--tl-date)_var(--tl-dot)_1fr]",
        className
      )}
      {...props}
    >
      {/* Date: above the title when narrow, its own sticky column when wide. */}
      <div className="col-start-2 row-start-1 @xl:col-start-1 @xl:row-span-2 @xl:text-right">
        <motion.time
          dateTime={dateTime}
          style={{ opacity }}
          className="mb-1 block text-xs font-medium tracking-wide text-white/50 uppercase transition-colors duration-300 group-data-reached/tl:text-primary @xl:sticky @xl:top-(--tl-sticky) @xl:mb-0 @xl:pt-1 @xl:text-sm @xl:normal-case @xl:tracking-normal"
        >
          {date}
        </motion.time>
      </div>

      {/* Dot on the rail. */}
      <div className="col-start-1 row-span-2 row-start-1 @xl:col-start-2">
        <span
          ref={dotRef}
          aria-hidden
          className={cn(
            "relative z-10 flex size-(--tl-dot) items-center justify-center rounded-full border border-white/15 bg-background text-white/40",
            "transition-[color,border-color,box-shadow] duration-300 [&_svg]:size-3.5",
            "group-data-reached/tl:border-primary/70 group-data-reached/tl:text-primary group-data-reached/tl:shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-primary)_15%,transparent),0_0_16px_color-mix(in_oklab,var(--color-primary)_50%,transparent)]"
          )}
        >
          {icon ?? (
            <span className="size-2 rounded-full bg-current transition-transform duration-300 group-data-reached/tl:scale-125 motion-reduce:transition-none" />
          )}
        </span>
      </div>

      <motion.div style={{ opacity, y }} className="col-start-2 row-start-2 min-w-0 @xl:col-start-3 @xl:row-start-1 @xl:row-span-2">
        <Title className="text-base font-semibold tracking-tight text-white @xl:pt-0.5">{title}</Title>
        {children && <div className="mt-2 text-sm leading-relaxed text-white/60">{children}</div>}
      </motion.div>
    </li>
  );
}
