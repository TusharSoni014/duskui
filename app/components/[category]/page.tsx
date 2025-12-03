"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { categories } from "@/lib/components-data";
import { notFound } from "next/navigation";

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.category as string;

  // Find the category by slug
  const category = categories.find((c) => c.slug === categorySlug);

  if (!category) {
    notFound();
  }

  const Icon = category.icon;

  return (
    <>
      <div className="max-w-5xl mx-auto">
        {/* Category Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{category.name}</h1>
              <p className="text-white/60">{category.description}</p>
            </div>
          </div>
          <p className="text-white/50 text-sm">
            {category.components.length} component
            {category.components.length !== 1 ? "s" : ""} available
          </p>
        </motion.div>

        {/* Components Grid */}
        <div className="grid gap-4">
          {category.components.map((component, index) => (
            <motion.div
              key={component.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.05,
              }}
            >
              <Link href={component.href}>
                <div className="group relative p-5 rounded-xl border border-white/10 bg-white/2 hover:bg-white/5 hover:border-primary/50 transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors">
                        {component.name}
                      </h3>
                      {component.description && (
                        <p className="text-white/50 text-sm mt-1">
                          {component.description}
                        </p>
                      )}
                      {component.keywords && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {component.keywords.slice(0, 4).map((keyword) => (
                            <span
                              key={keyword}
                              className="px-2 py-0.5 text-xs rounded bg-white/5 text-white/40"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="ml-4 p-2 rounded-lg bg-white/5 group-hover:bg-primary/20 transition-colors">
                      <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {category.components.length === 0 && (
          <div className="text-center py-20">
            <p className="text-white/40">No components in this category yet.</p>
          </div>
        )}
      </div>
    </>
  );
}
