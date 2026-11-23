import { Typewriter } from "@/components/dusk/text/typewriter";

export default function TypewriterOnceDemo() {
  return (
    <p className="font-mono text-xl text-white/80">
      <span className="select-none text-white/55">$ </span>
      <Typewriter
        phrases={["Compiling…", "Optimizing assets…", "Deployed to production ✓"]}
        typeFirst
        loop={false}
        pause={900}
        cursor="block"
      />
    </p>
  );
}
