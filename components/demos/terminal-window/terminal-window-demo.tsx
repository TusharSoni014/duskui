import { TerminalWindow, type TerminalLine } from "@/components/dusk/hacker/terminal-window";

const session: TerminalLine[] = [
  { type: "command", text: "npx shadcn@latest add https://duskui.com/r/terminal-window.json" },
  "✔ Checking registry.",
  "✔ Installing dependencies.",
  "✔ Created 1 file:",
  "  - components/dusk/hacker/terminal-window.tsx",
  { type: "command", text: "npm run dev" },
  "▲ Next.js 16 — ready on http://localhost:3000",
  { text: "✓ Compiled in 812ms", className: "text-primary" },
];

export default function TerminalWindowDemo() {
  return <TerminalWindow title="~/projects/duskui — zsh" lines={session} className="max-w-xl" />;
}
