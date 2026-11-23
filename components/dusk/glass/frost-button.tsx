"use client";

import * as React from "react";
import { motion, useAnimate, useReducedMotion } from "motion/react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const tones = {
  clear: [
    "border-white/25 text-white",
    "bg-zinc-900/85 supports-[backdrop-filter]:bg-white/10",
    "hover:bg-zinc-800/90 supports-[backdrop-filter]:hover:bg-white/[0.16]",
  ],
  dark: [
    "border-white/12 text-white",
    "bg-zinc-950/90 supports-[backdrop-filter]:bg-black/30",
    "hover:bg-zinc-900/90 supports-[backdrop-filter]:hover:bg-black/40",
  ],
  primary: [
    "border-primary/35 text-white",
    "bg-[color-mix(in_oklab,var(--primary)_30%,var(--background))] supports-[backdrop-filter]:bg-primary/20",
    "hover:bg-[color-mix(in_oklab,var(--primary)_38%,var(--background))] supports-[backdrop-filter]:hover:bg-primary/[0.28]",
  ],
} as const;

type Ripple = { id: number; x: number; y: number; size: number };

export interface FrostButtonProps extends Omit<ButtonProps, "variant"> {
  /** Glass color. `clear` is white frost, `dark` smoked glass, `primary` a mint-tinted pane. */
  tone?: keyof typeof tones;
  /** Press and hover effects: a faint light sweep on hover/focus, a ripple on press (default), or both. */
  effect?: "sweep" | "ripple" | "both" | "none";
}

/**
 * A frosted-glass button built on the DuskUI Button, so `loading`,
 * `loadingText`, sizes and focus styles all keep working.
 *
 * A ripple spreads from the press point (from the center for keyboard
 * presses); optionally a faint band of light sweeps across on hover / focus. With reduced
 * motion the sweep is skipped and the ripple becomes a soft flash.
 * Effects are not rendered with `asChild`, since Slot needs a single child.
 */
export function FrostButton({
  tone = "clear",
  effect = "ripple",
  size,
  asChild,
  loading,
  disabled,
  className,
  children,
  onPointerEnter,
  onPointerDown,
  onFocus,
  onClick,
  ...props
}: FrostButtonProps) {
  const reduceMotion = useReducedMotion();
  const [sweepScope, animate] = useAnimate<HTMLSpanElement>();
  const [ripples, setRipples] = React.useState<Ripple[]>([]);
  const nextId = React.useRef(0);

  const sweeps = effect === "sweep" || effect === "both";
  const ripplesOn = effect === "ripple" || effect === "both";
  const inactive = loading || disabled;

  const sweep = () => {
    if (!sweeps || reduceMotion || inactive || !sweepScope.current) return;
    animate(
      sweepScope.current,
      { x: ["-120%", "120%"] },
      { duration: 0.75, ease: [0.4, 0, 0.2, 1] }
    );
  };

  const addRipple = (target: HTMLElement, clientX?: number, clientY?: number) => {
    if (!ripplesOn || inactive) return;
    const rect = target.getBoundingClientRect();
    const x = clientX === undefined ? rect.width / 2 : clientX - rect.left;
    const y = clientY === undefined ? rect.height / 2 : clientY - rect.top;
    // Big enough to cover the farthest corner from the press point.
    const size =
      2 * Math.hypot(Math.max(x, rect.width - x), Math.max(y, rect.height - y));
    const id = nextId.current++;
    setRipples((list) => [...list, { id, x, y, size }]);
  };

  const effects =
    !asChild && effect !== "none" ? (
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
      >
        {sweeps && (
          <span
            ref={sweepScope}
            className="absolute inset-y-0 left-0 w-full bg-[linear-gradient(105deg,transparent_30%,rgb(255_255_255/0.1)_45%,rgb(255_255_255/0.16)_50%,rgb(255_255_255/0.1)_55%,transparent_70%)]"
            style={{ transform: "translateX(-120%)" }}
          />
        )}
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            className="absolute rounded-full bg-white/20"
            style={{ left: r.x - r.size / 2, top: r.y - r.size / 2, width: r.size, height: r.size }}
            initial={{ scale: reduceMotion ? 1 : 0, opacity: reduceMotion ? 0.2 : 0.35 }}
            animate={{ scale: 1, opacity: 0 }}
            transition={{
              scale: { duration: 0.55, ease: [0.2, 0.7, 0.3, 1] },
              opacity: { duration: reduceMotion ? 0.35 : 0.7, ease: "easeOut" },
            }}
            onAnimationComplete={() =>
              setRipples((list) => list.filter((item) => item.id !== r.id))
            }
          />
        ))}
      </span>
    ) : null;

  return (
    <Button
      // No base variant: the tone classes below provide the whole fill.
      variant={null}
      data-variant="frost"
      size={size}
      asChild={asChild}
      loading={loading}
      disabled={disabled}
      data-tone={tone}
      className={cn(
        "overflow-hidden border font-medium [text-shadow:0_1px_2px_rgb(0_0_0/0.35)]",
        "supports-[backdrop-filter]:backdrop-blur-md supports-[backdrop-filter]:backdrop-saturate-150",
        "shadow-[inset_0_1px_0_rgb(255_255_255/0.12),0_1px_2px_rgb(0_0_0/0.3)]",
        tones[tone],
        className
      )}
      onPointerEnter={(event) => {
        onPointerEnter?.(event);
        if (event.pointerType !== "touch") sweep();
      }}
      onFocus={(event) => {
        onFocus?.(event);
        if (event.currentTarget.matches(":focus-visible")) sweep();
      }}
      onPointerDown={(event) => {
        onPointerDown?.(event);
        addRipple(event.currentTarget, event.clientX, event.clientY);
      }}
      onClick={(event) => {
        // detail === 0 means the click came from the keyboard (Enter / Space).
        if (event.detail === 0) addRipple(event.currentTarget);
        onClick?.(event);
      }}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          {effects}
          {children}
        </>
      )}
    </Button>
  );
}
