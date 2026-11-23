"use client";

import * as React from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  usePageInView,
  useReducedMotion,
  type AnimationPlaybackControls,
} from "motion/react";

import { cn } from "@/lib/utils";

type WordRotateTag = "span" | "strong" | "em" | "p" | "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export interface WordRotateProps extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
  /** Words (or short phrases) to cycle through. The first one is server-rendered. */
  words: string[];
  /** Milliseconds each word stays on screen (minimum 1000). */
  interval?: number;
  /** Element to render. `span` (default) sits inline in a sentence. */
  as?: WordRotateTag;
  /** Slide distance as a fraction of the line height. 0 for a pure blur/fade swap. */
  distance?: number;
  /** Blur applied to incoming and outgoing words, in px. */
  blur?: number;
  /** Pause while the pointer is over the word. */
  pauseOnHover?: boolean;
  /**
   * How assistive tech gets the words:
   * - `"all"` (default): every word is exposed once as visually hidden text (also best for SEO).
   * - `"polite"`: the visible word is a polite live region, announced each time it changes.
   */
  announce?: "all" | "polite";
  /** Classes for each word, e.g. a color. */
  wordClassName?: string;
}

/**
 * Cycles through words with a vertical slide-and-blur swap. The container's
 * width springs between word lengths so the surrounding sentence glides
 * instead of jumping.
 *
 * The rotation pauses off-screen, in hidden tabs and (optionally) on hover.
 * Under reduced motion the first word stays put. Screen readers and search
 * engines get every word as real text, or polite announcements with
 * `announce="polite"`.
 */
export function WordRotate({
  words,
  interval = 2400,
  as = "span",
  distance = 0.6,
  blur = 4,
  pauseOnHover = true,
  announce = "all",
  wordClassName,
  className,
  onPointerEnter,
  onPointerLeave,
  ...props
}: WordRotateProps) {
  const Comp = as as React.ElementType;
  const rootRef = React.useRef<HTMLElement>(null);
  const boxRef = React.useRef<HTMLSpanElement>(null);
  const measured = React.useRef(false);

  const reduceMotion = useReducedMotion();
  const pageVisible = usePageInView();
  const inView = useInView(rootRef, { amount: 0.5 });
  const [hovered, setHovered] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  const width = useMotionValue<number | "auto">("auto");

  const count = words.length;
  const safeIndex = count ? index % count : 0;
  const running = count > 1 && !reduceMotion && inView && pageVisible && !(pauseOnHover && hovered);

  React.useEffect(() => {
    if (!running) return;
    const timer = setTimeout(() => setIndex((i) => (i + 1) % count), Math.max(1000, interval));
    return () => clearTimeout(timer);
  }, [running, safeIndex, count, interval]);

  // Spring the box to the incoming word's width, and follow later size changes (fonts, breakpoints).
  React.useLayoutEffect(() => {
    const word = boxRef.current?.querySelector<HTMLElement>(`[data-word="${safeIndex}"]`);
    if (!word) return;
    let controls: AnimationPlaybackControls | undefined;
    const target = word.offsetWidth;
    if (!measured.current || reduceMotion) {
      measured.current = true;
      width.jump(target);
    } else {
      controls = animate(width, target, { type: "spring", duration: 0.45, bounce: 0.1 });
    }

    let first = true;
    const observer = new ResizeObserver(() => {
      if (first) {
        first = false;
        return;
      }
      controls?.stop();
      width.jump(word.offsetWidth);
    });
    observer.observe(word);
    return () => {
      controls?.stop();
      observer.disconnect();
    };
  }, [safeIndex, reduceMotion, width]);

  const y = `${distance * 100}%`;
  const still = reduceMotion === true;

  return (
    <Comp
      ref={rootRef}
      data-slot="word-rotate"
      className={cn(as === "span" || as === "strong" || as === "em" ? "inline-flex" : "flex", className)}
      onPointerEnter={(e: React.PointerEvent<HTMLElement>) => {
        setHovered(true);
        onPointerEnter?.(e);
      }}
      onPointerLeave={(e: React.PointerEvent<HTMLElement>) => {
        setHovered(false);
        onPointerLeave?.(e);
      }}
      {...props}
    >
      {announce === "all" && <span className="sr-only">{words.join(", ")}</span>}
      <motion.span
        ref={boxRef}
        aria-hidden={announce === "all" || undefined}
        aria-live={announce === "polite" ? "polite" : undefined}
        style={{ width }}
        // Vertical padding keeps ascenders/descenders and blur from being clipped.
        className="relative -my-[0.15em] inline-flex overflow-hidden py-[0.15em] whitespace-nowrap"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={safeIndex}
            data-word={safeIndex}
            className={cn("inline-block", wordClassName)}
            initial={still ? { opacity: 0 } : { opacity: 0, y, filter: `blur(${blur}px)` }}
            animate={{ opacity: 1, y: "0%", filter: "blur(0px)" }}
            exit={still ? { opacity: 0 } : { opacity: 0, y: `-${y}`, filter: `blur(${blur}px)` }}
            transition={{ type: "spring", duration: 0.45, bounce: 0.1 }}
          >
            {words[safeIndex]}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </Comp>
  );
}
