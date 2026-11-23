"use client";

import * as React from "react";
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
  XIcon,
} from "lucide-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

import { cn } from "@/lib/utils";

/*
 * Sonner injects its own unlayered CSS, which beats Tailwind's layered
 * utilities. So colors go through Sonner's CSS variables, and the few extra
 * styles use `!` and are scoped to `data-[styled=true]` so they never touch
 * fully custom toasts (`toast.custom`).
 */
const toastClassNames: NonNullable<NonNullable<ToasterProps["toastOptions"]>["classNames"]> = {
  toast: cn(
    "data-[styled=true]:gap-2.5! data-[styled=true]:px-4! data-[styled=true]:py-3.5!",
    "data-[styled=true]:shadow-lg!",
    "data-[styled=true]:focus-visible:ring-[3px]! data-[styled=true]:focus-visible:ring-ring/50!"
  ),
  title: "text-sm! font-medium! leading-snug!",
  description: "text-[0.8125rem]! leading-snug! text-muted-foreground!",
  icon: "self-start! mt-0.5!",
  actionButton: cn(
    "h-7! rounded-md! bg-primary! px-2.5! text-xs! font-medium! text-primary-foreground!",
    "transition-[background-color,box-shadow]! hover:bg-primary/90! focus-visible:ring-[3px]! focus-visible:ring-ring/50!"
  ),
  cancelButton: cn(
    "h-7! rounded-md! bg-secondary! px-2.5! text-xs! font-medium! text-secondary-foreground!",
    "transition-colors! hover:bg-secondary/80! focus-visible:ring-[3px]! focus-visible:ring-ring/50!"
  ),
  closeButton: cn(
    "border-border! bg-popover! text-muted-foreground! transition-colors!",
    "hover:bg-accent! hover:text-foreground! focus-visible:ring-[3px]! focus-visible:ring-ring/50!"
  ),
};

/** Merges our class names with any the caller passes, key by key. */
function mergeClassNames(
  extra: NonNullable<ToasterProps["toastOptions"]>["classNames"]
): NonNullable<ToasterProps["toastOptions"]>["classNames"] {
  if (!extra) return toastClassNames;
  const keys = new Set([...Object.keys(toastClassNames), ...Object.keys(extra)]) as Set<
    keyof typeof toastClassNames
  >;
  const merged: typeof toastClassNames = {};
  for (const key of keys) merged[key] = cn(toastClassNames[key], extra[key]);
  return merged;
}

/**
 * DuskUI Toaster — a drop-in upgrade of the shadcn/ui Sonner Toaster.
 *
 * Same component and props as shadcn (every Sonner `ToasterProps`), plus:
 * - Dark by default and styled with the DuskUI tokens: popover surface,
 *   neutral shadow, mint action button, tinted status icons.
 * - On-brand `richColors` (success, info, warning, error).
 * - Your `toastOptions.classNames` are merged with ours instead of replacing them.
 * Fire toasts with `toast()` from "sonner" anywhere in your app.
 * Sonner already pauses on hover, supports swipe-to-dismiss and keyboard
 * focus (Alt+T), and disables its animations under reduced motion.
 */
function Toaster({ theme = "dark", className, toastOptions, style, icons, ...props }: ToasterProps) {
  return (
    <Sonner
      theme={theme}
      // Sonner sets a system font stack on the toaster; use the app font instead.
      className={cn("toaster group font-sans!", className)}
      icons={{
        success: <CircleCheckIcon className="size-4 text-emerald-300" />,
        info: <InfoIcon className="size-4 text-sky-300" />,
        warning: <TriangleAlertIcon className="size-4 text-amber-300" />,
        error: <OctagonXIcon className="size-4 text-destructive" />,
        loading: <Loader2Icon className="size-4 animate-spin text-muted-foreground motion-reduce:animate-none" />,
        close: <XIcon className="size-3" />,
        ...icons,
      }}
      toastOptions={{
        ...toastOptions,
        classNames: mergeClassNames(toastOptions?.classNames),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-bg-hover": "var(--accent)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--normal-border-hover": "var(--input)",
          "--border-radius": "calc(var(--radius) + 4px)",
          "--success-bg": "color-mix(in oklab, oklch(0.765 0.177 163.2) 10%, var(--popover))",
          "--success-border": "color-mix(in oklab, oklch(0.765 0.177 163.2) 25%, transparent)",
          "--success-text": "oklch(0.845 0.143 165)",
          "--info-bg": "color-mix(in oklab, oklch(0.746 0.16 232.7) 10%, var(--popover))",
          "--info-border": "color-mix(in oklab, oklch(0.746 0.16 232.7) 25%, transparent)",
          "--info-text": "oklch(0.828 0.111 230.3)",
          "--warning-bg": "color-mix(in oklab, oklch(0.828 0.189 84.4) 10%, var(--popover))",
          "--warning-border": "color-mix(in oklab, oklch(0.828 0.189 84.4) 25%, transparent)",
          "--warning-text": "oklch(0.879 0.169 91.6)",
          "--error-bg": "color-mix(in oklab, var(--destructive) 14%, var(--popover))",
          "--error-border": "color-mix(in oklab, var(--destructive) 35%, transparent)",
          "--error-text": "oklch(0.8 0.12 25)",
          ...style,
        } as React.CSSProperties
      }
      {...props}
    />
  );
}

export { Toaster };
