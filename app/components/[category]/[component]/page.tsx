import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ButtonDocs } from "@/components/docs/pages/button-docs";
import { InputDocs } from "@/components/docs/pages/input-docs";
import { NeonButtonDocs } from "@/components/docs/pages/neon-button-docs";
import { GlowTextDocs } from "@/components/docs/pages/glow-text-docs";
import { NeonBorderDocs } from "@/components/docs/pages/neon-border-docs";
import { ElectricCardDocs } from "@/components/docs/pages/electric-card-docs";
import { PlasmaLoaderDocs } from "@/components/docs/pages/plasma-loader-docs";
import { CircuitBoardDocs } from "@/components/docs/pages/circuit-board-docs";
import { DataStreamDocs } from "@/components/docs/pages/data-stream-docs";
import { HologramCardDocs } from "@/components/docs/pages/hologram-card-docs";
import { BinaryRainDocs } from "@/components/docs/pages/binary-rain-docs";
import { TechGridDocs } from "@/components/docs/pages/tech-grid-docs";
import { TerminalWindowDocs } from "@/components/docs/pages/terminal-window-docs";
import { GlitchTextDocs } from "@/components/docs/pages/glitch-text-docs";
import { MatrixRainDocs } from "@/components/docs/pages/matrix-rain-docs";
import { CyberButtonDocs } from "@/components/docs/pages/cyber-button-docs";
import { ScanLineDocs } from "@/components/docs/pages/scan-line-docs";
import { GlassCardDocs } from "@/components/docs/pages/glass-card-docs";
import { BlurPanelDocs } from "@/components/docs/pages/blur-panel-docs";
import { FrostButtonDocs } from "@/components/docs/pages/frost-button-docs";
import { CrystalModalDocs } from "@/components/docs/pages/crystal-modal-docs";
import { IceInputDocs } from "@/components/docs/pages/ice-input-docs";
import { CardDocs } from "@/components/docs/pages/card-docs";
import { DialogDocs } from "@/components/docs/pages/dialog-docs";
import { BadgeDocs } from "@/components/docs/pages/badge-docs";
import { JsonLd } from "@/components/json-ld";
import {
  categories,
  getCategoryBySlug,
  getComponentBySlug,
} from "@/lib/components-data";
import { pageMetadata } from "@/lib/seo";
import { absoluteUrl, siteConfig } from "@/lib/site";

type Params = { category: string; component: string };

/** slug → docs page. Add new component docs here. */
const docs: Record<string, React.ComponentType> = {
  badge: BadgeDocs,
  dialog: DialogDocs,
  card: CardDocs,
  "ice-input": IceInputDocs,
  "crystal-modal": CrystalModalDocs,
  "frost-button": FrostButtonDocs,
  "blur-panel": BlurPanelDocs,
  "glass-card": GlassCardDocs,
  "scan-line": ScanLineDocs,
  "cyber-button": CyberButtonDocs,
  "matrix-rain": MatrixRainDocs,
  "glitch-text": GlitchTextDocs,
  "terminal-window": TerminalWindowDocs,
  "tech-grid": TechGridDocs,
  "binary-rain": BinaryRainDocs,
  "hologram-card": HologramCardDocs,
  "data-stream": DataStreamDocs,
  "circuit-board": CircuitBoardDocs,
  "plasma-loader": PlasmaLoaderDocs,
  "electric-card": ElectricCardDocs,
  "neon-border": NeonBorderDocs,
  "glow-text": GlowTextDocs,
  "neon-button": NeonButtonDocs,
  button: ButtonDocs,
  input: InputDocs,
};

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return categories.flatMap((category) =>
    category.components.map((component) => ({
      category: category.slug,
      component: component.slug,
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { category: categorySlug, component: componentSlug } = await params;
  const category = getCategoryBySlug(categorySlug);
  const component = getComponentBySlug(categorySlug, componentSlug);
  if (!category || !component) return {};

  const title = `${component.name} — Animated React ${component.name} Component`;
  const description =
    component.description ??
    `${component.name} component for React and Next.js, built with Tailwind CSS and Motion.`;
  return pageMetadata({
    title,
    description,
    path: component.href,
    type: "article",
    keywords: [...(component.keywords ?? []), "React", "Next.js", "shadcn/ui", "Motion", "Tailwind CSS"],
    noindex: !component.ready,
  });
}

function ComingSoon({ name, category }: { name: string; category: string }) {
  return (
    <div className="mx-auto max-w-xl py-24 text-center">
      <p className="mb-3 text-sm font-medium text-primary">{category}</p>
      <h1 className="mb-4 text-3xl font-bold">{name}</h1>
      <p className="text-white/60">
        This component is being crafted. Meanwhile, check out the finished ones.
      </p>
      <Link
        href="/components/shadcn-plus/button"
        className="mt-6 inline-block text-sm text-primary underline-offset-4 hover:underline"
      >
        See the Button →
      </Link>
    </div>
  );
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { category: categorySlug, component: componentSlug } = await params;
  const category = getCategoryBySlug(categorySlug);
  const component = getComponentBySlug(categorySlug, componentSlug);
  if (!category || !component) notFound();

  const Docs = docs[component.slug];

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Components", item: absoluteUrl("/components") },
              { "@type": "ListItem", position: 2, name: category.name, item: absoluteUrl(`/components/${category.slug}`) },
              { "@type": "ListItem", position: 3, name: component.name, item: absoluteUrl(component.href) },
            ],
          },
          ...(Docs
            ? [
                {
                  "@context": "https://schema.org",
                  "@type": "TechArticle",
                  headline: `${component.name} component for React`,
                  description: component.description,
                  url: absoluteUrl(component.href),
                  keywords: component.keywords?.join(", "),
                  proficiencyLevel: "Beginner",
                  author: { "@type": "Person", name: siteConfig.author.name },
                  publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
                },
              ]
            : []),
        ]}
      />
      {Docs ? <Docs /> : <ComingSoon name={component.name} category={category.name} />}
    </>
  );
}
