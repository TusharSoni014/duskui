"use client";

import * as React from "react";
import { motion } from "motion/react";
import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const tabs = ["Preview", "Code"] as const;
type Tab = (typeof tabs)[number];

interface ComponentPreviewProps {
  /** The live demo. */
  children: React.ReactNode;
  /** Server-rendered <CodeBlock /> for the Code tab. */
  code: React.ReactNode;
  className?: string;
  minHeight?: number;
}

export function ComponentPreview({
  children,
  code,
  className,
  minHeight = 240,
}: ComponentPreviewProps) {
  const id = React.useId();
  const [tab, setTab] = React.useState<Tab>("Preview");
  const [replay, setReplay] = React.useState(0);
  const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    const next = (tabs.indexOf(tab) + 1) % tabs.length;
    setTab(tabs[next]);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className={cn("my-6", className)}>
      <div className="mb-3 flex items-center justify-between border-b border-white/10">
        <div role="tablist" aria-label="Preview or code" className="flex" onKeyDown={onKeyDown}>
          {tabs.map((t, i) => {
            const active = t === tab;
            return (
              <button
                key={t}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                role="tab"
                id={`${id}-${t}-tab`}
                aria-selected={active}
                aria-controls={`${id}-${t}-panel`}
                tabIndex={active ? 0 : -1}
                onClick={() => setTab(t)}
                className={cn(
                  "relative px-3 pb-2.5 pt-1 text-sm font-medium outline-none transition-colors focus-visible:text-white",
                  active ? "text-white" : "text-white/45 hover:text-white/75"
                )}
              >
                {t}
                {active && (
                  <motion.span
                    layoutId={`${id}-indicator`}
                    className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary"
                    transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
                  />
                )}
              </button>
            );
          })}
        </div>
        {tab === "Preview" && (
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Replay preview"
            className="mb-1.5 text-white/50 hover:text-white"
            onClick={() => setReplay((n) => n + 1)}
          >
            <RotateCcw />
          </Button>
        )}
      </div>

      {/* Both panels stay in the HTML (good for SEO); only one is visible. */}
      <div
        role="tabpanel"
        id={`${id}-Preview-panel`}
        aria-labelledby={`${id}-Preview-tab`}
        hidden={tab !== "Preview"}
      >
        <div
          key={replay}
          className="relative flex flex-wrap items-center justify-center gap-3 overflow-hidden rounded-xl border border-white/10 bg-[radial-gradient(circle,rgb(255_255_255/0.06)_1px,transparent_1px)] bg-size-[16px_16px] p-8 sm:p-10"
          style={{ minHeight }}
        >
          {children}
        </div>
      </div>
      <div
        role="tabpanel"
        id={`${id}-Code-panel`}
        aria-labelledby={`${id}-Code-tab`}
        hidden={tab !== "Code"}
      >
        {code}
      </div>
    </div>
  );
}
