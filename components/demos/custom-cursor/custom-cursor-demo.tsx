import { ArrowUpRight } from "lucide-react";

import { CustomCursor } from "@/components/dusk/custom-cursor/custom-cursor";

export default function CustomCursorDemo() {
  return (
    <CustomCursor className="flex h-80 w-full max-w-xl flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-background p-6">
      <div className="flex items-center justify-between">
        <span className="font-semibold tracking-tight text-white">
          studio<span className="text-primary">.</span>
        </span>
        <nav aria-label="Demo" className="flex gap-1 text-sm text-white/70">
          {["Work", "About", "Contact"].map((item) => (
            <button key={item} type="button" className="rounded-md px-2.5 py-1 hover:text-white">
              {item}
            </button>
          ))}
        </nav>
      </div>

      <div>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Move around</p>
        <h3 className="mt-2 max-w-sm text-3xl font-semibold tracking-tight text-white">
          A cursor that follows with a little weight.
        </h3>
      </div>

      <div className="flex items-end justify-between gap-4">
        <p className="max-w-[16rem] text-sm text-white/50">
          The ring grows over anything clickable. Plain text keeps the small dot.
        </p>
        <button
          type="button"
          data-cursor-label="Open"
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          View case <ArrowUpRight className="size-4" aria-hidden />
        </button>
      </div>
    </CustomCursor>
  );
}
