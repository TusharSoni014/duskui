import { Disc3, Headphones, Music2, Radio } from "lucide-react";
import { ExpandableCard, type ExpandableCardItem } from "@/components/dusk/expandable-card/expandable-card";

function Cover({ icon: Icon, tone }: { icon: typeof Disc3; tone: string }) {
  return (
    <span className="grid size-full place-items-center" style={{ background: tone }}>
      <Icon className="size-1/3 min-h-5 min-w-5 text-white/60" aria-hidden />
    </span>
  );
}

const tracks: ExpandableCardItem[] = [
  {
    id: "neon-rain",
    title: "Neon Rain",
    subtitle: "Night Drive · 3:42",
    description: "Warm analog synths over a slow, rain-soaked beat. The opener of the record.",
    media: <Cover icon={Disc3} tone="#243029" />,
    content: <p>Written in one take on a borrowed Juno-60, then left almost untouched.</p>,
  },
  {
    id: "afterglow",
    title: "Afterglow",
    subtitle: "Night Drive · 4:05",
    description: "A shimmering arpeggio that builds into the album's brightest chorus.",
    media: <Cover icon={Music2} tone="#232b33" />,
    content: <p>The vocal was recorded at 4am in a stairwell for the natural reverb.</p>,
  },
  {
    id: "static",
    title: "Static Bloom",
    subtitle: "Night Drive · 2:58",
    description: "Tape hiss, a drum machine and a melody that keeps almost resolving.",
    media: <Cover icon={Radio} tone="#2b2633" />,
    content: <p>Built around a loop sampled from an old shortwave broadcast.</p>,
  },
  {
    id: "last-exit",
    title: "Last Exit",
    subtitle: "Night Drive · 5:31",
    description: "The closing track: a long fade into ambient noise and passing headlights.",
    media: <Cover icon={Headphones} tone="#332a22" />,
    content: <p>Best heard with headphones; the stereo field slowly widens to the end.</p>,
  },
];

export default function ExpandableCardListDemo() {
  return <ExpandableCard items={tracks} layout="list" className="max-w-md" />;
}
