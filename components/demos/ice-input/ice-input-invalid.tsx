"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Mail } from "lucide-react";

import { IceInput } from "@/components/dusk/glass/ice-input";
import { GlassBackdrop } from "@/components/demos/glass-card/glass-backdrop";

export default function IceInputInvalid() {
  const [value, setValue] = React.useState("ava@dusk");
  const [touched, setTouched] = React.useState(true);
  const invalid = touched && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  return (
    <>
      <GlassBackdrop />
      <div className="relative grid w-full max-w-xs gap-1.5">
        <label htmlFor="ice-invalid" className="text-sm font-medium text-white/85">
          Work email
        </label>
        <IceInput
          id="ice-invalid"
          type="email"
          icon={<Mail />}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setTouched(false);
          }}
          onBlur={() => setTouched(true)}
          aria-invalid={invalid || undefined}
          aria-describedby="ice-invalid-error"
        />
        <div id="ice-invalid-error" aria-live="polite" className="min-h-5">
          <AnimatePresence initial={false}>
            {invalid && (
              <motion.p
                className="text-sm text-rose-300"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
              >
                Enter a full email address, like ava@dusk.dev.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
