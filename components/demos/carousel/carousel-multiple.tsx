import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/dusk/carousel/carousel";

const products = [
  { name: "Text Reveal", price: "Free" },
  { name: "Blur Panel", price: "Free" },
  { name: "Dock", price: "Free" },
  { name: "Carousel", price: "Free" },
  { name: "Tabs", price: "Free" },
  { name: "Navbar", price: "Free" },
  { name: "Pagination", price: "Free" },
];

export default function CarouselMultipleDemo() {
  return (
    <Carousel aria-label="Components" className="w-full max-w-xl">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium">Popular components</h3>
        <div className="flex gap-2">
          <CarouselPrevious size="icon-sm" />
          <CarouselNext size="icon-sm" />
        </div>
      </div>
      <CarouselContent className="gap-3">
        {products.map((p) => (
          <CarouselItem key={p.name} className="basis-[calc((100%_-_0.75rem)/2)] sm:basis-[calc((100%_-_1.5rem)/3)]">
            <a
              href={`#${p.name.toLowerCase().replace(" ", "-")}`}
              className="block rounded-xl border border-white/10 bg-card p-3 outline-none transition-colors hover:border-white/20 focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <div className="aspect-square rounded-lg bg-white/[0.04]" />
              <p className="mt-3 text-sm font-medium">{p.name}</p>
              <p className="text-xs text-muted-foreground">{p.price}</p>
            </a>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselDots className="mt-3" />
    </Carousel>
  );
}
