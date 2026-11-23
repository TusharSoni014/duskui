import type { FileTreeItem } from "@/components/dusk/file-tree/file-tree";

/** Sample data shared by the File Tree demos. */
export const projectFiles: FileTreeItem[] = [
  {
    id: "app",
    name: "app",
    children: [
      {
        id: "app/(marketing)",
        name: "(marketing)",
        children: [
          { id: "app/(marketing)/page.tsx", name: "page.tsx" },
          { id: "app/(marketing)/pricing.mdx", name: "pricing.mdx" },
        ],
      },
      {
        id: "app/dashboard",
        name: "dashboard",
        children: [
          { id: "app/dashboard/layout.tsx", name: "layout.tsx" },
          { id: "app/dashboard/page.tsx", name: "page.tsx" },
          { id: "app/dashboard/loading.tsx", name: "loading.tsx" },
        ],
      },
      { id: "app/globals.css", name: "globals.css" },
      { id: "app/layout.tsx", name: "layout.tsx" },
    ],
  },
  {
    id: "components",
    name: "components",
    children: [
      {
        id: "components/ui",
        name: "ui",
        children: [
          { id: "components/ui/button.tsx", name: "button.tsx" },
          { id: "components/ui/dialog.tsx", name: "dialog.tsx" },
        ],
      },
      { id: "components/site-header.tsx", name: "site-header.tsx" },
    ],
  },
  {
    id: "public",
    name: "public",
    children: [
      { id: "public/og.png", name: "og.png" },
      { id: "public/logo.svg", name: "logo.svg" },
      { id: "public/intro.mp4", name: "intro.mp4" },
    ],
  },
  { id: "scripts", name: "scripts", children: [{ id: "scripts/deploy.sh", name: "deploy.sh" }] },
  { id: ".env.local", name: ".env.local" },
  { id: "next.config.ts", name: "next.config.ts" },
  { id: "package.json", name: "package.json" },
  { id: "package-lock.json", name: "package-lock.json" },
  { id: "README.md", name: "README.md" },
];
