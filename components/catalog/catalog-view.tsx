"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { componentHref, components, searchComponents } from "@/lib/components-data";

export function CatalogView() {
  const [query, setQuery] = React.useState("");
  const visible = searchComponents(query);

  return (
    <div className="mx-auto max-w-6xl">
      <motion.header
        initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.45 }}
        className="mb-10"
      >
        <h1 className="mb-3 text-4xl font-bold tracking-tight md:text-5xl">Components</h1>
        <p className="max-w-2xl text-lg text-white/60">
          {components.length} animated React components built on shadcn/ui and Motion. Copy the
          source or install any of them with the shadcn CLI.
        </p>
        <div className="relative mt-6 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/30" />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search components…"
            aria-label="Search components"
            className="pl-9"
          />
        </div>
      </motion.header>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((component, i) => (
          <motion.li
            key={component.slug}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: Math.min(i * 0.02, 0.4) }}
          >
            <Link
              href={componentHref(component.slug)}
              className="group relative flex h-full flex-col rounded-xl border border-white/10 bg-white/[0.02] p-5 outline-none transition-colors hover:border-primary/40 hover:bg-primary/[0.04] focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              <span className="flex items-center justify-between font-semibold text-white">
                {component.name}
                <ArrowUpRight className="size-4 text-white/30 transition-[color,transform] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
              </span>
              <span className="mt-1.5 line-clamp-2 text-sm text-white/50">{component.description}</span>
            </Link>
          </motion.li>
        ))}
      </ul>
      {visible.length === 0 && (
        <p className="py-16 text-center text-white/40">No components match “{query}”.</p>
      )}
    </div>
  );
}
