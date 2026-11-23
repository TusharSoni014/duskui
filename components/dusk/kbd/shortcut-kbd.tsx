"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";

import { Kbd, KbdGroup, type KbdProps } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* Platform                                                                   */
/* -------------------------------------------------------------------------- */

export type Platform = "mac" | "other";

const subscribeNoop = () => () => {};

function readPlatform(): Platform {
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  const name = nav.userAgentData?.platform || nav.platform || nav.userAgent;
  return /mac|iphone|ipad|ipod/i.test(name) ? "mac" : "other";
}

/**
 * The visitor's platform, or `null` while rendering on the server and during
 * hydration. Using `useSyncExternalStore` with a server snapshot means the
 * first client render matches the server HTML exactly, then updates.
 */
export function usePlatform(): Platform | null {
  return React.useSyncExternalStore(subscribeNoop, readPlatform, () => null);
}

/* -------------------------------------------------------------------------- */
/* Keys                                                                       */
/* -------------------------------------------------------------------------- */

const MODIFIERS = ["mod", "ctrl", "shift", "alt", "meta"] as const;
type Modifier = (typeof MODIFIERS)[number];

const aliases: Record<string, string> = {
  cmd: "meta",
  command: "meta",
  win: "meta",
  super: "meta",
  control: "ctrl",
  option: "alt",
  opt: "alt",
  esc: "escape",
  return: "enter",
  up: "arrowup",
  down: "arrowdown",
  left: "arrowleft",
  right: "arrowright",
  del: "delete",
  " ": "space",
};

/** Lower-cases a key name and resolves aliases ("cmd" → "meta", "esc" → "escape"…). */
export function normalizeKey(key: string) {
  const lower = key.toLowerCase();
  return aliases[lower] ?? lower;
}

const isModifier = (key: string): key is Modifier => (MODIFIERS as readonly string[]).includes(key);

const symbols: Record<string, { mac: string; other: string; name: string }> = {
  mod: { mac: "⌘", other: "Ctrl", name: "Command" },
  meta: { mac: "⌘", other: "Win", name: "Command" },
  ctrl: { mac: "⌃", other: "Ctrl", name: "Control" },
  shift: { mac: "⇧", other: "Shift", name: "Shift" },
  alt: { mac: "⌥", other: "Alt", name: "Option" },
  enter: { mac: "↵", other: "Enter", name: "Enter" },
  escape: { mac: "Esc", other: "Esc", name: "Escape" },
  backspace: { mac: "⌫", other: "Backspace", name: "Backspace" },
  delete: { mac: "⌦", other: "Del", name: "Delete" },
  tab: { mac: "⇥", other: "Tab", name: "Tab" },
  space: { mac: "Space", other: "Space", name: "Space" },
  arrowup: { mac: "↑", other: "↑", name: "Up arrow" },
  arrowdown: { mac: "↓", other: "↓", name: "Down arrow" },
  arrowleft: { mac: "←", other: "←", name: "Left arrow" },
  arrowright: { mac: "→", other: "→", name: "Right arrow" },
};

/** The visible label and the spoken name of a key on a platform. */
export function describeKey(key: string, platform: Platform) {
  const k = normalizeKey(key);
  const symbol = symbols[k];
  // On Windows / Linux "mod" means Control, so speak it that way.
  if (symbol) return { label: symbol[platform], name: k === "mod" && platform === "other" ? "Control" : symbol.name };
  const label = k.length === 1 ? k.toUpperCase() : k.charAt(0).toUpperCase() + k.slice(1);
  return { label, name: label };
}

function modifierDown(mod: Modifier, e: KeyboardEvent, platform: Platform) {
  switch (mod) {
    case "mod":
      return platform === "mac" ? e.metaKey : e.ctrlKey;
    case "ctrl":
      return e.ctrlKey;
    case "shift":
      return e.shiftKey;
    case "alt":
      return e.altKey;
    case "meta":
      return e.metaKey;
  }
}

/** Matches by physical key for letters and digits, so Option / Shift can't change them. */
function eventMatchesKey(key: string, e: KeyboardEvent) {
  if (/^[a-z]$/.test(key)) return e.code === `Key${key.toUpperCase()}`;
  if (/^[0-9]$/.test(key)) return e.code === `Digit${key}` || e.code === `Numpad${key}`;
  if (key === "space") return e.code === "Space";
  return normalizeKey(e.key) === key;
}

function isEditable(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName);
}

/* -------------------------------------------------------------------------- */
/* Hook                                                                       */
/* -------------------------------------------------------------------------- */

export interface UseShortcutOptions {
  /** Listen for the shortcut. Default true. */
  enabled?: boolean;
  /** Call `preventDefault()` when the shortcut fires (e.g. to stop the browser's ⌘K). Default true. */
  preventDefault?: boolean;
  /**
   * Fire while focus is in a text field. Defaults to true for combos with
   * mod / ctrl / meta / alt and false for plain keys like "/".
   */
  enableInInputs?: boolean;
}

/**
 * Listens for a key combination such as `["mod", "k"]` and reports which of
 * its keys are held right now, so you can light them up. `mod` is ⌘ on Apple
 * platforms and Ctrl elsewhere. Returns `pressed` (one boolean per key) and
 * `count`, which goes up every time the full combo fires.
 */
