"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { PlasmaLoader } from "@/components/dusk/neon/plasma-loader";
import { Button } from "@/components/ui/button";

export default function PlasmaLoaderInlineDemo() {
  const [generating, setGenerating] = React.useState(true);

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4">
      <div className="flex h-12 w-full items-center gap-3 rounded-xl border border-white/10 bg-card px-4 text-sm">
        <AnimatePresence mode="wait" initial={false}>
          {generating ? (
            <motion.span
              key="busy"
              className="flex items-center gap-3 text-white/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <PlasmaLoader size={22} label="Generating response" />
              Generating response…
            </motion.span>
          ) : (
            <motion.span
              key="done"
              className="text-white/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Done. Your summary is ready.
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <Button variant="outline" size="sm" onClick={() => setGenerating((g) => !g)}>
        {generating ? "Finish" : "Generate again"}
      </Button>
    </div>
  );
}
