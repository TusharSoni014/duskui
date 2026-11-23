"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  type MotionValue,
  type Transition,
} from "motion/react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

/** Vertical gap between cards in px. Keep in sync with the list's `gap-2`. */
const GAP = 8;
/** Pointer travel (px) before a mouse press becomes a drag. */
const DRAG_THRESHOLD = 5;
/** Touch press duration (ms) before a drag starts; moving earlier scrolls the page instead. */
const TOUCH_DELAY = 250;

const layoutSpring: Transition = { type: "spring", stiffness: 520, damping: 42, mass: 0.8 };
const landSpring = { type: "spring", stiffness: 420, damping: 40 } as const;

export type KanbanCardData = { id: string; title: string };

export type KanbanColumnData<C extends KanbanCardData = KanbanCardData> = {
  id: string;
  title: string;
  cards: C[];
};

export type KanbanMove = {
  cardId: string;
  from: { columnId: string; index: number };
  /** `index` is the card's position in the target column after the move. */
  to: { columnId: string; index: number };
};

/** Returns new columns with one card moved. Exported for server-side or optimistic updates. */
export function moveKanbanCard<C extends KanbanCardData>(
  columns: KanbanColumnData<C>[],
  move: KanbanMove
): KanbanColumnData<C>[] {
  const source = columns.find((c) => c.id === move.from.columnId);
  const card = source?.cards.find((c) => c.id === move.cardId);
  if (!source || !card) return columns;
  return columns.map((column) => {
    let cards = column.cards;
    if (column.id === move.from.columnId) cards = cards.filter((c) => c.id !== move.cardId);
    if (column.id === move.to.columnId) {
      cards = cards === column.cards ? cards.slice() : cards;
      cards.splice(Math.min(Math.max(0, move.to.index), cards.length), 0, card);
    }
    return cards === column.cards ? column : { ...column, cards };
  });
}

export interface KanbanProps<C extends KanbanCardData = KanbanCardData>
  extends Omit<React.ComponentProps<"div">, "onChange" | "children"> {
  columns: KanbanColumnData<C>[];
  /** Called with the new columns after a drop or keyboard move, plus what moved. */
  onChange: (columns: KanbanColumnData<C>[], move: KanbanMove) => void;
  /** Card content. Defaults to the card title. */
  renderCard?: (card: C) => React.ReactNode;
  /** Name used in announcements and menu labels. Defaults to `card.title`. */
  getCardLabel?: (card: C) => string;
  /** Accessible name for the board. */
  label?: string;
  /** Classes for each column. */
  columnClassName?: string;
}

type DragState = {
  cardId: string;
  fromColumn: string;
  fromIndex: number;
  width: number;
  height: number;
  overColumn: string;
  overIndex: number;
};

type Session = {
  pointerId: number;
  pointerType: string;
  cardId: string;
  columnId: string;
  index: number;
  el: HTMLElement;
  startX: number;
  startY: number;
  offsetX: number;
  offsetY: number;
  started: boolean;
  timer: ReturnType<typeof setTimeout> | null;
};

type Landing = { cardId: string; left: number; top: number };

type BoardContextValue = {
  /** Returns (and clears) the screen position a card should glide in from, if it just moved. */
  takeLanding: (cardId: string) => Landing | null;
  reduceMotion: boolean;
};

const BoardContext = React.createContext<BoardContextValue | null>(null);

/**
 * A kanban board whose cards drag between columns and reorder with layout springs, with a live drop slot, column counts and a full keyboard alternative.
 */
