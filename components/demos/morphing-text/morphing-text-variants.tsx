import { MorphingText } from "@/components/dusk/morphing-text/morphing-text";

const words = ["Design", "Build", "Ship", "Repeat"];

export default function MorphingTextVariantsDemo() {
  return (
    <div className="grid w-full max-w-xl gap-8 sm:grid-cols-2">
      <figure className="flex flex-col items-center gap-3">
        <MorphingText as="p" words={words} variant="gooey" className="text-4xl font-bold" />
        <figcaption className="font-mono text-xs text-muted-foreground">variant=&quot;gooey&quot;</figcaption>
      </figure>
      <figure className="flex flex-col items-center gap-3">
        <MorphingText
          as="p"
          words={words}
          variant="blur"
          morphDuration={700}
          className="text-4xl font-light"
          wordClassName="bg-gradient-to-r from-primary to-cyan-300 bg-clip-text text-transparent"
        />
        <figcaption className="font-mono text-xs text-muted-foreground">variant=&quot;blur&quot; + gradient</figcaption>
      </figure>
    </div>
  );
}
