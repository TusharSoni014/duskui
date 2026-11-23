import { ImageCompare } from "@/components/dusk/image-compare/image-compare";

const palettes = {
  day: { sky: ["#7dd3fc", "#e0f2fe"], far: "#5b8fb0", mid: "#3f7a6b", near: "#25543f", sun: "#fff7d6" },
  dusk: { sky: ["#0b0620", "#5b1d5e"], far: "#2a1846", mid: "#1a1033", near: "#0b0718", sun: "#ffd1a8" },
};

function Landscape({ time }: { time: keyof typeof palettes }) {
  const p = palettes[time];
  return (
    <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" role="img" aria-label={`Mountains at ${time}`}>
      <defs>
        <linearGradient id={`land-sky-${time}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.sky[0]} />
          <stop offset="1" stopColor={p.sky[1]} />
        </linearGradient>
      </defs>
      <rect width="300" height="400" fill={`url(#land-sky-${time})`} />
      <circle cx="210" cy={time === "day" ? 90 : 210} r="26" fill={p.sun} opacity={time === "day" ? 1 : 0.85} />
      {time === "dusk" &&
        [
          [30, 40], [80, 22], [140, 64], [250, 30], [190, 110], [60, 130], [270, 150],
        ].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.2" fill="#fff" opacity="0.8" />)}
      <path d="M0 250 L60 180 L110 230 L170 150 L240 220 L300 170 L300 400 L0 400Z" fill={p.far} />
      <path d="M0 300 L50 250 L120 300 L190 240 L260 290 L300 260 L300 400 L0 400Z" fill={p.mid} />
      <path d="M0 350 L80 310 L150 345 L230 305 L300 335 L300 400 L0 400Z" fill={p.near} />
    </svg>
  );
}

export default function ImageCompareVerticalDemo() {
  return (
    <ImageCompare
      orientation="vertical"
      defaultPosition={45}
      className="aspect-[3/4] max-w-[18rem]"
      label="Compare day and dusk"
      beforeLabel="Day"
      afterLabel="Dusk"
      before={<Landscape time="day" />}
      after={<Landscape time="dusk" />}
    />
  );
}
