import type { MetadataRoute } from "next";

import { componentHref, components } from "@/lib/components-data";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: absoluteUrl("/"), lastModified, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/components"), lastModified, changeFrequency: "weekly", priority: 0.8 },
    ...components.map((c) => ({
      url: absoluteUrl(componentHref(c.slug)),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
  ];
}
