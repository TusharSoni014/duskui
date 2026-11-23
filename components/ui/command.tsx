"use client"

import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"
import { SearchIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

/**
 * DuskUI Command — a drop-in upgrade of the shadcn/ui Command (cmdk).
 *
 * Same parts, props and data-slot attributes as shadcn, plus:
 * - The result list eases its height as results filter in and out (cmdk's
 *   `--cmdk-list-height`), so the palette never jumps.
 * - The selected item eases its background in and its icon brightens.
 * - `CommandDialog` sits near the top of the screen like a real palette, and
 *   its accessible title lives inside the dialog.
 * - Shortcuts render as small keycaps.
 * - Under `prefers-reduced-motion` the height and highlight changes are instant.
 * CSS only. cmdk handles filtering, sorting and keyboard navigation.
 */
function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        "bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-xl",
        className
      )}
      {...props}
    />
  )
}

/** A Command inside a Dialog — the classic ⌘K palette. Wire the shortcut yourself. */
function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  className,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  /** Accessible title (visually hidden). */
  title?: string
  /** Accessible description (visually hidden). */
  description?: string
  className?: string
  showCloseButton?: boolean
}) {
  return (
    <Dialog {...props}>
      <DialogContent
        className={cn(
          "top-[max(1rem,12dvh)] translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-xl",
          className
        )}
        showCloseButton={showCloseButton}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Command className="[&_[cmdk-group-heading]]:text-muted-foreground **:data-[slot=command-input-wrapper]:h-12 **:data-[slot=command-input-wrapper]:pr-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5 **:data-[slot=command-list]:max-h-[min(360px,60dvh)]">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

/** The search field. Filters items as you type. */
function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div
      data-slot="command-input-wrapper"
      className="group/command-input flex h-10 items-center gap-2 border-b px-3"
    >
      <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          "placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    </div>
  )
}

/** The scrollable result list. Its height eases as results change. */
function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        "h-(--cmdk-list-height) max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto overscroll-contain",
        "transition-[height] duration-200 ease-out motion-reduce:transition-none",
        className
      )}
      {...props}
    />
  )
}

/** Shown when nothing matches the search. Fades in. */
function CommandEmpty({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className={cn(
        "text-muted-foreground animate-in fade-in-0 py-6 text-center text-sm duration-200",
        className
      )}
      {...props}
    />
  )
}

/** A titled group of items. Hidden automatically when none of its items match. */
function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "text-foreground [&_[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium",
        className
      )}
      {...props}
    />
  )
}

/** A thin divider between groups. */
function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn("bg-border -mx-1 h-px", className)}
      {...props}
    />
  )
}

/** A selectable row. `onSelect` fires on click or Enter. */
function CommandItem({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-hidden select-none",
        "transition-[color,background-color] duration-150 ease-out motion-reduce:transition-none",
        "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground",
        "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground [&_svg:not([class*='text-'])]:transition-colors data-[selected=true]:[&_svg:not([class*='text-'])]:text-foreground",
        className
      )}
      {...props}
    />
  )
}

/** Right-aligned keyboard hint, e.g. ⌘K. Visual only; wire the shortcut yourself. */
function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        "text-muted-foreground ml-auto rounded border border-white/10 bg-white/[0.04] px-1.5 py-px font-mono text-[0.7rem] tracking-widest",
        className
      )}
      {...props}
    />
  )
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}
