import { HyperText } from "@/components/dusk/hyper-text/hyper-text";

const links = ["Components", "Templates", "Changelog", "GitHub"];

export default function HyperTextHover() {
  return (
    <nav aria-label="Example" className="flex flex-wrap justify-center gap-2">
      {links.map((label) => (
        <a
          key={label}
          href="#"
          className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-sm text-white/80 transition-colors outline-none hover:border-primary/40 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/60"
        >
          <HyperText trigger="hover" duration={500}>
            {label}
          </HyperText>
        </a>
      ))}
    </nav>
  );
}
