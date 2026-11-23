"use client";

import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
  type Transition,
  type Variants,
} from "motion/react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

type PageItem = number | "start-ellipsis" | "end-ellipsis";

const range = (start: number, end: number) =>
  Array.from({ length: Math.max(0, end - start + 1) }, (_, i) => start + i);

/**
 * The visible page items. When there are more pages than fit, the result always
 * has the same length (2·boundary + 2·siblings + 3), so the bar never changes
 * width while you page through.
 */
export function getPaginationItems(
  page: number,
  totalPages: number,
  siblingCount = 1,
  boundaryCount = 1
): PageItem[] {
  const slots = boundaryCount * 2 + siblingCount * 2 + 3;
  if (totalPages <= slots) return range(1, totalPages);

  const startPages = range(1, boundaryCount);
  const endPages = range(totalPages - boundaryCount + 1, totalPages);

  const siblingsStart = Math.max(
    Math.min(page - siblingCount, totalPages - boundaryCount - siblingCount * 2 - 1),
    boundaryCount + 2
  );
  const siblingsEnd = Math.min(
    Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2),
    totalPages - boundaryCount - 1
  );

  return [
    ...startPages,
    siblingsStart > boundaryCount + 2 ? "start-ellipsis" : boundaryCount + 1,
    ...range(siblingsStart, siblingsEnd),
    siblingsEnd < totalPages - boundaryCount - 1 ? "end-ellipsis" : totalPages - boundaryCount,
    ...endPages,
  ];
}

const indicatorSpring: Transition = { type: "spring", bounce: 0.1, duration: 0.3 };
const rollSpring: Transition = { type: "spring", bounce: 0, duration: 0.25 };

export interface AnimatedPaginationProps
  extends Omit<React.ComponentProps<"nav">, "onChange" | "children"> {
  /** Number of pages. */
  totalPages: number;
  /** Controlled current page (1-based). */
  page?: number;
  /** Uncontrolled initial page. */
  defaultPage?: number;
  /** Called with the new page. */
  onPageChange?: (page: number) => void;
  /** Pages shown on each side of the current one. */
  siblingCount?: number;
  /** Pages always shown at the start and end. */
  boundaryCount?: number;
  /** Show the Previous / Next buttons. */
  showControls?: boolean;
  /** Text of the Previous / Next buttons (hidden on small screens). Pass `null` for icon-only. */
  labels?: { previous: React.ReactNode; next: React.ReactNode } | null;
  /**
   * Render real links: return the URL of a page. Clicks still call `onPageChange`;
   * call `event.preventDefault()` there or use `linkAs` for client-side routing.
   */
  getPageHref?: (page: number) => string;
  /** Component used for links when `getPageHref` is set, e.g. Next.js `Link`. */
  linkAs?: React.ElementType;
}

/**
 * Pagination with an indicator that glides to the current page (a shared
 * Motion `layoutId`), page numbers that roll up or down as the window of pages
 * shifts, and a smart ellipsis range that keeps the bar a constant width.
 *
 * Built on the DuskUI Pagination primitive: a `nav` landmark with
 * aria-current="page", and focus follows the page you pick. Renders buttons by
 * default, or real links with `getPageHref`.
 */
