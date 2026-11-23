import { ProgressiveBlur } from "@/components/dusk/progressive-blur/progressive-blur";

const tracks = [
  { title: "Midnight Static", artist: "Neon Harbor", time: "3:42", tone: 160 },
  { title: "Glass Rain", artist: "Lumen", time: "4:05", tone: 300 },
  { title: "After Hours", artist: "Kilo Vale", time: "2:58", tone: 40 },
  { title: "Low Orbit", artist: "Satellite Bloom", time: "3:21", tone: 220 },
  { title: "Soft Circuit", artist: "Neon Harbor", time: "5:10", tone: 150 },
  { title: "Paper Moons", artist: "Ivy & Ash", time: "3:33", tone: 20 },
  { title: "Undertow", artist: "Lumen", time: "4:47", tone: 320 },
  { title: "Static Bloom", artist: "Kilo Vale", time: "3:02", tone: 190 },
  { title: "Northern Lines", artist: "Satellite Bloom", time: "4:18", tone: 250 },
  { title: "Velvet Hour", artist: "Ivy & Ash", time: "3:55", tone: 350 },
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
              <span className="w-5 text-right text-xs text-white/35 tabular-nums">{i + 1}</span>
              <div className="size-11 shrink-0 rounded-md" style={{ background: `oklch(0.32 0.04 ${track.tone})` }} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{track.title}</p>
                <p className="truncate text-xs text-white/50">{track.artist}</p>
              </div>
              <span className="text-xs text-white/40 tabular-nums">{track.time}</span>
            </li>
          ))}
        </ol>
      </div>
      <ProgressiveBlur position="both" height={72} blurIntensity={10} />
    </div>
  );
}
