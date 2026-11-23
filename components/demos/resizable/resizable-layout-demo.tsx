"use client";

import { FileCode2, FileJson, FileText, Folder, GitBranch, Search, Settings, Terminal } from "lucide-react";

import { ResizableLayout, ResizableLayoutToggle } from "@/components/dusk/resizable/resizable-layout";
import { cn } from "@/lib/utils";

const files = [
  { name: "app", icon: Folder, depth: 0 },
  { name: "page.tsx", icon: FileCode2, depth: 1, active: true },
  { name: "layout.tsx", icon: FileCode2, depth: 1 },
  { name: "package.json", icon: FileJson, depth: 0 },
  { name: "README.md", icon: FileText, depth: 0 },
];

const rail = [
  { label: "Explorer", icon: Folder },
  { label: "Search", icon: Search },
  { label: "Source control", icon: GitBranch },
  { label: "Settings", icon: Settings },
];

const code = [
  ["import", " { Hero } ", "from", ' "@/components/hero"'],
  [""],
  ["export default function", " Page() {"],
  ["  return", " <Hero title=", '"Ship at dusk"', " />"],
  ["}"],
];

function Sidebar({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="flex h-full flex-col">
      <div className={cn("flex h-11 shrink-0 items-center gap-2 border-b px-2.5", collapsed && "justify-center px-0")}>
        <ResizableLayoutToggle />
        {!collapsed && <span className="truncate text-xs font-medium tracking-wide text-muted-foreground uppercase">Explorer</span>}
      </div>
      {collapsed ? (
        <nav aria-label="Activity bar" className="flex flex-col items-center gap-1 py-2">
          {rail.map(({ label, icon: Icon }) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              title={label}
              className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <Icon className="size-4" aria-hidden />
            </button>
          ))}
        </nav>
      ) : (
        <ul className="flex flex-col gap-0.5 p-2 text-sm">
          {files.map(({ name, icon: Icon, depth, active }) => (
            <li key={name}>
              <button
                type="button"
                aria-current={active ? "page" : undefined}
                style={{ paddingLeft: 8 + depth * 14 }}
                className={cn(
                  "flex w-full items-center gap-2 truncate rounded-md py-1 pr-2 text-left outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50",
                  active ? "bg-primary/10 text-primary" : "text-foreground/80 hover:bg-accent hover:text-foreground"
                )}
              >
                <Icon className="size-4 shrink-0 opacity-80" aria-hidden />
                <span className="truncate">{name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function ResizableLayoutDemo() {
  return (
    <div className="h-[420px] w-full max-w-3xl">
      <ResizableLayout
        sidebarLabel="Explorer"
        sidebar={({ collapsed }) => <Sidebar collapsed={collapsed} />}
        bottom={
          <div className="flex h-full flex-col">
            <div className="flex h-8 shrink-0 items-center gap-2 border-b px-3 text-xs text-muted-foreground">
              <Terminal className="size-3.5" aria-hidden /> Terminal
            </div>
            <pre className="flex-1 overflow-auto p-3 font-mono text-xs leading-relaxed text-muted-foreground">
              <span className="text-primary">➜</span> npm run dev{"\n"}
              {"  "}▲ Next.js ready on http://localhost:3000{"\n"}
              {"  "}✓ Compiled in 412ms
            </pre>
          </div>
        }
      >
        <div className="flex h-full flex-col">
          <div className="flex h-11 shrink-0 items-center border-b px-3 text-xs">
            <span className="rounded-md border border-b-0 bg-white/[0.03] px-3 py-1.5 text-foreground">page.tsx</span>
          </div>
          <pre className="flex-1 overflow-auto p-4 font-mono text-[0.8rem] leading-6">
            {code.map((line, i) => (
              <div key={i} className="flex gap-4">
                <span className="w-4 shrink-0 text-right text-muted-foreground/50 select-none">{i + 1}</span>
                <span>
                  {line.map((token, j) => (
                    <span
                      key={j}
                      className={j % 2 === 0 ? (token.startsWith(" ") ? "text-foreground/80" : "text-primary") : token.includes('"') ? "text-chart-4" : "text-foreground/80"}
                    >
                      {token}
                    </span>
                  ))}
                </span>
              </div>
            ))}
          </pre>
        </div>
      </ResizableLayout>
    </div>
  );
}
