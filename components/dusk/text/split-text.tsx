"use client";

import * as React from "react";
import { stagger, useAnimate, useInView, useReducedMotion, type DOMKeyframesDefinition } from "motion/react";

type SplitTextTag = "span" | "p" | "div" | "strong" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export interface SplitTextProps extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
  /** The text to animate. Plain text only. */
  children: string;
  /** Element to render. Use a heading level for titles. */
  as?: SplitTextTag;
  /** Animate each letter or each word. */
  by?: "letters" | "words";
  /** How each piece enters. */
  effect?: "rise" | "blur" | "fade" | "drop";
  /** Seconds between pieces. Defaults to 0.03 for letters and 0.07 for words. */
  stagger?: number;
  /** Seconds before the first piece starts. */
  delay?: number;
  /** Seconds each piece takes. */
  duration?: number;
  /** Play only the first time it scrolls into view. When `false` it replays on every entry. */
  once?: boolean;
  /** How much of the element must be visible to start (0–1). */
  amount?: number;
}

const HIDDEN: Record<NonNullable<SplitTextProps["effect"]>, DOMKeyframesDefinition> = {
  rise: { opacity: 0, transform: "translateY(0.45em)" },
  drop: { opacity: 0, transform: "translateY(-0.6em) rotate(-6deg)" },
  blur: { opacity: 0, filter: "blur(8px)", transform: "scale(1.15)" },
  fade: { opacity: 0 },
};

const SHOWN: Record<NonNullable<SplitTextProps["effect"]>, DOMKeyframesDefinition> = {
  rise: { opacity: 1, transform: "translateY(0em)" },
  drop: { opacity: 1, transform: "translateY(0em) rotate(0deg)" },
  blur: { opacity: 1, filter: "blur(0px)", transform: "scale(1)" },
  fade: { opacity: 1 },
};

const PIECE = "[data-split-piece]";

/** User-perceived characters, so emoji and accented letters aren't split apart. */
function graphemes(text: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    return Array.from(new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(text), (s) => s.segment);
  }
  return Array.from(text);
}

/**
 * Letters or words stagger in when the text scrolls into view.
 *
 * The server renders the finished text, so no-JS visitors and crawlers see it
 * immediately; the pieces are hidden just before the first client paint and
 * then animated with Motion (no React state per piece). Words stay real text;
 * in letter mode screen readers get the whole string from a visually hidden
 * copy, because letter-by-letter markup can be read one character at a time.
 * Reduced motion skips the animation entirely.
 */
export function SplitText({
  children,
  as = "span",
  by = "letters",
  effect = "rise",
  stagger: gap,
  delay = 0,
  duration = 0.6,
  once = true,
  amount = 0.4,
  className,
  ...props
}: SplitTextProps) {
  const Comp = as as React.ElementType;
  const [scope, animate] = useAnimate<HTMLElement>();
  const inView = useInView(scope, { once, amount });
  const reduceMotion = useReducedMotion();
  const played = React.useRef(false);

  const step = gap ?? (by === "letters" ? 0.03 : 0.07);

  // Hide the pieces before the first client paint (the server copy stays fully visible).
  React.useLayoutEffect(() => {
    if (reduceMotion || played.current) return;
    animate(PIECE, HIDDEN[effect], { duration: 0 });
  }, [animate, effect, reduceMotion]);

  React.useEffect(() => {
    if (reduceMotion) {
      animate(PIECE, SHOWN[effect], { duration: 0 });
      return;
    }
    if (!inView) {
      if (!once && played.current) animate(PIECE, HIDDEN[effect], { duration: 0 });
      return;
    }
    played.current = true;
    const controls = animate(PIECE, SHOWN[effect], {
      duration,
      delay: stagger(step, { startDelay: delay }),
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [animate, inView, once, reduceMotion, effect, duration, step, delay]);

  const words = children.split(/(\s+)/).filter(Boolean);

  // Words are real text, read normally. Letter-by-letter markup is read one character
  // at a time by some screen readers, so letters get a visually hidden copy instead.
  if (by === "words") {
    return (
      <Comp ref={scope} data-slot="split-text" className={className} {...props}>
        {words.map((word, i) =>
          /^\s+$/.test(word) ? (
            word
          ) : (
            <span key={i} data-split-piece className="inline-block whitespace-pre">
              {word}
            </span>
          )
        )}
      </Comp>
    );
  }

  return (
    <Comp ref={scope} data-slot="split-text" className={className} {...props}>
      <span className="sr-only">{children}</span>
      <span aria-hidden>
        {words.map((word, i) =>
          /^\s+$/.test(word) ? (
            word
          ) : (
            // Keep each word's letters together so lines only break between words.
            <span key={i} className="inline-block whitespace-pre">
              {graphemes(word).map((char, j) => (
                <span key={j} data-split-piece className="inline-block">
                  {char}
                </span>
              ))}
            </span>
          )
        )}
      </span>
    </Comp>
  );
}
