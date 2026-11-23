"use client";

import * as React from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { ArrowUpRight } from "lucide-react";

import { HoverCard, HoverCardTrigger } from "@/components/ui/hover-card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface LinkPreviewData {
  title: string;
  description?: string;
  /** Preview image (an Open Graph image works well, 1.91:1). */
  image?: string;
  /** Shown above the title. Defaults to the link's hostname. */
  siteName?: string;
}

export interface LinkPreviewProps
  extends Omit<React.ComponentProps<"a">, "children" | "href"> {
  href: string;
  /** The link text. */
  children: React.ReactNode;
  /** What the card shows. Fetch Open Graph data on your server and pass it in. */
  preview: LinkPreviewData;
  side?: "top" | "bottom";
  /** Let the card drift toward the cursor as it moves along the link. */
  followCursor?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  openDelay?: number;
  closeDelay?: number;
  /** Classes for the floating card. */
  contentClassName?: string;
}

function hostnameOf(href: string) {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return href;
  }
}

/**
 * An inline link that previews its destination on hover. The card tips up
 * out of the link with a little perspective, then drifts along with the
 * cursor as it moves across the text. The image shimmers (DuskUI Skeleton)
 * until it has loaded, then fades in; a broken image falls back to a tinted
 * panel with the site name. The link stays a normal link: keyboard focus
 * opens the preview too, and the card is extra, never the only way to see
 * where the link goes. Static positioning and fades only under reduced motion.
 */
export function LinkPreview({
  href,
  children,
  preview,
  side = "top",
  followCursor = true,
  open: openProp,
  onOpenChange,
  openDelay = 300,
  closeDelay,
  className,
  contentClassName,
  onPointerMove,
  ...props
}: LinkPreviewProps) {
  const reduceMotion = useReducedMotion();
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = openProp ?? internalOpen;
  const site = preview.siteName ?? hostnameOf(href);

  const offset = useMotionValue(0);
  const x = useSpring(offset, { stiffness: 220, damping: 26, mass: 0.6 });

  const setOpen = (next: boolean) => {
    if (openProp === undefined) setInternalOpen(next);
    onOpenChange?.(next);
    if (next) offset.jump(0);
  };

  return (
    <HoverCard open={open} onOpenChange={setOpen} openDelay={openDelay} closeDelay={closeDelay}>
      <HoverCardTrigger asChild>
        <a
          href={href}
          className={cn(
            "rounded-sm font-medium text-primary outline-none",
            "bg-[linear-gradient(currentColor,currentColor),linear-gradient(color-mix(in_oklab,currentColor_30%,transparent),color-mix(in_oklab,currentColor_30%,transparent))]",
            "bg-size-[0%_1px,100%_1px] bg-position-[0_100%,0_100%] bg-no-repeat pb-px",
            "transition-[background-size] duration-300 ease-out hover:bg-size-[100%_1px,100%_1px] focus-visible:bg-size-[100%_1px,100%_1px]",
            "focus-visible:ring-[3px] focus-visible:ring-ring/50 motion-reduce:transition-none",
            className
          )}
          onPointerMove={(event) => {
            onPointerMove?.(event);
            if (!followCursor || reduceMotion) return;
            const rect = event.currentTarget.getBoundingClientRect();
            // Follow at 40% of the distance from the link's center, so it leans rather than chases.
            offset.set((event.clientX - (rect.left + rect.width / 2)) * 0.4);
          }}
          {...props}
        >
          {children}
        </a>
      </HoverCardTrigger>
      <AnimatePresence>
        {open && (
          <HoverCardPrimitive.Portal key="preview" forceMount>
            <HoverCardPrimitive.Content forceMount asChild side={side} align="center" sideOffset={10} collisionPadding={12}>
              <motion.div
                data-slot="link-preview"
                className="z-50 [perspective:800px]"
                style={{ x }}
              >
                <motion.a
                  href={href}
                  tabIndex={-1}
                  aria-hidden
                  className={cn(
                    "block w-72 overflow-hidden rounded-xl border bg-popover p-2 text-popover-foreground outline-none",
                    "origin-(--radix-hover-card-content-transform-origin)",
                    "shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_20px_48px_-12px_rgb(0_0_0/0.75),0_0_0_1px_rgb(0_0_0/0.2)]",
                    "transition-[border-color] duration-200 hover:border-primary/30",
                    contentClassName
                  )}
                  initial={
                    reduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, scale: 0.92, rotateX: side === "top" ? 14 : -14, y: side === "top" ? 8 : -8, filter: "blur(4px)" }
                  }
                  animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
                  exit={
                    reduceMotion
                      ? { opacity: 0, transition: { duration: 0.1 } }
                      : { opacity: 0, scale: 0.95, y: side === "top" ? 4 : -4, transition: { duration: 0.12, ease: "easeIn" } }
                  }
                  transition={{ type: "spring", duration: 0.45, bounce: 0.25 }}
                >
                  <PreviewImage src={preview.image} site={site} />
                  <div className="px-1.5 pt-2.5 pb-1">
                    <p className="flex items-center gap-1 text-[0.6875rem] font-medium tracking-wide text-muted-foreground uppercase">
                      {site}
                      <ArrowUpRight className="size-3" />
                    </p>
                    <p className="mt-1 line-clamp-2 text-sm leading-snug font-semibold">{preview.title}</p>
                    {preview.description && (
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{preview.description}</p>
                    )}
                  </div>
                </motion.a>
              </motion.div>
            </HoverCardPrimitive.Content>
          </HoverCardPrimitive.Portal>
        )}
      </AnimatePresence>
    </HoverCard>
  );
}

/** The preview image: a shimmer until it loads, then a fade-in. Falls back to a tinted panel. */
function PreviewImage({ src, site }: { src?: string; site: string }) {
  const [status, setStatus] = React.useState<"loading" | "loaded" | "error">(src ? "loading" : "error");

  return (
    <div className="relative aspect-[1.91/1] overflow-hidden rounded-lg bg-muted">
      {status === "loading" && <Skeleton className="absolute inset-0 rounded-none" />}
      {status === "error" ? (
        <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(100%_120%_at_0%_0%,color-mix(in_oklab,var(--primary)_25%,transparent),transparent_70%)]">
          <span className="text-2xl font-semibold tracking-tight text-primary/80">{site.charAt(0).toUpperCase()}</span>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- plain <img> keeps the block framework-agnostic.
        <img
          src={src}
          alt=""
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
          className={cn(
            "absolute inset-0 size-full object-cover transition-opacity duration-300",
            status === "loaded" ? "opacity-100" : "opacity-0"
          )}
        />
      )}
    </div>
  );
}
