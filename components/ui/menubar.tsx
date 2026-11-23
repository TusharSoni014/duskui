"use client"

import * as React from "react"
import * as MenubarPrimitive from "@radix-ui/react-menubar"
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * DuskUI Menubar — the shadcn/ui Menubar, styled to match the DuskUI menus.
 *
 * Same parts, props and data-slot attributes as shadcn, plus:
 * - Menus grow out of their trigger: the scale origin follows Radix's
 *   transform origin and they slide in from the side they open on, on an
 *   expo-out curve, then close quicker than they opened.
 * - The open trigger keeps a mint-tinted highlight so you can see which menu
 *   you are in; triggers ease their background on hover.
 * - Check and radio indicators pop in when an item is selected.
 * - Sub-menu chevrons nudge toward the sub-menu while it's open.
 * - Under `prefers-reduced-motion` menus only fade.
 * CSS only (tw-animate-css). Radix handles roving focus between menus, arrow
 * keys, typeahead, sub-menus and aria.
 */
function Menubar({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Root>) {
  return (
    <MenubarPrimitive.Root
      data-slot="menubar"
      className={cn(
        "flex h-10 items-center gap-1 rounded-lg border bg-background p-1",
        "shadow-[inset_0_1px_0_rgb(255_255_255/0.04),0_1px_2px_rgb(0_0_0/0.3)]",
        className
      )}
      {...props}
    />
  )
}

/** One top-level menu: a MenubarTrigger and its MenubarContent. */
function MenubarMenu({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Menu>) {
  return <MenubarPrimitive.Menu data-slot="menubar-menu" {...props} />
}

/** Groups related items. Purely semantic (role="group"). */
function MenubarGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Group>) {
  return <MenubarPrimitive.Group data-slot="menubar-group" {...props} />
}

/** Portals content to `document.body`. Content already portals itself. */
function MenubarPortal({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Portal>) {
  return <MenubarPrimitive.Portal data-slot="menubar-portal" {...props} />
}

/** Holds radio items; only one can be selected. Use `value` / `onValueChange`. */
function MenubarRadioGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
  return (
    <MenubarPrimitive.RadioGroup data-slot="menubar-radio-group" {...props} />
  )
}

/** The top-level button that opens its menu (click, Enter, Space or ArrowDown). */
function MenubarTrigger({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Trigger>) {
  return (
    <MenubarPrimitive.Trigger
      data-slot="menubar-trigger"
      className={cn(
        "flex items-center rounded-md px-2.5 py-1 text-sm font-medium outline-hidden select-none",
        "transition-[color,background-color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
        "text-foreground/80 hover:bg-accent hover:text-foreground",
        "focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "data-[state=open]:bg-primary/10 data-[state=open]:text-primary",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    />
  )
}

const surface = [
  "z-50 min-w-[12rem] overflow-x-hidden overflow-y-auto rounded-lg border bg-popover p-1 text-popover-foreground",
  "shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_16px_40px_-12px_rgb(0_0_0/0.7),0_0_0_1px_rgb(0_0_0/0.2)]",
  "ease-[cubic-bezier(0.16,1,0.3,1)]",
  "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-90 data-[state=open]:duration-200",
  "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:duration-100",
  "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  "motion-reduce:data-[state=open]:zoom-in-100 motion-reduce:data-[state=closed]:zoom-out-100",
  "motion-reduce:data-[side=bottom]:slide-in-from-top-0 motion-reduce:data-[side=left]:slide-in-from-right-0 motion-reduce:data-[side=right]:slide-in-from-left-0 motion-reduce:data-[side=top]:slide-in-from-bottom-0",
]

/** The menu surface. Portalled, positioned under its trigger and scrollable when long. */
function MenubarContent({
  className,
  align = "start",
  alignOffset = -4,
  sideOffset = 8,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Content>) {
  return (
    <MenubarPortal>
      <MenubarPrimitive.Content
        data-slot="menubar-content"
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          surface,
          "max-h-(--radix-menubar-content-available-height) origin-(--radix-menubar-content-transform-origin)",
          className
        )}
        {...props}
      />
    </MenubarPortal>
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
function MenubarItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Item> & {
  /** Indent to line up with items that have an indicator or icon. */
  inset?: boolean
  /** `destructive` tints the item (and its icon) red. */
  variant?: "default" | "destructive"
}) {
  return (
    <MenubarPrimitive.Item
      data-slot="menubar-item"
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

const indicatorSlot =
  "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center"
/** The indicator mounts when the item becomes checked, so it pops in with a little overshoot. */
const indicatorPop =
  "flex items-center justify-center animate-in zoom-in-50 fade-in-0 duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:zoom-in-100"

/** A toggleable item with a check mark. Use `checked` / `onCheckedChange`. */
function MenubarCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.CheckboxItem>) {
  return (
    <MenubarPrimitive.CheckboxItem
      data-slot="menubar-checkbox-item"
      className={cn(itemBase, "py-1.5 pr-2 pl-8", className)}
      checked={checked}
      {...props}
    >
      <span className={indicatorSlot}>
        <MenubarPrimitive.ItemIndicator className={indicatorPop}>
          <CheckIcon className="size-4 !text-primary" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.CheckboxItem>
  )
}

/** One choice inside a MenubarRadioGroup. */
function MenubarRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioItem>) {
  return (
    <MenubarPrimitive.RadioItem
      data-slot="menubar-radio-item"
      className={cn(itemBase, "py-1.5 pr-2 pl-8", className)}
      {...props}
    >
      <span className={indicatorSlot}>
        <MenubarPrimitive.ItemIndicator className={indicatorPop}>
          <CircleIcon className="size-2 fill-primary !text-primary" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.RadioItem>
  )
}

/** A non-interactive heading for a group of items. */
function MenubarLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Label> & {
  inset?: boolean
}) {
  return (
    <MenubarPrimitive.Label
      data-slot="menubar-label"
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
function MenubarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Separator>) {
  return (
    <MenubarPrimitive.Separator
      data-slot="menubar-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

/** Right-aligned keyboard hint, e.g. ⌘S. Visual only; wire the shortcut yourself. */
function MenubarShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="menubar-shortcut"
      className={cn(
        "ml-auto pl-4 font-mono text-[0.7rem] tracking-widest text-muted-foreground/80",
        className
      )}
      {...props}
    />
  )
}

/** Wraps a sub-menu: a SubTrigger and its SubContent. */
function MenubarSub({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Sub>) {
  return <MenubarPrimitive.Sub data-slot="menubar-sub" {...props} />
}

/** The item that opens a sub-menu (hover, click, or the arrow key toward it). */
function MenubarSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubTrigger> & {
  inset?: boolean
}) {
  return (
    <MenubarPrimitive.SubTrigger
      data-slot="menubar-sub-trigger"
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
    </MenubarPrimitive.SubTrigger>
  )
}

/** The nested menu surface. */
function MenubarSubContent({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubContent>) {
  return (
    <MenubarPortal>
      <MenubarPrimitive.SubContent
        data-slot="menubar-sub-content"
        className={cn(
          surface,
          "min-w-[8rem] origin-(--radix-menubar-content-transform-origin)",
          className
        )}
        {...props}
      />
    </MenubarPortal>
  )
}

export {
  Menubar,
  MenubarPortal,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarSeparator,
  MenubarLabel,
  MenubarItem,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
}
