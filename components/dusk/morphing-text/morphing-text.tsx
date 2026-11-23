"use client";

import * as React from "react";
import {
  animate,
  useInView,
  usePageInView,
  useReducedMotion,
  type AnimationPlaybackControls,
} from "motion/react";

import { cn } from "@/lib/utils";

type MorphingTextTag = "span" | "strong" | "em" | "p" | "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export interface MorphingTextProps extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
  /** Words or short phrases to cycle through. The first one is server-rendered. */
  words: string[];
  /** Milliseconds from one word to the next, morph included (minimum: morph + 600). */
  interval?: number;
  /** Length of the morph in milliseconds. */
  morphDuration?: number;
  /**
   * - `"gooey"` (default): an SVG threshold filter melts the letters into each other.
   * - `"blur"`: a soft blur crossfade, better for thin fonts and gradient text.
   */
  variant?: "gooey" | "blur";
  /** Element to render. */
  as?: MorphingTextTag;
  /** Horizontal alignment of shorter words inside the reserved width. */
  align?: "start" | "center" | "end";
  /** Reserve the widest word's width so nothing around the text moves. */
  reserveSpace?: boolean;
  /**
   * How assistive tech gets the words:
   * - `"all"` (default): every word once, as visually hidden text (also best for SEO).
   * - `"polite"`: the current word is a polite live region, announced on each change.
   */
  announce?: "all" | "polite";
  /** Classes for each word, e.g. a color. */
  wordClassName?: string;
}

const alignments = {
  start: "justify-items-start text-left",
  center: "justify-items-center text-center",
  end: "justify-items-end text-right",
} as const;

/** Blur (px) and opacity for a word that is `f` (0–1) of the way in. */
function frame(f: number, maxBlur: number) {
  if (f <= 0) return { blur: maxBlur, opacity: 0 };
  return { blur: Math.min(8 / f - 8, maxBlur), opacity: f ** 0.4 };
}

/**
 * Cycles through words by melting one into the next: the outgoing word blurs
 * away while the incoming one sharpens, and an SVG threshold filter turns the
 * overlapping blur into liquid, gooey letterforms. The filter is only applied
 * during the morph, so resting text stays crisp.
 *
 * Frames are written straight to the DOM (no React render per frame). It pauses
 * off-screen and in background tabs, and shows only the first word when the
 * user prefers reduced motion. Every word stays available to screen readers.
 */
export function MorphingText({ words, ...props }: MorphingTextProps) {
  // Remount on a new word list so the imperative frames start clean.
  return <MorphingTextInner key={words.join("\u0000")} words={words} {...props} />;
}

function MorphingTextInner({
  words: wordsProp,
  interval = 3000,
  morphDuration = 1000,
  variant = "gooey",
  as = "span",
  align = "center",
  reserveSpace = true,
  announce = "all",
  wordClassName,
  className,
  style,
  ...props
}: MorphingTextProps) {
  const Comp = as as React.ElementType;
  // The parent keys this component by content, so the first list is the list for its lifetime.
  const [words] = React.useState(wordsProp);
  const rootRef = React.useRef<HTMLElement>(null);
  const outRef = React.useRef<HTMLSpanElement>(null);
  const inRef = React.useRef<HTMLSpanElement>(null);
  const indexRef = React.useRef(0);
  const filterId = `morph-${React.useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const reduceMotion = useReducedMotion();
  const pageVisible = usePageInView();
  const inView = useInView(rootRef, { amount: 0.4 });
  const [liveIndex, setLiveIndex] = React.useState(0);

  const count = words.length;
  const running = count > 1 && !reduceMotion && inView && pageVisible;
  const gooey = variant === "gooey";
  const maxBlur = gooey ? 100 : 16;

  React.useEffect(() => {
    if (!running) return;
    const root = rootRef.current;
    const outEl = outRef.current;
    const inEl = inRef.current;
    if (!root || !outEl || !inEl) return;

    let controls: AnimationPlaybackControls | undefined;
    let timer: ReturnType<typeof setTimeout>;
    let morphing = false;
    const morphMs = Math.max(200, morphDuration);
    const holdMs = Math.max(600, interval - morphMs);

    const paint = (f: number) => {
      const a = frame(1 - f, maxBlur);
      const b = frame(f, maxBlur);
      outEl.style.filter = `blur(${a.blur}px)`;
      outEl.style.opacity = String(a.opacity);
      inEl.style.filter = `blur(${b.blur}px)`;
      inEl.style.opacity = String(b.opacity);
    };

    // Promote the incoming word to the resting slot in one synchronous step: no flash.
    const settle = () => {
      if (!morphing) return;
      morphing = false;
      const next = (indexRef.current + 1) % count;
      indexRef.current = next;
      outEl.textContent = words[next];
      outEl.style.filter = "";
      outEl.style.opacity = "";
      inEl.textContent = words[(next + 1) % count];
      inEl.style.filter = "";
      inEl.style.opacity = "0";
      if (gooey) root.style.removeProperty("filter");
      if (announce === "polite") setLiveIndex(next);
    };

    const schedule = () => {
      timer = setTimeout(() => {
        morphing = true;
        if (gooey) root.style.filter = `url(#${filterId}) blur(0.4px)`;
        controls = animate(0, 1, {
          duration: morphMs / 1000,
          ease: "linear",
          onUpdate: paint,
          onComplete: () => {
            settle();
            schedule();
          },
        });
      }, holdMs);
    };

    schedule();
    return () => {
      clearTimeout(timer);
      controls?.stop();
      // Paused mid-morph (scrolled away, tab hidden): finish on the incoming word.
      settle();
    };
  }, [running, count, words, interval, morphDuration, gooey, maxBlur, filterId, announce]);

  const stack = "[grid-area:1/1] whitespace-nowrap";

  return (
    <Comp
      ref={rootRef}
      data-slot="morphing-text"
      className={cn(
        "relative inline-grid",
        as === "span" || as === "strong" || as === "em" ? "" : "w-full",
        alignments[align],
        className
      )}
      style={style}
      {...props}
    >
      {announce === "all" && <span className="sr-only">{words.join(", ")}</span>}
      {announce === "polite" && (
        <span className="sr-only" aria-live="polite">
          {words[liveIndex]}
        </span>
      )}
      {reserveSpace &&
        words.map((word, i) => (
          <span key={i} aria-hidden className={cn(stack, "invisible select-none", wordClassName)}>
            {word}
          </span>
        ))}
      <span ref={outRef} aria-hidden className={cn(stack, wordClassName)}>
        {words[0]}
      </span>
      {count > 1 && (
        <span ref={inRef} aria-hidden className={cn(stack, "select-none", wordClassName)} style={{ opacity: 0 }}>
          {words[1]}
        </span>
      )}
      {gooey && (
        <svg aria-hidden className="pointer-events-none absolute size-0" focusable="false">
          <defs>
            <filter id={filterId}>
              {/* Snap alpha to fully on/off so overlapping blur fuses into one shape. */}
              <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 255 -140" />
            </filter>
          </defs>
        </svg>
      )}
    </Comp>
  );
}
