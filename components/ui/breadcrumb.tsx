import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * DuskUI Breadcrumb — a drop-in upgrade of the shadcn/ui Breadcrumb.
 *
 * Same parts, props and data-slot attributes as shadcn (Breadcrumb,
 * BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage,
 * BreadcrumbSeparator, BreadcrumbEllipsis) plus:
 * - Links get an underline that grows in from the left on hover and a
 *   focus-visible ring.
 * - The current page is bright and carries aria-current="page" without the
 *   misleading role="link".
 * - The ellipsis is announced as "More pages" instead of being hidden.
 * CSS only — no client JavaScript, so it works in Server Components.
 */
function Breadcrumb({ ...props }: React.ComponentProps<"nav">) {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />;
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        "flex flex-wrap items-center gap-1.5 text-sm break-words text-muted-foreground sm:gap-2.5",
        className
      )}
      {...props}
    />
  );
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    />
  );
}

function BreadcrumbLink({
  asChild,
  className,
  ...props
}: React.ComponentProps<"a"> & {
  /** Render the child element (e.g. Next.js `Link`) instead of an `<a>`. */
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot : "a";
  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn(
        "relative inline-flex items-center gap-1.5 rounded-sm outline-none transition-colors duration-200 hover:text-foreground",
        "focus-visible:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50",
        // Underline that grows in from the left.
        "after:pointer-events-none after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-primary/70",
        "after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.16,1,0.3,1)] hover:after:scale-x-100",
        "motion-reduce:after:transition-none",
        "[&_svg]:size-3.5 [&_svg]:shrink-0",
        className
      )}
      {...props}
    />
  );
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-page"
      aria-current="page"
      className={cn("inline-flex items-center gap-1.5 font-medium text-foreground [&_svg]:size-3.5", className)}
      {...props}
    />
  );
}

function BreadcrumbSeparator({ children, className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn("text-muted-foreground/60 [&>svg]:size-3.5", className)}
      {...props}
    >
      {children ?? <ChevronRight />}
    </li>
  );
}

function BreadcrumbEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontal className="size-4" aria-hidden />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
