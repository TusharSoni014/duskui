import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselPlayToggle,
} from "@/components/dusk/carousel/carousel";

const quotes = [
  { quote: "The smoothest carousel I've shipped — and no extra dependency.", name: "Mia Chen", role: "Design engineer" },
  { quote: "Keyboard, swipe and screen readers all just work.", name: "Leo Park", role: "Accessibility lead" },
  { quote: "Autoplay that actually pauses when you look at it. Finally.", name: "Ava Singh", role: "Product designer" },
  { quote: "It respects reduced motion out of the box.", name: "Kai Moreno", role: "Frontend developer" },
];

export default function CarouselAutoplayDemo() {
  return (
    <Carousel loop autoplay={4000} aria-label="Testimonials" className="w-full max-w-md">
      <CarouselContent>
        {quotes.map((q) => (
          <CarouselItem key={q.name}>
            <figure className="flex h-44 flex-col justify-between rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_0%_0%,color-mix(in_oklab,var(--color-primary)_14%,transparent),transparent_60%)] bg-card p-6">
              <blockquote className="text-lg leading-snug text-balance">“{q.quote}”</blockquote>
              <figcaption className="text-sm text-muted-foreground">
                <span className="text-foreground">{q.name}</span> · {q.role}
              </figcaption>
            </figure>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="mt-3 flex items-center justify-center gap-2">
        <CarouselPlayToggle />
        <CarouselDots />
      </div>
    </Carousel>
  );
}
