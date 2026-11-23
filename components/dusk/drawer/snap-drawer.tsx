"use client";

import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

type SnapPoint = number | string;

export interface SnapDrawerProps {
  /** Element that opens the drawer, usually a Button. Omit when controlling `open` yourself. */
  trigger?: React.ReactElement;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * Heights the drawer rests at, smallest first: fractions of the screen
   * (0–1) or pixel strings like "160px".
   */
  snapPoints?: SnapPoint[];
  /** Controlled resting point. */
  snap?: SnapPoint | null;
  onSnapChange?: (snap: SnapPoint | null) => void;
  /** Accessible names for each snap point, used by the indicator buttons. */
  snapLabels?: string[];
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Shown at every height: the "peek" row under the title. */
  peek?: React.ReactNode;
  /** The rest of the content; scrolls once the drawer is fully expanded. */
  children?: React.ReactNode;
  /** Keep the page interactive while the drawer rests at its first point (a map sheet, a player). */
  nonModal?: boolean;
  className?: string;
}

const defaultSnapPoints: SnapPoint[] = [0.3, 0.6, 1];

/**
 * A bottom sheet with snap points, like Apple Maps: drag it between resting
 * heights, flick to skip one, or tap the indicator dots. A pill glides
 * between the dots (Motion layoutId) and the handle widens as the sheet
 * grows. Content only scrolls at the top point, so dragging never fights
 * scrolling. Built on vaul, so Escape, the focus trap and aria come from
 * Radix Dialog. Under reduced motion the pill and handle jump.
 */
export function SnapDrawer({
  trigger,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  snapPoints = defaultSnapPoints,
  snap: snapProp,
  onSnapChange,
  snapLabels,
  title,
  description,
  peek,
  children,
  nonModal = false,
  className,
}: SnapDrawerProps) {
  const id = React.useId();
  const reduceMotion = useReducedMotion();
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const [uncontrolledSnap, setUncontrolledSnap] = React.useState<SnapPoint | null>(snapPoints[0] ?? null);
  const open = openProp ?? uncontrolledOpen;
  const snap = snapProp !== undefined ? snapProp : uncontrolledSnap;
  const index = Math.max(0, snapPoints.indexOf(snap ?? snapPoints[0]));
  const atTop = index === snapPoints.length - 1;

  const setOpen = (next: boolean) => {
    if (openProp === undefined) setUncontrolledOpen(next);
    // Reopen at the first point.
    if (!next && snapProp === undefined) setUncontrolledSnap(snapPoints[0] ?? null);
    onOpenChange?.(next);
  };

  const setSnap = (next: SnapPoint | null) => {
    if (snapProp === undefined) setUncontrolledSnap(next);
    onSnapChange?.(next);
  };

  const labelFor = (i: number) =>
    snapLabels?.[i] ??
    (i === 0 ? "Collapse" : i === snapPoints.length - 1 ? "Expand fully" : `Expand to step ${i + 1}`);

  return (
    <DrawerPrimitive.Root
      open={open}
      onOpenChange={setOpen}
      snapPoints={snapPoints}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
      modal={!nonModal}
      // Fade the backdrop in from the second point; the first acts like a peek.
      {...(nonModal ? {} : { fadeFromIndex: Math.min(1, snapPoints.length - 1) })}
    >
      {trigger && <DrawerPrimitive.Trigger asChild>{trigger}</DrawerPrimitive.Trigger>}
      <DrawerPrimitive.Portal>
        {!nonModal && <DrawerPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60" />}
        <DrawerPrimitive.Content
          data-slot="drawer-content"
          // Tells Radix the missing description is intentional.
          {...(description ? {} : { "aria-describedby": undefined })}
          className={cn(
            "fixed inset-x-0 bottom-0 z-50 mx-auto flex h-full max-h-[97%] w-full max-w-xl flex-col rounded-t-2xl border border-b-0 bg-background outline-none",
            "shadow-[inset_0_1px_0_rgb(255_255_255/0.06),0_-24px_64px_-16px_rgb(0_0_0/0.75)]",
            // vaul animates snaps with inline transitions; reduced motion makes them jump.
            "motion-reduce:transition-none!",
            className
          )}
        >
          <div className="flex shrink-0 flex-col items-center gap-2 pt-3 pb-1">
            <motion.div
              aria-hidden
              className="h-1.5 rounded-full bg-white/20"
              initial={false}
              animate={{ width: 36 + index * 12, opacity: atTop ? 0.6 : 1 }}
              transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 30 }}
            />
          </div>

          <div className="flex shrink-0 items-start justify-between gap-4 px-5 pt-1 pb-3">
            <div className="min-w-0">
              <DrawerPrimitive.Title className="text-lg leading-tight font-semibold tracking-tight">{title}</DrawerPrimitive.Title>
              {description && (
                <DrawerPrimitive.Description className="mt-1 text-sm text-muted-foreground">{description}</DrawerPrimitive.Description>
              )}
            </div>
            <div role="group" aria-label="Drawer height" className="flex shrink-0 items-center gap-1 pt-1" data-vaul-no-drag>
              {snapPoints.map((point, i) => (
                <button
                  key={String(point)}
                  type="button"
                  aria-label={labelFor(i)}
                  aria-pressed={i === index}
                  onClick={() => setSnap(point)}
                  className="relative flex size-6 items-center justify-center rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  {i === index && (
                    <motion.span
                      layoutId={`${id}-snap`}
                      className="absolute inset-1 rounded-full bg-primary/20 shadow-[0_0_10px_color-mix(in_oklab,var(--color-primary)_40%,transparent)]"
                      transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 34 }}
                    />
                  )}
                  <span
                    className={cn(
                      "relative size-1.5 rounded-full transition-colors duration-200",
                      i === index ? "bg-primary" : "bg-white/25"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          {peek && <div className="shrink-0 px-5 pb-3">{peek}</div>}

          <div
            className={cn(
              "min-h-0 flex-1 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]",
              atTop ? "overflow-y-auto overscroll-contain" : "overflow-hidden"
            )}
          >
            {children}
          </div>
        </DrawerPrimitive.Content>
      </DrawerPrimitive.Portal>
    </DrawerPrimitive.Root>
  );
}
