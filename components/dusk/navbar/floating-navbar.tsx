"use client";

import * as React from "react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  type Transition,
  type Variants,
} from "motion/react";

import { cn } from "@/lib/utils";

export type NavbarLink = { label: string; href: string };

const pillSpring: Transition = { type: "spring", bounce: 0.1, duration: 0.35 };
const barSpring: Transition = { type: "spring", bounce: 0, duration: 0.3 };

export interface FloatingNavbarProps extends Omit<React.ComponentProps<"div">, "children"> {
  links: NavbarLink[];
  /** Controlled active link, e.g. from `usePathname()`. */
  activeHref?: string;
  /** Uncontrolled initial active link. Defaults to the first link. */
  defaultActiveHref?: string;
  /** Called when a link is clicked. Call `event.preventDefault()` to handle navigation yourself. */
  onNavigate?: (href: string, event: React.MouseEvent<HTMLElement>) => void;
  /** Brand on the left. */
  logo?: React.ReactNode;
  /** Buttons on the right (shown at every size). */
  actions?: React.ReactNode;
  /** Scroll container to watch. Defaults to the page. */
  container?: React.RefObject<HTMLElement | null>;
  /** Slide away when scrolling down and come back when scrolling up. */
  hideOnScroll?: boolean;
  /** Always shown above this scroll offset, in px. */
  revealAt?: number;
  /** Scroll distance in one direction before it hides or shows, in px. */
  threshold?: number;
  /** Component used for links, e.g. Next.js `Link`. Defaults to `<a>`. */
  linkAs?: React.ElementType;
  /** Name of the navigation landmark. */
  "aria-label"?: string;
}

/**
 * A floating, glassy navbar that slides out of the way when you scroll down
 * and drops back in as soon as you scroll up. A pill glides to the active
 * link and a hover highlight slides between links (shared Motion `layoutId`s).
 * Below 42rem of width it collapses into a menu button with an animated panel.
 *
 * Scroll is read through `useScroll` + `useMotionValueEvent`, so it only
 * re-renders when it actually hides or shows. Pass `container` to track a
 * scrollable element instead of the page. It uses a container query, so it
 * adapts to the space it's given, not the viewport. Keyboard focus always
 * reveals it; under reduced motion it fades instead of sliding.
 */
