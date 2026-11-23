import type { MetadataRoute } from "next";

import { categories } from "@/lib/components-data";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const categoryPages = categories
    .filter((category) => category.components.some((c) => c.ready))
    .map((category) => ({
      url: absoluteUrl(`/components/${category.slug}`),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  // Only finished components — "coming soon" pages are noindexed.
  const componentPages = categories.flatMap((category) =>
    category.components
      .filter((component) => component.ready)
      .map((component) => ({
        url: absoluteUrl(component.href),
        lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.9,
      }))
  );

  return [
    { url: absoluteUrl("/"), lastModified, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/components"), lastModified, changeFrequency: "weekly", priority: 0.8 },
    ...categoryPages,
    ...componentPages,
  ];
}
