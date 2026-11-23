"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useReducedMotion, type Transition } from "motion/react";
import { ChevronLeft, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type Side = "left" | "right";

type StackedSheetContextValue = {
  /** 0 for the first sheet, 1 for a sheet opened from it, and so on. */
  depth: number;
  side: Side;
  open: boolean;
  /** How many sheets are open on top of this one. */
  above: number;
  setAbove: (count: number) => void;
};

const StackedSheetContext = React.createContext<StackedSheetContextValue | null>(null);

function useStackedSheet() {
  const context = React.useContext(StackedSheetContext);
  if (!context) throw new Error("StackedSheet parts must be used inside <StackedSheet>.");
  return context;
}

const slide: Transition = { type: "spring", duration: 0.35, bounce: 0 };
const recede: Transition = { type: "spring", duration: 0.35, bounce: 0 };

export interface StackedSheetProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Edge the sheets slide in from. Nested sheets inherit it from the first one. */
  side?: Side;
  children?: React.ReactNode;
}

/**
 * Side sheets that stack. Open a StackedSheet from inside another one and the
 * new sheet slides over it while the one underneath scales back, shifts aside
 * and dims, so you can see the path you took. Closing a sheet brings the one
 * below forward again. Each level is a Radix Dialog: focus moves into the top
 * sheet, Escape and outside clicks close only the top one, and focus returns
 * to the trigger that opened it. Under reduced motion sheets fade and nothing
 * scales.
 */
export function StackedSheet({ open: openProp, defaultOpen = false, onOpenChange, side: sideProp, children }: StackedSheetProps) {
  const parent = React.useContext(StackedSheetContext);
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const [above, setAbove] = React.useState(0);
  const open = openProp ?? internalOpen;
  const depth = parent ? parent.depth + 1 : 0;
  const side = parent?.side ?? sideProp ?? "right";

  // Tell the sheet underneath how many sheets are now stacked on top of it.
  const reportToParent = parent?.setAbove;
  React.useEffect(() => {
    reportToParent?.(open ? above + 1 : 0);
  }, [reportToParent, open, above]);
  React.useEffect(() => () => reportToParent?.(0), [reportToParent]);

  const value = React.useMemo(() => ({ depth, side, open, above, setAbove }), [depth, side, open, above]);

  return (
    <StackedSheetContext.Provider value={value}>
      <DialogPrimitive.Root
        open={open}
        onOpenChange={(next) => {
          if (openProp === undefined) setInternalOpen(next);
          onOpenChange?.(next);
        }}
      >
        {children}
      </DialogPrimitive.Root>
    </StackedSheetContext.Provider>
  );
}

/** The element that opens this sheet. Use `asChild` to render your own Button. */
export const StackedSheetTrigger = DialogPrimitive.Trigger;

/** Closes this sheet. Use `asChild` to render your own Button. */
export const StackedSheetClose = DialogPrimitive.Close;

export interface StackedSheetContentProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** The sheet body. Scrolls when taller than the screen. */
  children?: React.ReactNode;
  /** Actions pinned to the bottom. */
  footer?: React.ReactNode;
  /** Render the X button. Nested sheets also get a back button. */
  showCloseButton?: boolean;
  className?: string;
}

/** The sheet surface. Slides in, and recedes when another sheet opens on top. */
export function StackedSheetContent({
  title,
  description,
  children,
  footer,
  showCloseButton = true,
  className,
}: StackedSheetContentProps) {
  const { depth, side, open, above } = useStackedSheet();
  const reduceMotion = useReducedMotion() ?? false;
  const offscreen = side === "right" ? "calc(100% + 1rem)" : "calc(-100% - 1rem)";
  const shift = side === "right" ? -28 : 28;
  const covered = above > 0;

  return (
    <AnimatePresence>
      {open && (
        // forceMount hands mounting to AnimatePresence so the exit animation can play.
        <DialogPrimitive.Portal forceMount>
          <DialogPrimitive.Overlay forceMount asChild>
            <motion.div
              className={cn("fixed inset-0 z-50", depth === 0 ? "bg-black/60 backdrop-blur-[2px]" : "bg-black/20")}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            />
          </DialogPrimitive.Overlay>
          <DialogPrimitive.Content forceMount asChild>
            <motion.div
              className={cn(
                "fixed inset-y-0 z-50 flex w-full max-w-md p-2 outline-none",
                side === "right" ? "right-0" : "left-0"
              )}
              initial={reduceMotion ? { opacity: 0 } : { x: offscreen }}
              animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { x: offscreen }}
              transition={slide}
            >
              <motion.div
                className={cn(
                  "relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border bg-background",
                  "shadow-lg",
                  className
                )}
                initial={false}
                animate={
                  reduceMotion
                    ? {}
                    : { scale: covered ? 1 - 0.04 * Math.min(above, 3) : 1, x: covered ? shift * Math.min(above, 3) : 0 }
                }
                transition={recede}
              >
                <div className="flex shrink-0 items-start gap-3 px-5 pt-5 pb-3">
                  {depth > 0 && (
                    <DialogPrimitive.Close
                      className="-mt-1 -ml-2 inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    >
                      <ChevronLeft className="size-4" aria-hidden />
                      <span className="sr-only">Back</span>
                    </DialogPrimitive.Close>
                  )}
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
                  <div className="flex shrink-0 flex-col-reverse gap-2 border-t px-5 py-4 sm:flex-row sm:justify-end">
                    {footer}
                  </div>
                )}
                {/* Dims the sheet while another one covers it. */}
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-black"
                  initial={false}
                  animate={{ opacity: covered ? 0.45 : 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </motion.div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      )}
    </AnimatePresence>
  );
}
