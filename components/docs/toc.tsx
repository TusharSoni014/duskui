"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export type TocItem = { id: string; title: string; depth?: 2 | 3 };

/** "On this page" nav with a sliding indicator that tracks the visible section. */
export function Toc({ items }: { items: TocItem[] }) {
  const [active, setActive] = React.useState(items[0]?.id);

  React.useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -70% 0px" }
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label="On this page" className="text-sm">
      <p className="mb-3 font-medium text-white/80">On this page</p>
      <ul className="relative space-y-0.5 border-l border-white/10">
        {items.map((item) => {
          const isActive = item.id === active;
          return (
            <li key={item.id} className="relative">
              {isActive && (
                <motion.span
                  layoutId="toc-indicator"
                  className="absolute -left-px top-0 h-full w-px bg-primary"
                  transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                />
              )}
              <a
                href={`#${item.id}`}
                className={cn(
                  "block py-1 transition-colors",
                  item.depth === 3 ? "pl-6" : "pl-3",
                  isActive ? "text-white" : "text-white/55 hover:text-white/80"
                )}
              >
                {item.title}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
