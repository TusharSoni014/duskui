"use client";

import * as React from "react";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export interface FadeScrollAreaProps extends React.ComponentProps<typeof ScrollArea> {
  /** Scroll direction. Horizontal areas get a horizontal scrollbar and side fades. */
  orientation?: "vertical" | "horizontal";
  /** Length of each edge fade in px. */
  fadeSize?: number;
}

function assignRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") ref(value);
  else if (ref) (ref as React.RefObject<T | null>).current = value;
}

/**
 * A Scroll Area whose edges fade out only when there's more to see. Scroll
 * down and the top edge starts to fade; reach the end and the bottom fade
 * disappears. If the content fits, there's no fade at all. The fades are a
 * CSS mask, so they work over any background, and they grow with the scroll
 * distance instead of popping. Updates run in a requestAnimationFrame and
 * never re-render React.
 */
export function FadeScrollArea({
  orientation = "vertical",
  fadeSize = 40,
  className,
  viewportClassName,
  viewportRef,
  children,
  ...props
}: FadeScrollAreaProps) {
  const localRef = React.useRef<HTMLDivElement | null>(null);
  const vertical = orientation === "vertical";

  const setViewport = React.useCallback(
    (node: HTMLDivElement | null) => {
      localRef.current = node;
      assignRef(viewportRef, node);
    },
    [viewportRef]
  );

  React.useEffect(() => {
    const el = localRef.current;
    if (!el) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const position = vertical ? el.scrollTop : Math.abs(el.scrollLeft);
      const max = vertical ? el.scrollHeight - el.clientHeight : el.scrollWidth - el.clientWidth;
      const start = Math.min(fadeSize, Math.max(0, position));
      const end = Math.min(fadeSize, Math.max(0, max - position));
      el.style.setProperty("--fade-start", `${start}px`);
      el.style.setProperty("--fade-end", `${end}px`);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    el.addEventListener("scroll", schedule, { passive: true });
    // Re-measure when the area or its content changes size.
    const observer = new ResizeObserver(schedule);
    observer.observe(el);
    if (el.firstElementChild) observer.observe(el.firstElementChild);

    return () => {
      el.removeEventListener("scroll", schedule);
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [vertical, fadeSize]);

  return (
    <ScrollArea
      data-slot="fade-scroll-area"
      className={className}
      viewportRef={setViewport}
      viewportClassName={cn(
        vertical
          ? "[mask-image:linear-gradient(to_bottom,transparent,#000_var(--fade-start),#000_calc(100%_-_var(--fade-end)),transparent)]"
          : "[mask-image:linear-gradient(to_right,transparent,#000_var(--fade-start),#000_calc(100%_-_var(--fade-end)),transparent)]",
        viewportClassName
      )}
      {...props}
    >
      {children}
      {!vertical && <ScrollBar orientation="horizontal" />}
    </ScrollArea>
  );
}
