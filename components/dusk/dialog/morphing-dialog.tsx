"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useReducedMotion, type Transition } from "motion/react";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const morph: Transition = { type: "spring", bounce: 0.1, duration: 0.5 };
const fade: Transition = { duration: 0.2, ease: "easeOut" };

type MorphingDialogContextValue = {
  /** Base for every shared layoutId, unique per dialog. */
  id: string;
  open: boolean;
  /** Layout morphs are switched off under reduced motion; the dialog just fades. */
  reduceMotion: boolean;
};

const MorphingDialogContext = React.createContext<MorphingDialogContextValue | null>(null);
/** Whether a part is rendered inside the trigger card or the open dialog. */
const SurfaceContext = React.createContext<"trigger" | "content">("trigger");

function useMorphingDialog() {
  const context = React.useContext(MorphingDialogContext);
  if (!context) throw new Error("MorphingDialog parts must be used inside <MorphingDialog>.");
  return context;
}

/** Shared layoutId for a part, or none under reduced motion. */
function useLayoutId(part: string) {
  const { id, reduceMotion } = useMorphingDialog();
  return reduceMotion ? undefined : `${id}-${part}`;
}

export interface MorphingDialogProps {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * A card that morphs into a dialog. Parts with the same role in the trigger
 * and the content (surface, media, title, subtitle) share a Motion `layoutId`,
 * so they fly to their new position and size. Built on Radix Dialog: focus is
 * trapped inside, Escape and outside clicks close it, focus returns to the card
 * and the title / description are wired to aria-labelledby / -describedby.
 */
export function MorphingDialog({ children, open: openProp, defaultOpen = false, onOpenChange }: MorphingDialogProps) {
  const id = React.useId();
  const reduceMotion = useReducedMotion() ?? false;
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = openProp ?? internalOpen;

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange]
  );

  const value = React.useMemo(() => ({ id, open, reduceMotion }), [id, open, reduceMotion]);

  return (
    <MorphingDialogContext.Provider value={value}>
      <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
        {children}
      </DialogPrimitive.Root>
    </MorphingDialogContext.Provider>
  );
}

export interface MorphingDialogTriggerProps
  extends Omit<React.ComponentProps<typeof motion.button>, "layoutId" | "children"> {
  children?: React.ReactNode;
}

/** The card that opens the dialog. A real `<button>`, so put only inline content (spans) inside. */
export function MorphingDialogTrigger({ className, style, children, ...props }: MorphingDialogTriggerProps) {
  const layoutId = useLayoutId("surface");
  return (
    <SurfaceContext.Provider value="trigger">
      <DialogPrimitive.Trigger asChild>
        <motion.button
          type="button"
          layoutId={layoutId}
          transition={morph}
          // borderRadius set in style so Motion keeps corners round while scaling.
          style={{ borderRadius: 16, ...style }}
          className={cn(
            "relative flex flex-col overflow-hidden border bg-card text-left text-card-foreground outline-none",
            "transition-colors duration-150 hover:border-foreground/20",
            "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40",
            className
          )}
          {...props}
        >
          {children}
        </motion.button>
      </DialogPrimitive.Trigger>
    </SurfaceContext.Provider>
  );
}

export interface MorphingDialogContentProps
  extends Omit<React.ComponentProps<typeof motion.div>, "layoutId" | "children"> {
  children?: React.ReactNode;
  /** Classes for the dimmed backdrop. */
  overlayClassName?: string;
}

