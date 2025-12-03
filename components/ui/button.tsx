import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2, type LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors duration-200 ease-in-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loaderIcon?: LucideIcon;
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  loaderIcon: LoaderIcon = Loader2,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  const iconSize = size === "sm" ? "size-3" : "size-4";

  // Separate icons from other children for proper animation
  const childArray = React.Children.toArray(children);
  const icons: React.ReactNode[] = [];
  const otherChildren: React.ReactNode[] = [];

  childArray.forEach((child) => {
    if (React.isValidElement(child) && typeof child.type !== "string") {
      const childType = child.type as React.ComponentType;
      const childProps = child.props as { className?: string };
      // Check if it's likely an icon component
      if (
        childType.displayName?.includes("Icon") ||
        (typeof childType === "object" && "render" in childType) ||
        (typeof childType === "function" &&
          childProps?.className?.includes("w-") &&
          childProps?.className?.includes("h-"))
      ) {
        icons.push(child);
        return;
      }
    }
    otherChildren.push(child);
  });

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || loading}
      {...props}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {loading ? (
          <motion.span
            key="loader"
            initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="inline-flex"
          >
            <LoaderIcon className={cn(iconSize, "animate-spin")} />
          </motion.span>
        ) : (
          icons.length > 0 && (
            <motion.span
              key="icons"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="inline-flex"
            >
              {icons}
            </motion.span>
          )
        )}
      </AnimatePresence>
      {otherChildren}
    </Comp>
  );
}

export { Button, buttonVariants };
