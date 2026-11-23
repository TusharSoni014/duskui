import type { Metadata } from "next";

import { CatalogView } from "@/components/catalog/catalog-view";
import { pageMetadata } from "@/lib/seo";

const title = "React Component Library — Animated shadcn/ui Components";
const description =
  "Browse every DuskUI component: animated React buttons, inputs, dialogs, cards, text effects and backgrounds built on shadcn/ui and Motion. Copy-paste or install with the shadcn CLI.";

export const metadata: Metadata = pageMetadata({
  title,
  description,
  path: "/components",
});

export default function ComponentsPage() {
  return <CatalogView />;
}