/** The open dialog. Rendered in a portal, centered, and scrolls if it's taller than the screen. */
export function MorphingDialogContent({
  className,
  overlayClassName,
  style,
  children,
  ...props
}: MorphingDialogContentProps) {
  const { open, reduceMotion } = useMorphingDialog();
  const layoutId = useLayoutId("surface");

  return (
    <AnimatePresence>
      {open && (
        // forceMount hands mounting to AnimatePresence so exit animations can play.
        <DialogPrimitive.Portal forceMount>
          <DialogPrimitive.Overlay forceMount asChild>
            <motion.div
              className={cn("fixed inset-0 z-50 bg-black/60 backdrop-blur-sm", overlayClassName)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={fade}
            />
          </DialogPrimitive.Overlay>
          <div className="pointer-events-none fixed inset-0 z-50 grid place-items-center p-4">
            <SurfaceContext.Provider value="content">
              <DialogPrimitive.Content forceMount asChild>
                <motion.div
                  layoutId={layoutId}
                  transition={morph}
                  initial={reduceMotion ? { opacity: 0 } : undefined}
                  animate={reduceMotion ? { opacity: 1 } : undefined}
                  exit={reduceMotion ? { opacity: 0 } : undefined}
                  style={{ borderRadius: 24, ...style }}
                  className={cn(
                    "pointer-events-auto relative flex max-h-[calc(100dvh-2rem)] w-full max-w-lg flex-col overflow-y-auto overflow-x-hidden border bg-card text-card-foreground outline-none",
                    "shadow-lg",
                    className
                  )}
                  {...props}
                >
                  {children}
                </motion.div>
              </DialogPrimitive.Content>
            </SurfaceContext.Provider>
          </div>
        </DialogPrimitive.Portal>
      )}
    </AnimatePresence>
  );
}

/** Image, illustration or color block shared by the card and the dialog. */
export function MorphingDialogMedia({
  className,
  ...props
}: Omit<React.ComponentProps<typeof motion.div>, "layoutId">) {
  const layoutId = useLayoutId("media");
  return (
    <motion.div
      layoutId={layoutId}
      transition={morph}
      className={cn("relative overflow-hidden", className)}
      {...props}
    />
  );
}

/** Title shared by the card and the dialog. Inside the dialog it's the accessible Radix title. */
export function MorphingDialogTitle({
  className,
  ...props
}: Omit<React.ComponentProps<typeof motion.h2>, "layoutId" | "layout">) {
  const surface = React.useContext(SurfaceContext);
  const layoutId = useLayoutId("title");
  const shared = {
    layoutId,
    // "position" moves the text without stretching it while it re-wraps.
    layout: "position" as const,
    transition: morph,
    className: cn("block font-semibold tracking-tight", className),
  };

  if (surface === "trigger") {
    return <motion.span {...shared} {...(props as React.ComponentProps<typeof motion.span>)} />;
  }
  return (
    <DialogPrimitive.Title asChild>
      <motion.h2 {...shared} {...props} />
    </DialogPrimitive.Title>
  );
}

/** Secondary line shared by the card and the dialog. */
export function MorphingDialogSubtitle({
  className,
  ...props
}: Omit<React.ComponentProps<typeof motion.span>, "layoutId" | "layout">) {
  const layoutId = useLayoutId("subtitle");
  return (
    <motion.span
      layoutId={layoutId}
      layout="position"
      transition={morph}
      className={cn("block text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

/**
 * Content that only exists in the open dialog. Fades up after the morph and
 * fades out before the dialog shrinks back. Linked as the aria description.
 */
export function MorphingDialogDescription({
  className,
  ...props
}: Omit<React.ComponentProps<typeof motion.div>, "initial" | "animate" | "exit">) {
  const { reduceMotion } = useMorphingDialog();
  return (
    <DialogPrimitive.Description asChild>
      <motion.div
        className={cn("text-sm leading-relaxed text-muted-foreground", className)}
        initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
        animate={{ opacity: 1, y: 0, transition: { ...fade, delay: reduceMotion ? 0 : 0.15 } }}
        exit={{ opacity: 0, y: reduceMotion ? 0 : 4, transition: { duration: 0.1 } }}
        {...props}
      />
    </DialogPrimitive.Description>
  );
}

/** Round close button pinned to the dialog's top-right corner. */
export function MorphingDialogClose({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof motion.button>, "initial" | "animate" | "exit">) {
  const { reduceMotion } = useMorphingDialog();
  return (
    <DialogPrimitive.Close asChild>
      <motion.button
        type="button"
        className={cn(
          "absolute top-3 right-3 z-10 inline-flex size-8 items-center justify-center rounded-full bg-black/40 text-white/80 outline-none backdrop-blur",
          "transition-colors hover:bg-black/60 hover:text-white focus-visible:ring-[3px] focus-visible:ring-ring/50",
          className
        )}
        initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.96 }}
        animate={{ opacity: 1, scale: 1, transition: { duration: 0.2, ease: "easeOut", delay: reduceMotion ? 0 : 0.15 } }}
        exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.96, transition: { duration: 0.1 } }}
        {...props}
      >
        {children ?? (
          <>
            <XIcon className="size-4" aria-hidden />
            <span className="sr-only">Close</span>
          </>
        )}
      </motion.button>
    </DialogPrimitive.Close>
  );
}
