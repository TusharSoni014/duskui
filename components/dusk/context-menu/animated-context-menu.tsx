"use client";

import * as React from "react";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { AnimatePresence, motion, useReducedMotion, type Transition, type Variants } from "motion/react";
import { ChevronRight } from "lucide-react";

import { ContextMenuShortcut, ContextMenuTrigger } from "@/components/ui/context-menu";
import { cn } from "@/lib/utils";

const pillSpring: Transition = { type: "spring", stiffness: 520, damping: 38, mass: 0.6 };

type RootContextValue = { open: boolean; reduceMotion: boolean };
const RootContext = React.createContext<RootContextValue | null>(null);

/** Each surface (the menu and every sub-menu) has its own highlight. */
type SurfaceContextValue = { id: string; active: string | null; setActive: (id: string | null) => void };
const SurfaceContext = React.createContext<SurfaceContextValue | null>(null);

type SubContextValue = { open: boolean };
const SubContext = React.createContext<SubContextValue | null>(null);

function useRoot() {
  const context = React.useContext(RootContext);
  if (!context) throw new Error("AnimatedContextMenu parts must be used inside <AnimatedContextMenu>.");
  return context;
}

function useSurface() {
  const context = React.useContext(SurfaceContext);
  if (!context) throw new Error("AnimatedContextMenu items must be inside AnimatedContextMenuContent or SubContent.");
  return context;
}

function useSurfaceState() {
  const id = React.useId();
  const [active, setActive] = React.useState<string | null>(null);
  return React.useMemo(() => ({ id, active, setActive }), [id, active]);
}

export type AnimatedContextMenuProps = React.ComponentProps<typeof ContextMenuPrimitive.Root>;

/**
 * A context menu that opens from the exact point you right-clicked.
 * Items cascade in, a highlight pill glides between them as you hover or
 * arrow through, check marks draw themselves and sub-menus slide out the same
 * way. Built on Radix Context Menu, so long-press on touch, focus, typeahead,
 * arrow keys, Escape and aria all work. Under reduced motion it fades and the
 * pill jumps.
 */
export function AnimatedContextMenu({ onOpenChange, children, ...props }: AnimatedContextMenuProps) {
  const reduceMotion = useReducedMotion() ?? false;
  // Radix Context Menu is uncontrolled; mirror its state so AnimatePresence can run the exit.
  const [open, setOpen] = React.useState(false);

  const value = React.useMemo(() => ({ open, reduceMotion }), [open, reduceMotion]);

  return (
    <RootContext.Provider value={value}>
      <ContextMenuPrimitive.Root
        onOpenChange={(next) => {
          setOpen(next);
          onOpenChange?.(next);
        }}
        {...props}
      >
        {children}
      </ContextMenuPrimitive.Root>
    </RootContext.Provider>
  );
}

/** The area that opens the menu on right-click or long-press. */
export const AnimatedContextMenuTrigger = ContextMenuTrigger;

function surfaceVariants(reduceMotion: boolean, stagger: number, fromX = 0): Variants {
  return reduceMotion
    ? {
        closed: { opacity: 0, transition: { duration: 0.1 } },
        open: { opacity: 1, transition: { duration: 0.15 } },
      }
    : {
        closed: { opacity: 0, scale: 0.96, x: fromX, transition: { duration: 0.1, ease: "easeIn" } },
        open: {
          opacity: 1,
          scale: 1,
          x: 0,
          transition: { duration: 0.18, ease: "easeOut", staggerChildren: stagger, delayChildren: 0.02 },
        },
      };
}

const surfaceClass = cn(
  "z-50 min-w-52 overflow-x-hidden overflow-y-auto rounded-xl border bg-popover p-1.5 text-popover-foreground shadow-lg outline-none",
  "origin-(--radix-context-menu-content-transform-origin)"
);

export interface AnimatedContextMenuContentProps
  extends Omit<React.ComponentProps<typeof ContextMenuPrimitive.Content>, "forceMount" | "asChild" | "children"> {
  children?: React.ReactNode;
  /** Delay between items as they cascade in, in seconds. */
  stagger?: number;
}

