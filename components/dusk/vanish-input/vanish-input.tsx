"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUp } from "lucide-react";

import { cn } from "@/lib/utils";

export interface VanishInputProps
  extends Omit<React.ComponentProps<"input">, "value" | "defaultValue" | "onChange" | "onSubmit" | "placeholder"> {
  /** Suggestions that take turns as the placeholder. */
  placeholders?: string[];
  /** Milliseconds each placeholder stays before the next slides in. */
  interval?: number;
  /** Controlled value. */
  value?: string;
  /** Initial value when uncontrolled. */
  defaultValue?: string;
  /** Called on every keystroke (and with `""` when the field clears after a submit). */
  onValueChange?: (value: string) => void;
  /** Called with the trimmed text when Enter or the button submits a non-empty value. */
  onSubmit?: (value: string) => void;
  /** Accessible name of the field. Defaults to the first placeholder. */
  label?: string;
  /** Accessible name of the submit button. */
  submitLabel?: string;
  /** Classes for the outer form. */
  containerClassName?: string;
}

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  delay: number;
  life: number;
};

/** A prompt field whose placeholder cycles through suggestions and whose text dissolves into particles when submitted. */
export function VanishInput({
  placeholders = ["Ask anything…"],
  interval = 3000,
  value,
  defaultValue = "",
  onValueChange,
  onSubmit,
  label,
  submitLabel = "Submit",
  containerClassName,
  className,
  disabled,
  ...props
}: VanishInputProps) {
  const reduce = useReducedMotion() ?? false;
  const formRef = React.useRef<HTMLFormElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const rafRef = React.useRef(0);
  const [internal, setInternal] = React.useState(defaultValue);
  const [vanishing, setVanishing] = React.useState(false);
  const [slot, setSlot] = React.useState(0);
  const current = value ?? internal;
  const count = placeholders.length;
  const placeholder = count ? placeholders[slot % count] : "";

  const update = (next: string) => {
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  };

  // Cycle the placeholder while it's visible: on screen, tab in front and the field empty.
  const idle = !current && !vanishing;
  React.useEffect(() => {
    const form = formRef.current;
    if (!form || count < 2 || !idle) return;
    let onScreen = true;
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
    });
    observer.observe(form);
    const id = window.setInterval(() => {
      if (onScreen && !document.hidden) setSlot((s) => (s + 1) % count);
    }, Math.max(800, interval));
    return () => {
      window.clearInterval(id);
      observer.disconnect();
    };
  }, [count, interval, idle]);

  React.useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  /** Paints the input's text onto the canvas exactly where the input shows it. */
  const paintText = (text: string) => {
    const input = inputRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });
    if (!input || !canvas || !ctx) return null;
    const style = getComputedStyle(input);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = input.offsetWidth;
    const height = input.offsetHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const left = parseFloat(style.paddingLeft) + parseFloat(style.borderLeftWidth);
    const right = parseFloat(style.paddingRight) + parseFloat(style.borderRightWidth);
    ctx.save();
    ctx.beginPath();
    ctx.rect(left, 0, width - left - right, height);
    ctx.clip();
    ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    if ("letterSpacing" in ctx && style.letterSpacing !== "normal") ctx.letterSpacing = style.letterSpacing;
    ctx.fillStyle = style.color;
    ctx.textBaseline = "middle";
    ctx.fillText(text, left - input.scrollLeft, height / 2);
    ctx.restore();
    return { ctx, canvas, dpr, width, height };
  };

  const vanish = (text: string) => {
    const painted = paintText(text);
    if (!painted) return;
    const { ctx, canvas, dpr, width, height } = painted;
    cancelAnimationFrame(rafRef.current);
    setVanishing(true);

    const finish = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setVanishing(false);
    };

    if (reduce) {
      // Reduced motion: the text simply fades out.
      const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const start = performance.now();
      const fadeFrame = (now: number) => {
        const t = Math.min(1, (now - start) / 250);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.putImageData(snapshot, 0, 0);
        canvas.style.opacity = String(1 - t);
        if (t < 1) rafRef.current = requestAnimationFrame(fadeFrame);
        else {
          canvas.style.opacity = "";
          finish();
        }
      };
      rafRef.current = requestAnimationFrame(fadeFrame);
      return;
    }

    // Sample the painted text roughly once per CSS pixel; every lit sample becomes a particle.
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const stride = Math.max(1, Math.round(dpr));
    const particles: Particle[] = [];
    let minX = Infinity;
    let maxX = -Infinity;
    for (let y = 0; y < canvas.height; y += stride) {
      for (let x = 0; x < canvas.width; x += stride) {
        const i = (y * canvas.width + x) * 4;
        const alpha = data[i + 3];
        if (alpha < 40) continue;
        const px = x / dpr;
        minX = Math.min(minX, px);
        maxX = Math.max(maxX, px);
        particles.push({
          x: px,
          y: y / dpr,
          vx: 0,
          vy: 0,
          size: stride / dpr + 0.4,
          color: `rgba(${data[i]}, ${data[i + 1]}, ${data[i + 2]}, ${alpha / 255})`,
          delay: 0,
          life: 0,
        });
      }
    }
    if (!particles.length) {
      finish();
      return;
    }
    const span = Math.max(1, maxX - minX);
    for (const p of particles) {
      // The dissolve sweeps from the end of the text back to its start.
      p.delay = ((maxX - p.x) / span) * 0.45 + Math.random() * 0.08;
      p.life = 0.45 + Math.random() * 0.45;
      const angle = -Math.PI / 2 + (Math.random() - 0.3) * Math.PI * 0.9;
      const speed = 30 + Math.random() * 90;
      p.vx = Math.cos(angle) * speed + 25;
      p.vy = Math.sin(angle) * speed;
    }

    const start = performance.now();
    const frame = (now: number) => {
      const t = (now - start) / 1000;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      let alive = false;
      for (const p of particles) {
        const local = t - p.delay;
        if (local >= p.life) continue;
        alive = true;
        if (local <= 0) {
          ctx.globalAlpha = 1;
          ctx.fillStyle = p.color;
          ctx.fillRect(p.x, p.y, p.size, p.size);
          continue;
        }
        const k = local / p.life;
        // Ease out: a quick burst that slows as it fades.
        const travel = local * (1 - k * 0.5);
        ctx.globalAlpha = 1 - k * k;
        ctx.fillStyle = p.color;
        const s = p.size * (1 - k * 0.6);
        ctx.fillRect(p.x + p.vx * travel, p.y + p.vy * travel, s, s);
      }
      ctx.globalAlpha = 1;
      if (alive) rafRef.current = requestAnimationFrame(frame);
      else finish();
    };
    rafRef.current = requestAnimationFrame(frame);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = current.trim();
    if (!text || vanishing || disabled) return;
    onSubmit?.(text);
    vanish(current);
    update("");
  };

  const canSubmit = !!current.trim() && !vanishing && !disabled;
  const accessibleName = label ?? placeholders[0] ?? "Search";

  return (
    <form
      ref={formRef}
      data-slot="vanish-input"
      onSubmit={handleSubmit}
      className={cn("relative w-full max-w-xl", containerClassName)}
    >
      <input
        ref={inputRef}
        type="text"
        value={current}
        aria-label={accessibleName}
        disabled={disabled}
        autoComplete="off"
        onChange={(e) => update(e.target.value)}
        className={cn(
          "h-12 w-full rounded-full border border-white/10 bg-card pl-5 pr-14 text-sm text-foreground shadow-xs outline-none sm:text-base",
          "transition-[border-color,box-shadow] duration-200 motion-reduce:transition-none",
          "hover:border-white/20 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/25",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />

      <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 size-full" />

      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-5 right-14 flex items-center overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          {idle && placeholder && (
            <motion.span
              key={`${slot}-${placeholder}`}
              className="truncate text-sm text-muted-foreground sm:text-base"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
              transition={{ duration: reduce ? 0.2 : 0.25, ease: "easeOut" }}
            >
              {placeholder}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <button
        type="submit"
        aria-label={submitLabel}
        aria-disabled={!canSubmit || undefined}
        className={cn(
          "absolute right-2 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full outline-none",
          "transition-[background-color,color,opacity,scale] duration-200 motion-reduce:transition-none",
          "focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          canSubmit
            ? "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95"
            : "cursor-default bg-white/10 text-muted-foreground"
        )}
      >
        <ArrowUp className="size-4" />
      </button>
    </form>
  );
}
