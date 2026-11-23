"use client";

import * as React from "react";
import {
  AnimatePresence,
  LayoutGroup,
  animate,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  type Transition,
} from "motion/react";
import { Check, Minus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type BillingPeriod = "monthly" | "yearly";

export type PricingFeature = string | { label: React.ReactNode; included?: boolean };

export interface PricingPlan {
  /** Stable, unique id. */
  id: string;
  name: string;
  description?: string;
  /**
   * Price per month for each billing period (`yearly` = monthly price when billed yearly),
   * one number for both, or text such as `"Custom"`.
   */
  price: { monthly: number; yearly: number } | number | string;
  features: PricingFeature[];
  cta: {
    label: string;
    /** Renders the button as a link. */
    href?: string;
    onClick?: () => void;
  };
  /** Highlight this plan with an animated border and badge. */
  popular?: boolean;
  /** Badge text for a popular plan. */
  badge?: string;
}

export interface PricingTableProps
  extends Omit<React.ComponentProps<"div">, "children" | "defaultValue"> {
  plans: PricingPlan[];
  /** Billing period (controlled). */
  billing?: BillingPeriod;
  defaultBilling?: BillingPeriod;
  onBillingChange?: (billing: BillingPeriod) => void;
  /** Show the monthly / yearly switch. */
  showToggle?: boolean;
  /** ISO 4217 currency code. */
  currency?: string;
  /** BCP 47 locale. Fixed by default so server and browser render the same string. */
  locale?: string;
  /** Text for the toggle, period and billing note. */
  labels?: Partial<PricingLabels>;
}

export interface PricingLabels {
  monthly: string;
  yearly: string;
  /** Small badge on the yearly option, e.g. "Save 20%". Empty string hides it. */
  yearlyBadge: string;
  /** Shown after the price. */
  perMonth: string;
  /** Screen-reader version of `perMonth`. */
  perMonthLabel: string;
  /** Line under the price. Receives the yearly total when billed yearly. */
  billedMonthly: string;
  billedYearly: (total: string) => string;
  /** Prefix read by screen readers for features a plan doesn't include. */
  notIncluded: string;
}

const defaultLabels: PricingLabels = {
  monthly: "Monthly",
  yearly: "Yearly",
  yearlyBadge: "Save 20%",
  perMonth: "/month",
  perMonthLabel: "per month",
  billedMonthly: "Billed monthly",
  billedYearly: (total) => `${total} billed yearly`,
  notIncluded: "Not included:",
};

const pill: Transition = { type: "spring", bounce: 0.2, duration: 0.45 };
const roll: Transition = { type: "spring", bounce: 0.15, duration: 0.6 };
const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

function priceFor(plan: PricingPlan, billing: BillingPeriod) {
  if (typeof plan.price === "number" || typeof plan.price === "string") return plan.price;
  return plan.price[billing];
}

/** A single digit column that rolls to its value. */
function Digit({ value, reduceMotion }: { value: number; reduceMotion: boolean }) {
  return (
    // Fixed 1em-wide window (tabular digits) with room above/below so the roll isn't clipped mid-glyph.
    <span className="relative inline-block h-[1lh] overflow-hidden align-top">
      <span className="invisible">0</span>
      <motion.span
        className="absolute inset-x-0 top-0 flex flex-col"
        initial={false}
        animate={{ y: `${-value * 10}%` }}
        transition={reduceMotion ? { duration: 0 } : roll}
      >
        {DIGITS.map((d) => (
          <span key={d} className="block h-[1lh]">
            {d}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

/**
 * A formatted price whose digits roll like an odometer. Characters are keyed
 * from the right so the units digit always rolls into the units digit. The
 * widest of all possible values is reserved, so nothing around it moves.
 */
function RollingPrice({
  text,
  reserve,
  reduceMotion,
}: {
  text: string;
  reserve: string[];
  reduceMotion: boolean;
}) {
  const chars = text.split("");
  const stack = "[grid-area:1/1] whitespace-nowrap";
  return (
    <span aria-hidden className="inline-grid justify-items-start tabular-nums">
      {reserve.map((r, i) => (
        <span key={i} className={cn(stack, "invisible select-none")}>
          {r}
        </span>
      ))}
      <span className={cn(stack, "inline-flex")}>
        <AnimatePresence initial={false} mode="popLayout">
          {chars.map((char, i) => {
            const key = chars.length - i; // position from the right
            const isDigit = char >= "0" && char <= "9";
            return (
              <motion.span
                key={`${key}-${isDigit ? "d" : char}`}
                layout={reduceMotion ? false : "position"}
                initial={{ opacity: 0, y: reduceMotion ? 0 : "-0.4em" }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduceMotion ? 0 : "0.4em" }}
                transition={reduceMotion ? { duration: 0 } : roll}
                className="inline-block"
              >
                {isDigit ? <Digit value={Number(char)} reduceMotion={reduceMotion} /> : char}
              </motion.span>
            );
          })}
        </AnimatePresence>
      </span>
    </span>
  );
}

/** Animated gradient ring for the popular plan; a steady ring under reduced motion. */
function PopularRing({ reduceMotion }: { reduceMotion: boolean }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref);
  const angle = useMotionValue(0);
  const background = useMotionTemplate`conic-gradient(from ${angle}deg, transparent 0%, color-mix(in oklab, var(--color-primary) 25%, transparent) 30%, var(--color-primary) 50%, color-mix(in oklab, var(--color-primary) 25%, transparent) 70%, transparent 100%)`;

  React.useEffect(() => {
    if (!inView || reduceMotion) return;
    const controls = animate(angle, angle.get() + 360, { duration: 5, ease: "linear", repeat: Infinity });
    return () => controls.stop();
  }, [inView, reduceMotion, angle]);

  const ring =
    "pointer-events-none absolute inset-0 rounded-[inherit] p-px [mask-composite:exclude] [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)]";

  return (
    <>
      <span ref={ref} aria-hidden className={cn(ring, "bg-primary/25")} />
      <motion.span
        aria-hidden
        className={cn(ring, "p-[1.5px]")}
        style={{ background: reduceMotion ? "var(--color-primary)" : background }}
      />
    </>
  );
}

/**
 * Pricing cards with a monthly / yearly switch. A pill glides between the
 * periods, prices roll digit by digit without changing width, and the popular
 * plan gets a travelling gradient border. The switch is a native radio group,
 * every price has a plain-text copy for screen readers, and the CTA is the
 * DuskUI Button (a link when `href` is set). Fully data-driven.
 */
export function PricingTable({
  plans,
  billing: billingProp,
  defaultBilling = "monthly",
  onBillingChange,
  showToggle = true,
  currency = "USD",
  locale = "en-US",
  labels: labelsProp,
  className,
  ...props
}: PricingTableProps) {
  const id = React.useId();
  const reduceMotion = useReducedMotion() ?? false;
  const [uncontrolled, setUncontrolled] = React.useState<BillingPeriod>(defaultBilling);
  const billing = billingProp ?? uncontrolled;
  const labels = { ...defaultLabels, ...labelsProp };

  const format = React.useMemo(() => {
    const nf = new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 2 });
    const whole = new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 0 });
    return (n: number) => (Number.isInteger(n) ? whole.format(n) : nf.format(n));
  }, [locale, currency]);

  const select = (next: BillingPeriod) => {
    if (billingProp === undefined) setUncontrolled(next);
    onBillingChange?.(next);
  };

  const periods: BillingPeriod[] = ["monthly", "yearly"];

  return (
    <div data-slot="pricing-table" className={cn("flex w-full flex-col items-center gap-8", className)} {...props}>
      {showToggle && (
        <LayoutGroup id={id}>
          <div
            role="radiogroup"
            aria-label="Billing period"
            className="relative isolate inline-flex items-center rounded-full border bg-muted/60 p-1"
          >
            {periods.map((period) => {
              const checked = billing === period;
              return (
                <label
                  key={period}
                  data-state={checked ? "checked" : "unchecked"}
                  className={cn(
                    "relative inline-flex h-9 cursor-pointer items-center gap-2 rounded-full px-4 text-sm font-medium text-muted-foreground select-none",
                    "transition-colors duration-200 hover:text-foreground data-[state=checked]:text-primary-foreground motion-reduce:transition-none",
                    "has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50"
                  )}
                >
                  <input
                    type="radio"
                    name={`${id}-billing`}
                    value={period}
                    checked={checked}
                    onChange={() => select(period)}
                    className="sr-only"
                  />
                  {checked && (
                    <motion.span
                      layoutId="billing-pill"
                      aria-hidden
                      transition={reduceMotion ? { duration: 0 } : pill}
                      className="absolute inset-0 -z-10 rounded-full bg-primary shadow-[0_0_20px_-4px_var(--color-primary)]"
                    />
                  )}
                  {labels[period]}
                  {period === "yearly" && labels.yearlyBadge && (
                    <span
                      className={cn(
                        "rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none transition-colors duration-200",
                        checked ? "bg-primary-foreground/15 text-primary-foreground" : "bg-primary/15 text-primary"
                      )}
                    >
                      {labels.yearlyBadge}
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        </LayoutGroup>
      )}

      <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(min(100%,13rem),1fr))] items-stretch gap-4">
        {plans.map((plan) => {
          const value = priceFor(plan, billing);
          const numeric = typeof value === "number";
          const text = numeric ? format(value) : value;
          // Every value this plan can show, so the widest one is reserved.
          const reserve =
            typeof plan.price === "object"
              ? [format(plan.price.monthly), format(plan.price.yearly)]
              : [text];
          const yearlyTotal =
            typeof plan.price === "object" ? format(Math.round(plan.price.yearly * 12 * 100) / 100) : null;
          const note = !numeric
            ? " "
            : billing === "yearly" && yearlyTotal
              ? labels.billedYearly(yearlyTotal)
              : typeof plan.price === "number"
                ? " "
                : labels.billedMonthly;

          return (
            <article
              key={plan.id}
              aria-labelledby={`${id}-${plan.id}-name`}
              className={cn(
                "relative flex flex-col rounded-2xl border bg-card p-6 text-card-foreground",
                plan.popular &&
                  "border-transparent bg-[radial-gradient(120%_60%_at_50%_0%,color-mix(in_oklab,var(--color-primary)_10%,transparent),transparent_70%)] shadow-[0_20px_60px_-25px_color-mix(in_oklab,var(--color-primary)_45%,transparent)]"
              )}
            >
              {plan.popular && <PopularRing reduceMotion={reduceMotion} />}
              <div className="flex items-center justify-between gap-2">
                <h3 id={`${id}-${plan.id}-name`} className="font-semibold tracking-tight">
                  {plan.name}
                </h3>
                {plan.popular && (
                  <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
                    {plan.badge ?? "Most popular"}
                  </span>
                )}
              </div>
              {plan.description && <p className="mt-1.5 text-sm text-muted-foreground">{plan.description}</p>}

              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight">
                  <span className="sr-only">
                    {numeric ? `${text} ${labels.perMonthLabel}` : text}
                  </span>
                  {numeric ? (
                    <RollingPrice text={text} reserve={reserve} reduceMotion={reduceMotion} />
                  ) : (
                    <span aria-hidden>{text}</span>
                  )}
                </span>
                {numeric && (
                  <span aria-hidden className="text-sm text-muted-foreground">
                    {labels.perMonth}
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{note}</p>

              <Button
                className="mt-6 w-full"
                variant={plan.popular ? "default" : "outline"}
                asChild={Boolean(plan.cta.href)}
                onClick={plan.cta.onClick}
              >
                {plan.cta.href ? <a href={plan.cta.href}>{plan.cta.label}</a> : plan.cta.label}
              </Button>

              <ul role="list" className="mt-6 space-y-2.5 text-sm">
                {plan.features.map((feature, i) => {
                  const f = typeof feature === "string" ? { label: feature, included: true } : feature;
                  const included = f.included !== false;
                  return (
                    <li key={i} className={cn("flex items-start gap-2.5", !included && "text-muted-foreground/70")}>
                      <span
                        aria-hidden
                        className={cn(
                          "mt-0.5 grid size-4 shrink-0 place-items-center rounded-full",
                          included ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                        )}
                      >
                        {included ? <Check className="size-3" strokeWidth={3} /> : <Minus className="size-3" strokeWidth={3} />}
                      </span>
                      <span>
                        {!included && <span className="sr-only">{labels.notIncluded} </span>}
                        {f.label}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </article>
          );
        })}
      </div>
    </div>
  );
}
