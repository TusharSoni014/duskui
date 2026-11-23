import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/dusk/carousel/carousel";

const slides = [
  { title: "Aurora", caption: "Northern lights over the fjord", tone: "from-emerald-400 via-teal-500 to-indigo-700" },
  { title: "Ember", caption: "Last light on the dunes", tone: "from-amber-300 via-rose-500 to-fuchsia-800" },
  { title: "Tide", caption: "Low tide at blue hour", tone: "from-sky-300 via-blue-600 to-slate-900" },
  { title: "Bloom", caption: "Spring in the night garden", tone: "from-fuchsia-400 via-violet-600 to-indigo-950" },
  { title: "Neon", caption: "Rain on the market street", tone: "from-primary via-cyan-500 to-violet-800" },
];

export default function CarouselDemo() {
  return (
    <Carousel loop aria-label="Featured scenes" className="w-full max-w-md">
      <CarouselContent>
        {slides.map((slide) => (
          <CarouselItem key={slide.title}>
            <div className={`relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-2xl bg-linear-to-br p-5 ${slide.tone}`}>
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgb(255_255_255/0.35),transparent_45%)]" />
              <h3 className="relative text-2xl font-semibold tracking-tight text-white drop-shadow">{slide.title}</h3>
              <p className="relative text-sm text-white/80">{slide.caption}</p>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="mt-4 flex items-center justify-between">
        <CarouselPrevious />
        <CarouselDots />
        <CarouselNext />
      </div>
    </Carousel>
  );
}
