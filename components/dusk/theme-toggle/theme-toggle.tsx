"use client";

import * as React from "react";
import { flushSync } from "react-dom";
import { motion, useReducedMotion, type Transition } from "motion/react";

import { cn } from "@/lib/utils";

export type Theme = "light" | "dark";

/** Element whose class is switched: a ref, the element itself, or a getter. */
export type ThemeTarget =
  | React.RefObject<HTMLElement | null>
  | HTMLElement
  | null
  | (() => HTMLElement | null);

export interface ThemeToggleProps
  extends Omit<React.ComponentProps<"button">, "onClick" | "children" | "type"> {
  /** Current theme (controlled). Pair with `onThemeChange`. */
  theme?: Theme;
  /** Initial theme when uncontrolled. */
  defaultTheme?: Theme;
  /** Called with the next theme, inside the view transition so the new snapshot shows it. */
  onThemeChange?: (theme: Theme) => void;
  /** Element that gets the `darkClass`. Defaults to `document.documentElement`. */
  target?: ThemeTarget;
  /** Toggle `darkClass` and `color-scheme` on the target. Turn off when a theme library (next-themes) does it. */
  applyClass?: boolean;
  /** Class added to the target in dark mode. */
  darkClass?: string;
  /** `"circle"` reveals the new theme from the button; `"none"` switches instantly. */
  transition?: "circle" | "none";
  /** Reveal duration in milliseconds. */
  duration?: number;
  /** CSS easing for the reveal. */
  easing?: string;
  size?: "sm" | "default" | "lg";
  variant?: "outline" | "ghost";
  /** Accessible name. The pressed state says whether dark mode is on. */
  label?: string;
}

const morph: Transition = { type: "spring", bounce: 0.1, duration: 0.5 };

const sizes = {
  sm: "size-8 [&_svg]:size-4",
  default: "size-9 [&_svg]:size-[18px]",
  lg: "size-11 [&_svg]:size-[22px]",
} as const;

const variants = {
  outline: "border border-current/15 bg-current/[0.04] hover:bg-current/[0.08]",
  ghost: "hover:bg-current/[0.08]",
} as const;

// Ray endpoints, precomputed so server and client markup are identical.
const rays = [
  [12, 3.2, 12, 1.4],
  [18.22, 5.78, 19.5, 4.5],
  [20.8, 12, 22.6, 12],
  [18.22, 18.22, 19.5, 19.5],
  [12, 20.8, 12, 22.6],
  [5.78, 18.22, 4.5, 19.5],
  [3.2, 12, 1.4, 12],
  [5.78, 5.78, 4.5, 4.5],
] as const;

