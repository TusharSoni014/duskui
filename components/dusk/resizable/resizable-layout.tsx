"use client";

import * as React from "react";
import { usePanelRef } from "react-resizable-panels";
import { useReducedMotion } from "motion/react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { cn } from "@/lib/utils";

/** How long the collapse / expand tween runs, in ms. */
const TWEEN_MS = 320;

type ResizableLayoutContextValue = {
  collapsed: boolean;
  toggle: () => void;
  sidebarId: string;
};

const ResizableLayoutContext = React.createContext<ResizableLayoutContextValue | null>(null);

/** Read and toggle the sidebar from anywhere inside a ResizableLayout. */
export function useResizableLayout() {
  const context = React.useContext(ResizableLayoutContext);
  if (!context) throw new Error("useResizableLayout must be used inside <ResizableLayout>.");
  return context;
}

export interface ResizableLayoutProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** Sidebar contents. A function receives `{ collapsed }` so it can render an icon rail. */
  sidebar: React.ReactNode | ((state: { collapsed: boolean }) => React.ReactNode);
  /** The main area. */
  children: React.ReactNode;
  /** Optional bottom panel under the main area (a terminal, logs…), resizable vertically. */
  bottom?: React.ReactNode;
  /** Sidebar width on first render. Strings without a unit are percentages. */
  sidebarDefaultSize?: number | string;
  /** Narrowest the open sidebar can be dragged before it snaps shut. */
  sidebarMinSize?: number | string;
  sidebarMaxSize?: number | string;
  /** Width of the collapsed icon rail. `0` hides the sidebar completely. */
  collapsedSize?: number | string;
  /** Bottom panel height on first render, as a percentage string. */
  bottomDefaultSize?: number | string;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Accessible name of the sidebar region. */
  sidebarLabel?: string;
}

/**
 * An IDE-style layout: a collapsible sidebar, a main area and an optional
 * bottom panel, all resizable by pointer or keyboard (focus a divider, then
 * use the arrow keys, Home or End). Dragging the sidebar below its minimum
 * snaps it into an icon rail; the toggle button (or `useResizableLayout`)
 * collapses and expands it with a smooth tween. Built on the DuskUI
 * Resizable (react-resizable-panels v4). Under reduced motion it snaps.
 */
export function ResizableLayout({
  sidebar,
  children,
  bottom,
  sidebarDefaultSize = "24",
  sidebarMinSize = 180,
  sidebarMaxSize = "40",
  collapsedSize = 52,
  bottomDefaultSize = "32",
  defaultCollapsed = false,
  onCollapsedChange,
  sidebarLabel = "Sidebar",
  className,
  ...props
}: ResizableLayoutProps) {
  const sidebarId = React.useId();
  const reduceMotion = useReducedMotion();
  const panelRef = usePanelRef();
  const groupRef = React.useRef<HTMLDivElement>(null);
  const tweenTimer = React.useRef<number | undefined>(undefined);
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed);

  React.useEffect(() => () => window.clearTimeout(tweenTimer.current), []);

  const collapsedRef = React.useRef(defaultCollapsed);
  const handleResize = React.useCallback(
    () => {
      const next = panelRef.current?.isCollapsed() ?? false;
      if (next === collapsedRef.current) return;
      collapsedRef.current = next;
      setCollapsed(next);
      onCollapsedChange?.(next);
    },
    [panelRef, onCollapsedChange]
  );

  const toggle = React.useCallback(() => {
    const panel = panelRef.current;
    const group = groupRef.current;
    if (!panel) return;
    // Panels animate flex-grow only while this attribute is set, so dragging stays 1:1.
    if (group && !reduceMotion) {
      group.dataset.tween = "";
      window.clearTimeout(tweenTimer.current);
      tweenTimer.current = window.setTimeout(() => {
        delete group.dataset.tween;
      }, TWEEN_MS + 40);
    }
    if (panel.isCollapsed()) panel.expand();
    else panel.collapse();
  }, [panelRef, reduceMotion]);

  const context = React.useMemo(() => ({ collapsed, toggle, sidebarId }), [collapsed, toggle, sidebarId]);

  return (
    <ResizableLayoutContext.Provider value={context}>
      <div
        className={cn(
          "h-full w-full overflow-hidden rounded-xl border bg-background",
          "shadow-[inset_0_1px_0_rgb(255_255_255/0.04),0_16px_48px_-24px_rgb(0_0_0/0.8)]",
          className
        )}
        {...props}
      >
        <ResizablePanelGroup
          orientation="horizontal"
          elementRef={groupRef}
          className={cn(
            "[&[data-tween]>[data-panel]]:transition-[flex-grow]",
            "[&[data-tween]>[data-panel]]:duration-[320ms]",
            "[&[data-tween]>[data-panel]]:ease-[cubic-bezier(0.32,0.72,0,1)]"
          )}
        >
          <ResizablePanel
            id={sidebarId}
            panelRef={panelRef}
            collapsible
            collapsedSize={collapsedSize}
            defaultSize={defaultCollapsed ? collapsedSize : sidebarDefaultSize}
            minSize={sidebarMinSize}
            maxSize={sidebarMaxSize}
            onResize={handleResize}
            role="region"
            aria-label={sidebarLabel}
            data-collapsed={collapsed || undefined}
            className="bg-white/[0.015]"
          >
            {typeof sidebar === "function" ? sidebar({ collapsed }) : sidebar}
          </ResizablePanel>
          <ResizableHandle withHandle aria-label={`Resize ${sidebarLabel.toLowerCase()}`} />
          <ResizablePanel minSize="30">
            {bottom ? (
              <ResizablePanelGroup orientation="vertical">
                <ResizablePanel minSize="25">{children}</ResizablePanel>
                <ResizableHandle aria-label="Resize bottom panel" />
                <ResizablePanel defaultSize={bottomDefaultSize} minSize="12" collapsible collapsedSize={0}>
                  {bottom}
                </ResizablePanel>
              </ResizablePanelGroup>
            ) : (
              children
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </ResizableLayoutContext.Provider>
  );
}

/** A button that collapses / expands the sidebar. Announces its state via aria-expanded. */
export function ResizableLayoutToggle({ className, onClick, ...props }: React.ComponentProps<"button">) {
  const { collapsed, toggle, sidebarId } = useResizableLayout();
  const Icon = collapsed ? PanelLeftOpen : PanelLeftClose;

  return (
    <button
      type="button"
      aria-expanded={!collapsed}
      aria-controls={sidebarId}
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) toggle();
      }}
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground outline-none",
        "transition-[color,background-color,box-shadow] duration-150 hover:bg-accent hover:text-foreground",
        "focus-visible:ring-[3px] focus-visible:ring-ring/50",
        className
      )}
      {...props}
    >
      <Icon className="size-4" aria-hidden />
    </button>
  );
}