/** The menu surface. Scales out of the cursor point and staggers its items in. */
export function AnimatedContextMenuContent({
  className,
  stagger = 0.03,
  children,
  onPointerLeave,
  ...props
}: AnimatedContextMenuContentProps) {
  const { open, reduceMotion } = useRoot();
  const surface = useSurfaceState();
  const { setActive } = surface;

  return (
    <AnimatePresence onExitComplete={() => setActive(null)}>
      {open && (
        // forceMount hands mounting to AnimatePresence so the exit animation can play.
        <ContextMenuPrimitive.Portal key="menu" forceMount>
          <ContextMenuPrimitive.Content
            forceMount
            asChild
            onPointerLeave={(event) => {
              onPointerLeave?.(event);
              setActive(null);
            }}
            {...props}
          >
            <motion.div
              className={cn(surfaceClass, "max-h-(--radix-context-menu-content-available-height)", className)}
              variants={surfaceVariants(reduceMotion, stagger)}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <SurfaceContext.Provider value={surface}>{children}</SurfaceContext.Provider>
            </motion.div>
          </ContextMenuPrimitive.Content>
        </ContextMenuPrimitive.Portal>
      )}
    </AnimatePresence>
  );
}

function useItemVariants(): Variants {
  const { reduceMotion } = useRoot();
  return reduceMotion
    ? { closed: { opacity: 0, transition: { duration: 0.1 } }, open: { opacity: 1 } }
    : {
        closed: { opacity: 0, x: -4, transition: { duration: 0.1 } },
        open: { opacity: 1, x: 0, transition: { duration: 0.18, ease: "easeOut" } },
      };
}

/** Shared item chrome: the gliding pill, optional icon and shortcut. */
function useItemHighlight() {
  const itemId = React.useId();
  const { id, active, setActive } = useSurface();
  const { reduceMotion } = useRoot();
  return {
    isActive: active === itemId,
    activate: () => setActive(itemId),
    pill: (variant: "default" | "destructive" = "default") => (
      <motion.span
        aria-hidden
        layoutId={`${id}-pill`}
        className={cn(
          "absolute inset-0 rounded-lg",
          variant === "destructive" ? "bg-destructive/15" : "bg-accent"
        )}
        transition={reduceMotion ? { duration: 0 } : pillSpring}
      />
    ),
  };
}

const itemClass = cn(
  "relative flex cursor-default items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm outline-none select-none",
  "transition-colors duration-150 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
);

export interface AnimatedContextMenuItemProps
  extends Omit<React.ComponentProps<typeof ContextMenuPrimitive.Item>, "asChild"> {
  /** Leading icon. */
  icon?: React.ReactNode;
  /** Trailing keyboard hint, e.g. "⌘C". Visual only. */
  shortcut?: React.ReactNode;
  /** `destructive` tints the item and its highlight red. */
  variant?: "default" | "destructive";
}

