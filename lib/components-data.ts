import {
  Sparkles,
  Cpu,
  Zap,
  Terminal,
  Layers,
  LucideIcon,
} from "lucide-react";

export type Component = {
  name: string;
  slug: string;
  href: string;
  description?: string;
  keywords?: string[];
  /** Has a full docs page. Pages that aren't ready are noindexed and left out of the sitemap. */
  ready?: boolean;
};

export type Category = {
  name: string;
  slug: string;
  icon: LucideIcon;
  description: string;
  components: Component[];
};

export const categories: Category[] = [
  {
    name: "Shadcn+",
    slug: "shadcn-plus",
    icon: Sparkles,
    description: "Enhanced shadcn components with animations",
    components: [
      {
        name: "Button",
        slug: "button",
        href: "/components/shadcn-plus/button",
        description:
          "Animated shadcn/ui button with width-stable loading, plus status, hold-to-confirm, shimmer, magnetic, spotlight and copy blocks.",
        keywords: ["button", "loading", "status", "hold to confirm", "shimmer", "magnetic", "spotlight", "copy"],
        ready: true,
      },
      {
        name: "Input",
        slug: "input",
        href: "/components/shadcn-plus/input",
        description:
          "Animated shadcn/ui input with floating label, password strength meter, search, OTP code and shimmer border blocks.",
        keywords: ["input", "form", "floating label", "password", "otp", "search", "shimmer"],
        ready: true,
      },
      {
        name: "Card",
        slug: "card",
        href: "/components/shadcn-plus/card",
        description:
          "Animated React card components for shadcn/ui: cursor-following glow border, 3D tilt with glare and a shimmer skeleton loading card, built with Motion and Tailwind CSS.",
        keywords: ["card", "glow card", "tilt card", "3d card", "skeleton", "loading card", "hover", "shadcn", "motion"],
        ready: true,
      },
      {
        name: "Dialog",
        slug: "dialog",
        href: "/components/shadcn-plus/dialog",
        description:
          "Accessible animated React dialog and modal components for shadcn/ui: a morphing card-to-dialog transition, an async confirm dialog and a drag-to-dismiss bottom sheet drawer.",
        keywords: ["dialog", "modal", "morphing dialog", "confirm dialog", "alert dialog", "drawer", "bottom sheet", "radix", "shadcn", "motion"],
        ready: true,
      },
      {
        name: "Badge",
        slug: "badge",
        href: "/components/shadcn-plus/badge",
        description:
          "Animated React badge components for shadcn/ui: pulsing live status badge, odometer-style notification count badge and shimmering New badge, plus soft, success and warning variants.",
        keywords: ["badge", "pulse badge", "status", "notification count", "counter", "shimmer", "tag", "shadcn", "motion"],
        ready: true,
      },
    ],
  },
  {
    name: "Techy",
    slug: "techy",
    icon: Cpu,
    description: "Tech-inspired UI components",
    components: [
      {
        name: "Circuit Board",
        slug: "circuit-board",
        href: "/components/techy/circuit-board",
        description:
          "An animated React circuit board background with SVG traces and light pulses racing along them, built with Tailwind CSS.",
        keywords: ["circuit board background", "pcb animation", "svg circuit", "animated background", "react", "tailwind", "tech background"],
        ready: true,
      },
      {
        name: "Data Stream",
        slug: "data-stream",
        href: "/components/techy/data-stream",
        description:
          "A flowing data stream effect for React: glowing packets race along lanes on a high-DPI canvas, a lightweight hero accent.",
        keywords: ["data stream", "data flow animation", "canvas animation", "network traffic", "hero background", "react", "tailwind"],
        ready: true,
      },
      {
        name: "Hologram Card",
        slug: "hologram-card",
        href: "/components/techy/hologram-card",
        description:
          "A holographic React card with iridescent foil, scanlines and a 3D tilt and glare that follow the cursor, built with Motion.",
        keywords: ["hologram card", "holographic effect", "3d tilt card", "iridescent", "glare effect", "framer motion", "react", "tailwind"],
        ready: true,
      },
      {
        name: "Binary Rain",
        slug: "binary-rain",
        href: "/components/techy/binary-rain",
        description:
          "A binary rain background for React with falling 0s and 1s on a fast, accessible canvas, the classic hacker effect.",
        keywords: ["binary rain", "matrix rain", "hacker background", "canvas animation", "falling code", "react", "tailwind"],
        ready: true,
      },
      {
        name: "Tech Grid",
        slug: "tech-grid",
        href: "/components/techy/tech-grid",
        description:
          "An animated tech grid background for React with cursor-lit cells, a scan line and a retro perspective floor.",
        keywords: ["grid background", "retro grid", "perspective grid", "cyberpunk grid", "cursor spotlight", "react", "tailwind"],
        ready: true,
      },
    ],
  },
  {
    name: "Neon",
    slug: "neon",
    icon: Zap,
    description: "Vibrant neon-styled components",
    components: [
      {
        name: "Neon Button",
        slug: "neon-button",
        href: "/components/neon/neon-button",
        description:
          "React neon button with a glow that brightens on hover and focus, a flicker-on effect, any color and a width-stable loading state.",
        keywords: ["neon button", "glow button", "glowing button", "flicker", "loading button", "tailwind", "motion"],
        ready: true,
      },
      {
        name: "Glow Text",
        slug: "glow-text",
        href: "/components/neon/glow-text",
        description:
          "Neon glow text effect for React with breathing or flicker animation that stays real, selectable and SEO-friendly.",
        keywords: ["glow text", "neon text", "text shadow", "text effect", "flicker", "heading", "tailwind"],
        ready: true,
      },
      {
        name: "Neon Border",
        slug: "neon-border",
        href: "/components/neon/neon-border",
        description:
          "Animated neon border for any React element, with a travelling light beam, glow and hover trigger.",
        keywords: ["neon border", "animated border", "glowing border", "border beam", "conic gradient", "card", "tailwind"],
        ready: true,
      },
      {
        name: "Electric Card",
        slug: "electric-card",
        href: "/components/neon/electric-card",
        description:
          "React card with an electric border effect: procedural SVG lightning crackles around the edge on hover or focus.",
        keywords: ["electric card", "lightning", "electric border", "spark", "glow card", "hover effect", "svg"],
        ready: true,
      },
      {
        name: "Plasma Loader",
        slug: "plasma-loader",
        href: "/components/neon/plasma-loader",
        description:
          "Accessible React loading spinner with a glowing plasma effect made of gooey orbiting blobs.",
        keywords: ["loader", "spinner", "plasma", "gooey", "loading indicator", "neon", "accessible"],
        ready: true,
      },
    ],
  },
  {
    name: "Hacker",
    slug: "hacker",
    icon: Terminal,
    description: "Matrix-style hacker aesthetics",
    components: [
      {
        name: "Terminal Window",
        slug: "terminal-window",
        href: "/components/hacker/terminal-window",
        description:
          "Animated React terminal window that types out commands and output with a blinking cursor, auto-scroll, loop and replay, with SEO-friendly real text.",
        keywords: ["terminal", "console", "cli", "typing animation", "typewriter", "command line", "shell", "code window"],
        ready: true,
      },
      {
        name: "Glitch Text",
        slug: "glitch-text",
        href: "/components/hacker/glitch-text",
        description:
          "React glitch text effect with RGB-split clip-path slices that triggers on hover, on a loop or on scroll into view, while keeping the text selectable and accessible.",
        keywords: ["glitch", "text", "rgb split", "chromatic aberration", "cyberpunk", "distortion", "hover effect", "clip-path"],
        ready: true,
      },
      {
        name: "Matrix Rain",
        slug: "matrix-rain",
        href: "/components/hacker/matrix-rain",
        description:
          "Matrix digital rain background for React: falling katakana and digits on a high-DPI canvas with configurable color, speed, size and fade.",
        keywords: ["matrix", "digital rain", "falling code", "canvas", "background", "katakana", "hacker", "animated background"],
        ready: true,
      },
      {
        name: "Cyber Button",
        slug: "cyber-button",
        href: "/components/hacker/cyber-button",
        description:
          "Cyberpunk React button with angled clip-path corners and a text scramble or glitch hover effect, built on the DuskUI Button with loading support.",
        keywords: ["button", "cyberpunk", "cyber", "text scramble", "glitch", "clip-path", "hacker", "futuristic"],
        ready: true,
      },
      {
        name: "Scan Line",
        slug: "scan-line",
        href: "/components/hacker/scan-line",
        description:
          "CRT scan line overlay for React with retro scanlines, a rolling scan bar, vignette, flicker and curvature, in pure CSS that never blocks clicks.",
        keywords: ["scan line", "scanlines", "crt", "retro", "overlay", "vhs", "monitor", "vignette"],
        ready: true,
      },
    ],
  },
  {
    name: "Glassmorphism",
    slug: "glass",
    icon: Layers,
    description: "Frosted glass effect components",
    components: [
      {
        name: "Glass Card",
        slug: "glass-card",
        href: "/components/glass/glass-card",
        description:
          "React glassmorphism card with Tailwind backdrop blur, a pointer-tracking specular highlight, gradient border and optional 3D tilt.",
        keywords: ["glass", "glassmorphism", "card", "frosted", "backdrop blur", "tilt", "highlight"],
        ready: true,
      },
      {
        name: "Blur Panel",
        slug: "blur-panel",
        href: "/components/glass/blur-panel",
        description:
          "Backdrop-blur React panel for sticky headers, toolbars and sidebars whose frosted glass fades in on scroll.",
        keywords: ["blur", "panel", "backdrop", "glass", "sticky header", "scroll", "toolbar"],
        ready: true,
      },
      {
        name: "Frost Button",
        slug: "frost-button",
        href: "/components/glass/frost-button",
        description:
          "Frosted-glass React button with a light sweep, press ripple and loading state, built on the shadcn-compatible DuskUI Button.",
        keywords: ["button", "frost", "glass", "glassmorphism", "ripple", "shine", "loading"],
        ready: true,
      },
      {
        name: "Crystal Modal",
        slug: "crystal-modal",
        href: "/components/glass/crystal-modal",
        description:
          "Accessible glassmorphism modal dialog on Radix with Motion scale-and-blur animations and a frosted backdrop.",
        keywords: ["modal", "dialog", "crystal", "glass", "radix", "popup", "overlay"],
        ready: true,
      },
      {
        name: "Ice Input",
        slug: "ice-input",
        href: "/components/glass/ice-input",
        description:
          "Frosted-glass React input with a frost-spread focus animation and cool glow, built on the DuskUI Input.",
        keywords: ["input", "ice", "glass", "form", "text field", "focus", "glow"],
        ready: true,
      },
    ],
  },
];

// Flat list of all components for search
export const allComponents = categories.flatMap((category) =>
  category.components.map((component) => ({
    ...component,
    category: category.name,
    categorySlug: category.slug,
  }))
);

// Search function
export function searchComponents(query: string) {
  const lowerQuery = query.toLowerCase();
  return allComponents.filter(
    (component) =>
      component.name.toLowerCase().includes(lowerQuery) ||
      component.description?.toLowerCase().includes(lowerQuery) ||
      component.keywords?.some((k) => k.toLowerCase().includes(lowerQuery)) ||
      component.category.toLowerCase().includes(lowerQuery)
  );
}

// Find category by slug
export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}

// Find component by category and component slug
export function getComponentBySlug(categorySlug: string, componentSlug: string) {
  const category = getCategoryBySlug(categorySlug);
  if (!category) return null;
  return category.components.find((c) => c.slug === componentSlug) || null;
}
