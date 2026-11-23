import * as React from "react";

import { cn } from "@/lib/utils";

export interface ScanLineProps extends React.ComponentProps<"div"> {
  /** Draw horizontal scanlines. */
  lines?: boolean;
  /** Distance between scanlines, in px. */
  lineSpacing?: number;
  /** Darkness of each scanline, 0–1. */
  lineOpacity?: number;
  /** Show the slowly moving bright scan bar. */
  bar?: boolean;
  /** Seconds for the bar to travel from top to bottom. */
  barDuration?: number;
  /** Bar color. Any CSS color, including theme variables. */
  barColor?: string;
  /** Darken the edges like a CRT tube. */
  vignette?: boolean;
  /** Subtle, slow brightness flicker (well under 3 flashes per second). */
  flicker?: boolean;
  /** Fake screen curvature: rounded tube corners, inner shadow and glass glare. */
  curvature?: boolean;
  /** Classes for the overlay layer. */
  overlayClassName?: string;
}

const CSS = `
@keyframes dusk-scan-bar { from { transform: translateY(-60%) } to { transform: translateY(60%) } }
@keyframes dusk-scan-flicker {
  0%, 100% { opacity: 0.02 } 7% { opacity: 0.05 } 9% { opacity: 0.02 }
  46% { opacity: 0.02 } 48% { opacity: 0.045 } 52% { opacity: 0.02 }
}
.dusk-scan-bar { animation: dusk-scan-bar var(--dusk-scan-duration, 7s) linear infinite }
.dusk-scan-flicker { animation: dusk-scan-flicker 3.4s steps(1, end) infinite }
@media (prefers-reduced-motion: reduce) {
  .dusk-scan-bar { display: none }
  .dusk-scan-flicker { animation: none }
}
`;

/**
 * Wrap anything to give it a CRT monitor look: fine horizontal scanlines,
 * a bright scan bar that slowly rolls down, plus optional vignette, flicker
 * and fake curvature.
 *
 * The overlay is pure CSS (no JavaScript, works in Server Components), sits
 * above the content with `pointer-events: none` and is `aria-hidden`, so
 * links, text selection and screen readers keep working. Under reduced
 * motion the bar and flicker are turned off and only static effects remain.
 */
export function ScanLine({
  lines = true,
  lineSpacing = 3,
  lineOpacity = 0.35,
  bar = true,
  barDuration = 7,
  barColor = "var(--color-primary)",
  vignette = true,
  flicker = false,
  curvature = false,
  overlayClassName,
  className,
  style,
  children,
  ...props
}: ScanLineProps) {
  const spacing = Math.max(2, lineSpacing);
  const dark = `rgb(0 0 0 / ${Math.min(1, Math.max(0, lineOpacity))})`;

  return (
    <div
      data-slot="scan-line"
      className={cn("relative isolate overflow-hidden", curvature && "rounded-[2rem/1.5rem]", className)}
      style={style}
      {...props}
    >
      <style href="duskui-scan-line" precedence="duskui">
        {CSS}
      </style>

      {children}

      <div
        aria-hidden
        className={cn("pointer-events-none absolute inset-0 z-10 overflow-hidden", curvature && "rounded-[inherit]", overlayClassName)}
      >
        {lines && (
          <div
            className="absolute inset-0"
            style={{
              // A dark line plus a faint light one, so the lines show on dark and light content.
              backgroundImage: `repeating-linear-gradient(to bottom, rgb(255 255 255 / 0.025) 0 1px, transparent 1px ${spacing - 1}px, ${dark} ${spacing - 1}px ${spacing}px)`,
            }}
          />
        )}

        {bar && (
          <div
            className="dusk-scan-bar absolute inset-x-0 top-0 h-full mix-blend-screen will-change-transform"
            style={
              {
                "--dusk-scan-duration": `${barDuration}s`,
                backgroundImage: `linear-gradient(to bottom, transparent 38%, color-mix(in oklab, ${barColor} 6%, transparent) 46%, color-mix(in oklab, ${barColor} 16%, transparent) 49.6%, color-mix(in oklab, ${barColor} 28%, transparent) 50%, transparent 50.4%)`,
              } as React.CSSProperties
            }
          />
        )}

        {flicker && <div className="dusk-scan-flicker absolute inset-0 bg-white opacity-[0.02]" />}

        {vignette && (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgb(0_0_0/0.55)_100%)]" />
        )}

        {curvature && (
          <div className="absolute inset-0 rounded-[inherit] bg-[radial-gradient(ellipse_at_28%_18%,rgb(255_255_255/0.07),transparent_45%)] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.05),inset_0_0_70px_rgb(0_0_0/0.65)]" />
        )}
      </div>
    </div>
  );
}
