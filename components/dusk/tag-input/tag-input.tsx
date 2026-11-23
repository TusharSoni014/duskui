"use client";

import * as React from "react";
import { AnimatePresence, motion, useAnimate, useReducedMotion, type Transition } from "motion/react";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type TagRejectReason = "duplicate" | "invalid" | "max";

export interface TagInputProps {
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (tags: string[]) => void;
  /** Placeholder while there are no tags. */
  placeholder?: string;
  /** Stop accepting tags once this many are added. Shows an `n/max` counter. */
  max?: number;
  /** Optional list of suggestions, filtered as you type (Arrow keys + Enter to pick). */
  suggestions?: string[];
  /** Characters that commit a tag besides Enter. Pasted text is also split on new lines and tabs. */
  separators?: string[];
  /** Allow the same tag twice. Duplicates are compared case-insensitively. */
  allowDuplicates?: boolean;
  /** Return `false` or an error message to reject a tag. */
  validate?: (tag: string, tags: string[]) => boolean | string;
  /** Normalize a tag before it's checked and added. Defaults to trimming whitespace. */
  transform?: (tag: string) => string;
  /** Fires when a tag is rejected, e.g. to show an error under the field. */
  onReject?: (tag: string, reason: TagRejectReason, message: string) => void;
  /** Form field name. Each tag is submitted with its own hidden input. */
  name?: string;
  disabled?: boolean;
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
  /** Classes for the field. */
  className?: string;
}

const chipSpring: Transition = { type: "spring", bounce: 0.35, duration: 0.4 };
const pillSpring: Transition = { type: "spring", stiffness: 520, damping: 38, mass: 0.6 };

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** The visible chip. Shakes whenever `shake` changes (a duplicate was entered). */
function ChipBody({
  tag,
  pending,
  shake,
  disabled,
  reduceMotion,
  onRemove,
}: {
  tag: string;
  pending: boolean;
  shake: number;
  disabled: boolean;
  reduceMotion: boolean;
  onRemove: () => void;
}) {
  const [scope, animate] = useAnimate<HTMLSpanElement>();
  const lastShake = React.useRef(shake);

  React.useEffect(() => {
    if (lastShake.current === shake) return;
    lastShake.current = shake;
    if (reduceMotion || !scope.current) return;
    animate(scope.current, { x: [0, -6, 5, -4, 3, 0], scale: [1, 1.06, 1] }, { duration: 0.42, ease: "easeOut" });
  }, [shake, reduceMotion, animate, scope]);

  return (
    <span
      ref={scope}
      data-pending={pending || undefined}
      className={cn(
        "inline-flex h-6 max-w-full items-center gap-1 rounded-md border pr-0.5 pl-2 text-xs font-medium",
        "transition-[background-color,border-color,color,box-shadow] duration-200 ease-out motion-reduce:transition-none",
        "border-primary/25 bg-primary/10 text-primary shadow-[0_0_12px_-6px_var(--color-primary)]",
        "data-pending:border-destructive/60 data-pending:bg-destructive/15 data-pending:text-destructive data-pending:shadow-[0_0_14px_-6px_var(--color-destructive)]"
      )}
    >
      <span className="truncate">{tag}</span>
      <button
        type="button"
        aria-label={`Remove ${tag}`}
        disabled={disabled}
        onClick={onRemove}
        className="grid size-4.5 place-items-center rounded-sm opacity-70 outline-none transition-[opacity,background-color] hover:bg-current/15 hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring/60"
      >
        <XIcon className="size-3" aria-hidden />
      </button>
    </span>
  );
}

/**
 * A tag (chip) input. Type and press Enter or a comma and the text pops into
 * a chip; chips slide over to make room and shrink away when removed.
 * Backspace in the empty field first highlights the last chip, a second
 * press removes it. Duplicates make the existing chip shake, invalid tags
 * and a full field shake the whole input. Pasting "a, b, c" (or one per
 * line) adds them all. Optional suggestions behave like a combobox list.
 * Every add, removal and rejection is announced to screen readers, and each
 * tag can be submitted with a form. Under reduced motion chips just fade.
 */
