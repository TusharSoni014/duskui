"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=/<>[]{}";

export interface CyberButtonProps extends Omit<ButtonProps, "asChild"> {
  /** Hover / keyboard-focus effect on the label. */
  effect?: "scramble" | "glitch" | "none";
  /** Size of the angled corner cuts, in px. */
  cut?: number;
  /** Which corners are cut: top-left + bottom-right, top-right + bottom-left, or all four. */
  corners?: "diagonal" | "reverse" | "all";
  /** Length of the scramble or glitch, in ms. */
  duration?: number;
  /** Characters used while scrambling. Keep them the same width as your font's letters. */
  characters?: string;
}

type Corner = "tl" | "tr" | "br" | "bl";

const cornerSets: Record<NonNullable<CyberButtonProps["corners"]>, Corner[]> = {
  diagonal: ["tl", "br"],
  reverse: ["tr", "bl"],
  all: ["tl", "tr", "br", "bl"],
};

/** Clip-path polygon with 45° cuts on the chosen corners. */
function cyberClip(cut: number, corners: Corner[]) {
  const c = `${cut}px`;
  const has = (k: Corner) => corners.includes(k);
  const points = [
    ...(has("tl") ? [`${c} 0`] : ["0 0"]),
    ...(has("tr") ? [`calc(100% - ${c}) 0`, `100% ${c}`] : ["100% 0"]),
    ...(has("br") ? [`100% calc(100% - ${c})`, `calc(100% - ${c}) 100%`] : ["100% 100%"]),
    ...(has("bl") ? [`${c} 100%`, `0 calc(100% - ${c})`] : ["0 100%"]),
    ...(has("tl") ? [`0 ${c}`] : []),
  ];
  return `polygon(${points.join(", ")})`;
}

/** 1px lines along the diagonal cuts, so bordered variants keep a continuous outline. */
function cutEdges(cut: number, corners: Corner[]) {
  const d = cut * Math.SQRT1_2;
  const angle: Record<Corner, number> = { tl: 135, tr: 225, br: 315, bl: 45 };
  return corners
    .map(
      (k) =>
        `linear-gradient(${angle[k]}deg, transparent ${d}px, var(--cyber-edge) ${d}px, var(--cyber-edge) ${d + 1.25}px, transparent ${d + 1.25}px)`
    )
    .join(", ");
}

