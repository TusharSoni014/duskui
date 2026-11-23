import { AvatarGroup } from "@/components/dusk/avatar/avatar-group";

const team = [
  { name: "Maya Chen", src: "https://i.pravatar.cc/150?img=47" },
  { name: "Leo Park", src: "https://i.pravatar.cc/150?img=12" },
  { name: "Ines Duarte", src: "https://i.pravatar.cc/150?img=32" },
  { name: "Sam Okafor" },
  { name: "Ava Lindqvist", src: "https://i.pravatar.cc/150?img=5" },
  { name: "Noah Becker", src: "https://i.pravatar.cc/150?img=15" },
  { name: "Priya Nair", src: "https://i.pravatar.cc/150?img=44" },
];

export default function AvatarGroupDemo() {
  return (
    <div className="flex flex-col items-center gap-10 pt-6">
      <AvatarGroup items={team} max={5} label="Project members" />
      <AvatarGroup items={team.slice(0, 4)} size="sm" label="Reviewers" />
    </div>
  );
}
