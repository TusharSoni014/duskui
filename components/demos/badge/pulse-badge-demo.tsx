import { PulseBadge, PulseDot } from "@/components/dusk/badge/pulse-badge";

export default function PulseBadgeDemo() {
  return (
    <>
      <PulseBadge>Online</PulseBadge>
      <PulseBadge tone="danger">Live</PulseBadge>
      <PulseBadge tone="warning">Deploying</PulseBadge>
      <PulseBadge tone="muted" pulse={false}>Offline</PulseBadge>
      <span className="relative inline-flex">
        <span className="grid size-10 place-items-center rounded-full bg-secondary text-sm font-medium">AK</span>
        <PulseDot className="absolute right-0 bottom-0 size-2.5 ring-2 ring-background rounded-full" />
        <span className="sr-only">Ada Kim, online</span>
      </span>
    </>
  );
}
