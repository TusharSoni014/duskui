import type { Metadata } from "next";

import { CatalogView } from "@/components/catalog/catalog-view";
import { pageMetadata } from "@/lib/seo";

const title = "React Component Library — Animated shadcn/ui Components";
const description =
  "Browse DuskUI's animated React components: shadcn/ui upgrades, neon, glass, hacker and techy styles. Copy-paste or install with the shadcn CLI.";

export const metadata: Metadata = pageMetadata({
  title,
  description,
  path: "/components",
});

export default function ComponentsPage() {
  return <CatalogView />;
}
