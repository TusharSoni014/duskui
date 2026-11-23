"use client";

import * as React from "react";
import {
  useAnimate,
  useInView,
  useReducedMotion,
  type AnimationPlaybackControls,
  type DOMKeyframesDefinition,
} from "motion/react";

import { cn } from "@/lib/utils";

type TextAnimateTag = "span" | "p" | "div" | "strong" | "em" | "blockquote" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export type TextAnimatePreset = "fadeIn" | "blurIn" | "slideUp" | "slideDown" | "scaleUp" | "blurInUp";

export interface TextAnimateProps extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
  /** The text to animate. Plain text; `\n` starts a new line. */
  children: string;
  /** Element to render. Use a heading level for titles. */
  as?: TextAnimateTag;
  /** How each piece enters. */
  animation?: TextAnimatePreset;
  /** Split into characters, words, or the lines the text actually wraps onto. */
  by?: "character" | "word" | "line";
  /** Start when the component mounts, or when it scrolls into view. */
  trigger?: "mount" | "inView";
  /** Seconds before the first piece starts. */
  delay?: number;
  /** Seconds each piece takes. Defaults to 0.45 / 0.6 / 0.75 for character / word / line. */
  duration?: number;
  /** Seconds between pieces. Defaults to 0.025 / 0.06 / 0.14 for character / word / line. */
  stagger?: number;
  /** In `"inView"` mode, play only the first time. When `false` it replays on every entry. */
  once?: boolean;
  /** How much of the element must be visible to start (0–1). */
  amount?: number;
  /** Classes for every animated piece, e.g. a color. */
  segmentClassName?: string;
}

const HIDDEN: Record<TextAnimatePreset, DOMKeyframesDefinition> = {
  fadeIn: { opacity: 0 },
  blurIn: { opacity: 0, filter: "blur(6px)" },
  slideUp: { opacity: 0, transform: "translateY(0.35em)" },
  slideDown: { opacity: 0, transform: "translateY(-0.35em)" },
  scaleUp: { opacity: 0, transform: "scale(0.9)" },
  blurInUp: { opacity: 0, filter: "blur(6px)", transform: "translateY(0.3em)" },
};

const SHOWN: Record<TextAnimatePreset, DOMKeyframesDefinition> = {
  fadeIn: { opacity: 1 },
  blurIn: { opacity: 1, filter: "blur(0px)" },
  slideUp: { opacity: 1, transform: "translateY(0em)" },
  slideDown: { opacity: 1, transform: "translateY(0em)" },
  scaleUp: { opacity: 1, transform: "scale(1)" },
  blurInUp: { opacity: 1, filter: "blur(0px)", transform: "translateY(0em)" },
};

const DEFAULTS = {
  character: { stagger: 0.025, duration: 0.45 },
  word: { stagger: 0.06, duration: 0.6 },
  line: { stagger: 0.14, duration: 0.75 },
} as const;

const PIECE = "[data-text-piece]";

/** User-perceived characters, so emoji and accented letters aren't split apart. */
function graphemes(text: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    return Array.from(new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(text), (s) => s.segment);
  }
  return Array.from(text);
}

/** Groups pieces by the visual line they sit on (offsetTop ignores the entrance transforms). */
function groupByLine(pieces: HTMLElement[]): HTMLElement[][] {
  const lines: HTMLElement[][] = [];
  let lastTop = -Infinity;
  for (const piece of pieces) {
    const top = piece.offsetTop;
    if (top > lastTop + 2 || !lines.length) {
      lines.push([piece]);
      lastTop = top;
    } else {
      lines[lines.length - 1].push(piece);
    }
  }
  return lines;
}

/**
 * One text animation component with presets: fade, blur, slide up or down,
 * scale up and blur-in-up, by character, word or visual line, on mount or
 * when scrolled into view.
 *
 * The server renders the finished text so crawlers and no-JS visitors see it;
 * pieces are hidden just before the first client paint and animated with
 * Motion directly on the DOM. Line mode measures where the text really wraps,
 * so it follows every breakpoint. Reduced motion shows the text at once.
 */
export function TextAnimate({
  children,
  as = "p",
  animation = "fadeIn",
  by = "word",
  trigger = "inView",
  delay = 0,
  duration,
  stagger,
  once = true,
  amount = 0.3,
  segmentClassName,
  className,
  ...props
}: TextAnimateProps) {
  const Comp = as as React.ElementType;
  const [scope, animate] = useAnimate<HTMLElement>();
  const inView = useInView(scope, { once, amount });
  const reduceMotion = useReducedMotion();
  const played = React.useRef(false);

  const step = stagger ?? DEFAULTS[by].stagger;
  const length = duration ?? DEFAULTS[by].duration;
  const active = trigger === "mount" || inView;

  // Hide the pieces before the first client paint (the server copy stays fully visible).
  React.useLayoutEffect(() => {
    if (reduceMotion || played.current) return;
    animate(PIECE, HIDDEN[animation], { duration: 0 });
  }, [animate, animation, reduceMotion, children, by]);

  React.useEffect(() => {
    if (reduceMotion) {
      animate(PIECE, SHOWN[animation], { duration: 0 });
      return;
    }
    if (!active) {
      if (!once && played.current) animate(PIECE, HIDDEN[animation], { duration: 0 });
      return;
    }
    const root = scope.current;
    if (!root) return;
    played.current = true;
    const pieces = Array.from(root.querySelectorAll<HTMLElement>(PIECE));
    const groups = by === "line" ? groupByLine(pieces) : pieces.map((piece) => [piece]);
    const controls: AnimationPlaybackControls[] = groups.map((group, i) =>
      animate(group, SHOWN[animation], {
        duration: length,
        delay: delay + i * step,
        ease: [0.22, 1, 0.36, 1],
      })
    );
    return () => controls.forEach((c) => c.stop());
  }, [animate, scope, active, once, reduceMotion, animation, by, length, step, delay, children]);

  const lines = children.split("\n");
  const piece = cn("inline-block whitespace-pre", segmentClassName);

  const renderWords = (line: string, lineIndex: number) =>
    line
      .split(/(\s+)/)
      .filter(Boolean)
      .map((word, i) => {
        if (/^\s+$/.test(word)) return word;
        const key = `${lineIndex}-${i}`;
        if (by !== "character") {
          return (
            <span key={key} data-text-piece className={piece}>
              {word}
            </span>
          );
        }
        // Letters of a word stay together so lines only break between words.
        return (
          <span key={key} className="inline-block whitespace-pre">
            {graphemes(word).map((char, j) => (
              <span key={j} data-text-piece className={piece}>
                {char}
              </span>
            ))}
          </span>
        );
      });

  const content = lines.map((line, i) => (
    <React.Fragment key={i}>
      {i > 0 && <br />}
      {renderWords(line, i)}
    </React.Fragment>
  ));

  // Words are real text, read normally. Letter-by-letter markup can be read one character
  // at a time by some screen readers, so character mode gets a visually hidden copy instead.
  return (
    <Comp ref={scope} data-slot="text-animate" className={className} {...props}>
      {by === "character" ? (
        <>
          <span className="sr-only">{children}</span>
          <span aria-hidden>{content}</span>
        </>
      ) : (
        content
      )}
    </Comp>
  );
}
