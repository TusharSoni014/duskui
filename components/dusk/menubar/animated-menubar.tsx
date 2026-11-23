"use client";

import * as React from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion, type Transition, type Variants } from "motion/react";
import { CheckIcon, ChevronRightIcon } from "lucide-react";

import { MenubarShortcut, MenubarSubContent } from "@/components/ui/menubar";
import { cn } from "@/lib/utils";

const glide: Transition = { type: "spring", stiffness: 500, damping: 38, mass: 0.7 };

type AnimatedMenubarContextValue = {
  /** Base for shared layoutIds, unique per menubar. */
  id: string;
  /** Value of the open menu, or "" when none is open. */
  openMenu: string;
  /** Trigger under the pointer or keyboard focus while no menu is open. */
  hovered: string | null;
  setHovered: React.Dispatch<React.SetStateAction<string | null>>;
  reduceMotion: boolean;
};

const AnimatedMenubarContext = React.createContext<AnimatedMenubarContextValue | null>(null);

function useAnimatedMenubar() {
  const context = React.useContext(AnimatedMenubarContext);
  if (!context) throw new Error("AnimatedMenubar parts must be used inside <AnimatedMenubar>.");
  return context;
}

type MenuContextValue = {
  value: string;
  open: boolean;
  /** Item under the gliding pill, by its useId. */
  activeItem: string | null;
  setActiveItem: (id: string | null) => void;
};

const MenuContext = React.createContext<MenuContextValue | null>(null);

function useMenu() {
  const context = React.useContext(MenuContext);
  if (!context) throw new Error("AnimatedMenubar menu parts must be used inside <AnimatedMenubarMenu>.");
  return context;
}

