"use client"

import * as React from "react"
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu"
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * DuskUI Context Menu — the shadcn/ui Context Menu with DuskUI motion.
 *
 * Same parts, props and data-slot attributes as shadcn, plus:
 * - Menus grow out of the cursor: the scale origin follows Radix's transform
 *   origin (the click point), on an expo-out curve, and close quicker than
 *   they open.
 * - Highlighted items ease their background in; destructive items tint red.
 * - Check and radio indicators pop in when an item is selected.
 * - Sub-menu chevrons nudge toward the sub-menu while it's open.
 * - Under `prefers-reduced-motion` menus only fade.
 * CSS only (tw-animate-css). Radix handles right-click and long-press,
 * focus, typeahead, arrow keys, sub-menus and aria.
 */
function ContextMenu({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Root>) {
  return <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />
}

/** The area that opens the menu on right-click (or long-press on touch). */
function ContextMenuTrigger({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Trigger>) {
  return (
    <ContextMenuPrimitive.Trigger data-slot="context-menu-trigger" {...props} />
  )
}

/** Groups related items. Purely semantic (role="group"). */
function ContextMenuGroup({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Group>) {
  return (
    <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />
  )
}

/** Portals content to `document.body`. Content already portals itself. */
function ContextMenuPortal({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Portal>) {
  return (
    <ContextMenuPrimitive.Portal data-slot="context-menu-portal" {...props} />
  )
}

/** Wraps a sub-menu: a SubTrigger and its SubContent. */
function ContextMenuSub({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Sub>) {
  return <ContextMenuPrimitive.Sub data-slot="context-menu-sub" {...props} />
}

/** Holds radio items; only one can be selected. Use `value` / `onValueChange`. */
function ContextMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioGroup>) {
  return (
    <ContextMenuPrimitive.RadioGroup
      data-slot="context-menu-radio-group"
      {...props}
    />
  )
}

const surface = [
  "z-50 min-w-[8rem] overflow-x-hidden overflow-y-auto rounded-lg border bg-popover p-1 text-popover-foreground",
  "origin-(--radix-context-menu-content-transform-origin)",
  "shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_16px_40px_-12px_rgb(0_0_0/0.7),0_0_0_1px_rgb(0_0_0/0.2)]",
  "ease-[cubic-bezier(0.16,1,0.3,1)]",
  "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-90 data-[state=open]:duration-200",
  "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:duration-100",
  "motion-reduce:data-[state=open]:zoom-in-100 motion-reduce:data-[state=closed]:zoom-out-100",
]

/** The menu surface. Portalled and positioned at the pointer. */
function ContextMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Content>) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        data-slot="context-menu-content"
        className={cn(
          surface,
          "max-h-(--radix-context-menu-content-available-height)",
          className
        )}
        {...props}
      />
    </ContextMenuPrimitive.Portal>
  )
}

const itemBase = [
  "relative flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-hidden select-none",
  "transition-[color,background-color] duration-150 ease-out motion-reduce:transition-none",
  "focus:bg-accent focus:text-accent-foreground",
  "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
]

/** A menu action. `onSelect` fires on click, Enter or Space and closes the menu. */
function ContextMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Item> & {
  /** Indent to line up with items that have an indicator or icon. */
  inset?: boolean
  /** `destructive` tints the item (and its icon) red. */
  variant?: "default" | "destructive"
}) {
  return (
    <ContextMenuPrimitive.Item
      data-slot="context-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        itemBase,
        "data-[inset]:pl-8",
        "data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:*:[svg]:!text-destructive",
        className
      )}
      {...props}
    />
  )
}

/** The item that opens a sub-menu (hover, click, or the arrow key toward it). */
function ContextMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubTrigger> & {
  inset?: boolean
}) {
  return (
    <ContextMenuPrimitive.SubTrigger
      data-slot="context-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        itemBase,
        "group/sub data-[inset]:pl-8 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-4 transition-transform duration-200 ease-out group-data-[state=open]/sub:translate-x-0.5 motion-reduce:transition-none" />
    </ContextMenuPrimitive.SubTrigger>
  )
}

/** The nested menu surface. */
function ContextMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubContent>) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.SubContent
        data-slot="context-menu-sub-content"
        className={cn(
          surface,
          "data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2",
          "motion-reduce:data-[side=left]:slide-in-from-right-0 motion-reduce:data-[side=right]:slide-in-from-left-0",
          className
        )}
        {...props}
      />
    </ContextMenuPrimitive.Portal>
  )
}

/** The check / radio indicator slot. */
const indicatorSlot =
  "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center"
/** The indicator mounts when the item becomes checked, so it pops in with a little overshoot. */
const indicatorPop =
  "flex items-center justify-center animate-in zoom-in-50 fade-in-0 duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:zoom-in-100"

/** A toggleable item with a check mark. Use `checked` / `onCheckedChange`. */
function ContextMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.CheckboxItem>) {
  return (
    <ContextMenuPrimitive.CheckboxItem
      data-slot="context-menu-checkbox-item"
      className={cn(itemBase, "py-1.5 pr-2 pl-8", className)}
      checked={checked}
      {...props}
    >
      <span className={indicatorSlot}>
        <ContextMenuPrimitive.ItemIndicator className={indicatorPop}>
          <CheckIcon className="size-4 !text-primary" />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  )
}

/** One choice inside a ContextMenuRadioGroup. */
function ContextMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioItem>) {
  return (
    <ContextMenuPrimitive.RadioItem
      data-slot="context-menu-radio-item"
      className={cn(itemBase, "py-1.5 pr-2 pl-8", className)}
      {...props}
    >
      <span className={indicatorSlot}>
        <ContextMenuPrimitive.ItemIndicator className={indicatorPop}>
          <CircleIcon className="size-2 fill-primary !text-primary" />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  )
}

/** A non-interactive heading for a group of items. */
function ContextMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Label> & {
  inset?: boolean
}) {
  return (
    <ContextMenuPrimitive.Label
      data-slot="context-menu-label"
      data-inset={inset}
      className={cn(
        "px-2 py-1.5 text-xs font-medium text-muted-foreground data-[inset]:pl-8",
        className
      )}
      {...props}
    />
  )
}

/** A thin divider between groups. */
function ContextMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Separator>) {
  return (
    <ContextMenuPrimitive.Separator
      data-slot="context-menu-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

/** Right-aligned keyboard hint, e.g. ⌘C. Visual only; wire the shortcut yourself. */
function ContextMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="context-menu-shortcut"
      className={cn(
        "ml-auto font-mono text-[0.7rem] tracking-widest text-muted-foreground/80",
        className
      )}
      {...props}
    />
  )
}

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
}
