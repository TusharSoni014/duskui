"use client";

import * as React from "react";
import { Reorder, useDragControls, useReducedMotion, type Transition } from "motion/react";
import { GripVertical } from "lucide-react";

import { cn } from "@/lib/utils";

const layoutSpring: Transition = { type: "spring", stiffness: 520, damping: 40, mass: 0.8 };

const lifted = { scale: 1.01 };
const resting = { scale: 1 };

export type SortableItemState = {
  index: number;
  /** True while dragged with the pointer or picked up with the keyboard. */
  active: boolean;
};

export interface SortableListProps<T> extends Omit<React.ComponentProps<"div">, "children" | "onChange"> {
  items: T[];
  /** Called with the reordered array. Store it to keep the list in sync. */
  onReorder: (items: T[]) => void;
  /** Row content. The drag handle is rendered for you on the leading edge. */
  renderItem: (item: T, state: SortableItemState) => React.ReactNode;
  /** Stable key per item. Defaults to `item.id`, or the item itself for strings and numbers. */
  getKey?: (item: T) => string;
  /** Name used in screen reader announcements. Defaults to the key. */
  getLabel?: (item: T) => string;
  /** Accessible name for the list. */
  label?: string;
  /** Classes for each row. */
  itemClassName?: string;
}

function defaultKey(item: unknown): string {
  if (item && typeof item === "object" && "id" in item) return String((item as { id: unknown }).id);
  return String(item);
}

type Picked = { key: string; originalItems: unknown[] } | null;

/**
 * A vertical drag-to-reorder list built on Motion's Reorder: drag rows by their handle, neighbours spring out of the way, and the keyboard can pick up, move and drop rows too.
 */
export function SortableList<T>({
  items,
  onReorder,
  renderItem,
  getKey = defaultKey,
  getLabel,
  label = "Sortable list",
  itemClassName,
  className,
  ...props
}: SortableListProps<T>) {
  const reduceMotion = useReducedMotion();
  const instructionsId = React.useId();
  const [picked, setPicked] = React.useState<Picked>(null);
  const [draggingKey, setDraggingKey] = React.useState<string | null>(null);
  const [announcement, setAnnouncement] = React.useState("");
  const handles = React.useRef(new Map<string, HTMLButtonElement>());
  const refocusKey = React.useRef<string | null>(null);
  const itemsRef = React.useRef(items);
  React.useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const nameOf = (item: T) => (getLabel ? getLabel(item) : getKey(item));
  const positionOf = (key: string, list: T[] = itemsRef.current) => list.findIndex((item) => getKey(item) === key);

  // Moving a focused row in the DOM can drop focus in some browsers; put it back.
  React.useLayoutEffect(() => {
    const key = picked?.key ?? refocusKey.current;
    refocusKey.current = null;
    if (!key) return;
    const handle = handles.current.get(key);
    if (handle && document.activeElement !== handle) handle.focus({ preventScroll: true });
  }, [items, picked]);

  const announce = (message: string) => setAnnouncement(message);

  const pickUp = (item: T) => {
    const key = getKey(item);
    setPicked({ key, originalItems: items });
    announce(
      `Picked up ${nameOf(item)}. Position ${positionOf(key, items) + 1} of ${items.length}. Use the up and down arrow keys to move, Space or Enter to drop, Escape to cancel.`
    );
  };

  const drop = (item: T) => {
    setPicked(null);
    announce(`Dropped ${nameOf(item)} at position ${positionOf(getKey(item)) + 1} of ${itemsRef.current.length}.`);
  };

  const cancel = (item: T) => {
    if (!picked) return;
    const original = picked.originalItems as T[];
    refocusKey.current = picked.key;
    setPicked(null);
    onReorder(original);
    announce(`Reorder cancelled. ${nameOf(item)} returned to position ${positionOf(getKey(item), original) + 1}.`);
  };

  const move = (item: T, delta: number) => {
    const from = positionOf(getKey(item), items);
    const to = Math.min(items.length - 1, Math.max(0, from + delta));
    if (from === to) return;
    const next = items.slice();
    next.splice(from, 1);
    next.splice(to, 0, item);
    onReorder(next);
    announce(`${nameOf(item)} moved to position ${to + 1} of ${items.length}.`);
  };

  const handleKeyDown = (event: React.KeyboardEvent, item: T) => {
    const key = getKey(item);
    const isPicked = picked?.key === key;
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      if (isPicked) drop(item);
      else pickUp(item);
    } else if (isPicked && (event.key === "ArrowUp" || event.key === "ArrowDown")) {
      event.preventDefault();
      move(item, event.key === "ArrowUp" ? -1 : 1);
    } else if (isPicked && (event.key === "Home" || event.key === "End")) {
      event.preventDefault();
      move(item, event.key === "Home" ? -items.length : items.length);
    } else if (isPicked && event.key === "Escape") {
      event.preventDefault();
      cancel(item);
    } else if (!picked && (event.key === "ArrowUp" || event.key === "ArrowDown")) {
      // Arrow keys hop between handles while nothing is picked up.
      event.preventDefault();
      const index = positionOf(key, items);
      const target = items[index + (event.key === "ArrowUp" ? -1 : 1)];
      if (target !== undefined) handles.current.get(getKey(target))?.focus();
    }
  };

  return (
    <div data-slot="sortable-list" className={cn("w-full", className)} {...props}>
      <Reorder.Group
        as="ul"
        axis="y"
        values={items}
        onReorder={onReorder}
        aria-label={label}
        className="flex flex-col gap-2"
        onBlur={(event: React.FocusEvent<HTMLUListElement>) => {
          // Tabbing away while holding a row drops it where it is. A null target means the DOM moved, not the user.
          const next = event.relatedTarget as Node | null;
          if (!picked || !next || event.currentTarget.contains(next)) return;
          const item = items.find((candidate) => getKey(candidate) === picked.key);
          if (item !== undefined) drop(item);
        }}
      >
        {items.map((item, index) => {
          const key = getKey(item);
          return (
            <SortableRow
              key={key}
              item={item}
              name={nameOf(item)}
              active={picked?.key === key || draggingKey === key}
              picked={picked?.key === key}
              reduceMotion={!!reduceMotion}
              instructionsId={instructionsId}
              className={itemClassName}
              handleRef={(node) => {
                if (node) handles.current.set(key, node);
                else handles.current.delete(key);
              }}
              onHandleKeyDown={(event) => handleKeyDown(event, item)}
              onDragStart={() => setDraggingKey(key)}
              onDragEnd={() => {
                setDraggingKey(null);
                const position = positionOf(key);
                announce(`${nameOf(item)} moved to position ${position + 1} of ${itemsRef.current.length}.`);
              }}
            >
              {renderItem(item, { index, active: picked?.key === key || draggingKey === key })}
            </SortableRow>
          );
        })}
      </Reorder.Group>
      <p id={instructionsId} className="sr-only">
        Press Space or Enter to pick up. Use the up and down arrow keys to move, Space or Enter to drop, Escape to cancel.
      </p>
      <div aria-live="assertive" aria-atomic="true" className="sr-only">
        {announcement}
      </div>
    </div>
  );
}

