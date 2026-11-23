import { AvatarTooltipGroup } from "@/components/dusk/tooltip/avatar-tooltip-group";

const team = [
  { name: "Mia Chen", role: "Design engineer" },
  { name: "Leo Okafor", role: "Frontend" },
  { name: "Ava Rossi", role: "Product design" },
  { name: "Kai Nakamura", role: "Platform" },
  { name: "Noah Patel", role: "Developer relations" },
  { name: "Zoe Martin", role: "Support" },
  { name: "Ivan Petrov", role: "Infrastructure" },
];

export default function AvatarTooltipGroupDemo() {
  return <AvatarTooltipGroup aria-label="Project members" items={team} max={5} size={44} />;
}
