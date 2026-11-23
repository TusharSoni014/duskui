"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion, type Transition } from "motion/react";
import { CheckIcon, CopyIcon } from "lucide-react";

import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

export interface CopyInputProps
  extends Omit<React.ComponentProps<"input">, "value" | "defaultValue" | "readOnly" | "onCopy" | "children"> {
  /** The text to show and copy. */
  value: string;
  /** Fires after a successful copy. */
  onCopy?: (value: string) => void;
  /** How long the "Copied" state lasts, in ms. */
  timeout?: number;
  /** Optional leading icon or text, e.g. `<KeyRound />` or `"npx"`. */
  addon?: React.ReactNode;
  /** Button label before copying. Set to `""` for an icon-only button. */
  copyLabel?: string;
  /** Button label after copying. */
  copiedLabel?: string;
  /** Classes for the group. `className` styles the input. */
  groupClassName?: string;
}

const iconSwap: Transition = { type: "spring", duration: 0.3, bounce: 0.3 };

async function writeClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for insecure contexts and older browsers.
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  }
}

/**
 * A read-only field with a copy button — for API keys, invite links and
 * install commands. On copy the icon morphs into a check, the label rolls to
 * "Copied" without changing the button's width, and a mint sweep runs across
 * the field. Focusing the field selects the whole value. The result is
 * announced to screen readers. Under reduced motion it only cross-fades.
 */
export function CopyInput({
  value,
  onCopy,
  timeout = 2000,
  addon,
  copyLabel = "Copy",
  copiedLabel = "Copied",
  groupClassName,
  className,
  onFocus,
  ...props
}: CopyInputProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const [copied, setCopied] = React.useState(false);
  const [sweep, setSweep] = React.useState(0);
  const timer = React.useRef<number | undefined>(undefined);

  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    const ok = await writeClipboard(value);
    if (!ok) return;
    setCopied(true);
    setSweep((n) => n + 1);
    onCopy?.(value);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), timeout);
  };

  const labelSwap = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 8, filter: "blur(2px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)" },
        exit: { opacity: 0, y: -8, filter: "blur(2px)" },
      };
  const iconMotion = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, scale: 0.4, rotate: -45 },
        animate: { opacity: 1, scale: 1, rotate: 0 },
        exit: { opacity: 0, scale: 0.4, rotate: 45 },
      };

  return (
    <InputGroup className={cn("overflow-hidden", groupClassName)}>
      {addon && <InputGroupAddon>{addon}</InputGroupAddon>}
      <InputGroupInput
        readOnly
        value={value}
        spellCheck={false}
        onFocus={(event) => {
          event.currentTarget.select();
          onFocus?.(event);
        }}
        className={cn("font-mono text-[0.8125rem] text-foreground/90", className)}
        {...props}
      />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          size={copyLabel ? "xs" : "icon-xs"}
          onClick={copy}
          aria-label={copyLabel ? undefined : copied ? copiedLabel : "Copy to clipboard"}
          className={cn("transition-colors", copied && "text-primary hover:text-primary")}
        >
          <span className="relative grid size-3.5 place-items-center">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span
                key={copied ? "check" : "copy"}
                {...iconMotion}
                transition={iconSwap}
                className="grid place-items-center [grid-area:1/1]"
              >
                {copied ? <CheckIcon className="size-3.5" /> : <CopyIcon className="size-3.5" />}
              </motion.span>
            </AnimatePresence>
          </span>
          {copyLabel ? (
            // Both labels share one grid cell, so the button keeps the width of the longer one.
            <span className="relative grid overflow-hidden">
              <span aria-hidden className="invisible [grid-area:1/1]">
                {copyLabel}
              </span>
              <span aria-hidden className="invisible [grid-area:1/1]">
                {copiedLabel}
              </span>
              <AnimatePresence initial={false} mode="popLayout">
                <motion.span key={copied ? "copied" : "copy"} {...labelSwap} transition={iconSwap} className="text-left [grid-area:1/1]">
                  {copied ? copiedLabel : copyLabel}
                </motion.span>
              </AnimatePresence>
            </span>
          ) : null}
        </InputGroupButton>
      </InputGroupAddon>

      {sweep > 0 && !reduceMotion && (
        <motion.span
          key={sweep}
          aria-hidden
          initial={{ x: "-100%", opacity: 1 }}
          animate={{ x: "100%", opacity: 0.2 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none absolute inset-0 bg-linear-to-r from-transparent via-primary/20 to-transparent"
        />
      )}
      <span className="sr-only" aria-live="polite">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </InputGroup>
  );
}