export interface AnimatedMenubarProps
  extends Omit<React.ComponentProps<typeof MenubarPrimitive.Root>, "value" | "defaultValue" | "onValueChange"> {
  /** Value of the open menu ("" when closed). */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

/**
 * A desktop-app style menubar. A highlight glides between the top-level
 * triggers as you hover or arrow across them, and stays under the open menu
 * while you sweep from menu to menu. Menus open from their trigger,
 * items cascade in, and a pill glides between items as you hover or arrow
 * through them. Built on Radix Menubar for roving focus, arrow keys,
 * typeahead, sub-menus and aria. Under reduced motion menus fade and the
 * highlights jump.
 */
export function AnimatedMenubar({
  value: valueProp,
  defaultValue = "",
  onValueChange,
  className,
  children,
  onPointerLeave,
  ...props
}: AnimatedMenubarProps) {
  const id = React.useId();
  const reduceMotion = useReducedMotion() ?? false;
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const [hovered, setHovered] = React.useState<string | null>(null);
  const openMenu = valueProp ?? uncontrolled;

  const setOpenMenu = (next: string) => {
    if (valueProp === undefined) setUncontrolled(next);
    onValueChange?.(next);
  };

  const context = React.useMemo(
    () => ({ id, openMenu, hovered, setHovered, reduceMotion }),
    [id, openMenu, hovered, reduceMotion]
  );

  return (
    <AnimatedMenubarContext.Provider value={context}>
      <LayoutGroup id={id}>
        <MenubarPrimitive.Root
          data-slot="menubar"
          value={openMenu}
          onValueChange={setOpenMenu}
          onPointerLeave={(event) => {
            onPointerLeave?.(event);
            setHovered(null);
          }}
          className={cn(
            "relative flex h-10 items-center gap-0.5 rounded-xl border bg-background p-1 shadow-xs",
            className
          )}
          {...props}
        >
          {children}
        </MenubarPrimitive.Root>
      </LayoutGroup>
    </AnimatedMenubarContext.Provider>
  );
}

export interface AnimatedMenubarMenuProps extends React.ComponentProps<typeof MenubarPrimitive.Menu> {
  /** Identifies the menu. Generated when omitted. */
  value?: string;
}

/** One top-level menu: an AnimatedMenubarTrigger and its AnimatedMenubarContent. */
export function AnimatedMenubarMenu({ value: valueProp, children, ...props }: AnimatedMenubarMenuProps) {
  const generated = React.useId();
  const value = valueProp ?? generated;
  const { openMenu } = useAnimatedMenubar();
  const open = openMenu === value;
  const [activeItem, setActiveItem] = React.useState<string | null>(null);

  const context = React.useMemo(
    // The pill is forgotten when the menu closes, so it never flashes on reopen.
    () => ({ value, open, activeItem: open ? activeItem : null, setActiveItem }),
    [value, open, activeItem]
  );

  return (
    <MenuContext.Provider value={context}>
      <MenubarPrimitive.Menu value={value} {...props}>
        {children}
      </MenubarPrimitive.Menu>
    </MenuContext.Provider>
  );
}

/** The top-level button. Shows the gliding highlight while hovered, focused or open. */
export function AnimatedMenubarTrigger({
  className,
  children,
  onPointerEnter,
  onFocus,
  onBlur,
  ...props
}: Omit<React.ComponentProps<typeof MenubarPrimitive.Trigger>, "asChild">) {
  const { id, openMenu, hovered, setHovered, reduceMotion } = useAnimatedMenubar();
  const { value, open } = useMenu();
  // While a menu is open the highlight belongs to it; otherwise it follows the pointer / focus.
  const highlighted = openMenu ? open : hovered === value;

  return (
    <MenubarPrimitive.Trigger
      data-slot="menubar-trigger"
      onPointerEnter={(event) => {
        onPointerEnter?.(event);
        if (event.pointerType === "mouse") setHovered(value);
      }}
      onFocus={(event) => {
        onFocus?.(event);
        setHovered(value);
      }}
      onBlur={(event) => {
        onBlur?.(event);
        setHovered((current) => (current === value ? null : current));
      }}
      className={cn(
        "relative flex items-center rounded-lg px-3 py-1 text-sm font-medium outline-none select-none",
        "text-foreground/75 transition-colors duration-150 motion-reduce:transition-none",
        "hover:text-foreground data-[state=open]:text-foreground",
        "focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      {highlighted && (
        <motion.span
          aria-hidden
          layoutId={`${id}-trigger`}
          className={cn(
            "absolute inset-0 rounded-lg transition-colors duration-150",
            open ? "bg-accent" : "bg-white/[0.06]"
          )}
          transition={reduceMotion ? { duration: 0 } : glide}
        />
      )}
      <span className="relative">{children}</span>
    </MenubarPrimitive.Trigger>
  );
}

export interface AnimatedMenubarContentProps
  extends Omit<React.ComponentProps<typeof MenubarPrimitive.Content>, "forceMount" | "asChild" | "children"> {
  children?: React.ReactNode;
  /** Delay between items as they cascade in, in seconds. */
  stagger?: number;
}

/** The menu surface. Fades open under its trigger and cascades its items in. */
export function AnimatedMenubarContent({
  className,
  align = "start",
  alignOffset = -4,
  sideOffset = 8,
  stagger = 0.025,
  children,
  onPointerLeave,
  ...props
}: AnimatedMenubarContentProps) {
  const { reduceMotion } = useAnimatedMenubar();
  const { open, setActiveItem } = useMenu();

  const variants: Variants = reduceMotion
    ? {
        closed: { opacity: 0, transition: { duration: 0.1 } },
        open: { opacity: 1, transition: { duration: 0.15 } },
      }
    : {
        closed: { opacity: 0, scale: 0.96, y: -4, transition: { duration: 0.1, ease: "easeIn" } },
        open: {
          opacity: 1,
          scale: 1,
          y: 0,
          transition: { duration: 0.18, ease: "easeOut", staggerChildren: stagger, delayChildren: 0.02 },
        },
      };

  return (
    <AnimatePresence>
      {open && (
        // forceMount hands mounting to AnimatePresence so the exit animation can play.
        <MenubarPrimitive.Portal forceMount>
          <MenubarPrimitive.Content
            forceMount
            asChild
            align={align}
            alignOffset={alignOffset}
            sideOffset={sideOffset}
            onPointerLeave={(event) => {
              onPointerLeave?.(event);
              setActiveItem(null);
            }}
            {...props}
          >
            <motion.div
              data-slot="menubar-content"
              className={cn(
                "z-50 min-w-56 overflow-x-hidden overflow-y-auto rounded-xl border bg-popover p-1.5 text-popover-foreground outline-none",
                "max-h-(--radix-menubar-content-available-height) origin-(--radix-menubar-content-transform-origin)",
                "shadow-lg",
                className
              )}
              variants={variants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              {children}
            </motion.div>
          </MenubarPrimitive.Content>
        </MenubarPrimitive.Portal>
      )}
    </AnimatePresence>
  );
}

function useItemVariants(): Variants {
  const { reduceMotion } = useAnimatedMenubar();
  return reduceMotion
    ? { closed: { opacity: 0, transition: { duration: 0.1 } }, open: { opacity: 1 } }
    : {
        closed: { opacity: 0, x: -4, transition: { duration: 0.08 } },
        open: { opacity: 1, x: 0, transition: { duration: 0.18, ease: "easeOut" } },
      };
}

const itemClass = cn(
  "relative flex cursor-default items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm outline-none select-none",
  "text-foreground/90 transition-colors duration-150 data-[highlighted]:text-foreground",
  "data-[disabled]:pointer-events-none data-[disabled]:opacity-45",
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
);

/** The gliding highlight behind the focused item. */
function ItemPill({ active, destructive }: { active: boolean; destructive?: boolean }) {
  const { id, reduceMotion } = useAnimatedMenubar();
  const { value } = useMenu();
  if (!active) return null;
  return (
    <motion.span
      aria-hidden
      layoutId={`${id}-${value}-item`}
      className={cn(
        "absolute inset-0 rounded-lg",
        destructive ? "bg-destructive/15" : "bg-accent"
      )}
      transition={reduceMotion ? { duration: 0 } : glide}
    />
  );
}

/** Radix focuses items on hover and arrow keys, so focus drives the pill. */
function usePillFocus(onFocus?: React.FocusEventHandler<HTMLDivElement>) {
  const itemId = React.useId();
  const { activeItem, setActiveItem } = useMenu();
  return {
    active: activeItem === itemId,
    onFocus: (event: React.FocusEvent<HTMLDivElement>) => {
      onFocus?.(event);
      setActiveItem(itemId);
    },
  };
}

export interface AnimatedMenubarItemProps extends Omit<React.ComponentProps<typeof MenubarPrimitive.Item>, "asChild"> {
  /** Leading icon. */
  icon?: React.ReactNode;
  /** Trailing keyboard hint, e.g. "⌘S". Visual only. */
  shortcut?: React.ReactNode;
  /** `destructive` tints the item and its pill red. */
  variant?: "default" | "destructive";
}

/** A menu action. `onSelect` fires on click, Enter or Space and closes the menu. */
export function AnimatedMenubarItem({
  className,
  children,
  icon,
  shortcut,
  variant = "default",
  onFocus,
  ...props
}: AnimatedMenubarItemProps) {
  const variants = useItemVariants();
  const pill = usePillFocus(onFocus);
  const destructive = variant === "destructive";

  return (
    <MenubarPrimitive.Item asChild onFocus={pill.onFocus} {...props}>
      <motion.div
        variants={variants}
        data-variant={variant}
        className={cn(itemClass, destructive && "text-destructive data-[highlighted]:text-destructive", className)}
      >
        <ItemPill active={pill.active} destructive={destructive} />
        {icon && (
          <span
            aria-hidden
            className={cn(
              "relative flex transition-colors duration-150",
              destructive ? "text-destructive" : pill.active ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {icon}
          </span>
        )}
        <span className="relative flex-1 truncate">{children}</span>
        {shortcut && <MenubarShortcut className="relative">{shortcut}</MenubarShortcut>}
      </motion.div>
    </MenubarPrimitive.Item>
  );
}

export interface AnimatedMenubarCheckboxItemProps
  extends Omit<React.ComponentProps<typeof MenubarPrimitive.CheckboxItem>, "asChild"> {
  shortcut?: React.ReactNode;
}

/** A toggleable item. The check scales in when it turns on. Use `checked` / `onCheckedChange`. */
export function AnimatedMenubarCheckboxItem({
  className,
  children,
  shortcut,
  onFocus,
  ...props
}: AnimatedMenubarCheckboxItemProps) {
  const variants = useItemVariants();
  const pill = usePillFocus(onFocus);
  const { reduceMotion } = useAnimatedMenubar();

  return (
    <MenubarPrimitive.CheckboxItem asChild onFocus={pill.onFocus} {...props}>
      <motion.div variants={variants} className={cn(itemClass, "pl-8", className)}>
        <ItemPill active={pill.active} />
        <span className="pointer-events-none absolute left-2.5 flex size-4 items-center justify-center">
          <MenubarPrimitive.ItemIndicator asChild>
            <motion.span
              initial={reduceMotion ? { opacity: 0 } : { scale: 0.6, opacity: 0 }}
              animate={reduceMotion ? { opacity: 1 } : { scale: 1, opacity: 1 }}
              transition={reduceMotion ? { duration: 0 } : { type: "spring", duration: 0.2, bounce: 0.1 }}
              className="flex"
            >
              <CheckIcon className="size-4 text-primary" />
            </motion.span>
          </MenubarPrimitive.ItemIndicator>
        </span>
        <span className="relative flex-1 truncate">{children}</span>
        {shortcut && <MenubarShortcut className="relative">{shortcut}</MenubarShortcut>}
      </motion.div>
    </MenubarPrimitive.CheckboxItem>
  );
}

/** A small heading for a group of items. Cascades in with the items. */
export function AnimatedMenubarLabel({
  className,
  ...props
}: Omit<React.ComponentProps<typeof motion.div>, "variants">) {
  const variants = useItemVariants();
  return (
    <MenubarPrimitive.Label asChild>
      <motion.div
        variants={variants}
        className={cn("px-2.5 pt-1.5 pb-1 text-xs font-medium text-muted-foreground", className)}
        {...props}
      />
    </MenubarPrimitive.Label>
  );
}

/** A divider between groups. Draws in from the left as the menu opens. */
export function AnimatedMenubarSeparator({
  className,
  ...props
}: Omit<React.ComponentProps<typeof motion.div>, "variants">) {
  const { reduceMotion } = useAnimatedMenubar();
  return (
    <MenubarPrimitive.Separator asChild>
      <motion.div
        variants={
          reduceMotion
            ? { closed: { opacity: 0, transition: { duration: 0.1 } }, open: { opacity: 1 } }
            : {
                closed: { scaleX: 0, opacity: 0, transition: { duration: 0.08 } },
                open: { scaleX: 1, opacity: 1, transition: { duration: 0.2, ease: "easeOut" } },
              }
        }
        className={cn("-mx-1.5 my-1.5 h-px origin-left bg-border", className)}
        {...props}
      />
    </MenubarPrimitive.Separator>
  );
}

/** Groups related items (role="group"). */
export const AnimatedMenubarGroup = MenubarPrimitive.Group;

/** Wraps a sub-menu: an AnimatedMenubarSubTrigger and an AnimatedMenubarSubContent. */
export const AnimatedMenubarSub = MenubarPrimitive.Sub;

/** The nested menu surface (the DuskUI MenubarSubContent). */
export const AnimatedMenubarSubContent = MenubarSubContent;

export interface AnimatedMenubarSubTriggerProps
  extends Omit<React.ComponentProps<typeof MenubarPrimitive.SubTrigger>, "asChild"> {
  icon?: React.ReactNode;
}

/** The item that opens a sub-menu. Shares the gliding pill and stays lit while its sub-menu is open. */
export function AnimatedMenubarSubTrigger({
  className,
  children,
  icon,
  onFocus,
  ...props
}: AnimatedMenubarSubTriggerProps) {
  const variants = useItemVariants();
  const pill = usePillFocus(onFocus);

  return (
    <MenubarPrimitive.SubTrigger asChild onFocus={pill.onFocus} {...props}>
      <motion.div
        variants={variants}
        className={cn(itemClass, "group/sub data-[state=open]:bg-accent/60", className)}
      >
        <ItemPill active={pill.active} />
        {icon && (
          <span
            aria-hidden
            className={cn("relative flex transition-colors duration-150", pill.active ? "text-foreground" : "text-muted-foreground")}
          >
            {icon}
          </span>
        )}
        <span className="relative flex-1 truncate">{children}</span>
        <ChevronRightIcon
          aria-hidden
          className="relative size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]/sub:translate-x-0.5 motion-reduce:transition-none"
        />
      </motion.div>
    </MenubarPrimitive.SubTrigger>
  );
}
