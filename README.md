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
| `components/dusk/<component>/` | Components and blocks built on the bases (e.g. `button/status-button.tsx`, `text/typewriter.tsx`). |
| `components/demos/<component>/` | Live examples. The docs "Code" tab shows these files verbatim. |
| `components/docs/` | Docs building blocks: `CodeBlock` (Shiki, server), `ComponentPreview`, `InstallTabs`, `Toc`, `PropsTable`. |
| `components/docs/pages/` | One server component per docs page, e.g. `button-docs.tsx`. |
| `lib/components-data.ts` | The one flat component list. Sidebar, search, catalog, sitemap and static routes all read from here. |
| `registry.json` | shadcn registry definition → built to `public/r/`. |
| `lib/seo.ts`, `lib/site.ts` | Page metadata helper and site config (`NEXT_PUBLIC_SITE_URL`). |

## Adding a component

Components are one flat list (no categories), served at `/components/<slug>`.

1. **Code** — a shadcn primitive upgrade goes in `components/ui/<name>.tsx` (keep the shadcn API); anything else, and blocks built on a primitive, go in `components/dusk/<name>/`.
2. **Demos** — one small file per example in `components/demos/<name>/`.
3. **Docs page** — copy `components/docs/pages/input-docs.tsx` (with blocks) or `glow-text-docs.tsx` (standalone), then register it in the `docs` map in `app/components/[slug]/page.tsx`.
4. **List it** — add `{ name, slug, description, keywords }` to `lib/components-data.ts`. That's what puts it in the sidebar, search, catalog and sitemap.
5. **Registry** — add items to `registry.json` and run `npm run registry:build`.

### Conventions

- Respect reduced motion: the site wraps everything in `<MotionConfig reducedMotion="user">`; blocks that move things with transforms also check `useReducedMotion()`.
- Use motion values (`useMotionValue`, `useMotionTemplate`) for pointer-driven effects so they never re-render React.
- Never change a component's size when its state changes (loading, copied…) unless the change is the point, and then animate it.
- Prefer `aria-disabled` + `aria-busy` over `disabled` for temporary states so keyboard focus is kept.
