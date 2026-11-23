import { ImageCompare } from "@/components/dusk/image-compare/image-compare";

// [x, width, height] of each tower, fixed so server and client markup match.
const towers = [
  [0, 46, 120], [42, 34, 168], [72, 52, 96], [120, 30, 196], [146, 58, 142],
  [200, 36, 222], [232, 48, 128], [276, 40, 176], [312, 56, 108], [364, 38, 156],
] as const;

function Skyline({ variant }: { variant: "sketch" | "render" }) {
  const render = variant === "render";
  return (
    <svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" role="img" aria-label={render ? "Rendered neon skyline" : "Wireframe sketch of a skyline"}>
      <defs>
        <linearGradient id={`sky-${variant}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={render ? "#1b0b3a" : "#0b0f0d"} />
          <stop offset="0.65" stopColor={render ? "#4a1550" : "#0e1411"} />
          <stop offset="1" stopColor={render ? "#ff6a7a" : "#121a16"} />
        </linearGradient>
        <radialGradient id={`moon-${variant}`}>
          <stop offset="0" stopColor="#fef3c7" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fef3c7" stopOpacity="0" />
        </radialGradient>
        <pattern id={`grid-${variant}`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="rgb(255 255 255 / 0.06)" />
        </pattern>
      </defs>
      <rect width="400" height="250" fill={`url(#sky-${variant})`} />
      {render ? (
        <>
          <circle cx="318" cy="62" r="46" fill="url(#moon-render)" />
          <circle cx="318" cy="62" r="16" fill="#fef3c7" />
        </>
      ) : (
        <>
          <rect width="400" height="250" fill="url(#grid-sketch)" />
          <circle cx="318" cy="62" r="16" fill="none" stroke="rgb(255 255 255 / 0.35)" strokeDasharray="3 3" />
        </>
      )}
      {towers.map(([x, w, h], i) => (
        <g key={i}>
          <rect
            x={x}
            y={250 - h}
            width={w}
            height={h}
            fill={render ? "#0a0614" : "none"}
            stroke={render ? "rgb(255 255 255 / 0.04)" : "rgb(255 255 255 / 0.4)"}
            strokeDasharray={render ? undefined : "4 3"}
          />
          {Array.from({ length: Math.floor(h / 22) }, (_, row) =>
            Array.from({ length: Math.floor(w / 14) }, (_, col) => {
              const lit = (i * 7 + row * 3 + col * 5) % 4 !== 0;
              return (
                <rect
                  key={`${row}-${col}`}
                  x={x + 5 + col * 14}
                  y={250 - h + 8 + row * 22}
                  width="6"
                  height="9"
                  rx="1"
                  fill={render ? (lit ? ((i + col) % 3 ? "#f3e3b5" : "#d9c79a") : "#1a1325") : "none"}
                  fillOpacity={render ? (lit ? 0.85 : 1) : 0}
                  stroke={render ? "none" : "rgb(255 255 255 / 0.18)"}
                />
              );
            })
          )}
        </g>
      ))}
    </svg>
  );
}

export default function ImageCompareDemo() {
  return (
    <ImageCompare
      className="max-w-xl"
      label="Compare wireframe and render"
      beforeLabel="Sketch"
      afterLabel="Render"
      before={<Skyline variant="sketch" />}
      after={<Skyline variant="render" />}
    />
  );
}
