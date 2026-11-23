import * as React from "react";

import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import {
  Code,
  DocHeading,
  DocText,
  PropsTable,
  type PropRow,
} from "@/components/docs/doc-primitives";
import { InstallTabs } from "@/components/docs/install-tabs";
import { Toc, type TocItem } from "@/components/docs/toc";
import { readSource } from "@/lib/source";
import { registryUrl } from "@/lib/site";

/** A live example. `file` is the demo path relative to the repo root; its source fills the Code tab. */
export type DocExample = {
  id: string;
  title: string;
  description: React.ReactNode;
  Demo: React.ComponentType;
  file: string;
  minHeight?: number;
};

/** A block built on the base component, installable on its own. */
export type DocBlock = DocExample & {
  registry: string;
  source: string;
  deps: string;
  props?: PropRow[];
};

export type DocConfig = {
  category: string;
  title: string;
  intro: React.ReactNode;
  tags: string[];
  hero: Pick<DocExample, "Demo" | "file" | "minHeight">;
  install: {
    registry: string;
    source: string;
    deps: string;
    note?: React.ReactNode;
  };
  usage?: { code: string; filename: string };
  examples?: DocExample[];
  blocks?: DocBlock[];
  blocksIntro?: React.ReactNode;
  api?: { intro?: React.ReactNode; props: PropRow[] };
  accessibility?: React.ReactNode[];
};

async function Preview({ Demo, file, minHeight }: Pick<DocExample, "Demo" | "file" | "minHeight">) {
  const code = await readSource(file);
  return (
    <ComponentPreview
      minHeight={minHeight}
      code={<CodeBlock code={code} title={file.split("/").pop()} />}
    >
      <Demo />
    </ComponentPreview>
  );
}

async function ManualInstall({ source, deps }: { source: string; deps: string }) {
  const code = await readSource(source);
  return (
    <ol className="space-y-5">
      {deps && (
        <li className="space-y-3">
          <p className="text-sm text-white/60">1. Install the dependencies.</p>
          <CodeBlock code={`npm install ${deps}`} lang="bash" />
        </li>
      )}
      <li className="space-y-3">
        <p className="text-sm text-white/60">
          {deps ? "2" : "1"}. Copy the source into <Code>{source}</Code>.
        </p>
        <CodeBlock code={code} title={source.split("/").pop()} maxHeight={420} />
      </li>
    </ol>
  );
}

export function docToc(config: DocConfig): TocItem[] {
  return [
    { id: "installation", title: "Installation" },
    ...(config.usage ? [{ id: "usage", title: "Usage" }] : []),
    ...(config.examples?.length
      ? [
          { id: "examples", title: "Examples" },
          ...config.examples.map((e) => ({ id: e.id, title: e.title, depth: 3 as const })),
        ]
      : []),
    ...(config.blocks?.length
      ? [
          { id: "blocks", title: "Blocks" },
          ...config.blocks.map((b) => ({ id: b.id, title: b.title, depth: 3 as const })),
        ]
      : []),
    ...(config.api ? [{ id: "api-reference", title: "API Reference" }] : []),
    ...(config.accessibility?.length ? [{ id: "accessibility", title: "Accessibility" }] : []),
  ];
}

/** Renders a full component docs page from a config. */
export function ComponentDocs({ config }: { config: DocConfig }) {
  return (
    <div className="flex gap-12">
      <article className="min-w-0 max-w-3xl flex-1">
        <header>
          <p className="mb-3 text-sm font-medium text-primary">{config.category}</p>
          <h1 className="text-4xl font-bold tracking-tight">{config.title}</h1>
          <p className="mt-3 text-lg leading-relaxed text-white/60">{config.intro}</p>
          <ul className="mt-5 flex flex-wrap gap-2 text-xs text-white/60">
            {config.tags.map((tag) => (
              <li key={tag} className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1">
                {tag}
              </li>
            ))}
          </ul>
        </header>

        <Preview {...config.hero} />

        <DocHeading id="installation">Installation</DocHeading>
        <InstallTabs
          registryUrl={registryUrl(config.install.registry)}
          manual={<ManualInstall source={config.install.source} deps={config.install.deps} />}
        />
        {config.install.note && <DocText>{config.install.note}</DocText>}

        {config.usage && (
          <>
            <DocHeading id="usage">Usage</DocHeading>
            <CodeBlock code={config.usage.code} title={config.usage.filename} />
          </>
        )}

        {config.examples?.length ? (
          <>
            <DocHeading id="examples">Examples</DocHeading>
            {config.examples.map((example) => (
              <section key={example.id} aria-labelledby={example.id}>
                <DocHeading as="h3" id={example.id}>{example.title}</DocHeading>
                <DocText>{example.description}</DocText>
                <Preview Demo={example.Demo} file={example.file} minHeight={example.minHeight} />
              </section>
            ))}
          </>
        ) : null}

        {config.blocks?.length ? (
          <>
            <DocHeading id="blocks">Blocks</DocHeading>
            <DocText>
              {config.blocksIntro ??
                "Ready-made variations composed from the base component with Motion. Each installs on its own and pulls in its dependencies automatically."}
            </DocText>
            {config.blocks.map((block) => (
              <section key={block.id} aria-labelledby={block.id}>
                <DocHeading as="h3" id={block.id}>{block.title}</DocHeading>
                <DocText>{block.description}</DocText>
                <Preview Demo={block.Demo} file={block.file} minHeight={block.minHeight} />
                <InstallTabs
                  registryUrl={registryUrl(block.registry)}
                  manual={<ManualInstall source={block.source} deps={block.deps} />}
                />
                {block.props?.length ? <PropsTable rows={block.props} /> : null}
              </section>
            ))}
          </>
        ) : null}

        {config.api && (
          <>
            <DocHeading id="api-reference">API Reference</DocHeading>
            {config.api.intro && <DocText>{config.api.intro}</DocText>}
            <PropsTable rows={config.api.props} />
          </>
        )}

        {config.accessibility?.length ? (
          <>
            <DocHeading id="accessibility">Accessibility</DocHeading>
            <ul className="list-disc space-y-2 pl-5 leading-7 text-white/60 marker:text-primary/60">
              {config.accessibility.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </>
        ) : null}
      </article>

      <aside className="hidden w-52 shrink-0 xl:block">
        <div className="sticky top-24">
          <Toc items={docToc(config)} />
        </div>
      </aside>
    </div>
  );
}
