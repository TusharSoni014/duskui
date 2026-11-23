import { Typewriter } from "@/components/dusk/text/typewriter";

export default function TypewriterDemo() {
  return (
    <h2 className="max-w-2xl text-center text-4xl font-bold tracking-tight text-balance sm:text-5xl">
      Built for{" "}
      <Typewriter
        phrases={["landing pages", "dashboards", "design systems", "side projects"]}
        className="text-primary"
      />
    </h2>
  );
}
