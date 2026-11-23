"use client";

import {
  BarsLoader,
  DotsLoader,
  OrbitLoader,
  PulseLoader,
  RingLoader,
} from "@/components/dusk/spinner/loaders";

const loaders = [
  { name: "Dots", Loader: DotsLoader },
  { name: "Bars", Loader: BarsLoader },
  { name: "Ring", Loader: RingLoader },
  { name: "Orbit", Loader: OrbitLoader },
  { name: "Pulse", Loader: PulseLoader },
];

export default function LoadersDemo() {
  return (
    <ul className="grid w-full max-w-xl grid-cols-2 gap-3 sm:grid-cols-5">
      {loaders.map(({ name, Loader }) => (
        <li
          key={name}
          className="flex flex-col items-center gap-4 rounded-xl border bg-card px-4 py-6 last:col-span-2 sm:last:col-span-1"
        >
          <Loader size={36} label={`${name} loader`} />
          <span className="text-xs text-muted-foreground">{name}</span>
        </li>
      ))}
    </ul>
  );
}
