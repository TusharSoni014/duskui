"use client";

import * as React from "react";
import { FileText, Inbox, Search, Sparkles, type LucideIcon } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { cn } from "@/lib/utils";

export interface AnimatedEmptyProps extends Omit<React.ComponentProps<typeof Empty>, "title"> {
  /** The main icon in the floating tile. */
  icon?: LucideIcon;
  /** Up to three small icons that drift around the tile. Pass `[]` for none. */
  satellites?: LucideIcon[];
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Heading level for the title, so it fits your page outline. */
  titleAs?: "h2" | "h3" | "h4" | "p";
  /** Actions under the text, usually one or two Buttons. */
  children?: React.ReactNode;
}

// Where the satellites sit around the tile, and how each one drifts.
const orbit = [
  { className: "-top-3 -left-9", drift: { x: [0, -3, 0], y: [0, -5, 0], rotate: [-12, -4, -12] }, duration: 5.2 },
  { className: "-right-10 top-1", drift: { x: [0, 4, 0], y: [0, 4, 0], rotate: [10, 18, 10] }, duration: 6.1 },
  { className: "-bottom-4 -left-4", drift: { x: [0, -2, 0], y: [0, 4, 0], rotate: [6, -4, 6] }, duration: 4.6 },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

/**
 * An empty state with a floating illustration. A glassy tile holding your
 * icon bobs gently while small satellite icons drift around it and soft rings
 * breathe behind it; the title, description and actions rise in one after
 * another. Built on the DuskUI Empty parts. Under reduced motion everything
 * simply fades in and stays still.
 */
export function AnimatedEmpty({
  icon: Icon = Inbox,
  satellites = [Search, FileText, Sparkles],
  title,
  description,
  titleAs: Title = "h3",
  className,
  children,
  ...props
}: AnimatedEmptyProps) {
  const reduceMotion = useReducedMotion() ?? false;

  // The hidden state is the same either way, so server and client HTML match;
  // under reduced motion only the opacity animates.
  const item: Variants = {
    hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: reduceMotion
        ? { opacity: { duration: 0.3 }, y: { duration: 0 }, filter: { duration: 0 } }
        : { type: "spring", duration: 0.6, bounce: 0.15 },
      transitionEnd: { filter: "none" },
    },
  };

  return (
    <Empty className={cn("overflow-hidden", className)} {...props}>
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className="flex flex-col items-center gap-6"
      >
        <EmptyHeader>
          <motion.div variants={item}>
            <EmptyMedia className="mb-6 size-24">
              {/* Breathing rings */}
              {[0, 1].map((ring) => (
                <motion.span
                  key={ring}
                  aria-hidden
                  className="absolute inset-0 rounded-full border border-primary/15"
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={reduceMotion ? { scale: 1, opacity: 0.5 } : { scale: [0.75, 1.35], opacity: [0.6, 0] }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { duration: 3.2, repeat: Infinity, ease: "easeOut", delay: ring * 1.6 }
                  }
                />
              ))}
              <span
                aria-hidden
                className="absolute inset-3 rounded-full bg-primary/10 blur-xl"
              />

              {/* Floating tile */}
              <motion.span
                aria-hidden
                className={cn(
                  "relative grid size-16 place-items-center rounded-2xl border border-white/10 text-primary",
                  "bg-linear-to-b from-white/[0.1] to-white/[0.02] backdrop-blur-sm",
                  "shadow-[inset_0_1px_0_rgb(255_255_255/0.1),0_18px_40px_-12px_rgb(0_0_0/0.8),0_0_40px_-12px_var(--color-primary)]"
                )}
                initial={{ y: 0, rotate: 0 }}
                animate={reduceMotion ? { y: 0, rotate: 0 } : { y: [0, -6, 0], rotate: [0, -2, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Icon className="size-7 drop-shadow-[0_0_8px_color-mix(in_oklab,var(--color-primary)_60%,transparent)]" />
              </motion.span>

              {/* Satellites */}
              {satellites.slice(0, 3).map((Satellite, index) => {
                const spot = orbit[index];
                return (
                  <motion.span
                    key={index}
                    aria-hidden
                    className={cn(
                      "absolute grid size-8 place-items-center rounded-lg border border-white/10 bg-card/80 text-muted-foreground",
                      "shadow-[inset_0_1px_0_rgb(255_255_255/0.06),0_8px_20px_-8px_rgb(0_0_0/0.7)]",
                      spot.className
                    )}
                    initial={{ rotate: spot.drift.rotate[0] }}
                    animate={reduceMotion ? { rotate: spot.drift.rotate[0] } : spot.drift}
                    transition={{ duration: spot.duration, repeat: Infinity, ease: "easeInOut", delay: index * 0.4 }}
                  >
                    <Satellite className="size-4" />
                  </motion.span>
                );
              })}
            </EmptyMedia>
          </motion.div>

          <motion.div variants={item}>
            <EmptyTitle>
              <Title className="text-lg font-medium tracking-tight">{title}</Title>
            </EmptyTitle>
          </motion.div>
          {description && (
            <motion.div variants={item}>
              <EmptyDescription>{description}</EmptyDescription>
            </motion.div>
          )}
        </EmptyHeader>

        {children && (
          <motion.div variants={item} className="w-full">
            <EmptyContent className="mx-auto flex-row flex-wrap justify-center gap-2">{children}</EmptyContent>
          </motion.div>
        )}
      </motion.div>
    </Empty>
  );
}
