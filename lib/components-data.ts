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
        description: "Enhanced button with loading states and custom icons",
        keywords: ["button", "click", "hover", "loading", "spinner"],
      },
      {
        name: "Glow Card",
        slug: "glow-card",
        href: "/components/shadcn-plus/glow-card",
        description: "Cards with glowing border effects",
        keywords: ["card", "glow", "border", "hover"],
      },
      {
        name: "Morphing Dialog",
        slug: "morphing-dialog",
        href: "/components/shadcn-plus/morphing-dialog",
        description: "Dialogs with morphing open/close animations",
        keywords: ["dialog", "modal", "morph", "transition"],
      },
      {
        name: "Shimmer Input",
        slug: "shimmer-input",
        href: "/components/shadcn-plus/shimmer-input",
        description: "Input fields with shimmer loading effect",
        keywords: ["input", "shimmer", "loading", "form"],
      },
      {
        name: "Pulse Badge",
        slug: "pulse-badge",
        href: "/components/shadcn-plus/pulse-badge",
        description: "Badges with pulsing animation",
        keywords: ["badge", "pulse", "notification", "status"],
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
        description: "Animated circuit board background pattern",
        keywords: ["circuit", "background", "tech", "pattern"],
      },
      {
        name: "Data Stream",
        slug: "data-stream",
        href: "/components/techy/data-stream",
        description: "Flowing data visualization effect",
        keywords: ["data", "stream", "flow", "visualization"],
      },
      {
        name: "Hologram Card",
        slug: "hologram-card",
        href: "/components/techy/hologram-card",
        description: "Cards with holographic effect",
        keywords: ["hologram", "card", "3d", "effect"],
      },
      {
        name: "Binary Rain",
        slug: "binary-rain",
        href: "/components/techy/binary-rain",
        description: "Falling binary code animation",
        keywords: ["binary", "rain", "code", "matrix"],
      },
      {
        name: "Tech Grid",
        slug: "tech-grid",
        href: "/components/techy/tech-grid",
        description: "Animated tech-style grid background",
        keywords: ["grid", "background", "tech", "pattern"],
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
        description: "Buttons with neon glow effect",
        keywords: ["button", "neon", "glow", "cyberpunk"],
      },
      {
        name: "Glow Text",
        slug: "glow-text",
        href: "/components/neon/glow-text",
        description: "Text with neon glow animation",
        keywords: ["text", "glow", "neon", "typography"],
      },
      {
        name: "Neon Border",
        slug: "neon-border",
        href: "/components/neon/neon-border",
        description: "Animated neon border effect",
        keywords: ["border", "neon", "glow", "animated"],
      },
      {
        name: "Electric Card",
        slug: "electric-card",
        href: "/components/neon/electric-card",
        description: "Cards with electric spark effects",
        keywords: ["card", "electric", "spark", "neon"],
      },
      {
        name: "Plasma Loader",
        slug: "plasma-loader",
        href: "/components/neon/plasma-loader",
        description: "Loading spinner with plasma effect",
        keywords: ["loader", "spinner", "plasma", "loading"],
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
        description: "Styled terminal/console window",
        keywords: ["terminal", "console", "cli", "window"],
      },
      {
        name: "Glitch Text",
        slug: "glitch-text",
        href: "/components/hacker/glitch-text",
        description: "Text with glitch distortion effect",
        keywords: ["glitch", "text", "distortion", "effect"],
      },
      {
        name: "Matrix Rain",
        slug: "matrix-rain",
        href: "/components/hacker/matrix-rain",
        description: "Classic matrix falling code effect",
        keywords: ["matrix", "rain", "code", "falling"],
      },
      {
        name: "Cyber Button",
        slug: "cyber-button",
        href: "/components/hacker/cyber-button",
        description: "Cyberpunk styled buttons",
        keywords: ["button", "cyber", "punk", "hacker"],
      },
      {
        name: "Scan Line",
        slug: "scan-line",
        href: "/components/hacker/scan-line",
        description: "CRT scan line overlay effect",
        keywords: ["scan", "line", "crt", "retro"],
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
        description: "Card with frosted glass effect",
        keywords: ["glass", "card", "blur", "frosted"],
      },
      {
        name: "Blur Panel",
        slug: "blur-panel",
        href: "/components/glass/blur-panel",
        description: "Panel with backdrop blur",
        keywords: ["blur", "panel", "backdrop", "glass"],
      },
      {
        name: "Frost Button",
        slug: "frost-button",
        href: "/components/glass/frost-button",
        description: "Button with frost glass effect",
        keywords: ["button", "frost", "glass", "blur"],
      },
      {
        name: "Crystal Modal",
        slug: "crystal-modal",
        href: "/components/glass/crystal-modal",
        description: "Modal with crystal clear glass effect",
        keywords: ["modal", "crystal", "glass", "dialog"],
      },
      {
        name: "Ice Input",
        slug: "ice-input",
        href: "/components/glass/ice-input",
        description: "Input field with ice glass styling",
        keywords: ["input", "ice", "glass", "form"],
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
