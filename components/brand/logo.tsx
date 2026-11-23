import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * DuskUI mark: a sun at the moment of dusk — the moon cutting into its
 * edge and the light sinking below the horizon in widening bands.
 * Keep in sync with public/logo.svg and app/icon.svg.
 */
export function LogoMark({
  className,
  title,
  ...props
}: React.ComponentProps<"svg"> & { title?: string }) {
  // Unique ids so several marks on one page never share (or lose) their defs.
  const id = React.useId().replace(/:/g, "");
  const fill = `${id}-fill`;
  const cut = `${id}-cut`;

  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      className={cn("size-8 shrink-0", className)}
      {...props}
    >
      {title && <title>{title}</title>}
      <defs>
        <linearGradient id={fill} x1="9" y1="4" x2="22" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#C8FFE6" />
          <stop offset="0.45" stopColor="#34E6A0" />
          <stop offset="1" stopColor="#0B8F8C" />
        </linearGradient>
        <mask id={cut} maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
          <rect width="32" height="32" fill="#fff" />
          <circle cx="24" cy="8" r="6" fill="#000" />
          <rect x="0" y="18.2" width="32" height="1.4" fill="#000" />
          <rect x="0" y="21.6" width="32" height="1.9" fill="#000" />
          <rect x="0" y="25.2" width="32" height="3.2" fill="#000" />
        </mask>
      </defs>
      <circle cx="15" cy="16" r="12" fill={`url(#${fill})`} mask={`url(#${cut})`} />
    </svg>
  );
}

/** Mark + wordmark lockup. */
export function Logo({
  className,
  markClassName,
  showWordmark = true,
}: {
  className?: string;
  markClassName?: string;
  showWordmark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark className={markClassName} />
      {showWordmark && (
        <span className="text-lg font-semibold tracking-tight whitespace-nowrap">
          Dusk<span className="text-primary">UI</span>
        </span>
      )}
    </span>
  );
}

/** The mark as a data URI, for next/og images. */
export const logoDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none"><defs><linearGradient id="f" x1="9" y1="4" x2="22" y2="28" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#C8FFE6"/><stop offset="0.45" stop-color="#34E6A0"/><stop offset="1" stop-color="#0B8F8C"/></linearGradient><mask id="m" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32"><rect width="32" height="32" fill="#fff"/><circle cx="24" cy="8" r="6" fill="#000"/><rect x="0" y="18.2" width="32" height="1.4" fill="#000"/><rect x="0" y="21.6" width="32" height="1.9" fill="#000"/><rect x="0" y="25.2" width="32" height="3.2" fill="#000"/></mask></defs><circle cx="15" cy="16" r="12" fill="url(#f)" mask="url(#m)"/></svg>`
)}`;
