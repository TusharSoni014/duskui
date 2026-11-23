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

export interface DrawerDialogProps {
  /** Element that opens the drawer, usually a Button. Omit when controlling `open` yourself. */
  trigger?: React.ReactElement;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** The drawer body. Scrolls when taller than the screen allows. */
  children?: React.ReactNode;
  /** Sticky actions under the body. */
  footer?: React.ReactNode;
  /** Render an X button next to the title. */
  showCloseButton?: boolean;
  /** Fraction of the drawer's height it must be dragged down to close (0–1). */
  closeThreshold?: number;
  className?: string;
}

const slide = { type: "spring", duration: 0.45, bounce: 0 } as const;

/**
 * A bottom sheet built on Radix Dialog. Slides up from the bottom, and can be
 * dragged down by its handle or header to dismiss — a fast flick or a drag past
 * `closeThreshold` closes it, anything less springs back. The backdrop fades
 * as you drag. Escape, the backdrop and the close button also close it, focus
 * is trapped inside, and with reduced motion it simply fades.
 */
export function DrawerDialog({
  trigger,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  title,
  description,
  children,
  footer,
  showCloseButton = true,
  closeThreshold = 0.3,
  className,
}: DrawerDialogProps) {
  const reduceMotion = useReducedMotion();
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = openProp ?? internalOpen;
  const sheetRef = React.useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  // Drag offset in px. Kept separate from the enter/exit slide so they don't fight.
  const dragY = useMotionValue(0);
  const backdropOpacity = useTransform(dragY, [0, 320], [1, 0]);

  const setOpen = (next: boolean) => {
    if (openProp === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  };

  const handleDragEnd = (_: PointerEvent, info: PanInfo) => {
    const height = sheetRef.current?.offsetHeight ?? 400;
    if (info.offset.y > height * closeThreshold || info.velocity.y > 600) {
      setOpen(false);
    } else {
      animate(dragY, 0, { type: "spring", duration: 0.35, bounce: 0.15 });
    }
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      {trigger && <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>}
      <AnimatePresence onExitComplete={() => dragY.set(0)}>
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
                <motion.div className="absolute inset-0 bg-black/60" style={{ opacity: backdropOpacity }} />
              </motion.div>
            </DialogPrimitive.Overlay>
            <DialogPrimitive.Content forceMount asChild>
              <motion.div
                ref={sheetRef}
                className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[calc(100dvh-3rem)] w-full max-w-lg flex-col outline-none"
                initial={reduceMotion ? { opacity: 0 } : { y: "100%" }}
                animate={reduceMotion ? { opacity: 1 } : { y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { y: "100%" }}
                transition={slide}
              >
                {/* The surface carries the drag, so the slide-in `y` above stays independent. */}
                <motion.div
                  className={cn(
                    "flex min-h-0 flex-1 flex-col rounded-t-2xl border border-b-0 bg-background",
                    "shadow-lg",
                    className
                  )}
                  style={{ y: dragY }}
                  drag="y"
                  dragControls={dragControls}
                  dragListener={false}
                  dragConstraints={{ top: 0 }}
                  dragElastic={{ top: 0.05, bottom: 1 }}
                  dragMomentum={false}
                  onDragEnd={handleDragEnd}
                >
                  {/* Drag zone: the handle and header. touch-none stops the page from scrolling instead. */}
                  <div
                    className="shrink-0 cursor-grab touch-none select-none active:cursor-grabbing"
                    onPointerDown={(event) => {
                      // Let buttons in the header (the close X) receive clicks.
                      if ((event.target as HTMLElement).closest("button")) return;
                      dragControls.start(event);
                    }}
                  >
                    <div aria-hidden className="mx-auto mt-3 h-1.5 w-10 rounded-full bg-white/15" />
                    <div className="flex items-start gap-4 px-6 pt-4 pb-2">
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
                  </div>
                  <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-4">{children}</div>
                  {footer && (
                    <div className="flex shrink-0 flex-col-reverse gap-2 border-t px-6 pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:flex-row sm:justify-end">
                      {footer}
                    </div>
                  )}
                  {!footer && <div aria-hidden className="h-[max(0.5rem,env(safe-area-inset-bottom))] shrink-0" />}
                </motion.div>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}
