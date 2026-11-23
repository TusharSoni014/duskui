import { CarouselContent, CarouselDots } from "@/components/dusk/carousel/carousel";
import { CoverflowCarousel, CoverflowItem } from "@/components/dusk/carousel/coverflow-carousel";

const albums = [
  { title: "Midnight Drive", artist: "Neon Coast", tone: "from-fuchsia-500 via-violet-600 to-indigo-900" },
  { title: "Low Tide", artist: "Harbor", tone: "from-sky-400 via-blue-600 to-slate-900" },
  { title: "Mint Condition", artist: "Dusk FM", tone: "from-primary via-emerald-500 to-teal-900" },
  { title: "Golden Hour", artist: "Sol", tone: "from-amber-300 via-orange-500 to-rose-800" },
  { title: "Static", artist: "Signal", tone: "from-zinc-300 via-zinc-500 to-zinc-900" },
  { title: "Bloom", artist: "Petal", tone: "from-rose-300 via-pink-500 to-purple-900" },
];

export default function CoverflowCarouselDemo() {
  return (
    <CoverflowCarousel aria-label="Albums" className="w-full max-w-xl">
      <CarouselContent className="gap-0 py-6">
        {albums.map((album) => (
          <CoverflowItem key={album.title} className="basis-1/2 sm:basis-2/5">
            <div className={`relative flex aspect-square flex-col justify-end overflow-hidden rounded-2xl bg-linear-to-br p-4 shadow-[0_24px_48px_-16px_rgb(0_0_0/0.8)] ${album.tone}`}>
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgb(255_255_255/0.25),transparent_40%)]" />
              <p className="relative font-semibold text-white">{album.title}</p>
              <p className="relative text-xs text-white/75">{album.artist}</p>
            </div>
          </CoverflowItem>
        ))}
      </CarouselContent>
      <CarouselDots className="mt-2" />
    </CoverflowCarousel>
  );
}
