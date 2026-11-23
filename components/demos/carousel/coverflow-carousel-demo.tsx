import { CarouselContent, CarouselDots } from "@/components/dusk/carousel/carousel";
import { CoverflowCarousel, CoverflowItem } from "@/components/dusk/carousel/coverflow-carousel";

const albums = [
  { title: "Midnight Drive", artist: "Coastline", tone: "bg-[#35303f]" },
  { title: "Low Tide", artist: "Harbor", tone: "bg-[#2c3646]" },
  { title: "Mint Condition", artist: "Dusk FM", tone: "bg-[#2f3b3a]" },
  { title: "Golden Hour", artist: "Sol", tone: "bg-[#4a3a30]" },
  { title: "Static", artist: "Signal", tone: "bg-zinc-700" },
  { title: "Bloom", artist: "Petal", tone: "bg-[#43323a]" },
];

export default function CoverflowCarouselDemo() {
  return (
    <CoverflowCarousel aria-label="Albums" className="w-full max-w-xl">
      <CarouselContent className="gap-0 py-6">
        {albums.map((album) => (
          <CoverflowItem key={album.title} className="basis-1/2 sm:basis-2/5">
            <div className={`relative flex aspect-square flex-col justify-end overflow-hidden rounded-xl border border-white/10 p-4 shadow-lg ${album.tone}`}>
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