/** One SVG that morphs a sun into a crescent moon with two twinkling stars. */
function SunMoonGlyph({ dark }: { dark: boolean }) {
  const maskId = `theme-toggle-${React.useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <motion.svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      initial={false}
      animate={{ rotate: dark ? 40 : 90 }}
      transition={morph}
    >
      <mask id={maskId}>
        <rect width="24" height="24" fill="white" />
        <motion.circle
          r="6.5"
          fill="black"
          initial={false}
          animate={dark ? { cx: 16.5, cy: 7.5 } : { cx: 27, cy: -3 }}
          transition={morph}
        />
      </mask>
      <motion.circle
        cx="12"
        cy="12"
        fill="currentColor"
        mask={`url(#${maskId})`}
        initial={false}
        animate={{ r: dark ? 8.5 : 5 }}
        transition={morph}
      />
      <motion.g
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        initial={false}
        animate={dark ? { opacity: 0, scale: 0.5 } : { opacity: 1, scale: 1 }}
        transition={morph}
      >
        {rays.map(([x1, y1, x2, y2]) => (
          <line key={`${x1}-${y1}`} x1={x1} y1={y1} x2={x2} y2={y2} />
        ))}
      </motion.g>
      {/* Two stars twinkle in beside the moon. */}
      <motion.g
        fill="currentColor"
        initial={false}
        animate={dark ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
        transition={{ ...morph, delay: dark ? 0.15 : 0 }}
      >
        <path d="M19 2.6l.55 1.85L21.4 5l-1.85.55L19 7.4l-.55-1.85L16.6 5l1.85-.55z" />
        <circle cx="21.2" cy="9.4" r="0.9" />
      </motion.g>
    </motion.svg>
  );
}

function resolveTarget(target: ThemeTarget | undefined): HTMLElement | null {
  if (typeof document === "undefined") return null;
  if (target === undefined) return document.documentElement;
  if (target === null) return null;
  if (typeof target === "function") return target();
  if (target instanceof HTMLElement) return target;
  return target.current;
}

function applyTheme(el: HTMLElement | null, theme: Theme, darkClass: string) {
  if (!el) return;
  el.classList.toggle(darkClass, theme === "dark");
  el.style.colorScheme = theme;
}

/**
 * A light/dark toggle whose icon morphs between a sun and a moon. The new
 * theme is revealed with a circle that grows out of the button, using the
 * View Transitions API; browsers without it (and reduced-motion users) get an
 * instant switch.
 *
 * It is not tied to a theme library: control it with `theme` /
 * `onThemeChange`, and it toggles a `dark` class on any target element
 * (the `<html>` element by default). Only the target is revealed, so the
 * effect can be scoped to a single panel.
 */
export function ThemeToggle({
  theme: themeProp,
  defaultTheme = "dark",
  onThemeChange,
  target,
  applyClass = true,
  darkClass = "dark",
  transition = "circle",
  duration = 600,
  easing = "cubic-bezier(0.65, 0, 0.35, 1)",
  size = "default",
  variant = "outline",
  label = "Dark mode",
  className,
  ...props
}: ThemeToggleProps) {
  const reduceMotion = useReducedMotion();
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const busy = React.useRef(false);
  const [uncontrolled, setUncontrolled] = React.useState<Theme>(defaultTheme);
  const theme = themeProp ?? uncontrolled;
  const dark = theme === "dark";

  // Latest values for the click handler, so the target can be a ref attached after mount.
  const latest = React.useRef({ target, applyClass, darkClass });
  React.useLayoutEffect(() => {
    latest.current = { target, applyClass, darkClass };
  });

  // Keep the target in sync with the theme (mount and external changes).
  React.useEffect(() => {
    if (applyClass) applyTheme(resolveTarget(target), theme, darkClass);
  }, [theme, applyClass, darkClass, target]);

  const commit = (next: Theme) => {
    // flushSync renders the new theme before the browser takes the "after" snapshot.
    flushSync(() => {
      if (themeProp === undefined) setUncontrolled(next);
      onThemeChange?.(next);
    });
    const { target: t, applyClass: apply, darkClass: cls } = latest.current;
    if (apply) applyTheme(resolveTarget(t), next, cls);
  };

  const toggle = () => {
    if (busy.current) return;
    const next: Theme = dark ? "light" : "dark";
    const el = resolveTarget(latest.current.target) ?? document.documentElement;
    const button = buttonRef.current;

    if (
      transition === "none" ||
      reduceMotion ||
      typeof document.startViewTransition !== "function" ||
      !button
    ) {
      commit(next);
      return;
    }

    // The root has a built-in name; any other target gets a temporary unique one.
    const isRoot = el === document.documentElement;
    const name = isRoot ? "root" : `theme-reveal-${Math.random().toString(36).slice(2, 9)}`;
    const style = document.createElement("style");
    style.textContent = `::view-transition-old(${name}),::view-transition-new(${name}){animation:none;mix-blend-mode:normal}::view-transition-group(${name}){animation:none}`;
    document.head.appendChild(style);
    if (!isRoot) el.style.setProperty("view-transition-name", name);

    // Circle center in the target's coordinates; radius reaches its farthest corner.
    const b = button.getBoundingClientRect();
    const t = isRoot
      ? { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight }
      : el.getBoundingClientRect();
    const x = b.left + b.width / 2 - t.left;
    const y = b.top + b.height / 2 - t.top;
    const r = Math.hypot(Math.max(x, t.width - x), Math.max(y, t.height - y));

    busy.current = true;
    const vt = document.startViewTransition(() => commit(next));
    vt.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
          { duration, easing, pseudoElement: `::view-transition-new(${name})` }
        );
      })
      .catch(() => {});
    const cleanup = () => {
      busy.current = false;
      style.remove();
      if (!isRoot) el.style.removeProperty("view-transition-name");
    };
    vt.finished.then(cleanup, cleanup);
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      aria-label={label}
      aria-pressed={dark}
      data-slot="theme-toggle"
      data-theme={theme}
      onClick={toggle}
      className={cn(
        "relative inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full outline-none select-none",
        "transition-[background-color,transform,box-shadow] duration-150 active:scale-95 motion-reduce:active:scale-100",
        "focus-visible:ring-[3px] focus-visible:ring-ring/50",
        sizes[size],
        variants[variant],
        className
      )}
      {...props}
    >
      <SunMoonGlyph dark={dark} />
    </button>
  );
}
