"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Copy } from "lucide-react";

import { Button, type ButtonProps } from "@/components/ui/button";

export interface CopyButtonProps extends Omit<ButtonProps, "value"> {
  /** Text written to the clipboard. */
  value: string;
  /** Called after a successful copy. */
  onCopied?: (value: string) => void;
  /** How long the success state stays visible, in ms. */
  timeout?: number;
}

const iconMotion = {
  initial: { opacity: 0, scale: 0.6 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.6 },
  transition: { type: "spring", duration: 0.2, bounce: 0 },
} as const;

/** Icon button that copies text and morphs its icon into a check mark. */
export function CopyButton({
  value,
  onCopied,
  timeout = 1600,
  variant = "ghost",
  size = "icon-sm",
  children,
  onClick,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined);

  React.useEffect(() => () => clearTimeout(timer.current), []);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      onCopied?.(value);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), timeout);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      aria-label={copied ? "Copied" : "Copy to clipboard"}
      onClick={handleClick}
      {...props}
    >
      <span className="relative inline-flex">
        <AnimatePresence mode="popLayout" initial={false}>
          {copied ? (
            <motion.span key="check" className="inline-flex text-emerald-400" {...iconMotion}>
              <Check />
            </motion.span>
          ) : (
            <motion.span key="copy" className="inline-flex" {...iconMotion}>
              <Copy />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      {children}
    </Button>
  );
}
