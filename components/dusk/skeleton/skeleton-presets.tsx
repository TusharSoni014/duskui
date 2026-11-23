import * as React from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/*
 * Ready-made placeholders built from the DuskUI Skeleton. Each one is a
 * Server Component, uses fixed (not random) widths so server and client
 * HTML match, and staggers its shimmer so the light rolls through the
 * layout as a wave instead of flashing everything at once.
 *
 * They are hidden from screen readers by default. Pass `label` to turn the
 * preset into a polite role="status" region that announces it, or set
 * `aria-busy` on the region you are loading instead.
 */

// Static class strings so Tailwind can see them. Delays the shimmer of the nth block.
const wave = [
  "",
  "*:data-[slot=skeleton-shimmer]:[animation-delay:90ms]",
  "*:data-[slot=skeleton-shimmer]:[animation-delay:180ms]",
  "*:data-[slot=skeleton-shimmer]:[animation-delay:270ms]",
  "*:data-[slot=skeleton-shimmer]:[animation-delay:360ms]",
  "*:data-[slot=skeleton-shimmer]:[animation-delay:450ms]",
  "*:data-[slot=skeleton-shimmer]:[animation-delay:540ms]",
  "*:data-[slot=skeleton-shimmer]:[animation-delay:630ms]",
];
const waveAt = (index: number) => wave[Math.min(index, wave.length - 1)];

// A natural-looking rhythm of line lengths, repeated.
const lineWidths = ["w-full", "w-11/12", "w-full", "w-4/5", "w-10/12", "w-full"];

interface PresetProps extends React.ComponentProps<"div"> {
  /** Announce this placeholder to screen readers, e.g. "Loading comments". */
  label?: string;
}

function PresetRoot({ label, className, children, ...props }: PresetProps) {
  return (
    <div
      role={label ? "status" : undefined}
      aria-hidden={label ? undefined : true}
      className={className}
      {...props}
    >
      {label && <span className="sr-only">{label}</span>}
      {children}
    </div>
  );
}

export interface SkeletonTextProps extends PresetProps {
  /** Number of lines. */
  lines?: number;
  /** Width of the last line, as a Tailwind class. */
  lastLineClassName?: string;
  /** Classes for every line, e.g. a different height. */
  lineClassName?: string;
}

/** A paragraph of text lines with a shorter last line. */
export function SkeletonText({
  lines = 3,
  lastLineClassName = "w-3/5",
  lineClassName,
  className,
  ...props
}: SkeletonTextProps) {
  return (
    <PresetRoot className={cn("grid gap-2.5", className)} {...props}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-3",
            i === lines - 1 && lines > 1 ? lastLineClassName : lineWidths[i % lineWidths.length],
            waveAt(i),
            lineClassName
          )}
        />
      ))}
    </PresetRoot>
  );
}

export interface SkeletonAvatarRowProps extends PresetProps {
  /** Avatar diameter, as a Tailwind size class. */
  avatarClassName?: string;
  /** Square avatar with rounded corners instead of a circle. */
  square?: boolean;
  /** Show a trailing button placeholder. */
  action?: boolean;
}

/** An avatar with a name and a subtitle, like a list item or comment header. */
export function SkeletonAvatarRow({
  avatarClassName = "size-10",
  square = false,
  action = false,
  className,
  ...props
}: SkeletonAvatarRowProps) {
  return (
    <PresetRoot className={cn("flex items-center gap-3", className)} {...props}>
      <Skeleton className={cn("shrink-0", square ? "rounded-lg" : "rounded-full", avatarClassName)} />
      <div className="grid flex-1 gap-2">
        <Skeleton className={cn("h-3.5 w-2/5", waveAt(1))} />
        <Skeleton className={cn("h-3 w-1/4", waveAt(2))} />
      </div>
      {action && <Skeleton className={cn("h-8 w-20 shrink-0", waveAt(3))} />}
    </PresetRoot>
  );
}

export interface SkeletonCardProps extends PresetProps {
  /** Show an image area on top. */
  media?: boolean;
  /** Number of description lines. */
  lines?: number;
  /** Show the footer row (avatar + button). */
  footer?: boolean;
}

/** A content card: optional media, a title, a few lines and a footer. */
export function SkeletonCard({ media = true, lines = 2, footer = true, className, ...props }: SkeletonCardProps) {
  return (
    <PresetRoot
      className={cn("grid gap-4 overflow-hidden rounded-xl border bg-card p-4", className)}
      {...props}
    >
      {media && <Skeleton className="aspect-video w-full rounded-lg" />}
      <div className="grid gap-2.5">
        <Skeleton className={cn("h-4 w-3/5", waveAt(1))} />
        {Array.from({ length: lines }, (_, i) => (
          <Skeleton
            key={i}
            className={cn("h-3", i === lines - 1 && lines > 1 ? "w-4/5" : "w-full", waveAt(i + 2))}
          />
        ))}
      </div>
      {footer && (
        <div className="flex items-center gap-2 pt-1">
          <Skeleton className={cn("size-7 rounded-full", waveAt(lines + 2))} />
          <Skeleton className={cn("h-3 w-24", waveAt(lines + 2))} />
          <Skeleton className={cn("ml-auto h-8 w-20", waveAt(lines + 3))} />
        </div>
      )}
    </PresetRoot>
  );
}

export interface SkeletonTableProps extends PresetProps {
  rows?: number;
  columns?: number;
  /** Show the header row. */
  header?: boolean;
}

// Column widths cycle so the table doesn't look like a grid of identical bars.
const cellWidths = ["w-3/4", "w-1/2", "w-2/3", "w-2/5", "w-1/3"];

/** A data table: header row plus body rows, with a leading avatar column. */
export function SkeletonTable({ rows = 5, columns = 4, header = true, className, ...props }: SkeletonTableProps) {
  const grid = { gridTemplateColumns: `minmax(0,1.6fr) repeat(${Math.max(columns - 1, 0)}, minmax(0,1fr))` };

  return (
    <PresetRoot className={cn("overflow-hidden rounded-xl border", className)} {...props}>
      {header && (
        <div className="grid items-center gap-4 border-b bg-muted/40 px-4 py-3" style={grid}>
          {Array.from({ length: columns }, (_, c) => (
            <Skeleton key={c} animation="none" className={cn("h-2.5 bg-accent/50", c === 0 ? "w-16" : "w-12")} />
          ))}
        </div>
      )}
      <div className="divide-y">
        {Array.from({ length: rows }, (_, r) => (
          <div key={r} className="grid items-center gap-4 px-4 py-3" style={grid}>
            {Array.from({ length: columns }, (_, c) =>
              c === 0 ? (
                <div key={c} className="flex items-center gap-3">
                  <Skeleton className={cn("size-7 shrink-0 rounded-full", waveAt(r))} />
                  <Skeleton className={cn("h-3", cellWidths[r % cellWidths.length], waveAt(r))} />
                </div>
              ) : (
                <Skeleton key={c} className={cn("h-3", cellWidths[(r + c) % cellWidths.length], waveAt(r))} />
              )
            )}
          </div>
        ))}
      </div>
    </PresetRoot>
  );
}
