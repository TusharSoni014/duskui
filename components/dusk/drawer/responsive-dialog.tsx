"use client";

import * as React from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

/**
 * `true` while `query` matches. Uses useSyncExternalStore with a server
 * snapshot, so the first client render matches the server HTML and React
 * re-renders with the real value right after hydration — no mismatch.
 */
export function useMediaQuery(query: string, serverValue = false) {
  const subscribe = React.useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query]
  );
  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverValue
  );
}

type ResponsiveDialogContextValue = { desktop: boolean };

const ResponsiveDialogContext = React.createContext<ResponsiveDialogContextValue | null>(null);

function useResponsiveDialog() {
  const context = React.useContext(ResponsiveDialogContext);
  if (!context) throw new Error("ResponsiveDialog parts must be used inside <ResponsiveDialog>.");
  return context;
}

export interface ResponsiveDialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Media query that switches to the centered Dialog. */
  desktopQuery?: string;
  children?: React.ReactNode;
}

/**
 * One component, two surfaces: a centered Dialog on desktop and a
 * drag-to-dismiss bottom Drawer (vaul) on phones. The open state lives here,
 * so rotating a tablet or resizing the window swaps the surface without
 * closing it. Content rises in with a short stagger on either surface.
 * Parts mirror the Dialog API (Trigger, Content, Header, Title, Description,
 * Body, Footer, Close). Focus trap, Escape and aria come from Radix Dialog
 * in both modes.
 */
export function ResponsiveDialog({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  desktopQuery = "(min-width: 768px)",
  children,
}: ResponsiveDialogProps) {
  const desktop = useMediaQuery(desktopQuery);
  const [uncontrolled, setUncontrolled] = React.useState(defaultOpen);
  const open = openProp ?? uncontrolled;

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setUncontrolled(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange]
  );

  const context = React.useMemo(() => ({ desktop }), [desktop]);

  return (
    <ResponsiveDialogContext.Provider value={context}>
      {desktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
          {children}
        </Dialog>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          {children}
        </Drawer>
      )}
    </ResponsiveDialogContext.Provider>
  );
}

/** Opens the dialog / drawer. Use `asChild` to render your own Button. */
export function ResponsiveDialogTrigger(props: React.ComponentProps<typeof DialogTrigger>) {
  const { desktop } = useResponsiveDialog();
  return desktop ? <DialogTrigger {...props} /> : <DrawerTrigger {...props} />;
}

/** Closes the dialog / drawer. Use `asChild` to render your own Button. */
export function ResponsiveDialogClose(props: React.ComponentProps<typeof DialogClose>) {
  const { desktop } = useResponsiveDialog();
  return desktop ? <DialogClose {...props} /> : <DrawerClose {...props} />;
}

const stagger: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } },
};

const rise = (reduceMotion: boolean): Variants => ({
  hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 },
  shown: reduceMotion
    ? { opacity: 1, transition: { duration: 0.2 } }
    : { opacity: 1, y: 0, transition: { type: "spring", duration: 0.45, bounce: 0.15 } },
});

export interface ResponsiveDialogContentProps {
  className?: string;
  children?: React.ReactNode;
  /** Desktop only: render the X button. On phones the drawer is dragged or tapped away. */
  showCloseButton?: boolean;
}

/** The surface: DialogContent on desktop, DrawerContent (with handle) on phones. */
export function ResponsiveDialogContent({ className, children, showCloseButton = true }: ResponsiveDialogContentProps) {
  const { desktop } = useResponsiveDialog();
  const body = (
    <motion.div variants={stagger} initial="hidden" animate="shown" className="contents">
      {children}
    </motion.div>
  );

  return desktop ? (
    <DialogContent showCloseButton={showCloseButton} className={cn("sm:max-w-md", className)}>
      {body}
    </DialogContent>
  ) : (
    <DrawerContent className={className}>{body}</DrawerContent>
  );
}

/** A block that rises in with the stagger. Use it for any custom section. */
function Rise({ className, children }: { className?: string; children?: React.ReactNode }) {
  const reduceMotion = useReducedMotion() ?? false;
  return (
    <motion.div variants={rise(reduceMotion)} className={className}>
      {children}
    </motion.div>
  );
}

/** Wraps the title and description. */
export function ResponsiveDialogHeader({ className, children }: { className?: string; children?: React.ReactNode }) {
  const { desktop } = useResponsiveDialog();
  return <Rise>{desktop ? <DialogHeader className={className}>{children}</DialogHeader> : <DrawerHeader className={className}>{children}</DrawerHeader>}</Rise>;
}

/** Accessible title, announced on open. Required. */
export function ResponsiveDialogTitle(props: React.ComponentProps<typeof DialogTitle>) {
  const { desktop } = useResponsiveDialog();
  return desktop ? <DialogTitle {...props} /> : <DrawerTitle {...props} />;
}

/** Supporting text linked via aria-describedby. */
export function ResponsiveDialogDescription(props: React.ComponentProps<typeof DialogDescription>) {
  const { desktop } = useResponsiveDialog();
  return desktop ? <DialogDescription {...props} /> : <DrawerDescription {...props} />;
}

/** The main content. Padded on phones to line up with the drawer header. */
export function ResponsiveDialogBody({ className, children }: { className?: string; children?: React.ReactNode }) {
  const { desktop } = useResponsiveDialog();
  return <Rise className={cn(!desktop && "overflow-y-auto px-4", className)}>{children}</Rise>;
}

/** Action row. Side by side on desktop, stacked full-width on phones. */
export function ResponsiveDialogFooter({ className, children }: { className?: string; children?: React.ReactNode }) {
  const { desktop } = useResponsiveDialog();
  return (
    <Rise>
      {desktop ? <DialogFooter className={className}>{children}</DialogFooter> : <DrawerFooter className={className}>{children}</DrawerFooter>}
    </Rise>
  );
}
