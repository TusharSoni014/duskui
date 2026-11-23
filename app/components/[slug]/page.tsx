import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AuroraBackgroundDocs } from "@/components/docs/pages/aurora-background-docs";
import { AvatarDocs } from "@/components/docs/pages/avatar-docs";
import { BackgroundBeamsDocs } from "@/components/docs/pages/background-beams-docs";
import { BadgeDocs } from "@/components/docs/pages/badge-docs";
import { BinaryRainDocs } from "@/components/docs/pages/binary-rain-docs";
import { BlurPanelDocs } from "@/components/docs/pages/blur-panel-docs";
import { ButtonDocs } from "@/components/docs/pages/button-docs";
import { CardDocs } from "@/components/docs/pages/card-docs";
import { CircuitBoardDocs } from "@/components/docs/pages/circuit-board-docs";
import { CrystalModalDocs } from "@/components/docs/pages/crystal-modal-docs";
import { CyberButtonDocs } from "@/components/docs/pages/cyber-button-docs";
import { DataStreamDocs } from "@/components/docs/pages/data-stream-docs";
import { DialogDocs } from "@/components/docs/pages/dialog-docs";
import { DotSpotlightDocs } from "@/components/docs/pages/dot-spotlight-docs";
import { DropdownMenuDocs } from "@/components/docs/pages/dropdown-menu-docs";
import { ElectricCardDocs } from "@/components/docs/pages/electric-card-docs";
import { FrostButtonDocs } from "@/components/docs/pages/frost-button-docs";
import { GlassCardDocs } from "@/components/docs/pages/glass-card-docs";
import { GlitchTextDocs } from "@/components/docs/pages/glitch-text-docs";
import { GlowTextDocs } from "@/components/docs/pages/glow-text-docs";
import { HologramCardDocs } from "@/components/docs/pages/hologram-card-docs";
import { IceInputDocs } from "@/components/docs/pages/ice-input-docs";
import { InputDocs } from "@/components/docs/pages/input-docs";
import { MatrixRainDocs } from "@/components/docs/pages/matrix-rain-docs";
import { MeteorsDocs } from "@/components/docs/pages/meteors-docs";
import { NeonBorderDocs } from "@/components/docs/pages/neon-border-docs";
import { NeonButtonDocs } from "@/components/docs/pages/neon-button-docs";
import { NumberTickerDocs } from "@/components/docs/pages/number-ticker-docs";
import { ParticlesDocs } from "@/components/docs/pages/particles-docs";
import { PlasmaLoaderDocs } from "@/components/docs/pages/plasma-loader-docs";
import { PopoverDocs } from "@/components/docs/pages/popover-docs";
import { ProgressDocs } from "@/components/docs/pages/progress-docs";
import { ScanLineDocs } from "@/components/docs/pages/scan-line-docs";
import { ScrollRevealTextDocs } from "@/components/docs/pages/scroll-reveal-text-docs";
import { ShinyTextDocs } from "@/components/docs/pages/shiny-text-docs";
import { SliderDocs } from "@/components/docs/pages/slider-docs";
import { SplitTextDocs } from "@/components/docs/pages/split-text-docs";
import { TechGridDocs } from "@/components/docs/pages/tech-grid-docs";
import { TerminalWindowDocs } from "@/components/docs/pages/terminal-window-docs";
import { TypewriterDocs } from "@/components/docs/pages/typewriter-docs";
import { WordRotateDocs } from "@/components/docs/pages/word-rotate-docs";
import { TabsDocs } from "@/components/docs/pages/tabs-docs";
import { AccordionDocs } from "@/components/docs/pages/accordion-docs";
import { SwitchDocs } from "@/components/docs/pages/switch-docs";
import { CheckboxDocs } from "@/components/docs/pages/checkbox-docs";
import { TooltipDocs } from "@/components/docs/pages/tooltip-docs";
import { AnimatedListDocs } from "@/components/docs/pages/animated-list-docs";
import { BentoGridDocs } from "@/components/docs/pages/bento-grid-docs";
import { FileUploadDocs } from "@/components/docs/pages/file-upload-docs";
import { MarqueeDocs } from "@/components/docs/pages/marquee-docs";
import { TimelineDocs } from "@/components/docs/pages/timeline-docs";
import { SelectDocs } from "@/components/docs/pages/select-docs";
import { RadioGroupDocs } from "@/components/docs/pages/radio-group-docs";
import { TextareaDocs } from "@/components/docs/pages/textarea-docs";
import { ToggleGroupDocs } from "@/components/docs/pages/toggle-group-docs";
import { ComboboxDocs } from "@/components/docs/pages/combobox-docs";
import { PaginationDocs } from "@/components/docs/pages/pagination-docs";
import { BreadcrumbDocs } from "@/components/docs/pages/breadcrumb-docs";
import { CarouselDocs } from "@/components/docs/pages/carousel-docs";
import { DockDocs } from "@/components/docs/pages/dock-docs";
import { NavbarDocs } from "@/components/docs/pages/navbar-docs";
import { AlertDocs } from "@/components/docs/pages/alert-docs";
import { AlertDialogDocs } from "@/components/docs/pages/alert-dialog-docs";
import { ToastDocs } from "@/components/docs/pages/toast-docs";
import { SkeletonDocs } from "@/components/docs/pages/skeleton-docs";
import { HoverCardDocs } from "@/components/docs/pages/hover-card-docs";
import { JsonLd } from "@/components/json-ld";
import { componentHref, components, getComponent } from "@/lib/components-data";
import { pageMetadata } from "@/lib/seo";
import { absoluteUrl, siteConfig } from "@/lib/site";