export function FloatingNavbar({
  links,
  activeHref,
  defaultActiveHref,
  onNavigate,
  logo,
  actions,
  container,
  hideOnScroll = true,
  revealAt = 64,
  threshold = 8,
  linkAs,
  className,
  "aria-label": ariaLabel = "Main",
  ...props
}: FloatingNavbarProps) {
  const groupId = React.useId();
  const menuId = React.useId();
  const toggleRef = React.useRef<HTMLButtonElement>(null);
  const headerRef = React.useRef<HTMLElement>(null);
  const [open, setOpen] = React.useState(false);
  const [internalActive, setInternalActive] = React.useState(defaultActiveHref ?? links[0]?.href);
  const [hovered, setHovered] = React.useState<string | null>(null);
  const active = activeHref ?? internalActive;
  const Link = linkAs ?? "a";
  const reduceMotion = useReducedMotion();

  const handleNavigate = (href: string, event: React.MouseEvent<HTMLElement>) => {
    onNavigate?.(href, event);
    if (activeHref === undefined) setInternalActive(href);
    setOpen(false);
  };

  // Escape and outside clicks close the mobile menu.
  React.useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    const onPointer = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const menuVariants: Variants = reduceMotion
    ? { closed: { opacity: 0 }, open: { opacity: 1 } }
    : {
        closed: { opacity: 0, y: -4, scale: 0.98, transition: { duration: 0.12, ease: "easeIn" } },
        open: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { type: "spring", duration: 0.25, bounce: 0, staggerChildren: 0.02 },
        },
      };
  const menuItemVariants: Variants = reduceMotion
    ? {}
    : { closed: { opacity: 0, y: -4 }, open: { opacity: 1, y: 0 } };

  return (
    <AutoHide
      container={container}
      enabled={hideOnScroll}
      locked={open}
      revealAt={revealAt}
      threshold={threshold}
      className={className}
      {...props}
    >
      <header ref={headerRef} className="pointer-events-auto relative w-full max-w-3xl">
        <div
          className={cn(
            "flex h-14 items-center gap-2 rounded-xl border border-white/10 px-2 pl-4",
            "bg-background/90 supports-[backdrop-filter]:bg-background/70 supports-[backdrop-filter]:backdrop-blur-md",
            "shadow-lg"
          )}
        >
          {logo && <div className="flex shrink-0 items-center">{logo}</div>}

          <nav aria-label={ariaLabel} className="hidden flex-1 justify-center @2xl:flex">
            <LayoutGroup id={groupId}>
              <ul className="flex items-center gap-1" onPointerLeave={() => setHovered(null)}>
                {links.map((link) => {
                  const isActive = link.href === active;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        aria-current={isActive ? "page" : undefined}
                        onClick={(event: React.MouseEvent<HTMLElement>) => handleNavigate(link.href, event)}
                        onPointerEnter={(event: React.PointerEvent) => {
                          if (event.pointerType === "mouse") setHovered(link.href);
                        }}
                        className={cn(
                          "relative isolate block rounded-full px-3.5 py-1.5 text-sm font-medium outline-none transition-colors duration-200",
                          "focus-visible:ring-[3px] focus-visible:ring-ring/50",
                          isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {hovered === link.href && (
                          <motion.span
                            layoutId="navbar-hover"
                            aria-hidden
                            transition={pillSpring}
                            className="absolute inset-0 -z-20 rounded-full bg-white/5"
                          />
                        )}
                        {isActive && (
                          <motion.span
                            layoutId="navbar-active"
                            aria-hidden
                            transition={pillSpring}
                            className="absolute inset-0 -z-10 rounded-full bg-white/10"
                          />
                        )}
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </LayoutGroup>
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2 @2xl:ml-0">
            {actions}
            <button
              ref={toggleRef}
              type="button"
              aria-expanded={open}
              aria-controls={menuId}
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
              className="grid size-9 place-items-center rounded-md text-foreground outline-none transition-colors hover:bg-white/6 focus-visible:ring-[3px] focus-visible:ring-ring/50 @2xl:hidden"
            >
              <span aria-hidden className="relative block h-3 w-4">
                <motion.span
                  className="absolute inset-x-0 top-0 h-0.5 rounded-full bg-current"
                  initial={false}
                  animate={open ? { top: 5, rotate: 45 } : { top: 0, rotate: 0 }}
                  transition={barSpring}
                />
                <motion.span
                  className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-current"
                  initial={false}
                  animate={open ? { bottom: 5, rotate: -45 } : { bottom: 0, rotate: 0 }}
                  transition={barSpring}
                />
              </span>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              id={menuId}
              key="menu"
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className={cn(
                "absolute inset-x-0 top-full mt-2 origin-top rounded-xl border border-white/10 bg-popover p-2 @2xl:hidden",
                "shadow-lg"
              )}
            >
              <nav aria-label={ariaLabel}>
                <ul className="grid gap-0.5">
                  {links.map((link) => {
                    const isActive = link.href === active;
                    return (
                      <motion.li key={link.href} variants={menuItemVariants}>
                        <Link
                          href={link.href}
                          aria-current={isActive ? "page" : undefined}
                          onClick={(event: React.MouseEvent<HTMLElement>) => handleNavigate(link.href, event)}
                          className={cn(
                            "flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium outline-none transition-colors",
                            "focus-visible:ring-[3px] focus-visible:ring-ring/50",
                            isActive ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                          )}
                        >
                          {link.label}
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </AutoHide>
  );
}

interface AutoHideProps extends React.ComponentProps<"div"> {
  container?: React.RefObject<HTMLElement | null>;
  enabled: boolean;
  /** Never hide while true (e.g. the menu is open). */
  locked: boolean;
  revealAt: number;
  threshold: number;
}

/**
 * The sticky wrapper that hides and shows. Its own state changes don't
 * re-render `children`, so the layoutId pills inside never animate by accident.
 */
function AutoHide({
  container,
  enabled,
  locked,
  revealAt,
  threshold,
  className,
  children,
  onFocusCapture,
  ...props
}: AutoHideProps) {
  const reduceMotion = useReducedMotion();
  const [hidden, setHidden] = React.useState(false);
  const lastY = React.useRef(0);
  const travel = React.useRef(0);
  const { scrollY } = useScroll(container ? { container } : undefined);

  useMotionValueEvent(scrollY, "change", (y) => {
    const delta = y - lastY.current;
    lastY.current = y;
    if (!enabled || locked || y <= revealAt) {
      travel.current = 0;
      setHidden(false);
      return;
    }
    // Count distance travelled in one direction so tiny jitters don't toggle it.
    if (Math.sign(delta) !== Math.sign(travel.current)) travel.current = 0;
    travel.current += delta;
    if (travel.current > threshold) setHidden(true);
    else if (travel.current < -threshold) setHidden(false);
  });

  const isHidden = hidden && enabled && !locked;

  return (
    <motion.div
      data-slot="floating-navbar"
      data-hidden={isHidden || undefined}
      className={cn(
        "@container pointer-events-none sticky top-0 z-40 flex w-full justify-center px-3 pt-3",
        "data-hidden:[&>header]:pointer-events-none",
        className
      )}
      initial={false}
      animate={reduceMotion ? { opacity: isHidden ? 0 : 1 } : { y: isHidden ? "-110%" : "0%", opacity: 1 }}
      transition={barSpring}
      onFocusCapture={(event: React.FocusEvent<HTMLDivElement>) => {
        onFocusCapture?.(event);
        setHidden(false);
      }}
      {...(props as React.ComponentProps<typeof motion.div>)}
    >
      {children}
    </motion.div>
  );
}
