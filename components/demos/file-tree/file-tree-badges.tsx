import { Database, Lock } from "lucide-react";

import { FileTree, type FileTreeItem } from "@/components/dusk/file-tree/file-tree";

const labels = { M: "Modified", A: "Added", U: "Untracked" } as const;

const status = (letter: keyof typeof labels, className: string) => (
  <>
    <span aria-hidden className={`font-mono font-semibold ${className}`}>
      {letter}
    </span>
    <span className="sr-only">, {labels[letter]}</span>
  </>
);

const items: FileTreeItem[] = [
  {
    id: "src",
    name: "src",
    children: [
      { id: "src/auth.ts", name: "auth.ts", badge: status("M", "text-amber-300") },
      { id: "src/session.ts", name: "session.ts", badge: status("A", "text-primary") },
      {
        id: "src/db",
        name: "db",
        icon: <Database className="size-4 text-sky-400" />,
        children: [
          { id: "src/db/schema.sql", name: "schema.sql", badge: status("U", "text-white/50") },
          { id: "src/db/seed.ts", name: "seed.ts" },
        ],
      },
    ],
  },
  { id: "secrets", name: "secrets.enc", icon: <Lock className="size-4 text-rose-400" />, disabled: true },
  { id: "tsconfig.json", name: "tsconfig.json" },
];

export default function FileTreeBadges() {
  return (
    <FileTree
      aria-label="Changed files"
      items={items}
      defaultExpanded={["src", "src/db"]}
      defaultSelected="src/auth.ts"
      indentGuides={false}
      indent={20}
      className="w-full max-w-xs rounded-xl border border-white/10 bg-background p-2"
    />
  );
}
