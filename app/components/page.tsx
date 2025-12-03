"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { categories } from "@/lib/components-data";

export default function ComponentsPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Component Library
        </h2>
        <p className="text-xl text-white/60 max-w-2xl">
          Explore our collection of beautifully animated React components.
          Each category offers unique styles to match your project&apos;s
          aesthetic.
        </p>
      </motion.div>

      {/* Category Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <Link key={category.name} href={`/components/${category.slug}`}>
            <motion.div
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{
                duration: 0.4,
                delay: 0.1 + index * 0.08,
                ease: "easeOut",
              }}
              className="group p-6 rounded-2xl bg-white/3 border border-white/10 hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer h-full"
            >
              <div className="w-10 h-10 rounded-lg bg-white/5 group-hover:bg-primary flex items-center justify-center mb-4 transition-colors">
                <category.icon className="w-5 h-5 text-primary group-hover:text-background transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1.5">
                {category.name}
              </h3>
              <p className="text-white/50 text-sm mb-4">
                {category.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {category.components.slice(0, 3).map((component) => (
                  <span
                    key={component.name}
                    className="px-2 py-1 text-xs rounded bg-white/5 text-white/50"
                  >
                    {component.name}
                  </span>
                ))}
                {category.components.length > 3 && (
                  <span className="px-2 py-1 text-xs rounded bg-white/5 text-white/30">
                    +{category.components.length - 3} more
                  </span>
                )}
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
