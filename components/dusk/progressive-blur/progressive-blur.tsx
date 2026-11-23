import * as React from "react";

import { cn } from "@/lib/utils";

type Edge = "top" | "bottom" | "left" | "right";

export interface ProgressiveBlurProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** Edge the blur builds toward. `both` blurs the top and the bottom. */
  position?: Edge | "both";
  /** Blur in px at the very edge. Each band inward halves it. */
  blurIntensity?: number;
  /** Depth of the blurred band, measured inward from the edge (any CSS length or px). */
  height?: number | string;
  /** Number of stacked bands. More bands give a smoother ramp at a small GPU cost. */
  layers?: number;
  /** Optional color that fades in toward the edge on top of the blur, e.g. `var(--background)`. */
  tint?: string;
}

const placement: Record<Edge, string> = {
  top: "inset-x-0 top-0",
  bottom: "inset-x-0 bottom-0",
  left: "inset-y-0 left-0",
  right: "inset-y-0 right-0",
};

function Band({
  edge,
  blurIntensity,
  size,
  layers,
  tint,
}: {
  edge: Edge;
  blurIntensity: number;
  size: string;
  layers: number;
  tint?: string;
}) {
  const vertical = edge === "top" || edge === "bottom";
  const n = Math.max(2, Math.round(layers));
  // Each band covers a window three segments wide that slides toward the edge;
  // windows overlap, so the blur ramps up smoothly instead of in visible steps.
  const segment = 100 / (n + 1);
  const bands = Array.from({ length: n }, (_, i) => {
    const p = (k: number) => `${Math.min(100, Math.max(0, k * segment)).toFixed(2)}%`;
    const last = i === n - 1;
    const stops = last
      ? `transparent ${p(i)}, black ${p(i + 1)}`
      : `transparent ${p(i)}, black ${p(i + 1)}, black ${p(i + 2)}, transparent ${p(i + 3)}`;
    const mask = `linear-gradient(to ${edge}, ${stops})`;
    const blur = `blur(${(blurIntensity / 2 ** (n - 1 - i)).toFixed(2)}px)`;
    return { mask, blur };
  });

  return (
    <div
      className={cn("absolute", placement[edge])}
      style={vertical ? { height: size } : { width: size }}
    >
      {bands.map(({ mask, blur }, i) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{
            backdropFilter: blur,
            WebkitBackdropFilter: blur,
            maskImage: mask,
            WebkitMaskImage: mask,
          }}
        />
      ))}
      {tint && (
        <div
          className="absolute inset-0"
          style={{ backgroundImage: `linear-gradient(to ${edge}, transparent, ${tint})` }}
        />
      )}
    </div>
  );
}

/**
 * Fades content into a smooth, progressive blur at the edge of a container:
 * a stack of `backdrop-filter` bands with overlapping gradient masks, each
 * stronger than the last, so the blur ramps up instead of stopping at a hard line.
 *
 * Place it inside a positioned parent that does not scroll (wrap your scroll
 * container) so it stays pinned to the edge. Pure CSS: no JavaScript, no
 * animation, renders in Server Components and never takes pointer events.
 * Without `backdrop-filter` support only the optional `tint` remains.
 */
export function ProgressiveBlur({
  position = "bottom",
  blurIntensity = 12,
  height = "30%",
  layers = 6,
  tint,
  className,
  ...props
}: ProgressiveBlurProps) {
  const size = typeof height === "number" ? `${height}px` : height;
  const edges: Edge[] = position === "both" ? ["top", "bottom"] : [position];

  return (
    <div
      aria-hidden
      data-slot="progressive-blur"
      className={cn("pointer-events-none absolute inset-0 z-10 overflow-hidden", className)}
      {...props}
    >
      {edges.map((edge) => (
        <Band key={edge} edge={edge} blurIntensity={blurIntensity} size={size} layers={layers} tint={tint} />
      ))}
    </div>
  );
}
