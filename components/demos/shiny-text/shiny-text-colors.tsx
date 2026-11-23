import { ShinyText } from "@/components/dusk/text/shiny-text";

export default function ShinyTextColorsDemo() {
  return (
    <div className="grid gap-5 text-center text-3xl font-semibold tracking-tight">
      <ShinyText
        as="p"
        color="color-mix(in oklab, var(--color-primary) 45%, transparent)"
        shineColor="var(--color-primary)"
      >
        Mint sweep
      </ShinyText>
      <ShinyText as="p" color="#a16207" shineColor="#fde68a" spread={0.5} duration={2.6}>
        Slow gold
      </ShinyText>
      <ShinyText as="p" color="#6d28d9" shineColor="#f0abfc" direction="rtl" angle={70} repeatDelay={0.6}>
        Right to left
      </ShinyText>
    </div>
  );
}
