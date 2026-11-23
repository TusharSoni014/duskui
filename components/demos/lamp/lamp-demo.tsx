"use client";

import { motion } from "motion/react";

import { Lamp } from "@/components/dusk/lamp/lamp";

export default function LampDemo() {
  return (
    <Lamp className="min-h-96 rounded-xl border border-white/10 px-6 pb-12">
      <motion.h3
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-center text-4xl font-semibold tracking-tight text-white sm:text-5xl"
      >
        Introducing workflows
      </motion.h3>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ delay: 0.4, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mt-3 max-w-md text-center text-sm leading-relaxed text-white/60"
      >
        Automate reviews, deploys and alerts with a few lines of config.
      </motion.p>
    </Lamp>
  );
}
