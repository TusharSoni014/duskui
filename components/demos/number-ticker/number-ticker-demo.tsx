import { NumberTicker } from "@/components/dusk/text/number-ticker";

const stats = [
  { label: "GitHub stars", ticker: <NumberTicker value={12480} suffix="+" /> },
  { label: "Uptime", ticker: <NumberTicker value={99.98} suffix="%" from={90} /> },
  { label: "Monthly revenue", ticker: <NumberTicker value={48200} currency="USD" decimals={0} /> },
];

export default function NumberTickerDemo() {
  return (
    <dl className="grid w-full max-w-2xl gap-6 text-center sm:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col-reverse gap-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-6"
        >
          <dt className="text-sm text-white/55">{stat.label}</dt>
          <dd className="text-4xl font-bold tracking-tight text-primary">{stat.ticker}</dd>
        </div>
      ))}
    </dl>
  );
}
