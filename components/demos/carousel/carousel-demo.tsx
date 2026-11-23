import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/dusk/carousel/carousel";

const slides = [
  { title: "Aurora", caption: "Northern lights over the fjord", tone: "bg-[#2f3b3a]" },
  { title: "Ember", caption: "Last light on the dunes", tone: "bg-[#4a3a30]" },
  { title: "Tide", caption: "Low tide at blue hour", tone: "bg-[#2c3646]" },
  { title: "Bloom", caption: "Spring in the night garden", tone: "bg-[#3a3443]" },
  { title: "Market", caption: "Rain on the market street", tone: "bg-[#33343a]" },
];

export default function CarouselDemo() {
  return (
    <Carousel loop aria-label="Featured scenes" className="w-full max-w-md">
      <CarouselContent>
        {slides.map((slide) => (
          <CarouselItem key={slide.title}>
            <div className={`relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-xl border border-white/10 p-5 ${slide.tone}`}>
              <h3 className="relative text-2xl font-semibold tracking-tight text-white">{slide.title}</h3>
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
