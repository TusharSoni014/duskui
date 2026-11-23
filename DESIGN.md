# DuskUI design rules

DuskUI should look designed, not generated. These rules apply to every primitive,
block, demo and page. When in doubt, remove the accessory.

## Principles

1. **Quiet by default, bold in one place.** A component gets at most one memorable
   effect — the one in its name. Everything around it stays calm.
2. **Motion explains state.** Animate what the user caused (open, close, select,
   confirm, load, error) and what changed. Do not animate for decoration.
3. **No cursor-following light.** Radial gradients that chase the pointer are banned,
   except in the three components whose whole purpose is that effect
   (`spotlight-button`, `glow-card`, `dot-spotlight`) — and there they stay subtle:
   border-level highlight, low opacity, no bloom, no colored fill blob.
4. **No glow.** No `shadow-[0_0_…]` halos, neon `text-shadow`s, or colored drop
   shadows on buttons, badges, dots, icons, inputs or cards. Depth comes from a
   1px border and, sparingly, a neutral shadow (`shadow-sm` / `shadow-md`, black).
   Exception: components named for the effect (`glow-text`, `neon-*`), toned down.
5. **Accent sparingly.** Mint (`--color-primary`) marks the primary action, the
   selected/active state and focus. It is not a decoration color, a section
   background tint, or a gradient.
6. **No gradient decoration.** No gradient text, gradient washes or blurred color
   blobs, except in components that *are* the effect (`aurora-*`, `rainbow-button`,
   backgrounds). Surfaces are solid.
7. **Primitives look like shadcn/ui.** `components/ui/*` is the calm baseline:
   standard focus ring (`focus-visible:ring-[3px] ring-ring/50`), hover = background
   or border change only, motion 150–250ms ease-out, no springy overshoot on
   everyday controls.
8. **Real content.** Demos use believable product content, not lorem or hype copy.
   Sentence case. No all-caps mono eyebrow labels, no accenting one word in a
   headline, no "big number + small label" stat rows unless the data is real.

## Tokens

| Token | Use |
| --- | --- |
| `--background` | Page. Near-black, neutral. |
| `--card` / `--popover` | Raised surfaces, one step lighter than background. |
| `--border` / `white/10` | Every surface edge. 1px. |
| `--muted-foreground` / `white/60` | Secondary text. |
| `--primary` (mint) | Primary action, selected state, focus ring. Only. |
| `--destructive` | Errors and destructive actions. |

**Radius:** controls `rounded-md`, cards and panels `rounded-xl`, pills only for
badges and toggles that are pills by nature.

**Motion:** state changes 150–250ms; enter/exit with `opacity` + small `y`/`scale`
(≤ 8px, ≥ 0.96); springs with `bounce ≤ 0.15` for layout moves; always respect
`prefers-reduced-motion`.

**Type:** Geist Sans for everything, Geist Mono only for code. Headings
`tracking-tight`, body `text-sm`/`text-base` with `leading-relaxed`, lines under ~80ch.

**Contrast:** readable text never goes below `white/55` (or `text-muted-foreground`)
on our dark surfaces; that is about 5:1. `white/40` and `white/45` fail WCAG AA
(4.5:1). Lower alphas are for icons, separators and decoration only. Watch for
stacked opacity: `text-white/60` inside an `opacity-70` wrapper is really ~40%.
White text on `--destructive` needs a darker fill
(`color-mix(in oklab, var(--color-destructive) 70%, black)`).

**Layout:** text never shares space with a decorative visual. If a background
visual can reach the copy, fade it out or put a card-colored scrim under the text.
Demos must fit 375px: about 290px inside the preview. Wrap, drop to icon-only with
an `sr-only` label, or show one item fewer on phones, rather than overflow.

## Checklist before shipping a component

- [ ] Remove one accessory. Does it still read well? Keep it removed.
- [ ] No pointer-chasing glow, halo shadow or neon text-shadow (unless it's the named effect).
- [ ] Mint only on the primary action / selected state / focus.
- [ ] Motion is caused by the user or by a state change, and is reduced-motion safe.
- [ ] Keyboard focus visible; contrast AA; works at 375px wide.
- [ ] No text sits on top of other text or a busy visual, at 375px and at 1280px.
