import { Lens } from "@/components/dusk/lens/lens";

// A tiny deterministic generator, so the skyline is identical on the server and the client.
function lcg(seed: number) {
  let s = seed;
  return () => (s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296;
}

const rand = lcg(2024);
const stars = Array.from({ length: 70 }, () => ({ x: rand() * 640, y: rand() * 170, r: 0.4 + rand() * 0.9 }));
let cursor = 0;
const buildings: { x: number; w: number; h: number }[] = [];
while (cursor < 640) {
  const w = 34 + Math.floor(rand() * 46);
  buildings.push({ x: cursor, w, h: 70 + Math.floor(rand() * 170) });
  cursor += w + 4;
}

function Skyline() {
  return (
    <svg viewBox="0 0 640 320" className="block h-auto w-full" role="img" aria-label="A city skyline at night">
      <defs>
        <linearGradient id="lens-demo-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#020617" />
          <stop offset="0.7" stopColor="#0f172a" />
          <stop offset="1" stopColor="#1e293b" />
        </linearGradient>
      </defs>
      <rect width="640" height="320" fill="url(#lens-demo-sky)" />
      {stars.map((s, i) => (
        <circle key={i} cx={s.x.toFixed(1)} cy={s.y.toFixed(1)} r={s.r.toFixed(2)} fill="#e2e8f0" opacity="0.8" />
      ))}
      <circle cx="520" cy="62" r="26" fill="#f1f5f9" />
      <circle cx="510" cy="56" r="26" fill="#020617" opacity="0.9" />
      {buildings.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={320 - b.h} width={b.w} height={b.h} fill={i % 3 ? "#0b1220" : "#0d1a1f"} />
          {Array.from({ length: Math.floor((b.h - 14) / 10) }, (_, row) =>
            Array.from({ length: Math.floor((b.w - 6) / 7) }, (_, col) =>
              (row * 7 + col * 3 + i) % 5 === 0 ? (
                <rect
                  key={`${row}-${col}`}
                  x={b.x + 5 + col * 7}
                  y={320 - b.h + 8 + row * 10}
                  width="3"
                  height="4"
                  fill={(row + col + i) % 4 ? "#fde68a" : "#fef3c7"}
                />
              ) : null
            )
          )}
        </g>
      ))}
      <text x="12" y="310" fill="#94a3b8" fontSize="7" fontFamily="monospace">
        N 52.3676° E 4.9041° · 02:14 local · 1,842 windows lit
      </text>
    </svg>
  );
}

export default function LensDemo() {
  return (
    <div className="w-full max-w-xl">
      <Lens className="border border-white/10">
        <Skyline />
      </Lens>
      <p className="mt-3 text-center text-sm text-white/60">Hover, press and hold on touch, or Tab in and use the arrow keys.</p>
    </div>
  );
}
