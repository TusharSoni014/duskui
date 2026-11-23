"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "lucide-react";

import { buttonVariants, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * DuskUI Pagination — a drop-in upgrade of the shadcn/ui Pagination.
 *
 * Same parts, props and data-slot attributes as shadcn (Pagination,
 * PaginationContent, PaginationItem, PaginationLink, PaginationPrevious,
 * PaginationNext, PaginationEllipsis) plus:
 * - `asChild` on PaginationLink (and Previous / Next) to render your router's
 *   Link or a `<button>`.
 * - The current page is a soft mint surface with a faint glow.
 * - Previous / Next chevrons nudge in their direction on hover.
 * - `aria-disabled` links are dimmed and unclickable but stay focusable.
 * - The ellipsis is announced as "More pages" instead of being hidden.
 * CSS only (no Motion). Respects reduced motion.
 */
function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

function PaginationContent({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
  /** Marks the current page: sets aria-current="page" and the active style. */
  isActive?: boolean;
  /** Render the child element (e.g. Next.js `Link` or a `<button>`) instead of an `<a>`. */
  asChild?: boolean;
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">;

function PaginationLink({ className, isActive, size = "icon", asChild = false, ...props }: PaginationLinkProps) {
  const Comp = asChild ? Slot : "a";
  return (
    <Comp
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({ variant: "ghost", size }),
        "tabular-nums text-muted-foreground hover:text-foreground",
        "border border-transparent",
        "data-[active=true]:border-primary/35 data-[active=true]:bg-primary/10 data-[active=true]:text-primary",
        "data-[active=true]:shadow-[0_0_18px_-6px_var(--color-primary)] data-[active=true]:hover:bg-primary/15",
        "aria-disabled:pointer-events-none aria-disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

/** Fills an empty `asChild` child (e.g. `<button />`) with the default content. */
function withDefaultContent(asChild: boolean | undefined, children: React.ReactNode, fallback: React.ReactNode) {
  if (children == null) return fallback;
  if (
    asChild &&
    React.isValidElement<{ children?: React.ReactNode }>(children) &&
    children.props.children == null
  ) {
    return React.cloneElement(children, undefined, fallback);
  }
  return children;
}

const chevronMotion =
  "transition-transform duration-200 ease-out motion-reduce:transition-none";

function PaginationPrevious({ className, children, asChild, ...props }: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      asChild={asChild}
      className={cn("group/pagination gap-1 px-2.5 sm:pl-2.5", className)}
      {...props}
    >
      {withDefaultContent(
        asChild,
        children,
        <>
          <ChevronLeftIcon className={cn(chevronMotion, "group-hover/pagination:-translate-x-0.5 motion-reduce:group-hover/pagination:translate-x-0")} />
          <span className="hidden sm:block">Previous</span>
        </>
      )}
    </PaginationLink>
  );
}

function PaginationNext({ className, children, asChild, ...props }: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      asChild={asChild}
      className={cn("group/pagination gap-1 px-2.5 sm:pr-2.5", className)}
      {...props}
    >
      {withDefaultContent(
        asChild,
        children,
        <>
          <span className="hidden sm:block">Next</span>
          <ChevronRightIcon className={cn(chevronMotion, "group-hover/pagination:translate-x-0.5 motion-reduce:group-hover/pagination:translate-x-0")} />
        </>
      )}
    </PaginationLink>
  );
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center text-muted-foreground", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" aria-hidden />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  type PaginationLinkProps,
};