export function Kanban<C extends KanbanCardData = KanbanCardData>({
  columns,
  onChange,
  renderCard = (card) => card.title,
  getCardLabel = (card) => card.title,
  label = "Kanban board",
  columnClassName,
  className,
  ...props
}: KanbanProps<C>) {
  const reduceMotion = useReducedMotion() ?? false;
  const instructionsId = React.useId();
  const [drag, setDrag] = React.useState<DragState | null>(null);
  const [announcement, setAnnouncement] = React.useState("");
  const overlayX = useMotionValue(0);
  const overlayY = useMotionValue(0);

  const scrollerRef = React.useRef<HTMLDivElement>(null);
  const columnEls = React.useRef(new Map<string, HTMLElement>());
  const listEls = React.useRef(new Map<string, HTMLElement>());
  const cardEls = React.useRef(new Map<string, HTMLElement>());
  const session = React.useRef<Session | null>(null);
  const cleanup = React.useRef<(() => void) | null>(null);
  const dragRef = React.useRef<DragState | null>(null);
  const columnsRef = React.useRef(columns);
  const landing = React.useRef<Landing | null>(null);
  const refocus = React.useRef<string | null>(null);
  const boardContext = React.useMemo<BoardContextValue>(
    () => ({
      takeLanding: (cardId) => {
        const value = landing.current;
        if (!value || value.cardId !== cardId) return null;
        landing.current = null;
        return value;
      },
      reduceMotion,
    }),
    [reduceMotion]
  );

  React.useEffect(() => {
    columnsRef.current = columns;
  }, [columns]);
  React.useEffect(() => {
    dragRef.current = drag;
  }, [drag]);
  React.useEffect(() => () => cleanup.current?.(), []);

  // After a keyboard move the card may have re-mounted in another column; keep focus on it.
  React.useLayoutEffect(() => {
    const id = refocus.current;
    if (!id) return;
    refocus.current = null;
    cardEls.current.get(id)?.focus({ preventScroll: true });
  }, [columns]);

  const findCard = (cardId: string, cols = columnsRef.current) => {
    for (const column of cols) {
      const index = column.cards.findIndex((c) => c.id === cardId);
      if (index !== -1) return { column, index, card: column.cards[index] };
    }
    return null;
  };

  const commit = (move: KanbanMove) => {
    const found = findCard(move.cardId);
    const target = columnsRef.current.find((c) => c.id === move.to.columnId);
    if (!found || !target) return;
    if (move.from.columnId === move.to.columnId && move.from.index === move.to.index) return;
    const next = moveKanbanCard(columnsRef.current, move);
    onChange(next, move);
    const position = next.find((c) => c.id === target.id)!.cards.findIndex((c) => c.id === move.cardId);
    setAnnouncement(
      `${getCardLabel(found.card)} moved to ${target.title}, position ${position + 1} of ${
        next.find((c) => c.id === target.id)!.cards.length
      }.`
    );
  };

  /* ---------------------------------- Pointer drag ---------------------------------- */

  const computeTarget = (clientX: number, clientY: number, state: DragState) => {
    let columnId = state.overColumn;
    let best = Infinity;
    for (const [id, el] of columnEls.current) {
      const rect = el.getBoundingClientRect();
      const distance = clientX < rect.left ? rect.left - clientX : clientX > rect.right ? clientX - rect.right : 0;
      if (distance < best) {
        best = distance;
        columnId = id;
      }
    }
    const list = listEls.current.get(columnId);
    if (!list) return { columnId, index: 0 };
    const pointerY = clientY - list.getBoundingClientRect().top;
    const placeholder = list.querySelector<HTMLElement>(":scope > [data-kanban-placeholder]");
    // offsetTop ignores the layout-animation transforms, so targets don't flicker mid-spring.
    let index = 0;
    list.querySelectorAll<HTMLElement>(":scope > [data-kanban-card]").forEach((card) => {
      let middle = card.offsetTop + card.offsetHeight / 2;
      if (placeholder && card.offsetTop > placeholder.offsetTop) middle -= placeholder.offsetHeight + GAP;
      if (pointerY > middle) index += 1;
    });
    return { columnId, index };
  };

  const endSession = () => {
    cleanup.current?.();
    cleanup.current = null;
    session.current = null;
  };

  const startDrag = (s: Session, clientX: number, clientY: number) => {
    const rect = s.el.getBoundingClientRect();
    s.started = true;
    s.offsetX = clientX - rect.left;
    s.offsetY = clientY - rect.top;
    overlayX.set(rect.left);
    overlayY.set(rect.top);
    const state: DragState = {
      cardId: s.cardId,
      fromColumn: s.columnId,
      fromIndex: s.index,
      width: rect.width,
      height: rect.height,
      overColumn: s.columnId,
      overIndex: s.index,
    };
    dragRef.current = state;
    setDrag(state);
    document.body.style.cursor = "grabbing";
    document.body.style.userSelect = "none";
    const found = findCard(s.cardId);
    if (found) setAnnouncement(`Picked up ${getCardLabel(found.card)}.`);
  };

  const finishDrag = (cancelled: boolean) => {
    const state = dragRef.current;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
    endSession();
    if (!state) return;
    // The card re-mounts at its destination and glides there from the overlay's last position.
    landing.current = { cardId: state.cardId, left: overlayX.get(), top: overlayY.get() };
    dragRef.current = null;
    setDrag(null);
    const found = findCard(state.cardId);
    if (cancelled) {
      if (found) setAnnouncement(`Move cancelled. ${getCardLabel(found.card)} returned to ${found.column.title}.`);
      return;
    }
    const sameSpot = state.overColumn === state.fromColumn && state.overIndex === state.fromIndex;
    if (sameSpot) {
      if (found) setAnnouncement(`${getCardLabel(found.card)} dropped in its original position.`);
      return;
    }
    commit({
      cardId: state.cardId,
      from: { columnId: state.fromColumn, index: state.fromIndex },
      to: { columnId: state.overColumn, index: state.overIndex },
    });
  };

  const handleCardPointerDown = (event: React.PointerEvent<HTMLElement>, cardId: string, columnId: string, index: number) => {
    if (event.button !== 0 || session.current) return;
    if ((event.target as HTMLElement).closest("button, a, input, textarea, select, [data-kanban-no-drag]")) return;

    const s: Session = {
      pointerId: event.pointerId,
      pointerType: event.pointerType,
      cardId,
      columnId,
      index,
      el: event.currentTarget,
      startX: event.clientX,
      startY: event.clientY,
      offsetX: 0,
      offsetY: 0,
      started: false,
      timer: null,
    };
    session.current = s;
    let lastX = event.clientX;
    let lastY = event.clientY;

    if (s.pointerType === "touch") {
      s.timer = setTimeout(() => {
        s.timer = null;
        if (session.current === s) startDrag(s, lastX, lastY);
      }, TOUCH_DELAY);
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerId !== s.pointerId) return;
      lastX = e.clientX;
      lastY = e.clientY;
      if (!s.started) {
        const moved = Math.hypot(e.clientX - s.startX, e.clientY - s.startY);
        if (s.pointerType === "touch") {
          // Moving before the long-press fires means the user is scrolling.
          if (moved > 8) endSession();
          return;
        }
        if (moved < DRAG_THRESHOLD) return;
        startDrag(s, e.clientX, e.clientY);
      }
      overlayX.set(e.clientX - s.offsetX);
      overlayY.set(e.clientY - s.offsetY);

      const scroller = scrollerRef.current;
      if (scroller) {
        const rect = scroller.getBoundingClientRect();
        if (e.clientX < rect.left + 48) scroller.scrollLeft -= 14;
        else if (e.clientX > rect.right - 48) scroller.scrollLeft += 14;
      }

      const state = dragRef.current;
      if (!state) return;
      const target = computeTarget(e.clientX, e.clientY, state);
      if (target.columnId !== state.overColumn || target.index !== state.overIndex) {
        const next = { ...state, overColumn: target.columnId, overIndex: target.index };
        dragRef.current = next;
        setDrag(next);
      }
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerId !== s.pointerId) return;
      if (s.started) finishDrag(false);
      else endSession();
    };
    const onCancel = (e: PointerEvent) => {
      if (e.pointerId !== s.pointerId) return;
      if (s.started) finishDrag(true);
      else endSession();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && s.started) {
        e.preventDefault();
        finishDrag(true);
      }
    };
    // While a touch drag is active, stop the page from scrolling under the finger.
    const onTouchMove = (e: TouchEvent) => {
      if (s.started) e.preventDefault();
    };
    const onContextMenu = (e: Event) => {
      if (s.started || s.timer) e.preventDefault();
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onCancel);
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("contextmenu", onContextMenu);
    cleanup.current = () => {
      if (s.timer) clearTimeout(s.timer);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onCancel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("contextmenu", onContextMenu);
      if (s.started) {
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    };
  };

  /* ---------------------------------- Keyboard ---------------------------------- */

  const moveByKeyboard = (cardId: string, to: { columnId: string; index: number }) => {
    const found = findCard(cardId);
    if (!found) return;
    const target = columnsRef.current.find((c) => c.id === to.columnId);
    if (!target) return;
    const max = target.id === found.column.id ? target.cards.length - 1 : target.cards.length;
    const index = Math.min(Math.max(0, to.index), max);
    if (target.id !== found.column.id) {
      // Cross-column moves re-mount the card; let it glide from where it was.
      const rect = cardEls.current.get(cardId)?.getBoundingClientRect();
      if (rect) landing.current = { cardId, left: rect.left, top: rect.top };
    }
    refocus.current = cardId;
    commit({ cardId, from: { columnId: found.column.id, index: found.index }, to: { columnId: target.id, index } });
  };

  const focusCard = (columnIndex: number, cardIndex: number) => {
    const column = columns[columnIndex];
    if (!column || column.cards.length === 0) return false;
    const card = column.cards[Math.min(cardIndex, column.cards.length - 1)];
    cardEls.current.get(card.id)?.focus();
    return true;
  };

  const handleCardKeyDown = (event: React.KeyboardEvent<HTMLElement>, cardId: string, columnIndex: number, index: number) => {
    if (event.target !== event.currentTarget) return;
    const column = columns[columnIndex];
    const arrows = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
    if (!arrows.includes(event.key)) return;
    event.preventDefault();
    const vertical = event.key === "ArrowUp" ? -1 : event.key === "ArrowDown" ? 1 : 0;
    const horizontal = event.key === "ArrowLeft" ? -1 : event.key === "ArrowRight" ? 1 : 0;

    if (event.altKey) {
      if (vertical) moveByKeyboard(cardId, { columnId: column.id, index: index + vertical });
      else {
        const target = columns[columnIndex + horizontal];
        if (target) moveByKeyboard(cardId, { columnId: target.id, index });
      }
      return;
    }
    if (vertical) focusCard(columnIndex, Math.max(0, index + vertical));
    else {
      // Skip empty columns when hopping sideways.
      for (let c = columnIndex + horizontal; c >= 0 && c < columns.length; c += horizontal) {
        if (focusCard(c, index)) break;
      }
    }
  };

  /* ---------------------------------- Render ---------------------------------- */

  const dragged = drag ? findCard(drag.cardId, columns) : null;

  return (
    <BoardContext.Provider value={boardContext}>
      <div data-slot="kanban" role="region" aria-label={label} className={cn("w-full", className)} {...props}>
        <motion.div ref={scrollerRef} layoutScroll className="flex gap-4 overflow-x-auto pb-2">
          {columns.map((column, columnIndex) => {
            const visible = drag ? column.cards.filter((c) => c.id !== drag.cardId) : column.cards;
            const showSlot = drag?.overColumn === column.id;
            const headingId = `${instructionsId}-col-${column.id}`;
            const nodes: React.ReactNode[] = visible.map((card, index) => (
              <KanbanCardItem
                key={card.id}
                id={card.id}
                name={getCardLabel(card)}
                columns={columns}
                columnId={column.id}
                index={index}
                count={visible.length}
                instructionsId={instructionsId}
                registerEl={(node) => {
                  if (node) cardEls.current.set(card.id, node);
                  else cardEls.current.delete(card.id);
                }}
                onPointerDown={(event) => handleCardPointerDown(event, card.id, column.id, index)}
                onKeyDown={(event) => handleCardKeyDown(event, card.id, columnIndex, index)}
                onMove={(to) => moveByKeyboard(card.id, to)}
                onMenuClosed={() => cardEls.current.get(card.id)?.focus({ preventScroll: true })}
              >
                {renderCard(card)}
              </KanbanCardItem>
            ));
            if (showSlot && drag) {
              nodes.splice(
                Math.min(drag.overIndex, nodes.length),
                0,
                <motion.li
                  key="__kanban-placeholder"
                  layout="position"
                  data-kanban-placeholder=""
                  aria-hidden
                  transition={reduceMotion ? { duration: 0 } : layoutSpring}
                  style={{ height: drag.height }}
                  className="rounded-xl border border-dashed border-white/20 bg-white/[0.02]"
                />
              );
            }
            return (
              <section
                key={column.id}
                ref={(node) => {
                  if (node) columnEls.current.set(column.id, node);
                  else columnEls.current.delete(column.id);
                }}
                aria-labelledby={headingId}
                data-over={showSlot || undefined}
                className={cn(
                  "flex w-72 shrink-0 flex-col rounded-2xl border bg-card/50 p-3 transition-[border-color,background-color] duration-200",
                  "data-[over]:border-white/20 data-[over]:bg-white/[0.03]",
                  columnClassName
                )}
              >
                <header className="mb-3 flex items-center justify-between px-1">
                  <h3 id={headingId} className="text-sm font-semibold">
                    {column.title}
                  </h3>
                  <span className="relative grid h-5 min-w-6 place-items-center overflow-hidden rounded-full bg-muted px-1.5 text-xs font-medium text-muted-foreground tabular-nums">
                    <AnimatePresence initial={false} mode="popLayout">
                      <motion.span
                        key={column.cards.length}
                        initial={reduceMotion ? false : { y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={reduceMotion ? undefined : { y: 10, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 44 }}
                      >
                        {column.cards.length}
                      </motion.span>
                    </AnimatePresence>
                    <span className="sr-only"> cards</span>
                  </span>
                </header>
                <ul
                  ref={(node) => {
                    if (node) listEls.current.set(column.id, node);
                    else listEls.current.delete(column.id);
                  }}
                  aria-labelledby={headingId}
                  className="relative flex min-h-20 flex-1 flex-col gap-2"
                >
                  {nodes}
                  {nodes.length === 0 && (
                    <li
                      aria-hidden
                      className="grid min-h-20 place-items-center rounded-xl border border-dashed text-xs text-muted-foreground"
                    >
                      Drop cards here
                    </li>
                  )}
                </ul>
              </section>
            );
          })}
        </motion.div>

        <p id={instructionsId} className="sr-only">
          Drag to move. With the keyboard, use the arrow keys to move between cards, Alt plus an arrow key to move the
          card, or open its menu.
        </p>
        <div aria-live="assertive" aria-atomic="true" className="sr-only">
          {announcement}
        </div>
      </div>

      {drag && dragged
        ? createPortal(
            <DragOverlay x={overlayX} y={overlayY} width={drag.width} height={drag.height} reduceMotion={reduceMotion}>
              {renderCard(dragged.card)}
            </DragOverlay>,
            document.body
          )
        : null}
    </BoardContext.Provider>
  );
}

const cardSurface =
  "relative rounded-xl border bg-card p-3 text-sm shadow-sm";

function DragOverlay({
  x,
  y,
  width,
  height,
  reduceMotion,
  children,
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
  width: number;
  height: number;
  reduceMotion: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[100]"
      style={{ x, y, width, height }}
    >
      <motion.div
        className={cn(cardSurface, "h-full cursor-grabbing border-white/20 text-foreground shadow-lg")}
        initial={{ scale: 1, rotate: 0 }}
        animate={reduceMotion ? { scale: 1, rotate: 0 } : { scale: 1.02, rotate: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 44 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

interface KanbanCardItemProps<C extends KanbanCardData> {
  id: string;
  name: string;
  columns: KanbanColumnData<C>[];
  columnId: string;
  index: number;
  count: number;
  instructionsId: string;
  registerEl: (node: HTMLLIElement | null) => void;
  onPointerDown: (event: React.PointerEvent<HTMLLIElement>) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLLIElement>) => void;
  onMove: (to: { columnId: string; index: number }) => void;
  onMenuClosed: () => void;
  children: React.ReactNode;
}

function KanbanCardItem<C extends KanbanCardData>({
  id,
  name,
  columns,
  columnId,
  index,
  count,
  instructionsId,
  registerEl,
  onPointerDown,
  onKeyDown,
  onMove,
  onMenuClosed,
  children,
}: KanbanCardItemProps<C>) {
  const board = React.useContext(BoardContext)!;
  const ref = React.useRef<HTMLLIElement>(null);
  const moved = React.useRef(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const columnIndex = columns.findIndex((c) => c.id === columnId);

  // FLIP: if this card was just dropped (or moved across columns), glide in from its previous screen position.
  React.useLayoutEffect(() => {
    const el = ref.current;
    const from = el ? board.takeLanding(id) : null;
    if (!el || !from || board.reduceMotion) return;
    const rect = el.getBoundingClientRect();
    const dx = from.left - rect.left;
    const dy = from.top - rect.top;
    x.set(dx);
    y.set(dy);
    scale.set(1.02);
    el.style.transform = `translateX(${dx}px) translateY(${dy}px) scale(1.02)`;
    // No cleanup on purpose: the glide is short, and stopping it (e.g. in Strict Mode's
    // simulated remount) would leave the card stranded at its offset.
    animate(x, 0, landSpring);
    animate(y, 0, landSpring);
    animate(scale, 1, landSpring);
  }, [board, id, x, y, scale]);

  const select = (to: { columnId: string; index: number }) => {
    moved.current = true;
    onMove(to);
  };

  return (
    <motion.li
      ref={(node) => {
        ref.current = node;
        registerEl(node);
      }}
      layout="position"
      transition={board.reduceMotion ? { duration: 0 } : layoutSpring}
      style={{ x, y, scale }}
      data-kanban-card=""
      tabIndex={0}
      aria-describedby={instructionsId}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      className={cn(
        cardSurface,
        "group/card cursor-grab touch-manipulation outline-none select-none [-webkit-touch-callout:none]",
        "transition-colors duration-150 hover:border-white/20",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
      )}
    >
      <div className="pr-7">{children}</div>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={`Move ${name}`}
          className={cn(
            "absolute top-2 right-2 grid size-6 place-items-center rounded-md text-muted-foreground outline-none",
            "opacity-0 transition-opacity group-hover/card:opacity-100 group-focus-within/card:opacity-100 focus-visible:opacity-100 data-[state=open]:opacity-100",
            "hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50",
            "[@media(hover:none)]:opacity-100"
          )}
        >
          <MoreHorizontal aria-hidden className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="min-w-44"
          onCloseAutoFocus={(event) => {
            if (!moved.current) return;
            moved.current = false;
            event.preventDefault();
            onMenuClosed();
          }}
        >
          <DropdownMenuLabel className="text-xs text-muted-foreground">Move card</DropdownMenuLabel>
          <DropdownMenuItem disabled={index === 0} onSelect={() => select({ columnId, index: index - 1 })}>
            <ArrowUp aria-hidden /> Move up
          </DropdownMenuItem>
          <DropdownMenuItem disabled={index === count - 1} onSelect={() => select({ columnId, index: index + 1 })}>
            <ArrowDown aria-hidden /> Move down
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {columns.map((column, i) =>
            column.id === columnId ? null : (
              <DropdownMenuItem key={column.id} onSelect={() => select({ columnId: column.id, index: column.cards.length })}>
                {i < columnIndex ? <ArrowLeft aria-hidden /> : <ArrowRight aria-hidden />}
                {column.title}
              </DropdownMenuItem>
            )
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.li>
  );
}
