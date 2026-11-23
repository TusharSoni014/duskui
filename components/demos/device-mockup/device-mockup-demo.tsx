import { PhoneMockup, SafariMockup } from "@/components/dusk/device-mockup/device-mockup";

function Dashboard() {
  return (
    <div className="flex size-full bg-[#07100d] text-white">
      <aside className="hidden w-[18%] flex-col gap-2 border-r border-white/5 p-[2%] sm:flex">
        <span className="mb-2 h-3 w-2/3 rounded bg-primary/80" />
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className="h-2 rounded bg-white/10" style={{ width: `${85 - i * 9}%` }} />
        ))}
      </aside>
      <div className="flex flex-1 flex-col gap-[3%] p-[3%]">
        <div className="grid grid-cols-3 gap-[3%]">
          {["24.8k", "1,204", "3.6%"].map((value) => (
            <div key={value} className="rounded-lg border border-white/5 bg-white/[0.03] p-[6%]">
              <span className="block h-1.5 w-1/2 rounded bg-white/15" />
              <span className="mt-2 block text-[clamp(10px,2cqw,20px)] font-semibold tabular-nums">{value}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-1 items-end gap-[1.5%] rounded-lg border border-white/5 bg-white/[0.03] p-[3%]">
          {[35, 55, 42, 70, 52, 88, 64, 78, 58, 95, 72, 84].map((h, i) => (
            <span key={i} className="flex-1 rounded-t bg-primary" style={{ height: `${h}%`, opacity: 0.3 + i * 0.06 }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileApp() {
  return (
    <div className="flex size-full flex-col gap-3 bg-[#07100d] px-[8%] pt-[22%] text-white">
      <span className="text-[clamp(10px,7cqw,22px)] font-semibold">Overview</span>
      <div className="rounded-2xl bg-primary p-4 text-primary-foreground">
        <span className="block text-[clamp(8px,4cqw,13px)] opacity-70">Revenue</span>
        <span className="block text-[clamp(12px,9cqw,28px)] font-bold tabular-nums">$12,480</span>
      </div>
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center gap-3 rounded-xl bg-white/[0.05] p-3">
          <span className="size-6 shrink-0 rounded-full bg-white/15" />
          <span className="h-2 flex-1 rounded bg-white/15" />
        </div>
      ))}
    </div>
  );
}

export default function DeviceMockupDemo() {
  return (
    <div className="relative w-full max-w-2xl pb-6 sm:pr-16">
      <SafariMockup url="app.acme.dev/overview">
        <Dashboard />
      </SafariMockup>
      <PhoneMockup className="absolute right-0 -bottom-2 hidden w-[26%] sm:block" color="mint">
        <MobileApp />
      </PhoneMockup>
    </div>
  );
}
