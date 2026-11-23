"use client";

import * as React from "react";
import { ArrowUp } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export interface ChatInputProps
  extends Omit<React.ComponentProps<"textarea">, "value" | "defaultValue" | "onSubmit"> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /**
   * Called with the trimmed message on Enter or the send button. Return a
   * promise to show the loading state until it settles. Uncontrolled inputs
   * clear right away and get the text back if the promise rejects.
   */
  onSubmit?: (message: string) => void | Promise<unknown>;
  /** Show the send button's spinner and block sending (e.g. while a reply streams). */
  loading?: boolean;
  /** Extra controls on the left of the toolbar (attach, model picker…). */
  actions?: React.ReactNode;
  /** Accessible name for the send button. */
  sendLabel?: string;
  /** Classes for the outer container. `className` styles the textarea. */
  containerClassName?: string;
}

/**
 * A chat composer: a textarea that grows with the message (up to `max-h`,
 * then scrolls) and a send button. Enter sends, Shift+Enter adds a new line,
 * and IME composition (Japanese, Chinese…) is never interrupted. The send
 * button wakes up with a little spring once there is something to send and
 * swaps to a spinner (the DuskUI Button `loading` prop) without changing size
 * while the message is sending. Click anywhere on the container to focus.
 */
export function ChatInput({
  value: valueProp,
  defaultValue = "",
  onValueChange,
  onSubmit,
  loading: loadingProp = false,
  actions,
  sendLabel = "Send message",
  placeholder = "Send a message…",
  disabled,
  className,
  containerClassName,
  onKeyDown,
  "aria-describedby": ariaDescribedBy,
  ...props
}: ChatInputProps) {
  const hintId = React.useId();
  const reduceMotion = useReducedMotion();
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const [pending, setPending] = React.useState(false);
  const value = valueProp ?? uncontrolled;
  const loading = loadingProp || pending;
  const canSend = value.trim().length > 0 && !loading && !disabled;

  const update = (next: string) => {
    if (valueProp === undefined) setUncontrolled(next);
    onValueChange?.(next);
  };

  const submit = async () => {
    if (!canSend) return;
    const message = value.trim();
    if (valueProp === undefined) setUncontrolled("");
    const result = onSubmit?.(message);
    if (!(result instanceof Promise)) return;
    setPending(true);
    try {
      await result;
    } catch {
      // Give the text back so nothing is lost.
      if (valueProp === undefined) setUncontrolled(message);
    } finally {
      setPending(false);
    }
  };

  return (
    <div
      data-slot="chat-input"
      data-disabled={disabled || undefined}
      onPointerDown={(event) => {
        // Clicking the padding or toolbar focuses the field, but not buttons inside it.
        if (event.target === event.currentTarget) {
          event.preventDefault();
          textareaRef.current?.focus();
        }
      }}
      className={cn(
        "group/chat relative w-full cursor-text rounded-2xl border border-input bg-input/30 p-2 shadow-xs",
        "transition-[border-color,box-shadow,background-color] duration-200 ease-out motion-reduce:transition-none",
        "hover:border-ring/40 focus-within:border-ring/70 focus-within:ring-[3px] focus-within:ring-ring/20",
        "focus-within:shadow-[0_0_32px_-12px_var(--color-primary)]",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        containerClassName
      )}
    >
      <Textarea
        ref={textareaRef}
        rows={1}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        aria-busy={loading || undefined}
        aria-describedby={cn(ariaDescribedBy, hintId)}
        enterKeyHint="send"
        onChange={(event) => update(event.target.value)}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.defaultPrevented) return;
          if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
            event.preventDefault();
            void submit();
          }
        }}
        className={cn(
          "max-h-48 min-h-10 resize-none border-0 bg-transparent px-2 py-1.5 shadow-none",
          "hover:bg-transparent focus-visible:ring-0 dark:bg-transparent dark:hover:bg-transparent",
          className
        )}
        {...props}
      />

      <div
        className="flex items-center gap-1.5 pt-1"
        onPointerDown={(event) => {
          if (event.target === event.currentTarget) {
            event.preventDefault();
            textareaRef.current?.focus();
          }
        }}
      >
        {actions}
        <span id={hintId} className="sr-only">
          Press Enter to send, Shift+Enter for a new line.
        </span>
        <span aria-hidden className="ml-auto hidden text-[11px] text-muted-foreground/70 opacity-0 transition-opacity duration-200 group-focus-within/chat:opacity-100 sm:inline">
          <kbd className="font-sans">Shift</kbd> + <kbd className="font-sans">Enter</kbd> for a new line
        </span>
        <motion.div
          className="ml-auto sm:ml-1.5"
          initial={false}
          animate={canSend || loading ? { scale: 1, opacity: 1 } : { scale: reduceMotion ? 1 : 0.9, opacity: 0.6 }}
          transition={{ type: "spring", bounce: 0.45, duration: 0.35 }}
        >
          <Button
            type="button"
            size="icon-sm"
            loading={loading}
            disabled={!canSend && !loading}
            aria-label={sendLabel}
            onClick={() => {
              void submit();
              textareaRef.current?.focus();
            }}
            className="rounded-full disabled:opacity-100 disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
          >
            <ArrowUp className="size-4" strokeWidth={2.5} />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
