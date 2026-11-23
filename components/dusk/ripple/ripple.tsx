"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

export interface RippleProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** Diameter in px of the innermost ring, where each ring is born. */
  mainCircleSize?: number;
  /** Number of rings in the loop. `0` turns the loop off (useful with `interactive`). */
  numCircles?: number;
  /** Space between neighbouring rings in px (diameter). */
  circleGap?: number;
  /** Ring color. Any CSS color; defaults to a soft white. */
  color?: string;
  /** Seconds for one ring to travel from the center to the outside. */
  duration?: number;
  /** Spawn ripples where the pointer presses inside the parent element. */
  interactive?: boolean;
  /** Final diameter in px of a pointer ripple. */
  clickSize?: number;
}

const SVG_NS = "http://www.w3.org/2000/svg";
/** Most pointer ripples alive at once; the oldest is dropped beyond this. */
const MAX_CLICK_RIPPLES = 12;

/** Ring opacity over its life: a quick fade in, then a long fade out. */
const lifeOpacity = (p: number) => (p < 0.1 ? p / 0.1 : 1 - (p - 0.1) / 0.9);

/**
 * Concentric rings that expand from the center in a staggered, seamless loop, with optional ripples spawned wherever the pointer presses.
 *
 * Rings are SVG circles with non-scaling strokes, scaled on the compositor, so
 * lines stay crisp at every size. The rings render in their resting positions
 * on the server, so reduced motion simply keeps that still frame. Fills its
 * nearest positioned parent and never takes pointer events: presses are heard
 * on the parent. Pauses off-screen and in hidden tabs.
 */
export function Ripple({
  mainCircleSize = 140,
  numCircles = 4,
  circleGap = 80,
  color = "rgb(255 255 255)",
  duration = 8,
  interactive = false,
  clickSize = 280,
  className,
  style,
  ...props
}: RippleProps) {
  const reduceMotion = useReducedMotion();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const ringRefs = React.useRef<(SVGCircleElement | null)[]>([]);

  const count = Math.max(0, Math.round(numCircles));
  const start = Math.max(0, mainCircleSize);
  const maxSize = start + Math.max(count, 1) * Math.max(1, circleGap);
  const startScale = start / maxSize;
  const stroke = `color-mix(in oklab, ${color} 25%, transparent)`;
  const fill = `color-mix(in oklab, ${color} 2%, transparent)`;

  // Resting frame: rings evenly spread through their life, oldest outside.
  const rings = Array.from({ length: count }, (_, i) => {
    const p = (i + 0.5) / count;
    return { p, scale: startScale + (1 - startScale) * p, opacity: lifeOpacity(p) };
  });

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root || reduceMotion || count === 0) return;
    const total = Math.max(0.5, duration) * 1000;
    const animations: Animation[] = [];
    ringRefs.current.slice(0, count).forEach((el, i) => {
      if (!el) return;
      const animation = el.animate(
        [
          { offset: 0, transform: `scale(${startScale})`, opacity: 0 },
          { offset: 0.1, transform: `scale(${startScale + (1 - startScale) * 0.1})`, opacity: 1 },
          { offset: 1, transform: "scale(1)", opacity: 0 },
        ],
        { duration: total, iterations: Infinity, easing: "linear" }
      );
      // Start every ring at its resting point so the loop picks up without a jump.
      animation.currentTime = ((i + 0.5) / count) * total;
      animations.push(animation);
    });

    let inView = true;
    const sync = () => {
      for (const a of animations) {
        if (inView && !document.hidden) a.play();
        else a.pause();
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    observer.observe(root);
    document.addEventListener("visibilitychange", sync);
    return () => {
      for (const a of animations) a.cancel();
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [count, startScale, duration, reduceMotion]);

  React.useEffect(() => {
    const root = rootRef.current;
    const target = root?.parentElement;
    if (!root || !target || !interactive || reduceMotion) return;
    const live: SVGSVGElement[] = [];
    const diameter = Math.max(8, clickSize);

    const onPress = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      const rect = root.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const svg = document.createElementNS(SVG_NS, "svg");
      svg.setAttribute("width", String(diameter));
      svg.setAttribute("height", String(diameter));
      svg.setAttribute("viewBox", `0 0 ${diameter} ${diameter}`);
      Object.assign(svg.style, {
        position: "absolute",
        left: `${x - diameter / 2}px`,
        top: `${y - diameter / 2}px`,
        overflow: "visible",
      });

      let finished = 0;
      const waves = 2;
      for (let i = 0; i < waves; i++) {
        const circle = document.createElementNS(SVG_NS, "circle");
        circle.setAttribute("cx", String(diameter / 2));
        circle.setAttribute("cy", String(diameter / 2));
        circle.setAttribute("r", String(diameter / 2 - 1));
        circle.setAttribute("fill", i === 0 ? fill : "none");
        circle.setAttribute("stroke", stroke);
        circle.setAttribute("stroke-width", "1");
        circle.setAttribute("vector-effect", "non-scaling-stroke");
        Object.assign(circle.style, { transformBox: "fill-box", transformOrigin: "center", opacity: "0" });
        svg.appendChild(circle);
        const animation = circle.animate(
          [
            { transform: "scale(0.04)", opacity: 0.7 },
            { transform: "scale(1)", opacity: 0 },
          ],
          { duration: 900, delay: i * 140, easing: "cubic-bezier(0.2, 0.7, 0.3, 1)", fill: "backwards" }
        );
        animation.onfinish = () => {
          finished += 1;
          if (finished === waves) {
            svg.remove();
            const at = live.indexOf(svg);
            if (at >= 0) live.splice(at, 1);
          }
        };
      }

      root.appendChild(svg);
      live.push(svg);
      while (live.length > MAX_CLICK_RIPPLES) live.shift()?.remove();
    };

    target.addEventListener("pointerdown", onPress);
    return () => {
      target.removeEventListener("pointerdown", onPress);
      for (const svg of live) svg.remove();
    };
  }, [interactive, clickSize, stroke, fill, reduceMotion]);

  return (
    <div
      ref={rootRef}
      aria-hidden
      data-slot="ripple"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      style={style}
      {...props}
    >
      {count > 0 && (
        <svg
          width={maxSize}
          height={maxSize}
          viewBox={`0 0 ${maxSize} ${maxSize}`}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible"
        >
          {rings.map((ring, i) => (
            <circle
              key={i}
              ref={(el) => {
                ringRefs.current[i] = el;
              }}
              cx={maxSize / 2}
              cy={maxSize / 2}
              r={maxSize / 2 - 1}
              fill={fill}
              stroke={stroke}
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
              style={{
                transformBox: "fill-box",
                transformOrigin: "center",
                transform: `scale(${ring.scale.toFixed(4)})`,
                opacity: Number(ring.opacity.toFixed(3)),
              }}
            />
          ))}
        </svg>
      )}
    </div>
  );
}
