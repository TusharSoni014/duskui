"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion, type Transition } from "motion/react";
import { CircleAlertIcon, CircleCheckIcon, LockIcon, LockOpenIcon } from "lucide-react";

import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

type Protocol = "https://" | "http://";

export interface UrlInputProps
  extends Omit<React.ComponentProps<"input">, "value" | "defaultValue" | "type" | "children"> {
  /** The full URL including protocol (controlled). Empty string when the field is empty. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (url: string) => void;
  /** Show a check / warning icon once something is typed. */
  showStatus?: boolean;
  /** Classes for the group. `className` styles the input. */
  groupClassName?: string;
}

const spring: Transition = { type: "spring", duration: 0.35, bounce: 0.25 };

function split(url: string): { protocol: Protocol; rest: string } {
  const match = /^(https?):\/\//i.exec(url.trim());
  if (!match) return { protocol: "https://", rest: url.trim() };
  return { protocol: match[1].toLowerCase() === "http" ? "http://" : "https://", rest: url.trim().slice(match[0].length) };
}

/** True for URLs with a dotted hostname (or localhost). */
export function isValidUrl(url: string) {
  try {
    const { hostname } = new URL(url);
    return hostname === "localhost" || /^[^.\s]+(\.[^.\s]+)+$/.test(hostname);
  } catch {
    return false;
  }
}

/**
 * A URL field with the protocol as an addon. Type or paste a full address
 * and "https://" is lifted out of the text into the addon; click the addon
 * to switch between https and http — the padlock unlocks and the protocol
 * rolls over. A check or warning pops in on the right as you type, and
 * `aria-invalid` is set once you leave an invalid URL. The value you get
 * back always includes the protocol.
 */
export function UrlInput({
  value: valueProp,
  defaultValue = "",
  onValueChange,
  showStatus = true,
  groupClassName,
  className,
  onBlur,
  onPaste,
  name,
  disabled,
  "aria-invalid": ariaInvalid,
  ...props
}: UrlInputProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const url = valueProp ?? uncontrolled;
  const [touched, setTouched] = React.useState(false);
  // The last protocol picked, so it survives clearing the field.
  const [protocolPref, setProtocolPref] = React.useState<Protocol>(() => split(url).protocol);
  const parsed = split(url);
  const rest = parsed.rest;
  const protocol = rest ? parsed.protocol : protocolPref;
  const valid = rest ? isValidUrl(protocol + rest) : true;
  const invalid = Boolean(ariaInvalid) || (touched && !valid);
  const secure = protocol === "https://";

  const emit = (nextProtocol: Protocol, nextRest: string) => {
    const next = nextRest ? nextProtocol + nextRest : "";
    if (valueProp === undefined) setUncontrolled(next);
    onValueChange?.(next);
  };

  const handleChange = (text: string) => {
    const lifted = /^https?:\/\//i.test(text.trim()) ? split(text) : null;
    if (lifted) {
      setProtocolPref(lifted.protocol);
      emit(lifted.protocol, lifted.rest);
    } else {
      emit(protocol, text.replace(/^\s+/, ""));
    }
  };

  const toggleProtocol = () => {
    const next: Protocol = secure ? "http://" : "https://";
    setProtocolPref(next);
    emit(next, rest);
  };

  const pop = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, scale: 0.4, filter: "blur(2px)" },
        animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
        exit: { opacity: 0, scale: 0.4, filter: "blur(2px)" },
      };
  const roll = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: secure ? 10 : -10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: secure ? -10 : 10 },
      };

  return (
    <InputGroup className={groupClassName} data-disabled={disabled || undefined}>
      <InputGroupAddon className="pr-0">
        <button
          type="button"
          onClick={toggleProtocol}
          disabled={disabled}
          aria-label={`Protocol ${secure ? "https" : "http"}. Switch to ${secure ? "http" : "https"}`}
          className={cn(
            "-ml-1.5 inline-flex h-7 items-center gap-1.5 rounded-sm px-1.5 font-mono text-[0.8125rem] font-normal outline-none",
            "transition-[color,background-color] duration-200 hover:bg-accent/60 focus-visible:ring-2 focus-visible:ring-ring/60",
            secure ? "text-muted-foreground hover:text-foreground" : "text-amber-400/90 hover:text-amber-300"
          )}
        >
          <span className="relative grid size-3.5 place-items-center">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span key={secure ? "lock" : "open"} {...pop} transition={spring} className="grid [grid-area:1/1]">
                {secure ? <LockIcon className="size-3.5" /> : <LockOpenIcon className="size-3.5" />}
              </motion.span>
            </AnimatePresence>
          </span>
          {/* Fixed to the width of "https://" so the input never shifts. */}
          <span className="relative grid overflow-hidden">
            <span aria-hidden className="invisible [grid-area:1/1]">
              https://
            </span>
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span key={protocol} {...roll} transition={spring} className="text-left [grid-area:1/1]">
                {protocol}
              </motion.span>
            </AnimatePresence>
          </span>
        </button>
      </InputGroupAddon>
      <InputGroupInput
        type="text"
        inputMode="url"
        autoComplete="url"
        autoCapitalize="none"
        spellCheck={false}
        placeholder="example.com"
        disabled={disabled}
        value={rest}
        aria-invalid={invalid || undefined}
        onChange={(event) => handleChange(event.target.value)}
        onPaste={(event) => {
          onPaste?.(event);
          if (event.defaultPrevented) return;
          const pasted = event.clipboardData.getData("text").trim();
          // Pasting a full URL replaces the field, protocol included.
          if (/^https?:\/\//i.test(pasted) && event.currentTarget.selectionStart === 0) {
            event.preventDefault();
            handleChange(pasted);
          }
        }}
        onBlur={(event) => {
          setTouched(true);
          onBlur?.(event);
        }}
        className={cn("pl-1", className)}
        {...props}
      />
      {showStatus && (
        <InputGroupAddon align="inline-end">
          <span className="relative grid size-4 place-items-center">
            <AnimatePresence initial={false} mode="popLayout">
              {rest ? (
                <motion.span
                  key={valid ? "valid" : "invalid"}
                  {...pop}
                  transition={spring}
                  className={cn("grid [grid-area:1/1]", valid ? "text-primary" : "text-amber-400/90")}
                >
                  {valid ? <CircleCheckIcon className="size-4" /> : <CircleAlertIcon className="size-4" />}
                </motion.span>
              ) : null}
            </AnimatePresence>
          </span>
          <span className="sr-only" aria-live="polite">
            {rest && touched ? (valid ? "Valid URL" : "This doesn't look like a valid URL") : ""}
          </span>
        </InputGroupAddon>
      )}
      {name && <input type="hidden" name={name} value={url} disabled={disabled} />}
    </InputGroup>
  );
}
