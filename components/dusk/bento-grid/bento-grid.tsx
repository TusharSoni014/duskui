"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";
import { motion, useMotionTemplate, useMotionValue } from "motion/react";

import { cn } from "@/lib/utils";

type Columns = 2 | 3 | 4;

const BentoContext = React.createContext<Columns>(3);

const gridColumns: Record<Columns, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

// Spans only kick in from `sm`, where the grid has 2+ columns.
const colSpans: Record<number, string> = {
  1: "",
  2: "sm:col-span-2",
  3: "sm:col-span-2 lg:col-span-3",
  4: "sm:col-span-2 lg:col-span-4",
};

const rowSpans: Record<number, string> = {
  1: "",
  2: "sm:row-span-2",
  3: "sm:row-span-3",
};

export interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Columns on large screens. Phones get one column, tablets two. */
  columns?: Columns;
}

/**
 * A responsive bento layout: one column on phones, two on tablets and
 * `columns` from `lg`. Rows are at least 14rem tall; give a card `rowSpan` to
 * make it taller. Set `auto-rows-*` in `className` to change the row height.
 */
export function BentoGrid({ columns = 3, className, children, ...props }: BentoGridProps) {
  return (
    <BentoContext.Provider value={columns}>
      <div
        data-slot="bento-grid"
        className={cn("grid w-full auto-rows-[minmax(14rem,auto)] grid-cols-1 gap-4", gridColumns[columns], className)}
        {...props}
      >
        {children}
      </div>
    </BentoContext.Provider>
  );
}

type CardBaseProps = Omit<
  React.HTMLAttributes<HTMLElement>,
  "title" | "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart"
>;

export interface BentoCardProps extends CardBaseProps {
  /** Card heading. */
  title: React.ReactNode;
  /** One or two lines under the title. */
  description?: React.ReactNode;
  /** Small icon above the title. */
  icon?: React.ReactNode;
  /** Visual behind the content (gradient, illustration, mini UI). It scales and brightens on hover. */
  background?: React.ReactNode;
  /** Makes the whole card a link. */
  href?: string;
  /** Link component to render when `href` is set, e.g. Next.js `Link`. */
  linkAs?: React.ElementType;
  /** Call-to-action label that slides up on hover / focus. Shown only on links. */
  cta?: React.ReactNode;
  /** Columns to span (clamped to the grid's `columns`). */
  colSpan?: 1 | 2 | 3 | 4;
  /** Rows to span. */
  rowSpan?: 1 | 2 | 3;
  /** Cursor glow color. Any CSS color. */
  glowColor?: string;
  /** Heading element for the title. */
  titleAs?: "h2" | "h3" | "h4";
}

/**
 * A bento cell. On hover (and keyboard focus) the background visual scales
 * up and brightens, a soft glow follows the cursor, and the content lifts to
 * reveal a call to action. With `href` the whole card is one link, so it is
 * a single Tab stop with a clear focus ring.
 *
 * The reveal is pure CSS transform/opacity and the glow uses motion values,
 * so nothing re-renders on hover. Touch screens (no hover) always show the
 * call to action; reduced motion keeps the fades and drops the movement.
 */
export function BentoCard({
  title,
  description,
  icon,
  background,
  href,
  linkAs,
  cta = "Learn more",
  colSpan = 1,
  rowSpan = 1,
  glowColor = "var(--color-primary)",
  titleAs: Title = "h3",
  className,
  children,
  onPointerMove,
  onFocus,
  ...props
}: BentoCardProps) {
  const columns = React.useContext(BentoContext);
  const span = Math.min(colSpan, columns);

  const x = useMotionValue(-1000);
  const y = useMotionValue(-1000);
  const glow = useMotionTemplate`radial-gradient(320px circle at ${x}px ${y}px, color-mix(in oklab, ${glowColor} 16%, transparent), transparent 70%)`;

  const handleMove = (event: React.PointerEvent<HTMLElement>) => {
    onPointerMove?.(event);
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  };

  const handleFocus = (event: React.FocusEvent<HTMLElement>) => {
    onFocus?.(event);
    // Keyboard focus: light the card from the top.
    x.set(event.currentTarget.offsetWidth / 2);
    y.set(0);
  };

  const isLink = Boolean(href);
  const Comp: React.ElementType = isLink ? (linkAs ?? "a") : "div";

  // Hover-only hidden states live under (hover: hover), so touch screens show everything.
  const hoverReveal =
    "[@media(hover:hover)]:translate-y-(--bento-shift) group-hover/bento:translate-y-0 group-focus-visible/bento:translate-y-0";

  return (
    <Comp
      data-slot="bento-card"
      href={href}
      className={cn(
        "group/bento relative isolate flex flex-col justify-end overflow-hidden rounded-xl border border-white/10 bg-card p-6 text-card-foreground",
        "shadow-[inset_0_1px_0_rgb(255_255_255/0.06)] transition-[border-color,box-shadow] duration-300 hover:border-white/20",
        // Movement distances as variables so reduced motion can zero them in one place.
        "[--bento-shift:2.75rem] [--bento-zoom:1.05] [--bento-nudge:0.125rem]",
        "motion-reduce:[--bento-shift:0px] motion-reduce:[--bento-zoom:1] motion-reduce:[--bento-nudge:0px]",
        isLink &&
          "outline-none focus-visible:border-primary/60 focus-visible:ring-[3px] focus-visible:ring-ring/40",
        colSpans[span],
        rowSpans[rowSpan],
        className
      )}
      onPointerMove={handleMove}
      onFocus={handleFocus}
      {...props}
    >
      {background && (
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 -z-10 origin-top opacity-75",
            "transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
            "group-hover/bento:scale-(--bento-zoom) group-hover/bento:opacity-100 group-focus-visible/bento:scale-(--bento-zoom) group-focus-visible/bento:opacity-100",
            "[mask-image:linear-gradient(to_bottom,#000_35%,transparent_85%)]"
          )}
        >
          {background}
        </div>
      )}

      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover/bento:opacity-100 group-focus-visible/bento:opacity-100"
        style={{ background: glow }}
      />

      <div
        className={cn(
          "relative transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          isLink && cta && hoverReveal
        )}
      >
        {icon && (
          <div className="mb-3 inline-flex size-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-primary [&_svg]:size-5">
            {icon}
          </div>
        )}
        <Title className="text-lg font-semibold tracking-tight text-white">{title}</Title>
        {description && <p className="mt-1.5 max-w-prose text-sm leading-relaxed text-white/60">{description}</p>}
        {children}
        {isLink && cta && (
          <span
            className={cn(
              "mt-4 inline-flex h-7 items-center gap-1.5 text-sm font-medium text-primary",
              "transition-opacity duration-300 [@media(hover:hover)]:opacity-0 group-hover/bento:opacity-100 group-focus-visible/bento:opacity-100"
            )}
          >
            {cta}
            <ArrowRight
              aria-hidden
              className="size-4 transition-transform duration-300 group-hover/bento:translate-x-(--bento-nudge)"
            />
          </span>
        )}
      </div>
    </Comp>
  );
}
