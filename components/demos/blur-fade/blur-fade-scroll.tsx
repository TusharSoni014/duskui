import { BlurFade } from "@/components/dusk/blur-fade/blur-fade";

const tones = [
  "from-primary/70 to-sky-500/60",
  "from-violet-500/70 to-fuchsia-500/60",
  "from-amber-400/70 to-rose-500/60",
  "from-sky-400/70 to-indigo-500/60",
  "from-emerald-400/70 to-primary/50",
  "from-rose-400/70 to-orange-400/60",
];

const shots = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  tone: tones[i % tones.length],
  tall: i % 5 === 1 || i % 5 === 3,
}));

export default function BlurFadeScroll() {
  return (
    <div
      role="region"
      tabIndex={0}
      aria-label="Scrollable gallery"
      className="h-96 w-full max-w-xl overflow-y-auto overscroll-contain rounded-xl border border-white/10 bg-background p-4 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <p className="mb-4 text-center font-mono text-xs text-white/40">Scroll down — tiles replay every time they enter</p>
      <div className="columns-2 gap-3 sm:columns-3">
        {shots.map((shot, i) => (
          <BlurFade
            key={shot.id}
            once={false}
            delay={(i % 3) * 0.06}
            inViewMargin="-24px"
            className="mb-3 break-inside-avoid"
          >
            <div
              className={`flex items-end rounded-lg bg-linear-to-br ${shot.tone} p-3 ${shot.tall ? "h-44" : "h-28"}`}
            >
              <span className="font-mono text-xs text-white/85">#{String(shot.id).padStart(2, "0")}</span>
            </div>
          </BlurFade>
        ))}
      </div>
    </div>
  );
}
