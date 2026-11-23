import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * DuskUI Textarea — a drop-in upgrade of the shadcn/ui Textarea.
 *
 * Same API as shadcn. It grows with its content (`field-sizing: content`)
 * between a 4rem minimum and whatever `max-h-*` you give it, then scrolls.
 * Adds the Input's hover state, soft focus ring, clear invalid state and a
 * tidy scrollbar. Set `className="field-sizing-fixed"` and `rows` for a
 * fixed-height box. CSS only, so it works in Server Components.
 */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs outline-none md:text-sm dark:bg-input/30",
        "transition-[color,background-color,border-color,box-shadow] duration-200 ease-out motion-reduce:transition-none",
        "placeholder:text-muted-foreground placeholder:transition-opacity focus:placeholder:opacity-60",
        "selection:bg-primary selection:text-primary-foreground",
        "hover:border-ring/40 dark:hover:bg-input/40",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:hover:border-destructive",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "read-only:bg-muted/40 read-only:focus-visible:ring-0",
        "[scrollbar-color:var(--color-border)_transparent] [scrollbar-width:thin]",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
