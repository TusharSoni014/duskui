"use client";

import * as React from "react";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
} from "motion/react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const RING =
  "p-px [mask-composite:exclude] [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)]";

export interface IceInputProps extends React.ComponentProps<"input"> {
  /** Glow color — any CSS color. Turns destructive automatically when `aria-invalid` is set. */
  color?: string;
  /** Leading icon, e.g. a lucide icon. Decorative: label the input itself. */
  icon?: React.ReactNode;
  /** Classes for the glass wrapper (width, radius…). */
  wrapperClassName?: string;
}

/**
 * A frosted-glass field built on the DuskUI Input. On focus, frost spreads
 * across the field from where you clicked (from the left edge for keyboard
 * focus) and a cool glow lights the border.
 *
 * The spread is a clip-path driven by motion values, so it never re-renders
 * and never changes the field's size. With reduced motion the frost appears
 * instantly. It's still a native <input>, so autofill and labels just work.
 */
export function IceInput({
  color = "oklch(0.86 0.11 215)",
  icon,
  wrapperClassName,
  className,
  style,
  onPointerDown,
  onFocus,
  onBlur,
  ...props
}: IceInputProps) {
  const reduceMotion = useReducedMotion();
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const pointerOrigin = React.useRef<{ x: number; y: number } | null>(null);

  const originX = useMotionValue(0);
  const originY = useMotionValue(0);
  const radius = useMotionValue(0);
  const clipPath = useMotionTemplate`circle(${radius}px at ${originX}px ${originY}px)`;

  const freeze = () => {
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = pointerOrigin.current?.x ?? 16;
    const y = pointerOrigin.current?.y ?? rect.height / 2;
    pointerOrigin.current = null;
    originX.jump(x);
    originY.jump(y);
    // Reach the farthest corner from the origin.
    const target = Math.hypot(Math.max(x, rect.width - x), Math.max(y, rect.height - y)) + 2;
    if (reduceMotion) radius.jump(target);
    else animate(radius, target, { duration: 0.65, ease: [0.22, 1, 0.36, 1] });
  };

  const thaw = () => {
    if (reduceMotion) radius.jump(0);
    else animate(radius, 0, { duration: 0.35, ease: [0.4, 0, 1, 1] });
  };

  const layer = "pointer-events-none absolute inset-0 -z-10 rounded-[inherit]";

  return (
    <div
      ref={wrapperRef}
      data-slot="ice-input"
      className={cn(
        "group/ice relative isolate w-full overflow-hidden rounded-lg border border-white/15",
        "[--ice:var(--ice-color)] has-aria-invalid:[--ice:var(--destructive)] has-aria-invalid:border-destructive/60",
        // Fallback first: an opaque field when backdrop-filter isn't supported.
        "bg-[color-mix(in_oklab,var(--background)_90%,transparent)]",
        "supports-[backdrop-filter]:bg-[color-mix(in_oklab,var(--background)_40%,rgb(255_255_255/0.06))] supports-[backdrop-filter]:backdrop-blur-md supports-[backdrop-filter]:backdrop-saturate-150",
        "shadow-[inset_0_1px_0_rgb(255_255_255/0.08)] transition-[border-color,box-shadow] duration-300 ease-out motion-reduce:transition-none",
        "hover:border-white/25",
        "has-[input:focus]:border-[color-mix(in_oklab,var(--ice)_55%,transparent)]",
        "has-[input:focus]:shadow-[inset_0_1px_0_rgb(255_255_255/0.12),0_0_0_3px_color-mix(in_oklab,var(--ice)_22%,transparent),0_0_28px_-4px_color-mix(in_oklab,var(--ice)_60%,transparent)]",
        "has-[input:disabled]:opacity-60",
        wrapperClassName
      )}
      style={{ "--ice-color": color, ...style } as React.CSSProperties}
    >
      {/* Frost: an icy wash plus a lit border, revealed by the expanding clip. */}
      <motion.span aria-hidden className={layer} style={{ clipPath }}>
        <span className="absolute inset-0 rounded-[inherit] bg-[linear-gradient(100deg,color-mix(in_oklab,var(--ice)_24%,transparent),color-mix(in_oklab,var(--ice)_7%,transparent)_55%,color-mix(in_oklab,var(--ice)_16%,transparent))]" />
        <span
          className={cn(
            "absolute inset-0 rounded-[inherit] bg-[linear-gradient(90deg,var(--ice),color-mix(in_oklab,var(--ice)_30%,transparent)_50%,var(--ice))] opacity-70",
            RING
          )}
        />
      </motion.span>

      {icon && (
        <span
          aria-hidden
          className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 text-white/55 transition-colors duration-300 group-has-[input:focus]/ice:text-(--ice) [&_svg:not([class*='size-'])]:size-4"
        >
          {icon}
        </span>
      )}

      <Input
        className={cn(
          "h-10 rounded-[inherit] border-0 bg-transparent text-white shadow-none placeholder:text-white/50",
          "hover:bg-transparent focus-visible:ring-0 dark:bg-transparent dark:hover:bg-transparent",
          icon && "pl-9",
          className
        )}
        onPointerDown={(event) => {
          onPointerDown?.(event);
          // Only a press that is about to focus the field sets the origin.
          if (document.activeElement === event.currentTarget) return;
          const rect = wrapperRef.current?.getBoundingClientRect();
          if (rect) {
            pointerOrigin.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
          }
        }}
        onFocus={(event) => {
          onFocus?.(event);
          freeze();
        }}
        onBlur={(event) => {
          onBlur?.(event);
          thaw();
        }}
        {...props}
      />
    </div>
  );
}
