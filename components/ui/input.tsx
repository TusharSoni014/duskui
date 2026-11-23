import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * DuskUI Input — a drop-in upgrade of the shadcn/ui Input.
 *
 * Same API as shadcn. Adds a hover state, smoother focus transition, a clear
 * invalid state, dark-mode autofill without the browser's yellow fill, and
 * tidy file / search inputs. CSS only, so it works in Server Components.
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs outline-none md:text-sm dark:bg-input/30",
        "transition-[color,background-color,border-color,box-shadow] duration-200 ease-out motion-reduce:transition-none",
        "placeholder:text-muted-foreground placeholder:transition-opacity focus:placeholder:opacity-60",
        "selection:bg-primary selection:text-primary-foreground",
        "hover:border-ring/40 dark:hover:bg-input/40",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:hover:border-destructive",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "read-only:bg-muted/40 read-only:focus-visible:ring-0",
        // Keep autofilled fields on-theme instead of the browser's yellow/blue fill.
        "autofill:shadow-[inset_0_0_0_1000px_var(--card)] autofill:[-webkit-text-fill-color:var(--foreground)]",
        "file:mr-3 file:inline-flex file:h-7 file:cursor-pointer file:rounded-sm file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        "[&::-webkit-search-cancel-button]:appearance-none",
        className
      )}
      {...props}
    />
  );
}

export { Input };
