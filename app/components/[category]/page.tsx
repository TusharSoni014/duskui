import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CategoryView } from "@/components/catalog/category-view";
import { categories, getCategoryBySlug } from "@/lib/components-data";
import { pageMetadata } from "@/lib/seo";

type Params = { category: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return {};

  const title = `${category.name} Components for React`;
  const description = `${category.description}. ${category.components
    .map((c) => c.name)
    .join(", ")} — copy-paste React components built with Tailwind CSS and Motion.`;
  return pageMetadata({
    title,
    description,
    path: `/components/${category.slug}`,
    noindex: !category.components.some((c) => c.ready),
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { category } = await params;
  if (!getCategoryBySlug(category)) notFound();
  return <CategoryView categorySlug={category} />;
}
