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
  type Variants,
} from "motion/react";

import { cn } from "@/lib/utils";

type FlipWordsTag = "span" | "strong" | "em" | "p" | "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export interface FlipWordsProps extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
  /** Words (or short phrases) to flip through. The first one is server-rendered. */
  words: string[];
  /** Milliseconds each word stays before flipping (minimum 1200). */
  interval?: number;
  /** Element to render. `span` (default) sits inline in a sentence. */
  as?: FlipWordsTag;
  /** Seconds between letters of the incoming word. */
  letterStagger?: number;
  /** Pause while the pointer is over the word or focus is inside it. */
  pauseOnHover?: boolean;
  /** Classes for each word, e.g. a color or gradient. */
  wordClassName?: string;
}

/** User-perceived characters, so emoji and accented letters aren't split apart. */
function graphemes(text: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    return Array.from(new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(text), (s) => s.segment);
  }
  return Array.from(text);
}

const PERSPECTIVE = 600;

const letterVariants: Variants = {
  hidden: { opacity: 0, rotateX: -90, y: "0.3em", filter: "blur(4px)" },
  visible: {
    opacity: 1,
    rotateX: 0,
    y: "0em",
    filter: "blur(0px)",
    transition: { type: "spring", duration: 0.6, bounce: 0.25 },
  },
};

/**
 * A word inside a sentence that flips over to the next one on a timer: the
 * old word tips back on the X axis and fades, the new word's letters flip up
 * one after another, and the container's width springs between word lengths
 * so the surrounding text glides instead of jumping.
 *
 * It pauses on hover or focus, off-screen and in hidden tabs. Every word is
 * exposed once as visually hidden text for screen readers and search engines,
 * and under reduced motion the first word simply stays put.
 */
export function FlipWords({
  words,
  interval = 3000,
  as = "span",
  letterStagger = 0.035,
  pauseOnHover = true,
  wordClassName,
  className,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  ...props
}: FlipWordsProps) {
  const Comp = as as React.ElementType;
  const rootRef = React.useRef<HTMLElement>(null);
  const boxRef = React.useRef<HTMLSpanElement>(null);
  const measured = React.useRef(false);

  const reduceMotion = useReducedMotion();
  const pageVisible = usePageInView();
  const inView = useInView(rootRef, { amount: 0.5 });
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  const width = useMotionValue<number | "auto">("auto");

  const count = words.length;
  const safeIndex = count ? index % count : 0;
  const paused = pauseOnHover && (hovered || focused);
  const running = count > 1 && !reduceMotion && inView && pageVisible && !paused;

  React.useEffect(() => {
    if (!running) return;
    const timer = setTimeout(() => setIndex((i) => (i + 1) % count), Math.max(1200, interval));
    return () => clearTimeout(timer);
  }, [running, safeIndex, count, interval]);

  // Spring the box to the incoming word's width, and follow later size changes (fonts, breakpoints).
  React.useLayoutEffect(() => {
    const word = boxRef.current?.querySelector<HTMLElement>(`[data-flip-word="${safeIndex}"]`);
    if (!word) return;
    let controls: AnimationPlaybackControls | undefined;
    const target = word.offsetWidth;
    if (!measured.current || reduceMotion) {
      measured.current = true;
      width.jump(target);
    } else {
      controls = animate(width, target, { type: "spring", duration: 0.6, bounce: 0.2 });
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

  const word = words[safeIndex] ?? "";

  return (
    <Comp
      ref={rootRef}
      data-slot="flip-words"
      className={cn(as === "span" || as === "strong" || as === "em" ? "inline-flex" : "flex", className)}
      onPointerEnter={(e: React.PointerEvent<HTMLElement>) => {
        setHovered(true);
        onPointerEnter?.(e);
      }}
      onPointerLeave={(e: React.PointerEvent<HTMLElement>) => {
        setHovered(false);
        onPointerLeave?.(e);
      }}
      onFocus={(e: React.FocusEvent<HTMLElement>) => {
        setFocused(true);
        onFocus?.(e);
      }}
      onBlur={(e: React.FocusEvent<HTMLElement>) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
        onBlur?.(e);
      }}
      {...props}
    >
      <span className="sr-only">{words.join(", ")}</span>
      <motion.span
        ref={boxRef}
        aria-hidden
        style={{ width }}
        // Clip sideways only, so letters can tip above and below the line while flipping.
        className="relative inline-flex overflow-x-clip whitespace-nowrap"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={safeIndex}
            data-flip-word={safeIndex}
            className={cn("inline-block", wordClassName)}
            style={{ transformPerspective: PERSPECTIVE, transformOrigin: "50% 100%" }}
            initial="hidden"
            animate="visible"
            exit={{
              opacity: 0,
              rotateX: 80,
              y: "-0.35em",
              filter: "blur(6px)",
              transition: { duration: 0.35, ease: [0.4, 0, 1, 1] },
            }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: letterStagger } } }}
          >
            {graphemes(word).map((char, i) => (
              <motion.span
                key={i}
                variants={letterVariants}
                className="inline-block whitespace-pre"
                style={{ transformPerspective: PERSPECTIVE, transformOrigin: "50% 100%" }}
              >
                {char}
              </motion.span>
            ))}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </Comp>
  );
}
