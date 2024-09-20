"use client";

import React, { ReactNode } from "react";
import { motion } from "framer-motion";

export default function template({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(10px)" }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
