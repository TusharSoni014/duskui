# DuskUI

Animated React components for Next.js — shadcn/ui primitives upgraded with [Motion](https://motion.dev), plus ready-made blocks built on top. Every component installs with the shadcn CLI:

```bash
npx shadcn@latest add https://duskui.com/r/button.json
```

## Development

```bash
npm install
npm run dev            # http://localhost:3000
npm run registry:build # regenerate public/r/*.json from registry.json
npm run build          # registry + production build
```

## Project layout

| Path | What lives there |
| --- | --- |
| `components/ui/` | Base components (shadcn API, upgraded). `button.tsx` is the reference. |
| `components/dusk/<component>/` | Blocks built on a base component (e.g. `status-button.tsx`). |
| `components/demos/<component>/` | Live examples. The docs "Code" tab shows these files verbatim. |
| `components/docs/` | Docs building blocks: `CodeBlock` (Shiki, server), `ComponentPreview`, `InstallTabs`, `Toc`, `PropsTable`. |
| `components/docs/pages/` | One server component per docs page, e.g. `button-docs.tsx`. |
| `lib/components-data.ts` | Sidebar, search, sitemap and static routes all read from here. |
| `registry.json` | shadcn registry definition → built to `public/r/`. |
| `lib/seo.ts`, `lib/site.ts` | Page metadata helper and site config (`NEXT_PUBLIC_SITE_URL`). |

## Adding a component

1. **Base** — add/upgrade it in `components/ui/<name>.tsx`. Keep the shadcn API, add `"use client"` if it uses Motion.
2. **Blocks** — put variations in `components/dusk/<name>/*.tsx`, importing the base.
3. **Demos** — one small file per example in `components/demos/<name>/`.
4. **Docs page** — copy `components/docs/pages/button-docs.tsx`, then register it in the `docs` map in `app/components/[category]/[component]/page.tsx`.
5. **Data** — set `ready: true` on the entry in `lib/components-data.ts` (this indexes it and adds it to the sitemap; unfinished pages stay `noindex`).
6. **Registry** — add items to `registry.json` and run `npm run registry:build`.

### Conventions

- Respect reduced motion: the site wraps everything in `<MotionConfig reducedMotion="user">`; blocks that move things with transforms also check `useReducedMotion()`.
- Use motion values (`useMotionValue`, `useMotionTemplate`) for pointer-driven effects so they never re-render React.
- Never change a component's size when its state changes (loading, copied…) unless the change is the point, and then animate it.
- Prefer `aria-disabled` + `aria-busy` over `disabled` for temporary states so keyboard focus is kept.
