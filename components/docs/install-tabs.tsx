"use client";

import * as React from "react";
import { motion } from "motion/react";

import { CopyButton } from "@/components/dusk/button/copy-button";
import { cn } from "@/lib/utils";

const managers = {
  npm: (url: string) => `npx shadcn@latest add ${url}`,
  pnpm: (url: string) => `pnpm dlx shadcn@latest add ${url}`,
  yarn: (url: string) => `yarn dlx shadcn@latest add ${url}`,
  bun: (url: string) => `bunx --bun shadcn@latest add ${url}`,
} as const;
type Manager = keyof typeof managers;

interface InstallTabsProps {
  registryUrl: string;
  /** Server-rendered manual install steps. */
  manual: React.ReactNode;
}

export function InstallTabs({ registryUrl, manual }: InstallTabsProps) {
  const id = React.useId();
  const [mode, setMode] = React.useState<"cli" | "manual">("cli");
  const [pm, setPm] = React.useState<Manager>("npm");
  const command = managers[pm](registryUrl);

  return (
    <div>
      <div className="mb-3 inline-flex rounded-lg border border-white/10 bg-white/[0.02] p-0.5">
        {(["cli", "manual"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            aria-pressed={mode === m}
            className={cn(
              "relative rounded-md px-3 py-1 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/50",
              mode === m ? "text-white" : "text-white/55 hover:text-white/80"
            )}
          >
            {mode === m && (
              <motion.span
                layoutId={`${id}-mode`}
                className="absolute inset-0 rounded-md bg-white/10"
                transition={{ type: "spring", duration: 0.3, bounce: 0.1 }}
              />
            )}
            <span className="relative">{m === "cli" ? "CLI" : "Manual"}</span>
          </button>
        ))}
      </div>

      <div hidden={mode !== "cli"}>
        <div className="overflow-hidden rounded-xl border border-white/10 bg-zinc-950/70">
          <div className="flex items-center justify-between border-b border-white/10 pl-2 pr-1.5">
            <div className="flex">
              {(Object.keys(managers) as Manager[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setPm(m)}
                  aria-pressed={pm === m}
                  className={cn(
                    "relative px-2.5 py-2.5 font-mono text-xs outline-none transition-colors focus-visible:text-white",
                    pm === m ? "text-white" : "text-white/55 hover:text-white/80"
                  )}
                >
                  {m}
                  {pm === m && (
                    <motion.span
                      layoutId={`${id}-pm`}
                      className="absolute inset-x-1.5 -bottom-px h-px bg-primary"
                    />
                  )}
                </button>
              ))}
            </div>
            <CopyButton value={command} className="text-white/50 hover:text-white" />
          </div>
          <pre className="overflow-x-auto p-4 font-mono text-[13px] text-white/85">
            <code>
              <span className="select-none text-white/45">$ </span>
              {command}
            </code>
          </pre>
        </div>
      </div>

      <div hidden={mode !== "manual"}>{manual}</div>
    </div>
  );
}
