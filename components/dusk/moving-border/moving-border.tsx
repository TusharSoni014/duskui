"use client";

import * as React from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
} from "motion/react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface MovingBorderProps extends Omit<React.ComponentProps<"div">, "color"> {
  /** Any CSS color for the travelling light. Defaults to the theme primary. */
  color?: string;
  /** Seconds for one lap around the border. */
  speed?: number;
  /** Corner radius in px. Large values (e.g. 9999) give a pill. */
  radius?: number;
  /** Border width in px: how much of the light shows around the content. */
  borderWidth?: number;
  /** Diameter of the beam in px. */
  beamSize?: number;
  /** Run the beam counter-clockwise. */
  reverse?: boolean;
  /** Classes for the inner content wrapper, which paints its own background. */
  contentClassName?: string;
}

/**
 * Point at fraction `t` (0–1) of the way around a rounded rectangle, walking
 * clockwise from the top-left corner. Moves at constant speed on every side.
 */
function pointOnRoundedRect(t: number, w: number, h: number, r: number) {
  const rad = Math.max(0, Math.min(r, w / 2, h / 2));
  const sx = w - 2 * rad;
  const sy = h - 2 * rad;
  const arc = (Math.PI / 2) * rad;
  const segments = [sx, arc, sy, arc, sx, arc, sy, arc];
  const total = segments.reduce((a, b) => a + b, 0) || 1;
  let d = (((t % 1) + 1) % 1) * total;

  for (let i = 0; i < segments.length; i++) {
    const len = segments[i];
    if (d > len && i < segments.length - 1) {
      d -= len;
      continue;
    }
    const k = len === 0 ? 0 : d / len;
    const corner = (cx: number, cy: number, start: number) => {
      const a = start + k * (Math.PI / 2);
      return { x: cx + rad * Math.cos(a), y: cy + rad * Math.sin(a) };
    };
    switch (i) {
      case 0: return { x: rad + k * sx, y: 0 };
      case 1: return corner(w - rad, rad, -Math.PI / 2);
      case 2: return { x: w, y: rad + k * sy };
      case 3: return corner(w - rad, h - rad, 0);
      case 4: return { x: w - rad - k * sx, y: h };
      case 5: return corner(rad, h - rad, Math.PI / 2);
      case 6: return { x: 0, y: h - rad - k * sy };
      default: return corner(rad, rad, Math.PI);
    }
  }
  return { x: 0, y: 0 };
}

/** Wraps any element in a thin border with a soft beam that travels around its rounded edge. */
export function MovingBorder({
  color = "var(--color-primary)",
  speed = 6,
  radius = 12,
  borderWidth = 1,
  beamSize = 64,
  reverse = false,
  className,
  contentClassName,
  style,
  children,
  ...props
}: MovingBorderProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const size = React.useRef({ w: 0, h: 0 });
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref);

  const progress = useMotionValue(0);
  // Start off-canvas so nothing flashes before the first measurement.
  const x = useMotionValue(-beamSize * 2);
  const y = useMotionValue(-beamSize * 2);

  const place = React.useCallback(() => {
    const { w, h } = size.current;
    if (!w || !h) return;
    // Walk the centre line of the border so the beam sits on it at every corner.
    const inset = borderWidth / 2;
    const p = pointOnRoundedRect(
      reverse ? -progress.get() : progress.get(),
      w - borderWidth,
      h - borderWidth,
      Math.max(0, radius - inset)
    );
    x.set(p.x + inset - beamSize / 2);
    y.set(p.y + inset - beamSize / 2);
  }, [beamSize, borderWidth, progress, radius, reverse, x, y]);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      size.current = { w: el.offsetWidth, h: el.offsetHeight };
      place();
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [place]);

  React.useEffect(() => progress.on("change", place), [place, progress]);

  React.useEffect(() => {
    if (reduceMotion || !inView) return;
    const controls = animate(progress, progress.get() + 1, {
      duration: Math.max(0.5, speed),
      ease: "linear",
      repeat: Infinity,
    });
    return () => controls.stop();
  }, [inView, progress, reduceMotion, speed]);

  return (
    <div
      ref={ref}
      data-slot="moving-border"
      className={cn(
        "relative isolate overflow-hidden",
        // Reduced motion: no beam, a steadily lit edge instead.
        "motion-reduce:[&>[data-slot=moving-border-beam]]:hidden motion-reduce:[&>[data-slot=moving-border-track]]:bg-(--mb)/45",
        className
      )}
      style={{ "--mb": color, borderRadius: radius, padding: borderWidth, ...style } as React.CSSProperties}
      {...props}
    >
      {/* Faint resting track. */}
      <span
        aria-hidden
        data-slot="moving-border-track"
        className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] bg-white/10"
      />
      <motion.span
        aria-hidden
        data-slot="moving-border-beam"
        className="pointer-events-none absolute top-0 left-0 -z-10 rounded-full"
        style={{
          x,
          y,
          width: beamSize,
          height: beamSize,
          background: "radial-gradient(closest-side, color-mix(in oklab, var(--mb) 85%, transparent) 0%, color-mix(in oklab, var(--mb) 35%, transparent) 55%, transparent 100%)",
        }}
      />
      <div
        data-slot="moving-border-content"
        className={cn("relative h-full bg-card", contentClassName)}
        style={{ borderRadius: Math.max(0, radius - borderWidth) }}
      >
        {children}
      </div>
    </div>
  );
}

export interface MovingBorderButtonProps extends Omit<ButtonProps, "asChild" | "color"> {
  /** Any CSS color for the travelling light. Defaults to the theme primary. */
  color?: string;
  /** Seconds for one lap around the border. */
  speed?: number;
  /** Corner radius in px. Defaults to a pill. */
  radius?: number;
  /** Border width in px. */
  borderWidth?: number;
  /** Diameter of the beam in px. */
  beamSize?: number;
  /** Classes for the outer border wrapper. `className` goes to the button itself. */
  containerClassName?: string;
}

/** Ready-made DuskUI Button with a soft beam circling its border. */
export function MovingBorderButton({
  color,
  speed = 5,
  radius = 9999,
  borderWidth = 1,
  beamSize = 48,
  containerClassName,
  className,
  style,
  variant = "ghost",
  ...props
}: MovingBorderButtonProps) {
  return (
    <MovingBorder
      color={color}
      speed={speed}
      radius={radius}
      borderWidth={borderWidth}
      beamSize={beamSize}
      // The wrapper clips its overflow, so it draws the keyboard focus ring itself.
      className={cn(
        "inline-flex align-middle has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/50",
        containerClassName
      )}
      contentClassName="bg-transparent"
    >
      <Button
        variant={variant}
        className={cn(
          "focus-visible:ring-0",
          // Ghost (the default) gets an opaque fill so the beam only shows on the edge.
          variant === "ghost" &&
            "bg-background text-foreground hover:bg-[color-mix(in_oklab,white_5%,var(--color-background))] dark:hover:bg-[color-mix(in_oklab,white_5%,var(--color-background))]",
          className
        )}
        style={{ borderRadius: Math.max(0, radius - borderWidth), ...style }}
        {...props}
      />
    </MovingBorder>
  );
}
