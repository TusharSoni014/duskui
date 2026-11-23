import { Lens } from "@/components/dusk/lens/lens";

export default function LensFinePrint() {
  return (
    <Lens zoom={2.6} size={140} className="w-full max-w-md border border-white/10 bg-card">
      <div className="space-y-3 p-6">
        <p className="text-sm font-medium text-muted-foreground">Pro plan</p>
        <p className="text-3xl font-semibold text-foreground">
          $12<span className="text-base font-normal text-white/50"> / month</span>
        </p>
        <p className="text-[9px] leading-snug text-white/45">
          Billed annually at $144. Prices exclude local taxes. Cancel any time from your account settings and keep access
          until the end of the billing period. Seats beyond the first ten are charged pro rata on the next invoice.
          Usage over 100,000 requests per month is billed at $0.20 per additional 1,000 requests.
        </p>
      </div>
    </Lens>
  );
}