export function AnimatedPagination({
  totalPages,
  page: pageProp,
  defaultPage = 1,
  onPageChange,
  siblingCount = 1,
  boundaryCount = 1,
  showControls = true,
  labels = { previous: "Previous", next: "Next" },
  getPageHref,
  linkAs,
  className,
  ...props
}: AnimatedPaginationProps) {
  const layoutId = React.useId();
  const reduceMotion = useReducedMotion();
  const navRef = React.useRef<HTMLElement>(null);
  const refocus = React.useRef(false);
  const [uncontrolled, setUncontrolled] = React.useState(defaultPage);
  const total = Math.max(1, Math.floor(totalPages));
  const page = Math.min(Math.max(1, pageProp ?? uncontrolled), total);

  // Direction of travel, so numbers roll the right way. Derived during render
  // from the previous page (React's "store info from previous renders" pattern).
  const [prevPage, setPrevPage] = React.useState(page);
  const [direction, setDirection] = React.useState(0);
  if (prevPage !== page) {
    setPrevPage(page);
    setDirection(Math.sign(page - prevPage));
  }

  const items = getPaginationItems(page, total, siblingCount, boundaryCount);

  // Focus follows the page you clicked, since the clicked slot may now show another number.
  React.useEffect(() => {
    if (!refocus.current) return;
    refocus.current = false;
    navRef.current?.querySelector<HTMLElement>('[aria-current="page"]')?.focus();
  }, [page]);

  const go = (next: number, fromNumber = false) => {
    const clamped = Math.min(Math.max(1, next), total);
    if (clamped === page) return;
    refocus.current = fromNumber;
    if (pageProp === undefined) setUncontrolled(clamped);
    onPageChange?.(clamped);
  };

  const offset = reduceMotion ? 0 : 14;
  const roll: Variants = {
    enter: (dir: number) => ({ y: dir * offset, opacity: 0, filter: "blur(2px)" }),
    center: { y: 0, opacity: 1, filter: "blur(0px)", transitionEnd: { filter: "none" } },
    exit: (dir: number) => ({ y: dir * -offset, opacity: 0, filter: "blur(2px)" }),
  };

  const renderLink = (
    target: number,
    content: React.ReactNode,
    extra: { isActive?: boolean; disabled?: boolean; fromNumber?: boolean; size?: "icon" | "default"; className?: string; label: string }
  ) => {
    const handleClick = (event: React.MouseEvent) => {
      if (extra.disabled) {
        event.preventDefault();
        return;
      }
      go(target, extra.fromNumber);
    };
    const common = {
      "aria-label": extra.label,
      "aria-disabled": extra.disabled || undefined,
      onClick: handleClick,
    };
    const LinkComp = linkAs ?? "a";
    return (
      <PaginationLink asChild isActive={extra.isActive} size={extra.size} className={extra.className}>
        {getPageHref && !extra.disabled ? (
          <LinkComp href={getPageHref(target)} {...common}>
            {content}
          </LinkComp>
        ) : getPageHref ? (
          // A disabled link has no href, so it can't be followed.
          <a role="link" tabIndex={0} {...common}>
            {content}
          </a>
        ) : (
          <button type="button" {...common}>
            {content}
          </button>
        )}
      </PaginationLink>
    );
  };

  return (
    <Pagination ref={navRef} className={className} {...props}>
      <LayoutGroup id={layoutId}>
        <PaginationContent>
          {showControls && (
            <PaginationItem>
              {renderLink(
                page - 1,
                <>
                  <ChevronLeftIcon className="transition-transform duration-200 group-hover/pagination:-translate-x-0.5 motion-reduce:transition-none" />
                  {labels && <span className="hidden sm:block">{labels.previous}</span>}
                </>,
                {
                  label: "Go to previous page",
                  disabled: page <= 1,
                  size: labels ? "default" : "icon",
                  className: cn("group/pagination", labels && "gap-1 px-2 sm:px-2.5"),
                }
              )}
            </PaginationItem>
          )}

          {items.map((item, slot) => {
            const isActive = item === page;
            return (
              // Keyed by slot, so a slot keeps its place while its number rolls.
              <PaginationItem key={slot}>
                {typeof item === "number" ? (
                  renderLink(
                    item,
                    <>
                      {isActive && (
                        <motion.span
                          layoutId="pagination-indicator"
                          aria-hidden
                          transition={reduceMotion ? { duration: 0 } : indicatorSpring}
                          className="pointer-events-none absolute inset-0 -z-10 rounded-md border bg-accent"
                        />
                      )}
                      <span className="relative grid h-full min-w-[3ch] place-items-center overflow-hidden">
                        <AnimatePresence initial={false} custom={direction}>
                          <motion.span
                            key={item}
                            custom={direction}
                            variants={roll}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={rollSpring}
                            className="col-start-1 row-start-1"
                          >
                            {item}
                          </motion.span>
                        </AnimatePresence>
                      </span>
                    </>,
                    {
                      label: isActive ? `Page ${item}` : `Go to page ${item}`,
                      isActive,
                      fromNumber: true,
                      size: "icon",
                      // The gliding indicator replaces the primitive's static active surface.
                      className:
                        "isolate data-[active=true]:border-transparent data-[active=true]:bg-transparent data-[active=true]:shadow-none data-[active=true]:hover:bg-transparent",
                    }
                  )
                ) : (
                  <PaginationEllipsis />
                )}
              </PaginationItem>
            );
          })}

          {showControls && (
            <PaginationItem>
              {renderLink(
                page + 1,
                <>
                  {labels && <span className="hidden sm:block">{labels.next}</span>}
                  <ChevronRightIcon className="transition-transform duration-200 group-hover/pagination:translate-x-0.5 motion-reduce:transition-none" />
                </>,
                {
                  label: "Go to next page",
                  disabled: page >= total,
                  size: labels ? "default" : "icon",
                  className: cn("group/pagination", labels && "gap-1 px-2 sm:px-2.5"),
                }
              )}
            </PaginationItem>
          )}
        </PaginationContent>
      </LayoutGroup>
    </Pagination>
  );
}
