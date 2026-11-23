import { Bold, Italic, Link2, Underline } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedTooltip } from "@/components/dusk/tooltip/animated-tooltip";

const tools = [
  { label: "Bold", keys: "⌘B", icon: Bold },
  { label: "Italic", keys: "⌘I", icon: Italic },
  { label: "Underline", keys: "⌘U", icon: Underline },
  { label: "Insert link", keys: "⌘K", icon: Link2 },
];

export default function AnimatedTooltipDemo() {
  return (
    <div role="toolbar" aria-label="Formatting" className="flex gap-1 rounded-xl border bg-card p-1.5">
      {tools.map(({ label, keys, icon: Icon }) => (
        <AnimatedTooltip
          key={label}
          content={
            <span className="flex items-center gap-2">
              {label}
              <kbd className="rounded border border-white/10 bg-white/5 px-1 font-mono text-[0.625rem] text-muted-foreground">
                {keys}
              </kbd>
            </span>
          }
        >
          <Button variant="ghost" size="icon" aria-label={label}>
            <Icon />
          </Button>
        </AnimatedTooltip>
      ))}
    </div>
  );
}
