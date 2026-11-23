import { PhoneMockup, type PhoneMockupProps } from "@/components/dusk/device-mockup/device-mockup";

function Screen({ title, accent, light }: { title: string; accent: string; light?: boolean }) {
  return (
    <div
      className="flex size-full flex-col gap-2 px-[9%] pt-[24%]"
      style={{ background: light ? "#f5f7f6" : "#07100d", color: light ? "#0a0a0a" : "#fff" }}
    >
      <span className="text-[clamp(9px,7cqw,18px)] font-semibold">{title}</span>
      <span className="aspect-[4/3] rounded-xl" style={{ background: `linear-gradient(140deg, ${accent}, transparent)` }} />
      {[80, 60, 70].map((w) => (
        <span key={w} className="h-1.5 rounded" style={{ width: `${w}%`, background: light ? "#0001" : "#fff2" }} />
      ))}
    </div>
  );
}

const phones: { color: PhoneMockupProps["color"]; title: string; accent: string; light?: boolean }[] = [
  { color: "graphite", title: "Music", accent: "#a78bfa" },
  { color: "silver", title: "Photos", accent: "#f59e0b", light: true },
  { color: "mint", title: "Wallet", accent: "var(--color-primary)" },
];

export default function DeviceMockupPhonesDemo() {
  return (
    <div className="grid w-full max-w-xl grid-cols-3 items-end gap-4 sm:gap-8">
      {phones.map((phone) => (
        <PhoneMockup
          key={phone.title}
          color={phone.color}
          tilt={12}
          statusBarClassName={phone.light ? "text-black" : undefined}
        >
          <Screen title={phone.title} accent={phone.accent} light={phone.light} />
        </PhoneMockup>
      ))}
    </div>
  );
}
