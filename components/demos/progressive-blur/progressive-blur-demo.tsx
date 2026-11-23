import { ProgressiveBlur } from "@/components/dusk/progressive-blur/progressive-blur";

const tracks = [
  { title: "Midnight Static", artist: "Neon Harbor", time: "3:42", tone: "from-primary to-sky-500" },
  { title: "Glass Rain", artist: "Lumen", time: "4:05", tone: "from-violet-500 to-fuchsia-500" },
  { title: "After Hours", artist: "Kilo Vale", time: "2:58", tone: "from-amber-400 to-rose-500" },
  { title: "Low Orbit", artist: "Satellite Bloom", time: "3:21", tone: "from-sky-400 to-indigo-500" },
  { title: "Soft Circuit", artist: "Neon Harbor", time: "5:10", tone: "from-emerald-400 to-primary" },
  { title: "Paper Moons", artist: "Ivy & Ash", time: "3:33", tone: "from-rose-400 to-orange-400" },
  { title: "Undertow", artist: "Lumen", time: "4:47", tone: "from-fuchsia-500 to-violet-600" },
  { title: "Static Bloom", artist: "Kilo Vale", time: "3:02", tone: "from-teal-400 to-cyan-500" },
  { title: "Northern Lines", artist: "Satellite Bloom", time: "4:18", tone: "from-indigo-400 to-sky-400" },
  { title: "Velvet Hour", artist: "Ivy & Ash", time: "3:55", tone: "from-pink-500 to-amber-300" },
];

export default function ProgressiveBlurDemo() {
  return (
    // The blur sits on a non-scrolling wrapper so it stays pinned while the list moves.
    <div className="relative h-96 w-full max-w-sm overflow-hidden rounded-xl border border-white/10 bg-background">
      <div
        role="region"
        tabIndex={0}
        aria-label="Playlist"
        className="h-full overflow-y-auto overscroll-contain px-3 py-10 outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-ring/50"
      >
        <ol className="space-y-1">
          {tracks.map((track, i) => (
            <li key={track.title} className="flex items-center gap-3 rounded-lg p-2 hover:bg-white/[0.04]">
              <span className="w-5 text-right font-mono text-xs text-white/35">{i + 1}</span>
              <div className={`size-11 shrink-0 rounded-md bg-linear-to-br ${track.tone}`} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{track.title}</p>
                <p className="truncate text-xs text-white/50">{track.artist}</p>
              </div>
              <span className="font-mono text-xs text-white/40">{track.time}</span>
            </li>
          ))}
        </ol>
      </div>
      <ProgressiveBlur position="both" height={72} blurIntensity={10} />
    </div>
  );
}