/** A menu action. `onSelect` fires on click, Enter or Space and closes the menu. */
export function AnimatedContextMenuItem({
  className,
  children,
  icon,
  shortcut,
  variant = "default",
  onFocus,
  ...props
}: AnimatedContextMenuItemProps) {
  const variants = useItemVariants();
  const { isActive, activate, pill } = useItemHighlight();

  return (
    <ContextMenuPrimitive.Item
      asChild
      // Radix focuses items on hover and arrow keys, so focus drives the pill.
      onFocus={(event) => {
        onFocus?.(event);
        activate();
      }}
      {...props}
    >
      <motion.div
        variants={variants}
        data-variant={variant}
        className={cn(
          itemClass,
          variant === "destructive" ? "text-destructive" : "text-foreground/90 data-[highlighted]:text-foreground",
          className
        )}
      >
        {isActive && pill(variant)}
        {icon && (
          <span
            aria-hidden
            className={cn(
              "relative flex transition-colors duration-150",
              variant === "destructive" ? "text-destructive" : isActive ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {icon}
          </span>
        )}
        <span className="relative flex-1 truncate">{children}</span>
        {shortcut && <ContextMenuShortcut className="relative">{shortcut}</ContextMenuShortcut>}
      </motion.div>
    </ContextMenuPrimitive.Item>
  );
}

export interface AnimatedContextMenuCheckboxItemProps
  extends Omit<React.ComponentProps<typeof ContextMenuPrimitive.CheckboxItem>, "asChild" | "checked"> {
  checked?: boolean;
  shortcut?: React.ReactNode;
}

/** A toggle with a check mark that draws itself in. Use `checked` / `onCheckedChange`. */
export function AnimatedContextMenuCheckboxItem({
  className,
  children,
  checked = false,
  shortcut,
  onFocus,
  ...props
}: AnimatedContextMenuCheckboxItemProps) {
  const variants = useItemVariants();
  const { reduceMotion } = useRoot();
  const { isActive, activate, pill } = useItemHighlight();

  return (
    <ContextMenuPrimitive.CheckboxItem
      asChild
      checked={checked}
      onFocus={(event) => {
        onFocus?.(event);
        activate();
      }}
      {...props}
    >
      <motion.div variants={variants} className={cn(itemClass, "text-foreground/90 data-[highlighted]:text-foreground", className)}>
        {isActive && pill()}
        <span
          aria-hidden
          className={cn(
            "relative flex size-4 items-center justify-center rounded-[5px] border transition-colors duration-150",
            checked ? "border-primary/50 bg-primary/15" : "border-white/15"
          )}
        >
          <svg viewBox="0 0 16 16" className="size-3 !text-primary" fill="none">
            <motion.path
              d="M3.5 8.5l3 3 6-7"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={false}
              animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.22, ease: "easeOut" }}
            />
          </svg>
        </span>
        <span className="relative flex-1 truncate">{children}</span>
        {shortcut && <ContextMenuShortcut className="relative">{shortcut}</ContextMenuShortcut>}
      </motion.div>
    </ContextMenuPrimitive.CheckboxItem>
  );
}

/** Holds radio items; only one can be selected. Use `value` / `onValueChange`. */
export const AnimatedContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;

/** One choice inside AnimatedContextMenuRadioGroup. Its dot springs in. */
export function AnimatedContextMenuRadioItem({
  className,
  children,
  onFocus,
  ...props
}: Omit<React.ComponentProps<typeof ContextMenuPrimitive.RadioItem>, "asChild">) {
  const variants = useItemVariants();
  const { reduceMotion } = useRoot();
  const { isActive, activate, pill } = useItemHighlight();

  return (
    <ContextMenuPrimitive.RadioItem
      asChild
      onFocus={(event) => {
        onFocus?.(event);
        activate();
      }}
      {...props}
    >
      <motion.div
        variants={variants}
        className={cn(itemClass, "group/radio text-foreground/90 data-[highlighted]:text-foreground", className)}
      >
        {isActive && pill()}
        <span
          aria-hidden
          className="relative flex size-4 items-center justify-center rounded-full border border-white/15 transition-colors duration-150 group-data-[state=checked]/radio:border-primary/50"
        >
          <ContextMenuPrimitive.ItemIndicator asChild>
            <motion.span
              className="size-2 rounded-full bg-primary"
              initial={reduceMotion ? { opacity: 0 } : { scale: 0 }}
              animate={reduceMotion ? { opacity: 1 } : { scale: 1 }}
              transition={reduceMotion ? { duration: 0 } : { type: "spring", duration: 0.2, bounce: 0.1 }}
            />
          </ContextMenuPrimitive.ItemIndicator>
        </span>
        <span className="relative flex-1 truncate">{children}</span>
      </motion.div>
    </ContextMenuPrimitive.RadioItem>
  );
}

/** A small heading for a group of items. Cascades in with the items. */
export function AnimatedContextMenuLabel({
  className,
  ...props
}: Omit<React.ComponentProps<typeof motion.div>, "variants">) {
  const variants = useItemVariants();
  return (
    <ContextMenuPrimitive.Label asChild>
      <motion.div
        variants={variants}
        className={cn("px-2.5 pt-1.5 pb-1 text-xs font-medium text-muted-foreground", className)}
        {...props}
      />
    </ContextMenuPrimitive.Label>
  );
}

