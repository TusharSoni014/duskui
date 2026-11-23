import { NumberTicker } from "@/components/dusk/text/number-ticker";

export default function NumberTickerFormatsDemo() {
  return (
    <div className="grid w-full max-w-lg gap-3 font-medium">
      <Row label="de-DE · EUR">
        <NumberTicker value={1234567.89} locale="de-DE" currency="EUR" />
      </Row>
      <Row label="en-IN · grouping">
        <NumberTicker value={12500000} locale="en-IN" />
      </Row>
      <Row label="ja-JP · JPY">
        <NumberTicker value={98000} locale="ja-JP" currency="JPY" />
      </Row>
      <Row label="percent">
        <NumberTicker value={0.873} format={{ style: "percent", maximumFractionDigits: 1 }} />
      </Row>
      <Row label="countdown">
        <NumberTicker value={0} from={100} suffix="s left" duration={2.4} />
      </Row>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-3 last:border-0">
      <span className="text-sm text-white/50">{label}</span>
      <span className="text-2xl">{children}</span>
    </div>
  );
}
