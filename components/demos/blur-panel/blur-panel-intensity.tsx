import { BlurPanel } from "@/components/dusk/glass/blur-panel";
import { GlassBackdrop } from "@/components/demos/glass-card/glass-backdrop";

const levels = ["subtle", "medium", "strong"] as const;

export default function BlurPanelIntensity() {
  return (
    <>
      <GlassBackdrop />
      <div className="relative grid w-full max-w-2xl gap-4 sm:grid-cols-3">
        {levels.map((level) => (
          <BlurPanel
            key={level}
            intensity={level}
            scrollRange={false}
            edge="none"
            className="rounded-xl p-5 ring-1 ring-white/15"
          >
            <p className="text-xs text-white/70">intensity=&quot;{level}&quot;</p>
            <p className="mt-6 text-sm leading-relaxed text-white/85">
              Always frosted — handy for sidebars and docked panels.
            </p>
          </BlurPanel>
        ))}
      </div>
    </>
  );
}