export function useShortcut(
  keys: string[],
  onTrigger?: (event: KeyboardEvent) => void,
  { enabled = true, preventDefault = true, enableInInputs }: UseShortcutOptions = {}
) {
  const platform = usePlatform();
  const [pressed, setPressed] = React.useState<boolean[]>(() => keys.map(() => false));
  const [count, setCount] = React.useState(0);
  const handlerRef = React.useRef(onTrigger);

  React.useEffect(() => {
    handlerRef.current = onTrigger;
  }, [onTrigger]);

  // A stable string, so a new `keys` array with the same keys doesn't re-subscribe.
  const signature = keys.map(normalizeKey).join("\n");

  React.useEffect(() => {
    if (!enabled || !platform) return;
    const combo = signature.split("\n");
    const mods = combo.filter(isModifier);
    const main = combo.filter((k) => !isModifier(k));
    const hasChord = mods.some((m) => m !== "shift");
    const allowInInputs = enableInInputs ?? hasChord;
    // Main keys currently held.
    const held = new Set<string>();

    const sync = (e: KeyboardEvent) => {
      const next = combo.map((k) => (isModifier(k) ? modifierDown(k, e, platform) : held.has(k)));
      setPressed((prev) => (prev.length === next.length && prev.every((v, i) => v === next[i]) ? prev : next));
    };

    const onKeyDown = (e: KeyboardEvent) => {
      // Typing in a field shouldn't light up (or fire) plain-key shortcuts.
      if (!allowInInputs && isEditable(e.target)) return;
      for (const k of main) if (eventMatchesKey(k, e)) held.add(k);
      sync(e);
      if (e.repeat) return;
      const allMods = MODIFIERS.every((m) => {
        // "mod" and its platform twin are the same physical key.
        if (m === "mod") return true;
        // Symbols like "?" need Shift on most layouts, so don't insist it stays up.
        if (m === "shift" && !mods.includes("shift") && main.some((k) => !/^[a-z0-9]$/.test(k))) return true;
        const wanted =
          mods.includes(m) || (mods.includes("mod") && (platform === "mac" ? m === "meta" : m === "ctrl"));
        return modifierDown(m, e, platform) === wanted;
      });
      const modsDown = mods.every((m) => modifierDown(m, e, platform));
      const mainDown = main.length > 0 ? main.every((k) => held.has(k)) && main.some((k) => eventMatchesKey(k, e)) : false;
      if (allMods && modsDown && mainDown) {
        if (preventDefault) e.preventDefault();
        setCount((c) => c + 1);
        handlerRef.current?.(e);
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      for (const k of main) if (eventMatchesKey(k, e)) held.delete(k);
      // Releasing a modifier releases everything: macOS never sends keyup for keys
      // pressed with ⌘, and "?" turns back into "/" once Shift is up.
      if (["Meta", "Control", "Alt", "Shift"].includes(e.key)) held.clear();
      sync(e);
    };

    const reset = () => {
      held.clear();
      setPressed((prev) => (prev.some(Boolean) ? prev.map(() => false) : prev));
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", reset);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", reset);
      reset();
    };
  }, [signature, enabled, platform, preventDefault, enableInInputs]);

  return { pressed, count, platform };
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export interface ShortcutKbdProps
  extends Omit<React.ComponentProps<"kbd">, "children">,
    UseShortcutOptions,
    Pick<KbdProps, "size"> {
  /** The combination, e.g. `["mod", "k"]`, `["shift", "?"]` or `["g", "d"]` held together. */
  keys: string[];
  /** Called when the full combination is pressed. */
  onTrigger?: (event: KeyboardEvent) => void;
  /** Classes for each keycap. */
  keyClassName?: string;
}

/**
 * Keycaps for a shortcut that respond as you press it. Each cap sinks and
 * brightens slightly while its key is held, and when the whole combination
 * lands the caps dip once together and `onTrigger` runs. `mod` renders ⌘ on Apple
 * platforms and Ctrl elsewhere; until the platform is known (server render
 * and hydration) that cap is reserved but blank, so there is no mismatch.
 * Under reduced motion the dip is a surface change only.
 */
export function ShortcutKbd({
  keys,
  onTrigger,
  enabled,
  preventDefault,
  enableInInputs,
  size,
  className,
  keyClassName,
  ...props
}: ShortcutKbdProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const { pressed, count, platform } = useShortcut(keys, onTrigger, { enabled, preventDefault, enableInInputs });
  const [flashing, setFlashing] = React.useState(false);
  const [seenCount, setSeenCount] = React.useState(count);

  // Start a flash whenever the combo fires (adjusting state during render, no effect needed).
  if (count !== seenCount) {
    setSeenCount(count);
    setFlashing(true);
  }

  React.useEffect(() => {
    if (!flashing) return;
    const timer = window.setTimeout(() => setFlashing(false), 450);
    return () => window.clearTimeout(timer);
  }, [flashing, count]);

  const described = keys.map((key) => describeKey(key, platform ?? "mac"));
  const spoken = described.map((d) => d.name).join(" + ");

  return (
    <KbdGroup data-slot="shortcut-kbd" title={platform ? spoken : undefined} className={className} {...props}>
      {keys.map((key, index) => {
        const { label, name } = described[index];
        const isPlatformKey = ["mod", "meta", "ctrl", "alt"].includes(normalizeKey(key));
        return (
          <motion.span
            key={`${key}-${index}`}
            className="inline-flex"
            animate={
              flashing && !reduceMotion
                ? { y: [0, 1, 0] }
                : { y: 0 }
            }
            transition={{ duration: 0.25, delay: index * 0.03, ease: "easeOut" }}
          >
            <Kbd
              size={size}
              pressed={pressed[index] || flashing}
              className={keyClassName}
            >
              <span aria-hidden className={cn(isPlatformKey && !platform && "invisible")}>
                {label}
              </span>
              <span className="sr-only">{name}</span>
            </Kbd>
          </motion.span>
        );
      })}
    </KbdGroup>
  );
}