/** Scrambles `text` for `duration` ms each time `burst` changes, resolving left to right. */
function useScramble(text: string, burst: number, duration: number, characters: string) {
  const [frame, setFrame] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (burst === 0) return;
    const pool = Array.from(characters);
    const chars = Array.from(text);
    const start = performance.now();
    let lastPaint = 0;
    let raf = requestAnimationFrame(function tick(now) {
      const progress = Math.min(1, (now - start) / duration);
      // Repaint ~20×/s: fast enough to read as noise, slow enough not to strobe.
      if (now - lastPaint >= 50 || progress === 1) {
        lastPaint = now;
        const resolved = Math.floor(progress * chars.length);
        setFrame(
          progress === 1
            ? null
            : chars
                .map((ch, i) =>
                  i < resolved || ch.trim() === "" ? ch : pool[(Math.random() * pool.length) | 0]
                )
                .join("")
        );
      }
      if (progress < 1) raf = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, [burst, text, duration, characters]);

  return frame ?? text;
}

function ScrambleText({
  text,
  burst,
  duration,
  characters,
}: {
  text: string;
  burst: number;
  duration: number;
  characters: string;
}) {
  const shown = useScramble(text, burst, duration, characters);
  return (
    // The invisible real text reserves the width; the scrambled copy sits on top.
    <span className="relative inline-block whitespace-pre">
      <span className="invisible">{text}</span>
      <span aria-hidden className="absolute inset-0 overflow-x-clip">
        {shown}
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
}

const rand = (min: number, max: number) => min + Math.random() * (max - min);

/**
 * A cyberpunk button built on the DuskUI Button: angled corners cut with
 * `clip-path`, a monospace uppercase label, and a hover effect where the
 * label scrambles through random characters before resolving (or glitches
 * with an RGB split).
 *
 * Everything from the base Button keeps working, including `loading`,
 * `variant` and `size`. The width never changes while scrambling, focus shows
 * an inset outline (a normal ring would be clipped), and effects are skipped
 * under reduced motion.
 */
export function CyberButton({
  effect = "scramble",
  cut = 10,
  corners = "diagonal",
  duration = 550,
  characters = SCRAMBLE_CHARS,
  variant = "default",
  className,
  style,
  children,
  loading,
  onPointerEnter,
  onFocus,
  ...props
}: CyberButtonProps) {
  const reduceMotion = useReducedMotion();
  const [burst, setBurst] = React.useState(0);
  const layerA = React.useRef<HTMLSpanElement>(null);
  const layerB = React.useRef<HTMLSpanElement>(null);
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  const nextAllowed = React.useRef(0);
  const cornerList = cornerSets[corners];

  React.useEffect(() => () => clearTimeout(timer.current), []);

  const glitch = () => {
    const layers = [layerA.current, layerB.current];
    const frames = Math.max(3, Math.round(duration / 80));
    let frame = 0;
    const step = () => {
      layers.forEach((el, i) => {
        if (!el) return;
        if (frame >= frames) {
          el.style.opacity = "0";
          el.style.clipPath = "";
          el.style.transform = "";
          return;
        }
        const top = rand(0, 80);
        const height = rand(15, 45);
        el.style.opacity = "1";
        el.style.clipPath = `inset(${top}% 0 ${Math.max(0, 100 - top - height)}% 0)`;
        el.style.transform = `translateX(${(i === 0 ? -1 : 1) * rand(1, 3)}px)`;
      });
      frame += 1;
      if (frame <= frames) timer.current = setTimeout(step, duration / frames);
    };
    clearTimeout(timer.current);
    step();
  };

  const trigger = () => {
    if (effect === "none" || reduceMotion || loading) return;
    // At most one effect per second, however fast the pointer moves.
    const now = performance.now();
    if (now < nextAllowed.current) return;
    nextAllowed.current = now + Math.max(duration, 1000);
    if (effect === "glitch") glitch();
    else setBurst((n) => n + 1);
  };

  const label =
    effect === "scramble"
      ? React.Children.map(children, (child) =>
          typeof child === "string" || typeof child === "number" ? (
            <ScrambleText text={String(child)} burst={burst} duration={duration} characters={characters} />
          ) : (
            child
          )
        )
      : children;

  const layerClass =
    "pointer-events-none absolute inset-0 inline-flex items-center justify-center opacity-0 [gap:inherit]";

  return (
    <Button
      variant={variant}
      loading={loading}
      data-slot="cyber-button"
      className={cn(
        "isolate rounded-none font-mono uppercase tracking-[0.12em]",
        // clip-path hides outer rings, so focus uses an inset outline instead.
        "focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-current focus-visible:outline-solid focus-visible:ring-0",
        "[--cyber-edge:color-mix(in_oklab,var(--color-primary)_65%,transparent)] hover:[--cyber-edge:var(--color-primary)]",
        variant === "outline" &&
          "border-primary/65 bg-primary/5 text-primary hover:border-primary hover:bg-primary/15 hover:text-primary dark:border-primary/65 dark:bg-primary/5 dark:hover:bg-primary/15",
        className
      )}
      style={{
        clipPath: cyberClip(cut, cornerList),
        ...(variant === "outline" ? { backgroundImage: cutEdges(cut, cornerList) } : null),
        ...style,
      }}
      onPointerEnter={(e) => {
        trigger();
        onPointerEnter?.(e);
      }}
      onFocus={(e) => {
        if (e.currentTarget.matches(":focus-visible")) trigger();
        onFocus?.(e);
      }}
      {...props}
    >
      <span className="relative inline-flex items-center justify-center [gap:inherit]">
        {label}
        {effect === "glitch" && (
          <>
            <span ref={layerA} aria-hidden className={cn(layerClass, "text-[#ff2bd6]")}>
              {children}
            </span>
            <span ref={layerB} aria-hidden className={cn(layerClass, "text-[#00e5ff]")}>
              {children}
            </span>
          </>
        )}
      </span>
    </Button>
  );
}
