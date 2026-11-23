"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Input } from "@/components/ui/input";

export default function InputInvalidDemo() {
  const [value, setValue] = React.useState("not-an-email");
  const invalid = value.length > 0 && !/^\S+@\S+\.\S+$/.test(value);

  return (
    <div className="grid w-full max-w-sm gap-2">
      <label htmlFor="email-check" className="text-sm font-medium">
        Email
      </label>
      <Input
        id="email-check"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-invalid={invalid || undefined}
        aria-describedby="email-check-error"
      />
      <AnimatePresence initial={false}>
        {invalid && (
          <motion.p
            id="email-check-error"
            role="alert"
            className="text-xs text-destructive"
            initial={{ opacity: 0, height: 0, y: -4 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -4 }}
            transition={{ type: "spring", duration: 0.3, bounce: 0 }}
          >
            Enter a valid email address.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
