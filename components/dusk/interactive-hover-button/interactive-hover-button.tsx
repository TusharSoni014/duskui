"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface InteractiveHoverButtonProps extends Omit<ButtonProps, "variant" | "asChild"> {
  /** Any CSS color for the dot and the fill. Defaults to the theme primary. */
  color?: string;
  /** Text color on top of the fill. Defaults to the primary foreground. */
  fillForeground?: string;
  /** Label shown in the hover state. Defaults to `children`. */
  hoverLabel?: React.ReactNode;
  /** Icon that slides in with the hover label. */
  icon?: React.ReactNode;
}

const DOT = 8;

/** Pill button whose dot grows to fill it on hover while an arrow and label slide in. */
export function InteractiveHoverButton({
  color = "var(--color-primary)",
  fillForeground = "var(--color-primary-foreground)",
  hoverLabel,
  icon = <ArrowRight />,
  className,
  style,
  children,
  ...props
}: InteractiveHoverButtonProps) {
  const dot = React.useRef<HTMLSpanElement>(null);

  // Scale the dot just enough for its circle to cover the whole button.
  React.useEffect(() => {
    const el = dot.current;
    const button = el?.closest<HTMLElement>("[data-slot=button]");
    if (!el || !button) return;
    const fit = () => {
      const cx = el.offsetLeft + DOT / 2;
      const reach = Math.hypot(Math.max(cx, button.offsetWidth - cx), button.offsetHeight / 2);
      button.style.setProperty("--ihb-scale", String(Math.ceil((reach * 2) / DOT) + 1));
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(button);
    return () => observer.disconnect();
  }, []);

  const motionSafe = "transition-[translate,opacity] duration-250 ease-out motion-reduce:transition-opacity";

  return (
    <Button
      variant="outline"
      className={cn(
        "group/ihb isolate overflow-hidden rounded-full pr-5 pl-4 [--ihb-scale:48]",
        "dark:bg-transparent dark:hover:bg-transparent hover:bg-transparent",
        className
      )}
      style={{ "--ihb": color, "--ihb-fg": fillForeground, ...style } as React.CSSProperties}
      {...props}
    >
      <span
        ref={dot}
        aria-hidden
        data-slot="ihb-dot"
        className={cn(
          "pointer-events-none absolute top-1/2 left-4 -z-10 -translate-y-1/2 rounded-full bg-(--ihb)",
          "transition-[scale] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
          "group-hover/ihb:scale-(--ihb-scale) group-focus-visible/ihb:scale-(--ihb-scale)"
        )}
        style={{ width: DOT, height: DOT }}
      />
      {/* Both labels share one grid cell, so the width fits the wider one and never shifts. */}
      <span className="relative grid items-center">
        <span
          className={cn(
            "col-start-1 row-start-1 inline-flex items-center gap-2 pl-4",
            "group-hover/ihb:opacity-0 group-focus-visible/ihb:opacity-0",
            "motion-safe:group-hover/ihb:translate-x-10 motion-safe:group-focus-visible/ihb:translate-x-10",
            motionSafe
          )}
        >
          {children}
        </span>
        <span
          aria-hidden
          className={cn(
            "col-start-1 row-start-1 inline-flex items-center justify-center gap-2 text-(--ihb-fg) opacity-0",
            "group-hover/ihb:opacity-100 group-focus-visible/ihb:opacity-100",
            "motion-safe:-translate-x-10 motion-safe:group-hover/ihb:translate-x-0 motion-safe:group-focus-visible/ihb:translate-x-0",
            motionSafe
          )}
        >
          {hoverLabel ?? children}
          {icon}
        </span>
      </span>
    </Button>
  );
}
