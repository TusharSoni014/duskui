import { Typewriter } from "@/components/dusk/text/typewriter";

export default function TypewriterCursorsDemo() {
  return (
    <div className="grid w-full max-w-md gap-4 font-mono text-lg">
      <p className="text-white/50">
        bar <span className="text-white/30">›</span>{" "}
        <Typewriter phrases={["npm run build", "npm run dev"]} className="text-foreground" />
      </p>
      <p className="text-white/50">
        block <span className="text-white/30">›</span>{" "}
        <Typewriter
          phrases={["git push", "git pull --rebase"]}
          cursor="block"
          typeSpeed={90}
          className="text-foreground"
        />
      </p>
      <p className="text-white/50">
        underscore <span className="text-white/30">›</span>{" "}
        <Typewriter
          phrases={["ssh dusk@prod", "exit"]}
          cursor="underscore"
          cursorClassName="bg-[#ff2bd6]"
          className="text-foreground"
        />
      </p>
    </div>
  );
}