type Params = { slug: string };

/** slug → docs page. Add new component docs here. */
const docs: Record<string, React.ComponentType> = {
  "hover-card": HoverCardDocs,
  skeleton: SkeletonDocs,
  toast: ToastDocs,
  "alert-dialog": AlertDialogDocs,
  alert: AlertDocs,
  navbar: NavbarDocs,
  dock: DockDocs,
  carousel: CarouselDocs,
  breadcrumb: BreadcrumbDocs,
  pagination: PaginationDocs,
  combobox: ComboboxDocs,
  "toggle-group": ToggleGroupDocs,
  textarea: TextareaDocs,
  "radio-group": RadioGroupDocs,
  select: SelectDocs,
  timeline: TimelineDocs,
  marquee: MarqueeDocs,
  "file-upload": FileUploadDocs,
  "bento-grid": BentoGridDocs,
  "animated-list": AnimatedListDocs,
  tooltip: TooltipDocs,
  checkbox: CheckboxDocs,
  switch: SwitchDocs,
  accordion: AccordionDocs,
  tabs: TabsDocs,
  "aurora-background": AuroraBackgroundDocs,
  "background-beams": BackgroundBeamsDocs,
  "binary-rain": BinaryRainDocs,
  "blur-panel": BlurPanelDocs,
  "circuit-board": CircuitBoardDocs,
  "crystal-modal": CrystalModalDocs,
  "cyber-button": CyberButtonDocs,
  "data-stream": DataStreamDocs,
  "dot-spotlight": DotSpotlightDocs,
  "dropdown-menu": DropdownMenuDocs,
  "electric-card": ElectricCardDocs,
  "frost-button": FrostButtonDocs,
  "glass-card": GlassCardDocs,
  "glitch-text": GlitchTextDocs,
  "glow-text": GlowTextDocs,
  "hologram-card": HologramCardDocs,
  "ice-input": IceInputDocs,
  "matrix-rain": MatrixRainDocs,
  "neon-border": NeonBorderDocs,
  "neon-button": NeonButtonDocs,
  "number-ticker": NumberTickerDocs,
  "plasma-loader": PlasmaLoaderDocs,
  "scan-line": ScanLineDocs,
  "scroll-reveal-text": ScrollRevealTextDocs,
  "shiny-text": ShinyTextDocs,
  "split-text": SplitTextDocs,
  "tech-grid": TechGridDocs,
  "terminal-window": TerminalWindowDocs,
  "word-rotate": WordRotateDocs,
  avatar: AvatarDocs,
  badge: BadgeDocs,
  button: ButtonDocs,
  card: CardDocs,
  dialog: DialogDocs,
  input: InputDocs,
  meteors: MeteorsDocs,
  particles: ParticlesDocs,
  popover: PopoverDocs,
  progress: ProgressDocs,
  slider: SliderDocs,
  typewriter: TypewriterDocs,
};

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return components.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const component = getComponent(slug);
  if (!component) return {};

  return pageMetadata({
    title: `${component.name} — Animated React ${component.name} Component`,
    description: component.description,
    path: componentHref(slug),
    type: "article",
    keywords: [...component.keywords, "React", "Next.js", "shadcn/ui", "Motion", "Tailwind CSS"],
    noindex: !docs[slug],
  });
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const component = getComponent(slug);
  if (!component) notFound();

  const Docs = docs[slug];
  const url = absoluteUrl(componentHref(slug));

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Components", item: absoluteUrl("/components") },
              { "@type": "ListItem", position: 2, name: component.name, item: url },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "TechArticle",
            headline: `${component.name} component for React`,
            description: component.description,
            url,
            keywords: component.keywords.join(", "),
            proficiencyLevel: "Beginner",
            author: { "@type": "Person", name: siteConfig.author.name },
            publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
          },
        ]}
      />
      {Docs ? (
        <Docs />
      ) : (
        <div className="mx-auto max-w-xl py-24 text-center">
          <h1 className="mb-4 text-3xl font-bold">{component.name}</h1>
          <p className="text-white/60">Docs for this component are on the way.</p>
          <Link href="/components" className="mt-6 inline-block text-sm text-primary hover:underline">
            Browse all components →
          </Link>
        </div>
      )}
    </>
  );
}
