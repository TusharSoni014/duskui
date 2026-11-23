import { Check, Package } from "lucide-react";

import {
  MotionCollapsible,
  MotionCollapsibleContent,
  MotionCollapsibleTrigger,
} from "@/components/dusk/collapsible/motion-collapsible";

const steps = ["Order confirmed", "Packed at the warehouse", "Handed to the courier"];

export default function MotionCollapsibleDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <MotionCollapsible defaultOpen>
        <MotionCollapsibleTrigger>
          <span className="flex items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-lg border border-white/10 text-muted-foreground">
              <Package className="size-4" aria-hidden />
            </span>
            <span className="flex flex-col">
              <span>Order #4821</span>
              <span className="text-xs font-normal text-muted-foreground">Arrives Thursday</span>
            </span>
          </span>
        </MotionCollapsibleTrigger>
        <MotionCollapsibleContent>
          <ol className="flex flex-col gap-2 border-t border-white/5 pt-3">
            {steps.map((step) => (
              <li key={step} className="flex items-center gap-2">
                <Check className="size-3.5 text-muted-foreground" aria-hidden />
                {step}
              </li>
            ))}
          </ol>
        </MotionCollapsibleContent>
      </MotionCollapsible>
      <MotionCollapsible>
        <MotionCollapsibleTrigger>Shipping &amp; returns</MotionCollapsibleTrigger>
        <MotionCollapsibleContent>
          Free returns within 30 days. Print a label from your account and drop the parcel at any partner
          location — refunds land within three business days of us receiving it.
        </MotionCollapsibleContent>
      </MotionCollapsible>
    </div>
  );
}