/** A divider between groups. Draws in from the left as the menu opens. */
export function AnimatedContextMenuSeparator({
  className,
  ...props
}: Omit<React.ComponentProps<typeof motion.div>, "variants">) {
  const { reduceMotion } = useRoot();
  return (
    <ContextMenuPrimitive.Separator asChild>
      <motion.div
        variants={
          reduceMotion
            ? { closed: { opacity: 0, transition: { duration: 0.1 } }, open: { opacity: 1 } }
            : {
                closed: { scaleX: 0, opacity: 0, transition: { duration: 0.1 } },
                open: { scaleX: 1, opacity: 1, transition: { duration: 0.2, ease: "easeOut" } },
              }
        }
        className={cn("-mx-1.5 my-1.5 h-px origin-left bg-border", className)}
        {...props}
      />
    </ContextMenuPrimitive.Separator>
  );
}

/** Groups related items (role="group"). */
export const AnimatedContextMenuGroup = ContextMenuPrimitive.Group;

/** Wraps a sub-menu: an AnimatedContextMenuSubTrigger and its AnimatedContextMenuSubContent. */
export function AnimatedContextMenuSub({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Sub>) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = openProp ?? internalOpen;
  return (
    <SubContext.Provider value={{ open }}>
      <ContextMenuPrimitive.Sub
        open={open}
        onOpenChange={(next) => {
          if (openProp === undefined) setInternalOpen(next);
          onOpenChange?.(next);
        }}
        {...props}
      />
    </SubContext.Provider>
  );
}

/** The item that opens a sub-menu. Stays highlighted while its sub-menu is open. */
export function AnimatedContextMenuSubTrigger({
  className,
  children,
  icon,
  onFocus,
  ...props
}: Omit<React.ComponentProps<typeof ContextMenuPrimitive.SubTrigger>, "asChild"> & { icon?: React.ReactNode }) {
  const variants = useItemVariants();
  const { isActive, activate, pill } = useItemHighlight();
  const sub = React.useContext(SubContext);
  const lit = isActive || !!sub?.open;

  return (
    <ContextMenuPrimitive.SubTrigger
      asChild
      onFocus={(event) => {
        onFocus?.(event);
        activate();
      }}
      {...props}
    >
      <motion.div
        variants={variants}
        className={cn(itemClass, "text-foreground/90 data-[state=open]:text-foreground data-[highlighted]:text-foreground", className)}
      >
        {isActive && pill()}
        {!isActive && sub?.open && <span aria-hidden className="absolute inset-0 rounded-lg bg-accent/70" />}
        {icon && (
          <span aria-hidden className={cn("relative flex transition-colors duration-150", lit ? "text-foreground" : "text-muted-foreground")}>
            {icon}
          </span>
        )}
        <span className="relative flex-1 truncate">{children}</span>
        <ChevronRight
          aria-hidden
          className={cn(
            "relative text-muted-foreground transition-transform duration-200 motion-reduce:transition-none",
            sub?.open && "translate-x-0.5 text-foreground"
          )}
        />
      </motion.div>
    </ContextMenuPrimitive.SubTrigger>
  );
}

/** The nested menu surface. Slides out of its trigger and staggers its items. */
export function AnimatedContextMenuSubContent({
  className,
  stagger = 0.025,
  children,
  onPointerLeave,
  ...props
}: Omit<React.ComponentProps<typeof ContextMenuPrimitive.SubContent>, "forceMount" | "asChild" | "children"> & {
  children?: React.ReactNode;
  stagger?: number;
}) {
  const { reduceMotion } = useRoot();
  const sub = React.useContext(SubContext);
  const surface = useSurfaceState();
  const { setActive } = surface;
  if (!sub) throw new Error("AnimatedContextMenuSubContent must be inside <AnimatedContextMenuSub>.");

  return (
    <AnimatePresence onExitComplete={() => setActive(null)}>
      {sub.open && (
        <ContextMenuPrimitive.Portal key="sub" forceMount>
          <ContextMenuPrimitive.SubContent
            forceMount
            asChild
            sideOffset={6}
            alignOffset={-6}
            onPointerLeave={(event) => {
              onPointerLeave?.(event);
              setActive(null);
            }}
            {...props}
          >
            <motion.div
              className={cn(surfaceClass, "min-w-44", className)}
              variants={surfaceVariants(reduceMotion, stagger, -8)}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <SurfaceContext.Provider value={surface}>{children}</SurfaceContext.Provider>
            </motion.div>
          </ContextMenuPrimitive.SubContent>
        </ContextMenuPrimitive.Portal>
      )}
    </AnimatePresence>
  );
}
