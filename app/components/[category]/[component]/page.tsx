"use client";

import React from "react";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { getCategoryBySlug, getComponentBySlug } from "@/lib/components-data";

// Import component pages
import ButtonPage from "@/components/pages/button-page";

// Component registry - maps slug to actual component
const componentRegistry: Record<string, React.ComponentType> = {
  button: ButtonPage,
};

// Placeholder for components that don't have a page yet
function ComingSoon({
  componentName,
  categoryName,
}: {
  componentName: string;
  categoryName: string;
}) {
  return (
    <div className="max-w-2xl mx-auto text-center py-20">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
        <span className="text-3xl">🚧</span>
      </div>
      <h1 className="text-3xl font-bold mb-4">{componentName}</h1>
      <p className="text-white/60 mb-2">
        This component is coming soon to the {categoryName} collection.
      </p>
      <p className="text-white/40 text-sm">
        Check back later for the full documentation and examples.
      </p>
    </div>
  );
}

export default function ComponentPage() {
  const params = useParams();
  const categorySlug = params.category as string;
  const componentSlug = params.component as string;

  const category = getCategoryBySlug(categorySlug);
  if (!category) {
    notFound();
  }

  const component = getComponentBySlug(categorySlug, componentSlug);
  if (!component) {
    notFound();
  }

  // Check if we have a registered component page
  const PageComponent = componentRegistry[componentSlug];

  return PageComponent ? (
    <PageComponent />
  ) : (
    <ComingSoon componentName={component.name} categoryName={category.name} />
  );
}
