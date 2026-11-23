import { CopyButton } from "@/components/dusk/button/copy-button";

export default function CopyButtonDemo() {
  const command = "npx shadcn@latest add https://duskui.com/r/button.json";
  return (
    <div className="flex max-w-full items-center gap-2 rounded-lg border border-white/10 bg-zinc-950 py-1 pl-4 pr-1 font-mono text-sm text-white/80">
      <span className="truncate">{command}</span>
      <CopyButton value={command} />
    </div>
  );
}
