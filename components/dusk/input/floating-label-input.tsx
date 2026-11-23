"use client";

import * as React from "react";
import { motion } from "motion/react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface FloatingLabelInputProps extends React.ComponentProps<"input"> {
  label: string;
}

/**
 * The label sits inside the field like a placeholder and springs up when the
 * field is focused or filled. It is a real <label>, so it stays accessible.
 */
export function FloatingLabelInput({
  label,
  id,
  className,
  value,
  defaultValue,
  onFocus,
  onBlur,
  onChange,
  ...props
}: FloatingLabelInputProps) {
  const autoId = React.useId();
  const inputId = id ?? autoId;
  const ref = React.useRef<HTMLInputElement>(null);
  const [focused, setFocused] = React.useState(false);
  const [hasText, setHasText] = React.useState(Boolean(defaultValue));

  // Catch browser autofill, which may not fire onChange.
  React.useEffect(() => {
    const t = setTimeout(() => ref.current?.value && setHasText(true), 300);
    return () => clearTimeout(t);
  }, []);

  const filled = value !== undefined ? String(value).length > 0 : hasText;
  const floated = focused || filled;

  return (
    <div className="relative w-full">
      <Input
        ref={ref}
        id={inputId}
        value={value}
        defaultValue={defaultValue}
        className={cn("h-12 px-3 pb-1.5 pt-5", className)}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        onChange={(e) => {
          setHasText(e.target.value.length > 0);
          onChange?.(e);
        }}
        {...props}
      />
      <motion.label
        htmlFor={inputId}
        className={cn(
          "pointer-events-none absolute left-3 top-0 origin-left text-sm leading-5 transition-colors duration-200",
          focused ? "text-primary" : "text-muted-foreground",
          props["aria-invalid"] && "text-destructive"
        )}
        initial={false}
        animate={floated ? { y: 5, scale: 0.78 } : { y: 14, scale: 1 }}
        transition={{ type: "spring", duration: 0.3, bounce: 0.1 }}
      >
        {label}
      </motion.label>
    </div>
  );
}
