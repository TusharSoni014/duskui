"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  animate,
  AnimatePresence,
  motion,
  useDragControls,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type PanInfo,
} from "motion/react";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type Side = "left" | "right";

export interface SidePanelProps {
  /** Element that opens the panel, usually a Button. Omit when controlling `open` yourself. */
  trigger?: React.ReactElement;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** The panel body. Scrolls when taller than the screen. */
  children?: React.ReactNode;
  /** Actions pinned to the bottom. */
  footer?: React.ReactNode;
  /** Edge the panel slides in from. */
  side?: Side;
  /** Render an X button next to the title. */
  showCloseButton?: boolean;
  /** Fraction of the panel's width it must be dragged to close (0–1). */
  closeThreshold?: number;
  className?: string;
}

const slide = { type: "spring", duration: 0.45, bounce: 0 } as const;

/**
 * A side sheet you can drag closed. Grab the edge handle or the header and
 * pull the panel toward its edge — a fast flick or a drag past
 * `closeThreshold` dismisses it, anything less springs back, and the backdrop
 * fades as you drag. Built on Radix Dialog, so Escape, the backdrop and the
 * close button work, focus is trapped inside and returns to the trigger. With
 * reduced motion it simply fades.
 */
export function SidePanel({
  trigger,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  title,
  description,
  children,
  footer,
  side = "right",
  showCloseButton = true,
  closeThreshold = 0.35,
  className,
}: SidePanelProps) {
  const reduceMotion = useReducedMotion();
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = openProp ?? internalOpen;
  const panelRef = React.useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  // Drag offset in px, kept apart from the enter/exit slide so they don't fight.
  const dragX = useMotionValue(0);
  const sign = side === "right" ? 1 : -1;
  const backdropOpacity = useTransform(dragX, (x) => Math.max(0, 1 - (x * sign) / 360));
  const offscreen = side === "right" ? "100%" : "-100%";

  const setOpen = (next: boolean) => {
    if (openProp === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  };

  const handleDragEnd = (_: PointerEvent, info: PanInfo) => {
    const width = panelRef.current?.offsetWidth ?? 400;
    if (info.offset.x * sign > width * closeThreshold || info.velocity.x * sign > 600) {
      setOpen(false);
    } else {
      animate(dragX, 0, { type: "spring", duration: 0.35, bounce: 0.15 });
    }
  };

  const startDrag = (event: React.PointerEvent) => {
    // Let buttons (the close X) receive their clicks.
    if ((event.target as HTMLElement).closest("button, a, input, textarea, select")) return;
    dragControls.start(event);
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      {trigger && <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>}
      <AnimatePresence onExitComplete={() => dragX.set(0)}>
        {open && (
          // forceMount hands mounting to AnimatePresence so exit animations can play.
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay forceMount asChild>
              <motion.div
                className="fixed inset-0 z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <motion.div
                  className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
                  style={{ opacity: backdropOpacity }}
                />
              </motion.div>
            </DialogPrimitive.Overlay>
            <DialogPrimitive.Content forceMount asChild>
              <motion.div
                ref={panelRef}
                className={cn(
                  "fixed inset-y-0 z-50 flex w-[calc(100%-2.5rem)] max-w-sm outline-none",
                  side === "right" ? "right-0" : "left-0"
                )}
                initial={reduceMotion ? { opacity: 0 } : { x: offscreen }}
                animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { x: offscreen }}
                transition={slide}
              >
                {/* The surface carries the drag, so the slide-in `x` above stays independent. */}
                <motion.div
                  className={cn(
                    "relative flex min-h-0 flex-1 flex-col bg-background",
                    side === "right"
                      ? "border-l shadow-[inset_1px_0_0_rgb(255_255_255/0.04),-24px_0_64px_-16px_rgb(0_0_0/0.7)]"
                      : "border-r shadow-[inset_-1px_0_0_rgb(255_255_255/0.04),24px_0_64px_-16px_rgb(0_0_0/0.7)]",
                    className
                  )}
                  style={{ x: dragX }}
                  drag="x"
                  dragControls={dragControls}
                  dragListener={false}
                  dragConstraints={side === "right" ? { left: 0 } : { right: 0 }}
                  dragElastic={side === "right" ? { left: 0.04, right: 1 } : { left: 1, right: 0.04 }}
                  dragMomentum={false}
                  onDragEnd={handleDragEnd}
                >
                  {/* Edge handle. touch-none stops the page from scrolling instead. */}
                  <div
                    aria-hidden
                    onPointerDown={startDrag}
                    className={cn(
                      "group/handle absolute inset-y-0 flex w-5 cursor-grab touch-none items-center justify-center active:cursor-grabbing",
                      side === "right" ? "-left-5" : "-right-5"
                    )}
                  >
                    <span className="h-12 w-1.5 rounded-full bg-white/20 transition-[height,background-color] duration-200 group-hover/handle:h-16 group-hover/handle:bg-primary/70 group-active/handle:bg-primary" />
                  </div>
                  {/* The header is a drag zone too. */}
                  <div
                    onPointerDown={startDrag}
                    className="flex shrink-0 cursor-grab touch-none items-start gap-4 px-5 pt-5 pb-3 select-none active:cursor-grabbing"
                  >
                    <div className="grid flex-1 gap-1.5">
                      <DialogPrimitive.Title className="text-lg leading-none font-semibold tracking-tight">
                        {title}
                      </DialogPrimitive.Title>
                      {description ? (
                        <DialogPrimitive.Description className="text-sm leading-relaxed text-muted-foreground">
                          {description}
                        </DialogPrimitive.Description>
                      ) : null}
                    </div>
                    {showCloseButton && (
                      <DialogPrimitive.Close className="-mt-1 -mr-2 inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50">
                        <XIcon className="size-4" aria-hidden />
                        <span className="sr-only">Close</span>
                      </DialogPrimitive.Close>
                    )}
                  </div>
                  <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-3">{children}</div>
                  {footer && (
                    <div className="flex shrink-0 flex-col-reverse gap-2 border-t px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:flex-row sm:justify-end">
                      {footer}
                    </div>
                  )}
                </motion.div>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}
