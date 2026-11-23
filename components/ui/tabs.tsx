"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * DuskUI Tabs — a drop-in upgrade of the shadcn/ui Tabs.
 *
 * Same parts, props and data-slot attributes as shadcn (Tabs, TabsList,
 * TabsTrigger, TabsContent) plus:
 * - `variant` on TabsList: `default` (segmented surface) or `line` (an
 *   underline that grows in under the active trigger).
 * - Vertical orientation styles out of the box (`orientation="vertical"`).
 * - Panels fade and rise in when they become active, and show a focus ring
 *   when focused from the keyboard.
 * - Hover, active and focus-visible states with smooth color transitions.
 * - Under `prefers-reduced-motion` panels only fade.
 * CSS only (tw-animate-css), powered by Radix for roving focus and aria.
 */
function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      orientation={orientation}
      className={cn("flex gap-2 data-[orientation=horizontal]:flex-col", className)}
      {...props}
    />
  );
}

const tabsListVariants = cva(
  [
    "inline-flex w-fit items-center justify-center text-muted-foreground",
    "data-[orientation=vertical]:h-fit data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch",
  ],
  {
    variants: {
      variant: {
        default:
          "h-9 rounded-lg bg-muted p-[3px] shadow-[inset_0_1px_2px_rgb(0_0_0/0.35)] data-[orientation=vertical]:gap-0.5",
        line: "h-9 gap-1 border-b border-border data-[orientation=vertical]:gap-0.5 data-[orientation=vertical]:border-b-0 data-[orientation=vertical]:border-s",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const tabsTriggerVariants = cva(
  [
    "relative inline-flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-md border border-transparent px-2.5 py-1 text-sm font-medium text-muted-foreground outline-none select-none",
    "transition-[color,background-color,border-color,box-shadow] duration-200 ease-out motion-reduce:transition-none",
    "hover:text-foreground data-[state=active]:text-foreground",
    "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
    "disabled:pointer-events-none disabled:opacity-50",
    "data-[orientation=vertical]:w-full data-[orientation=vertical]:flex-none data-[orientation=vertical]:justify-start",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        default: [
          "h-[calc(100%-1px)] data-[orientation=vertical]:h-8",
          "data-[state=active]:border-white/10 data-[state=active]:bg-background",
          "data-[state=active]:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_1px_3px_rgb(0_0_0/0.4)]",
        ],
        line: [
          "h-full rounded-b-none data-[orientation=vertical]:h-8 data-[orientation=vertical]:rounded-s-none data-[orientation=vertical]:rounded-e-md",
          // The underline: grows from the center on the active trigger.
          "after:pointer-events-none after:absolute after:inset-x-1.5 after:-bottom-px after:h-0.5 after:rounded-full after:bg-primary",
          "after:scale-x-0 after:transition-[scale] after:duration-300 after:ease-[cubic-bezier(0.16,1,0.3,1)] data-[state=active]:after:scale-x-100",
          "data-[orientation=vertical]:after:inset-x-auto data-[orientation=vertical]:after:inset-y-1.5 data-[orientation=vertical]:after:-start-px data-[orientation=vertical]:after:bottom-auto data-[orientation=vertical]:after:h-auto data-[orientation=vertical]:after:w-0.5",
          "data-[orientation=vertical]:after:scale-x-100 data-[orientation=vertical]:after:scale-y-0 data-[orientation=vertical]:data-[state=active]:after:scale-y-100",
          "motion-reduce:after:transition-none",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

type TabsVariant = NonNullable<VariantProps<typeof tabsListVariants>["variant"]>;

const TabsVariantContext = React.createContext<TabsVariant>("default");

/** The row (or column) of triggers. `variant="line"` swaps the segmented surface for an underline. */
function TabsList({
  className,
  variant,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & VariantProps<typeof tabsListVariants>) {
  const resolved = variant ?? "default";
  return (
    <TabsVariantContext.Provider value={resolved}>
      <TabsPrimitive.List
        data-slot="tabs-list"
        data-variant={resolved}
        className={cn(tabsListVariants({ variant: resolved }), className)}
        {...props}
      />
    </TabsVariantContext.Provider>
  );
}

/** A button that activates its panel. Arrow keys move between triggers. */
function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const variant = React.useContext(TabsVariantContext);
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(tabsTriggerVariants({ variant }), className)}
      {...props}
    />
  );
}

/** The panel shown when its `value` is active. */
function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        "flex-1 rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-1 data-[state=active]:duration-300 data-[state=active]:ease-[cubic-bezier(0.16,1,0.3,1)]",
        "motion-reduce:data-[state=active]:slide-in-from-bottom-0",
        className
      )}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants, tabsTriggerVariants };
