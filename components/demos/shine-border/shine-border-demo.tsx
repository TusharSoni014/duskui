import { ShineBorder } from "@/components/dusk/shine-border/shine-border";

export default function ShineBorderDemo() {
  return (
    <ShineBorder
      className="w-full max-w-sm"
      color={["#c4b5fd", "#7dd3fc"]}
      contentClassName="p-6"
    >
      <p className="text-sm font-medium text-white/60">Team plan</p>
      <p className="mt-2 text-xl font-semibold">$24 per seat, billed monthly</p>
      <p className="mt-2 text-sm leading-relaxed text-white/60">
        Shared projects, role-based access and audit logs for your whole team.
      </p>
    </ShineBorder>
  );
}
