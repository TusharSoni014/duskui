import type { Metadata } from "next";

import { siteConfig } from "@/lib/site";

/**
 * Per-page metadata. Next merges `openGraph`/`twitter` shallowly, so a page that
 * sets them would drop the root OG image — this helper always re-adds it.
 */
export function pageMetadata({
  title,
  description,
  path,
  keywords,
  noindex = false,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  noindex?: boolean;
  type?: "website" | "article";
}): Metadata {
  return {
    title,
    description,
    ...(keywords && { keywords }),
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      type,
      siteName: siteConfig.name,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: siteConfig.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: siteConfig.author.twitter,
      images: ["/twitter-image"],
    },
    ...(noindex && { robots: { index: false, follow: true } }),
  };
}