export function TagInput({
  value: valueProp,
  defaultValue = [],
  onValueChange,
  placeholder = "Add a tag…",
  max,
  suggestions,
  separators = [","],
  allowDuplicates = false,
  validate,
  transform = (tag) => tag.trim(),
  onReject,
  name,
  disabled = false,
  id: idProp,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  className,
}: TagInputProps) {
  const autoId = React.useId();
  const id = idProp ?? `${autoId}-input`;
  const hintId = `${autoId}-hint`;
  const listId = `${autoId}-list`;
  const reduceMotion = useReducedMotion() ?? false;
  const [fieldScope, animateField] = useAnimate<HTMLDivElement>();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const [uncontrolled, setUncontrolled] = React.useState<string[]>(defaultValue);
  const tags = valueProp ?? uncontrolled;
  const [text, setText] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const [shakes, setShakes] = React.useState<Record<string, number>>({});
  const [announcement, setAnnouncement] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(-1);

  const full = max !== undefined && tags.length >= max;
  const separatorPattern = React.useMemo(
    () => new RegExp(`[${[...separators, "\n", "\r", "\t"].map(escapeRegExp).join("")}]`),
    [separators]
  );

  const filtered = React.useMemo(() => {
    if (!suggestions?.length || full) return [];
    const q = text.trim().toLowerCase();
    const taken = new Set(tags.map((tag) => tag.toLowerCase()));
    return suggestions
      .filter((s) => !taken.has(s.toLowerCase()) && (!q || s.toLowerCase().includes(q)))
      .sort((a, b) => Number(!a.toLowerCase().startsWith(q)) - Number(!b.toLowerCase().startsWith(q)))
      .slice(0, 8);
  }, [suggestions, text, tags, full]);
  const listOpen = open && filtered.length > 0 && !disabled;
  const activeIndex = active < filtered.length ? active : -1;

  const commit = (next: string[]) => {
    if (valueProp === undefined) setUncontrolled(next);
    onValueChange?.(next);
  };

  const shakeField = () => {
    if (reduceMotion || !fieldScope.current) return;
    animateField(fieldScope.current, { x: [0, -7, 6, -4, 2, 0] }, { duration: 0.42, ease: "easeOut" });
  };

  /** Adds tags; returns true when the typed text was fully handled (so it can be cleared). */
  const add = (inputs: string[]) => {
    const next = [...tags];
    const added: string[] = [];
    let rejected: { tag: string; reason: TagRejectReason; message: string } | null = null;

    for (const raw of inputs) {
      const tag = transform(raw);
      if (!tag) continue;
      if (max !== undefined && next.length >= max) {
        rejected = { tag, reason: "max", message: `You can add up to ${max} tags.` };
        break;
      }
      const existing = allowDuplicates ? undefined : next.find((t) => t.toLowerCase() === tag.toLowerCase());
      if (existing !== undefined) {
        rejected = { tag: existing, reason: "duplicate", message: `${existing} is already added.` };
        setShakes((s) => ({ ...s, [existing]: (s[existing] ?? 0) + 1 }));
        continue;
      }
      const verdict = validate?.(tag, next) ?? true;
      if (verdict !== true) {
        rejected = {
          tag,
          reason: "invalid",
          message: typeof verdict === "string" ? verdict : `${tag} isn't a valid tag.`,
        };
        continue;
      }
      next.push(tag);
      added.push(tag);
    }

    if (added.length) commit(next);
    if (rejected && rejected.reason !== "duplicate") shakeField();
    if (rejected) onReject?.(rejected.tag, rejected.reason, rejected.message);

    const messages: string[] = [];
    if (added.length === 1) messages.push(`${added[0]} added.`);
    else if (added.length > 1) messages.push(`${added.length} tags added.`);
    if (rejected) messages.push(rejected.message);
    if (added.length && max !== undefined) messages.push(`${next.length} of ${max}.`);
    if (messages.length) setAnnouncement(messages.join(" "));

    setPending(false);
    setActive(-1);
    // Keep text the user may want to fix (invalid / over the limit); clear it otherwise.
    return !rejected || rejected.reason === "duplicate";
  };

  const remove = (index: number) => {
    const tag = tags[index];
    if (tag === undefined) return;
    commit(tags.filter((_, i) => i !== index));
    setAnnouncement(`${tag} removed.`);
    setPending(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value;
    setPending(false);
    setOpen(true);
    setActive(-1);
    if (separatorPattern.test(raw)) {
      const parts = raw.split(separatorPattern);
      const rest = parts.pop() ?? "";
      const done = add(parts);
      setText(done ? rest : parts.join(separators[0] ?? ",") + rest);
      return;
    }
    setText(raw);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case "Enter": {
        const pick = listOpen && activeIndex >= 0 ? filtered[activeIndex] : undefined;
        if (pick !== undefined) {
          event.preventDefault();
          if (add([pick])) setText("");
        } else if (text.trim()) {
          // Only swallow Enter when there's something to add, so an empty field can still submit its form.
          event.preventDefault();
          if (add([text])) setText("");
        }
        return;
      }
      case "Backspace": {
        if (text || tags.length === 0) return;
        event.preventDefault();
        if (pending) {
          remove(tags.length - 1);
        } else {
          setPending(true);
          setAnnouncement(`Press Backspace again to remove ${tags[tags.length - 1]}.`);
        }
        return;
      }
      case "ArrowDown":
      case "ArrowUp": {
        if (!filtered.length) return;
        event.preventDefault();
        setOpen(true);
        const delta = event.key === "ArrowDown" ? 1 : -1;
        setActive((i) => {
          const current = i < filtered.length ? i : -1;
          if (current === -1) return delta > 0 ? 0 : filtered.length - 1;
          return (current + delta + filtered.length) % filtered.length;
        });
        return;
      }
      case "Escape": {
        if (pending) {
          event.preventDefault();
          setPending(false);
        } else if (listOpen) {
          event.preventDefault();
          setOpen(false);
        }
        return;
      }
      default:
        if (pending && event.key !== "Shift") setPending(false);
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = event.clipboardData.getData("text");
    if (!separatorPattern.test(pasted)) return;
    event.preventDefault();
    const parts = pasted.split(separatorPattern);
    add(parts);
  };

  const chipMotion = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, scale: 0.5, filter: "blur(3px)" },
        animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
        exit: { opacity: 0, scale: 0.5, filter: "blur(3px)", transition: { duration: 0.16 } },
      };

  const describedBy = [hintId, ariaDescribedBy].filter(Boolean).join(" ");
  const hasList = Boolean(suggestions?.length);
  const optionId = (index: number) => `${listId}-${index}`;

  return (
    <div className="relative w-full">
      <div
        ref={fieldScope}
        data-slot="tag-input"
        data-disabled={disabled || undefined}
        data-invalid={ariaInvalid || undefined}
        onPointerDown={(event) => {
          if (disabled || (event.target as HTMLElement).closest("button")) return;
          if (event.target !== inputRef.current) event.preventDefault();
          inputRef.current?.focus();
        }}
        className={cn(
          "relative flex min-h-9 w-full cursor-text flex-wrap items-center gap-1 rounded-md border border-input bg-transparent py-1 pr-2 pl-1.5 text-sm shadow-xs dark:bg-input/30",
          "transition-[border-color,box-shadow,background-color] duration-200 ease-out motion-reduce:transition-none",
          "hover:border-ring/40 dark:hover:bg-input/40",
          "focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/30",
          "data-invalid:border-destructive data-invalid:ring-destructive/20 dark:data-invalid:ring-destructive/40",
          "data-disabled:pointer-events-none data-disabled:opacity-50",
          className
        )}
      >
        <AnimatePresence initial={false} mode="popLayout">
          {tags.map((tag, index) => (
            <motion.span
              key={allowDuplicates ? `${tag}-${index}` : tag}
              layout={reduceMotion ? false : "position"}
              {...chipMotion}
              transition={chipSpring}
              className="inline-flex max-w-full"
            >
              <ChipBody
                tag={tag}
                pending={pending && index === tags.length - 1}
                shake={shakes[tag] ?? 0}
                disabled={disabled}
                reduceMotion={reduceMotion}
                onRemove={() => {
                  remove(index);
                  inputRef.current?.focus();
                }}
              />
            </motion.span>
          ))}
        </AnimatePresence>

        <input
          ref={inputRef}
          id={id}
          type="text"
          value={text}
          disabled={disabled}
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          enterKeyHint="enter"
          placeholder={full ? `Limit of ${max} reached` : tags.length ? undefined : placeholder}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={describedBy}
          aria-invalid={ariaInvalid || undefined}
          {...(hasList
            ? {
                role: "combobox",
                "aria-autocomplete": "list" as const,
                "aria-expanded": listOpen,
                "aria-controls": listId,
                "aria-activedescendant": listOpen && activeIndex >= 0 ? optionId(activeIndex) : undefined,
              }
            : null)}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            setOpen(false);
            setPending(false);
          }}
          className="h-6 min-w-20 flex-1 bg-transparent px-1 outline-none placeholder:text-muted-foreground"
        />

        {max !== undefined && (
          <span
            aria-hidden
            className={cn(
              "ml-auto shrink-0 pl-1 text-xs tabular-nums text-muted-foreground transition-colors duration-200",
              full && "text-primary"
            )}
          >
            {tags.length}/{max}
          </span>
        )}
      </div>

      <span id={hintId} className="sr-only">
        Press Enter or {separators.includes(",") ? "comma" : separators.join(" or ")} to add a tag. Press
        Backspace twice in the empty field to remove the last tag.
        {max !== undefined && ` Up to ${max} tags.`}
      </span>
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </span>
      {name && tags.map((tag, index) => <input key={`${tag}-${index}`} type="hidden" name={name} value={tag} />)}

      {hasList && (
        <AnimatePresence>
          {listOpen && (
            <motion.ul
              key="suggestions"
              id={listId}
              role="listbox"
              aria-label="Suggestions"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.98, transition: { duration: 0.1 } }}
              transition={{ type: "spring", duration: 0.3, bounce: 0.15 }}
              // Clicking an option must not blur the input.
              onMouseDown={(event) => event.preventDefault()}
              className="absolute inset-x-0 top-full z-50 mt-1.5 max-h-60 origin-top overflow-y-auto overscroll-contain rounded-lg border bg-popover p-1 text-sm text-popover-foreground shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_16px_40px_-12px_rgb(0_0_0/0.7)]"
            >
              {filtered.map((suggestion, index) => {
                const highlighted = index === activeIndex;
                return (
                  <li
                    key={suggestion}
                    id={optionId(index)}
                    role="option"
                    aria-selected={highlighted}
                    onPointerMove={() => setActive(index)}
                    onClick={() => {
                      add([suggestion]);
                      setText("");
                      inputRef.current?.focus();
                    }}
                    className={cn(
                      "relative cursor-default rounded-md px-2.5 py-1.5 text-foreground/85 select-none",
                      highlighted && "text-foreground"
                    )}
                  >
                    {highlighted && (
                      <motion.span
                        aria-hidden
                        layoutId={`${autoId}-pill`}
                        transition={reduceMotion ? { duration: 0 } : pillSpring}
                        className="absolute inset-0 rounded-md bg-accent"
                      />
                    )}
                    <span className="relative">{suggestion}</span>
                  </li>
                );
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
