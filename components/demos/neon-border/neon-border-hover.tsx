import { NeonBorder } from "@/components/dusk/neon/neon-border";

const links = [
  { title: "Docs", text: "Guides and API reference." },
  { title: "Templates", text: "Start from a full page." },
];

export default function NeonBorderHoverDemo() {
  return (
    <div className="grid w-full max-w-lg gap-4 sm:grid-cols-2">
      {links.map((link) => (
        <NeonBorder key={link.title} trigger="hover" color="#22d3ee" radius={12} speed={2.5}>
          <a
            href="#"
            className="block rounded-[inherit] bg-card p-5 outline-none focus-visible:ring-2 focus-visible:ring-[#22d3ee]/50"
          >
            <span className="font-semibold">{link.title}</span>
            <span className="mt-1 block text-sm text-white/60">{link.text}</span>
          </a>
        </NeonBorder>
      ))}
    </div>
  );
}