interface SortableRowProps<T> {
  item: T;
  name: string;
  active: boolean;
  picked: boolean;
  reduceMotion: boolean;
  instructionsId: string;
  className?: string;
  handleRef: (node: HTMLButtonElement | null) => void;
  onHandleKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  children: React.ReactNode;
}

function SortableRow<T>({
  item,
  name,
  active,
  picked,
  reduceMotion,
  instructionsId,
  className,
  handleRef,
  onHandleKeyDown,
  onDragStart,
  onDragEnd,
  children,
}: SortableRowProps<T>) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      as="li"
      value={item}
      dragListener={false}
      dragControls={controls}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      initial={false}
      animate={active ? lifted : resting}
      transition={reduceMotion ? { duration: 0 } : layoutSpring}
      data-active={active || undefined}
      className={cn(
        "relative flex items-center gap-3 rounded-xl border bg-card px-3 py-2.5 text-sm",
        "transition-[border-color,box-shadow] duration-200 motion-reduce:transition-none",
        "data-[active]:border-white/20 data-[active]:shadow-lg",
        className
      )}
    >
      <button
        ref={handleRef}
        type="button"
        aria-label={`Reorder ${name}`}
        aria-describedby={instructionsId}
        aria-pressed={picked}
        onKeyDown={onHandleKeyDown}
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          controls.start(event);
        }}
        className={cn(
          "-ml-1 grid size-7 shrink-0 cursor-grab touch-none place-items-center rounded-md text-muted-foreground outline-none",
          "transition-colors hover:bg-accent hover:text-foreground active:cursor-grabbing",
          "focus-visible:ring-[3px] focus-visible:ring-ring/50",
          picked && "bg-accent text-foreground"
        )}
      >
        <GripVertical aria-hidden className="size-4" />
      </button>
      <div className="min-w-0 flex-1">{children}</div>
    </Reorder.Item>
  );
}
