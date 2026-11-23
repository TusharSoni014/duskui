"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion, type Transition } from "motion/react";

import { cn } from "@/lib/utils";

const RING =
  "p-px [mask-composite:exclude] [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)]";

const sizes = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
} as const;

const enter: Transition = { type: "spring", duration: 0.45, bounce: 0.18 };
const leave: Transition = { duration: 0.2, ease: [0.4, 0, 1, 1] };

const ModalContext = React.createContext<{ open: boolean }>({ open: false });

export type CrystalModalProps = React.ComponentProps<typeof DialogPrimitive.Root>;

/**
 * A glass modal on Radix Dialog: focus trap, Escape to close, scroll lock and
 * aria wiring come from Radix; Motion adds the enter/exit — the pane scales up
 * out of a blur while the page behind it frosts over.
 *
 * Works controlled (`open` + `onOpenChange`) or uncontrolled (`defaultOpen`).
 * Compose it like shadcn's Dialog: Trigger, Content, Header, Title,
 * Description, Footer and Close.
 */
function CrystalModal({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  ...props
}: CrystalModalProps) {
  // Track open state here so the content can stay mounted for its exit animation.
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const open = openProp ?? uncontrolledOpen;

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange]
  );

  const context = React.useMemo(() => ({ open }), [open]);

  return (
    <ModalContext.Provider value={context}>
      <DialogPrimitive.Root
        open={open}
        onOpenChange={handleOpenChange}
        {...props}
      />
    </ModalContext.Provider>
  );
}

function CrystalModalTrigger(props: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="crystal-modal-trigger" {...props} />;
}

function CrystalModalClose(props: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="crystal-modal-close" {...props} />;
}

export interface CrystalModalContentProps
  extends Omit<
    React.ComponentProps<typeof DialogPrimitive.Content>,
    "asChild" | "forceMount"
  > {
  /** Max width of the pane. */
  size?: keyof typeof sizes;
  /** Render the close (×) button in the corner. */
  showCloseButton?: boolean;
  /** Classes for the frosted overlay behind the pane. */
  overlayClassName?: string;
  /** Portal container. Defaults to `document.body`. */
  container?: HTMLElement | null;
}

function CrystalModalContent({
  size = "md",
  showCloseButton = true,
  overlayClassName,
  container,
  className,
  children,
  ...props
}: CrystalModalContentProps) {
  const { open } = React.useContext(ModalContext);
  const reduceMotion = useReducedMotion();

  const hidden = reduceMotion
    ? { opacity: 0 }
    : { opacity: 0, scale: 0.9, y: 16, filter: "blur(10px)" };

  return (
    <AnimatePresence>
      {open && (
        <DialogPrimitive.Portal forceMount container={container}>
          <DialogPrimitive.Overlay asChild forceMount>
            <motion.div
              data-slot="crystal-modal-overlay"
              className={cn(
                "fixed inset-0 z-50 bg-black/60 data-[state=closed]:pointer-events-none",
                "supports-[backdrop-filter]:bg-black/30 supports-[backdrop-filter]:backdrop-blur-md supports-[backdrop-filter]:backdrop-saturate-125",
                overlayClassName
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.25, ease: "easeOut" } }}
              exit={{ opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }}
            />
          </DialogPrimitive.Overlay>
          <DialogPrimitive.Content asChild forceMount {...props}>
            <motion.div
              data-slot="crystal-modal-content"
              className={cn(
                "fixed left-1/2 top-1/2 z-50 grid max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 overflow-y-auto rounded-2xl p-6 text-foreground outline-none",
                "isolate data-[state=closed]:pointer-events-none",
                // Fallback first: opaque pane when backdrop-filter isn't supported.
                "bg-[color-mix(in_oklab,var(--background)_94%,white_2%)]",
                "supports-[backdrop-filter]:bg-[color-mix(in_oklab,var(--background)_55%,transparent)] supports-[backdrop-filter]:backdrop-blur-2xl supports-[backdrop-filter]:backdrop-saturate-150",
                "shadow-[inset_0_1px_0_rgb(255_255_255/0.14),0_32px_80px_-16px_rgb(0_0_0/0.75)]",
                sizes[size],
                className
              )}
              initial={hidden}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                filter: "blur(0px)",
                // Drop the filter at rest: it would blur nested glass and costs a layer.
                transitionEnd: { filter: "none" },
                transition: enter,
              }}
              exit={{ ...hidden, transition: leave }}
            >
              {/* Gradient hairline + a soft primary glow at the top edge. */}
              <span
                aria-hidden
                className={cn(
                  "pointer-events-none absolute inset-0 -z-10 rounded-[inherit] bg-[linear-gradient(160deg,rgb(255_255_255/0.4),rgb(255_255_255/0.08)_30%,rgb(255_255_255/0.04)_70%,rgb(255_255_255/0.16))]",
                  RING
                )}
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-8 -top-24 -z-10 h-40 rounded-full bg-primary/20 blur-3xl"
              />
              {children}
              {showCloseButton && (
                <DialogPrimitive.Close
                  data-slot="crystal-modal-close"
                  className={cn(
                    "absolute right-3 top-3 grid size-8 place-items-center rounded-full text-white/60 outline-none",
                    "transition-[color,background-color,box-shadow] duration-150 hover:bg-white/10 hover:text-white",
                    "focus-visible:text-white focus-visible:ring-[3px] focus-visible:ring-ring/50",
                    "[&_svg]:size-4"
                  )}
                >
                  <XIcon aria-hidden />
                  <span className="sr-only">Close</span>
                </DialogPrimitive.Close>
              )}
            </motion.div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      )}
    </AnimatePresence>
  );
}

function CrystalModalHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="crystal-modal-header"
      className={cn("flex flex-col gap-1.5 pr-8 text-center sm:text-left", className)}
      {...props}
    />
  );
}

function CrystalModalFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="crystal-modal-footer"
      className={cn("mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
}

function CrystalModalTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="crystal-modal-title"
      className={cn("text-lg font-semibold leading-tight tracking-tight text-white", className)}
      {...props}
    />
  );
}

function CrystalModalDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="crystal-modal-description"
      className={cn("text-sm leading-relaxed text-white/70", className)}
      {...props}
    />
  );
}

export {
  CrystalModal,
  CrystalModalTrigger,
  CrystalModalContent,
  CrystalModalHeader,
  CrystalModalFooter,
  CrystalModalTitle,
  CrystalModalDescription,
  CrystalModalClose,
};
