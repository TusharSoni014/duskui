"use client";

import * as React from "react";
import { animate, useReducedMotion, type AnimationPlaybackControls } from "motion/react";

import { cn } from "@/lib/utils";

export interface AuroraBackgroundProps extends React.ComponentProps<"div"> {
  /** Colors of the light bands, any CSS color. One band is drawn per color (up to 6). */
  colors?: string[];
  /** Overall brightness, from 0 (off) to 1 (vivid). */
  intensity?: number;
  /** Speed multiplier. `1` drifts slowly; lower is calmer. */
  speed?: number;
  /** Softness of the bands in px. */
  blur?: number;
  /** Fade the aurora out toward the bottom and sides. */
  fade?: boolean;
}

const DEFAULT_COLORS = ["var(--color-primary)", "#38bdf8", "#6366f1"];

/**
 * Hand-placed band layouts, in percent of the container. Bands sit near the
 * top and overlap, so any palette blends into a single sky.
 */
const LAYOUTS = [
  { left: -15, top: -30, width: 75, height: 70, rotate: -14, drift: [8, 5, -4] },
  { left: 35, top: -35, width: 80, height: 65, rotate: 10, drift: [-7, 6, 4] },
  { left: 5, top: -5, width: 65, height: 50, rotate: -6, drift: [6, -5, 3] },
  { left: 45, top: -10, width: 70, height: 55, rotate: 16, drift: [-5, 7, -3] },
  { left: 15, top: -40, width: 85, height: 60, rotate: -20, drift: [4, 8, -5] },
  { left: -5, top: 5, width: 60, height: 45, rotate: 4, drift: [-6, -4, 4] },
];

/**
 * A soft, slowly shifting aurora: layered, blurred gradient bands that drift,
 * stretch and sway like northern lights. Fills its nearest positioned parent.
 *
 * Only transforms are animated, so every band stays on its own GPU layer.
 * Animation pauses off-screen and in hidden tabs, and reduced motion keeps a
 * still frame of the same sky.
 */
export function AuroraBackground({
  colors = DEFAULT_COLORS,
  intensity = 0.35,
  speed = 1,
  blur = 64,
  fade = true,
  className,
  style,
  ...props
}: AuroraBackgroundProps) {
  const reduceMotion = useReducedMotion();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const bandRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const palette = (colors.length ? colors : DEFAULT_COLORS).slice(0, LAYOUTS.length);
  const bandCount = palette.length;

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root || reduceMotion) return;
    const rate = Math.max(speed, 0.05);
    const controls: AnimationPlaybackControls[] = [];

    for (let i = 0; i < bandCount; i++) {
      const el = bandRefs.current[i];
      if (!el) continue;
      const { rotate, drift } = LAYOUTS[i];
      const [dx, dy, dr] = drift;
      controls.push(
        animate(
          el,
          {
            x: ["0%", `${dx}%`, `${-dx * 0.6}%`, "0%"],
            y: ["0%", `${dy}%`, `${-dy * 0.5}%`, "0%"],
            rotate: [rotate, rotate + dr, rotate - dr * 0.5, rotate],
            scaleX: [1, 1.12, 0.95, 1],
            scaleY: [1, 0.92, 1.06, 1],
          },
          { duration: (24 + i * 6) / rate, ease: "easeInOut", repeat: Infinity }
        )
      );
    }

    let inView = true;
    const sync = () => {
      const play = inView && !document.hidden;
      for (const c of controls) {
        if (play) c.play();
        else c.pause();
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    observer.observe(root);
    document.addEventListener("visibilitychange", sync);
    return () => {
      for (const c of controls) c.stop();
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [bandCount, speed, reduceMotion]);

  return (
    <div
      ref={rootRef}
      aria-hidden
      data-slot="aurora-background"
      className={cn(
        "pointer-events-none absolute inset-0 isolate overflow-hidden",
        fade && "[mask-image:radial-gradient(ellipse_90%_80%_at_50%_0%,#000_35%,transparent_100%)]",
        className
      )}
      style={style}
      {...props}
    >
      <div className="absolute inset-0" style={{ opacity: Math.min(Math.max(intensity, 0), 1) }}>
        {palette.map((color, i) => {
          const { left, top, width, height, rotate } = LAYOUTS[i];
          return (
            <div
              key={i}
              ref={(el) => {
                bandRefs.current[i] = el;
              }}
              className="absolute rounded-[50%] mix-blend-screen will-change-transform"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                width: `${width}%`,
                height: `${height}%`,
                transform: `rotate(${rotate}deg)`,
                background: `radial-gradient(50% 50% at 50% 50%, ${color} 0%, color-mix(in oklab, ${color} 35%, transparent) 40%, transparent 100%)`,
                filter: blur > 0 ? `blur(${blur}px)` : undefined,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
