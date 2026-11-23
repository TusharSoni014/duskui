export const siteConfig = {
  name: "DuskUI",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://duskui.com").replace(
    /\/$/,
    ""
  ),
  title: "DuskUI - Animated React Components built on shadcn/ui & Motion",
  description:
    "Open-source, copy-paste React components for Next.js. shadcn/ui primitives upgraded with Motion animations, loading states and hover effects — installable with the shadcn CLI.",
  keywords: [
    "React components",
    "Next.js components",
    "shadcn/ui",
    "shadcn components",
    "Motion",
    "Framer Motion",
    "animated components",
    "Tailwind CSS",
    "UI library",
    "component library",
    "DuskUI",
  ],
  author: { name: "Tushar Verma", twitter: "@tusharsoni014" },
  links: {
    github: "https://github.com/duskui/duskui",
  },
} as const;

export function absoluteUrl(path = "/") {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Registry URL that users pass to `npx shadcn add`. */
export function registryUrl(name: string) {
  return absoluteUrl(`/r/${name}.json`);
}
