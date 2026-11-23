/**
 * The DuskUI component list. One flat list, like any UI library — add a
 * component here (alphabetical order is applied at runtime) and it shows up in
 * the sidebar, search, catalog, sitemap and static routes.
 */
export type Component = {
  name: string;
  slug: string;
  description: string;
  keywords: string[];
};

const list: Component[] = [
  {
    name: "Aurora Background",
    slug: "aurora-background",
    description:
      "An animated aurora background for React with soft, drifting northern-lights gradients built on Motion and Tailwind CSS.",
    keywords: ["aurora", "northern lights", "gradient background", "animated background", "hero background", "blur", "motion"],
  },
  {
    name: "Avatar",
    slug: "avatar",
    description:
      "Animated React avatar components for shadcn/ui: soft image fade-in, an overlapping avatar group that fans out on hover with +N overflow, and a status avatar with a pulsing online indicator.",
    keywords: ["avatar", "avatar group", "avatar stack", "status avatar", "presence indicator", "online status", "profile picture", "radix", "shadcn", "motion"],
  },
  {
    name: "Background Beams",
    slug: "background-beams",
    description:
      "An animated background beams effect for React with streaks of light racing along curved SVG paths.",
    keywords: ["beams", "light beams", "svg animation", "animated background", "hero background", "streaks", "lines"],
  },
  {
    name: "Badge",
    slug: "badge",
    description:
      "Animated React badge components for shadcn/ui: pulsing live status badge, odometer-style notification count badge and shimmering New badge, plus soft, success and warning variants.",
    keywords: ["badge", "pulse badge", "status", "notification count", "counter", "shimmer", "tag", "shadcn", "motion"],
  },
  {
    name: "Binary Rain",
    slug: "binary-rain",
    description:
      "A binary rain background for React with falling 0s and 1s on a fast, accessible canvas, the classic hacker effect.",
    keywords: ["binary rain", "matrix rain", "hacker background", "canvas animation", "falling code", "react", "tailwind"],
  },
  {
    name: "Blur Panel",
    slug: "blur-panel",
    description:
      "Backdrop-blur React panel for sticky headers, toolbars and sidebars whose frosted glass fades in on scroll.",
    keywords: ["blur", "panel", "backdrop", "glass", "sticky header", "scroll", "toolbar"],
  },
  {
    name: "Button",
    slug: "button",
    description:
      "Animated shadcn/ui button with width-stable loading, plus status, hold-to-confirm, shimmer, magnetic, spotlight and copy blocks.",
    keywords: ["button", "loading", "status", "hold to confirm", "shimmer", "magnetic", "spotlight", "copy"],
  },
  {
    name: "Card",
    slug: "card",
    description:
      "Animated React card components for shadcn/ui: cursor-following glow border, 3D tilt with glare and a shimmer skeleton loading card, built with Motion and Tailwind CSS.",
    keywords: ["card", "glow card", "tilt card", "3d card", "skeleton", "loading card", "hover", "shadcn", "motion"],
  },
  {
    name: "Circuit Board",
    slug: "circuit-board",
    description:
      "An animated React circuit board background with SVG traces and light pulses racing along them, built with Tailwind CSS.",
    keywords: ["circuit board background", "pcb animation", "svg circuit", "animated background", "react", "tailwind", "tech background"],
  },
  {
    name: "Crystal Modal",
    slug: "crystal-modal",
    description:
      "Accessible glassmorphism modal dialog on Radix with Motion scale-and-blur animations and a frosted backdrop.",
    keywords: ["modal", "dialog", "crystal", "glass", "radix", "popup", "overlay"],
  },
  {
    name: "Cyber Button",
    slug: "cyber-button",
    description:
      "Cyberpunk React button with angled clip-path corners and a text scramble or glitch hover effect, built on the DuskUI Button with loading support.",
    keywords: ["button", "cyberpunk", "cyber", "text scramble", "glitch", "clip-path", "hacker", "futuristic"],
  },
  {
    name: "Data Stream",
    slug: "data-stream",
    description:
      "A flowing data stream effect for React: glowing packets race along lanes on a high-DPI canvas, a lightweight hero accent.",
    keywords: ["data stream", "data flow animation", "canvas animation", "network traffic", "hero background", "react", "tailwind"],
  },
  {
    name: "Dialog",
    slug: "dialog",
    description:
      "Accessible animated React dialog and modal components for shadcn/ui: a morphing card-to-dialog transition, an async confirm dialog and a drag-to-dismiss bottom sheet drawer.",
    keywords: ["dialog", "modal", "morphing dialog", "confirm dialog", "alert dialog", "drawer", "bottom sheet", "radix", "shadcn", "motion"],
  },
  {
    name: "Dot Spotlight",
    slug: "dot-spotlight",
    description:
      "A dot grid background for React with a cursor-following spotlight that lights up nearby dots.",
    keywords: ["dot grid", "dot pattern", "spotlight", "cursor glow", "mouse follow", "background", "motion values"],
  },
  {
    name: "Dropdown Menu",
    slug: "dropdown-menu",
    description:
      "Accessible animated React dropdown menu for shadcn/ui with sub-menus, checkbox and radio items, staggered items and a highlight pill that glides between options.",
    keywords: ["dropdown menu", "dropdown", "menu", "context menu", "action menu", "submenu", "checkbox menu", "radix", "shadcn", "motion"],
  },
  {
    name: "Electric Card",
    slug: "electric-card",
    description:
      "React card with an electric border effect: procedural SVG lightning crackles around the edge on hover or focus.",
    keywords: ["electric card", "lightning", "electric border", "spark", "glow card", "hover effect", "svg"],
  },
  {
    name: "Frost Button",
    slug: "frost-button",
    description:
      "Frosted-glass React button with a light sweep, press ripple and loading state, built on the shadcn-compatible DuskUI Button.",
    keywords: ["button", "frost", "glass", "glassmorphism", "ripple", "shine", "loading"],
  },
  {
    name: "Glass Card",
    slug: "glass-card",
    description:
      "React glassmorphism card with Tailwind backdrop blur, a pointer-tracking specular highlight, gradient border and optional 3D tilt.",
    keywords: ["glass", "glassmorphism", "card", "frosted", "backdrop blur", "tilt", "highlight"],
  },
  {
    name: "Glitch Text",
    slug: "glitch-text",
    description:
      "React glitch text effect with RGB-split clip-path slices that triggers on hover, on a loop or on scroll into view, while keeping the text selectable and accessible.",
    keywords: ["glitch", "text", "rgb split", "chromatic aberration", "cyberpunk", "distortion", "hover effect", "clip-path"],
  },
  {
    name: "Glow Text",
    slug: "glow-text",
    description:
      "Neon glow text effect for React with breathing or flicker animation that stays real, selectable and SEO-friendly.",
    keywords: ["glow text", "neon text", "text shadow", "text effect", "flicker", "heading", "tailwind"],
  },
  {
    name: "Hologram Card",
    slug: "hologram-card",
    description:
      "A holographic React card with iridescent foil, scanlines and a 3D tilt and glare that follow the cursor, built with Motion.",
    keywords: ["hologram card", "holographic effect", "3d tilt card", "iridescent", "glare effect", "framer motion", "react", "tailwind"],
  },
  {
    name: "Ice Input",
    slug: "ice-input",
    description:
      "Frosted-glass React input with a frost-spread focus animation and cool glow, built on the DuskUI Input.",
    keywords: ["input", "ice", "glass", "form", "text field", "focus", "glow"],
  },
  {
    name: "Input",
    slug: "input",
    description:
      "Animated shadcn/ui input with floating label, password strength meter, search, OTP code and shimmer border blocks.",
    keywords: ["input", "form", "floating label", "password", "otp", "search", "shimmer"],
  },
  {
    name: "Matrix Rain",
    slug: "matrix-rain",
    description:
      "Matrix digital rain background for React: falling katakana and digits on a high-DPI canvas with configurable color, speed, size and fade.",
    keywords: ["matrix", "digital rain", "falling code", "canvas", "background", "katakana", "hacker", "animated background"],
  },
  {
    name: "Meteors",
    slug: "meteors",
    description:
      "An animated meteor shower background for React with shooting stars and glowing tails.",
    keywords: ["meteors", "shooting stars", "meteor shower", "night sky", "animated background", "stars", "card background"],
  },
  {
    name: "Neon Border",
    slug: "neon-border",
    description:
      "Animated neon border for any React element, with a travelling light beam, glow and hover trigger.",
    keywords: ["neon border", "animated border", "glowing border", "border beam", "conic gradient", "card", "tailwind"],
  },
  {
    name: "Neon Button",
    slug: "neon-button",
    description:
      "React neon button with a glow that brightens on hover and focus, a flicker-on effect, any color and a width-stable loading state.",
    keywords: ["neon button", "glow button", "glowing button", "flicker", "loading button", "tailwind", "motion"],
  },
  {
    name: "Number Ticker",
    slug: "number-ticker",
    description:
      "Animated number counter for React that springs to its value on scroll, with Intl.NumberFormat currency and locale support and a server-rendered final value.",
    keywords: ["number ticker", "count up", "animated counter", "number animation", "stats", "currency", "intl"],
  },
  {
    name: "Particles",
    slug: "particles",
    description:
      "An interactive canvas particles background for React that reacts to the cursor, with optional constellation lines.",
    keywords: ["particles", "canvas", "interactive background", "constellation", "starfield", "cursor", "animated background"],
  },
  {
    name: "Plasma Loader",
    slug: "plasma-loader",
    description:
      "Accessible React loading spinner with a glowing plasma effect made of gooey orbiting blobs.",
    keywords: ["loader", "spinner", "plasma", "gooey", "loading indicator", "neon", "accessible"],
  },
  {
    name: "Popover",
    slug: "popover",
    description:
      "Animated React popover components for shadcn/ui: spring popovers that grow from their trigger and a feedback button that morphs into a form.",
    keywords: ["popover", "popup", "floating panel", "feedback widget", "morphing popover", "share popover", "radix", "shadcn", "motion"],
  },
  {
    name: "Progress",
    slug: "progress",
    description:
      "Animated React progress bar components for shadcn/ui: spring-animated and indeterminate bars, a circular progress ring with a counting number, a multi-step stepper and segmented progress.",
    keywords: ["progress", "progress bar", "circular progress", "progress ring", "stepper", "steps", "segmented progress", "loading", "radix", "shadcn", "motion"],
  },
  {
    name: "Scan Line",
    slug: "scan-line",
    description:
      "CRT scan line overlay for React with retro scanlines, a rolling scan bar, vignette, flicker and curvature, in pure CSS that never blocks clicks.",
    keywords: ["scan line", "scanlines", "crt", "retro", "overlay", "vhs", "monitor", "vignette"],
  },
  {
    name: "Scroll Reveal Text",
    slug: "scroll-reveal-text",
    description:
      "Scroll-driven text reveal for React where words light up one by one as the paragraph scrolls into view, with no re-renders.",
    keywords: ["scroll reveal", "scroll animation", "text reveal", "scroll-linked", "opacity", "paragraph", "text effect"],
  },
  {
    name: "Shiny Text",
    slug: "shiny-text",
    description:
      "Shimmering text effect for React with a light band sweeping across real, selectable, SEO-friendly text on any heading level.",
    keywords: ["shiny text", "shimmer text", "text shine", "gradient text", "loading text", "background-clip", "text effect"],
  },
  {
    name: "Slider",
    slug: "slider",
    description:
      "Accessible animated React slider components for shadcn/ui: range and vertical sliders, a value slider with a floating tooltip that follows the thumb, and a stepped slider with tick marks.",
    keywords: ["slider", "range slider", "input range", "value tooltip", "stepped slider", "tick marks", "price range", "radix", "shadcn", "motion"],
  },
  {
    name: "Split Text",
    slug: "split-text",
    description:
      "Split text animation for React where letters or words stagger in on scroll, with server-rendered text and screen-reader support.",
    keywords: ["split text", "letter animation", "stagger text", "text reveal", "word animation", "headline", "text effect"],
  },
  {
    name: "Tech Grid",
    slug: "tech-grid",
    description:
      "An animated tech grid background for React with cursor-lit cells, a scan line and a retro perspective floor.",
    keywords: ["grid background", "retro grid", "perspective grid", "cyberpunk grid", "cursor spotlight", "react", "tailwind"],
  },
  {
    name: "Terminal Window",
    slug: "terminal-window",
    description:
      "Animated React terminal window that types out commands and output with a blinking cursor, auto-scroll, loop and replay, with SEO-friendly real text.",
    keywords: ["terminal", "console", "cli", "typing animation", "typewriter", "command line", "shell", "code window"],
  },
  {
    name: "Typewriter",
    slug: "typewriter",
    description:
      "Typewriter text effect for React that types and deletes phrases with a blinking caret, with no layout shift and SEO-friendly real text.",
    keywords: ["typewriter", "typing animation", "typing effect", "text effect", "caret", "cursor", "tailwind"],
  },
  {
    name: "Word Rotate",
    slug: "word-rotate",
    description:
      "Rotating word animation for React with a slide-and-blur swap and a springy width that keeps the sentence smooth.",
    keywords: ["word rotate", "rotating text", "text rotator", "flip words", "animated headline", "text effect"],
  },
  {
    name: "Tabs",
    slug: "tabs",
    description:
      "Animated React tabs for shadcn/ui with a gliding active indicator, direction-aware panel transitions and an iOS-style segmented control.",
    keywords: ["tabs", "animated tabs", "react tabs", "shadcn tabs", "segmented control", "radix tabs", "framer motion tabs"],
  },
  {
    name: "Accordion",
    slug: "accordion",
    description:
      "Animated React accordion for shadcn/ui with spring height, a rotating chevron and an SEO-ready FAQ section with FAQPage schema.",
    keywords: ["accordion", "animated accordion", "faq accordion", "collapsible", "shadcn accordion", "radix accordion", "faq schema"],
  },
  {
    name: "Switch",
    slug: "switch",
    description:
      "Animated React toggle switch for shadcn/ui with a spring thumb, a sun-to-moon theme toggle and an async loading switch.",
    keywords: ["switch", "toggle", "toggle switch", "dark mode toggle", "theme switch", "shadcn switch", "radix switch"],
  },
  {
    name: "Checkbox",
    slug: "checkbox",
    description:
      "Animated React checkbox for shadcn/ui whose check mark draws itself, with indeterminate support, to-do strike-through and selectable checkbox cards.",
    keywords: ["checkbox", "animated checkbox", "todo checkbox", "checkbox card", "indeterminate checkbox", "shadcn checkbox", "radix checkbox"],
  },
  {
    name: "Tooltip",
    slug: "tooltip",
    description:
      "Animated React tooltip for shadcn/ui with spring scale and blur, plus an avatar group whose tooltips tilt toward the cursor.",
    keywords: ["tooltip", "animated tooltip", "avatar group", "avatar tooltip", "shadcn tooltip", "radix tooltip", "framer motion tooltip"],
  },
  {
    name: "Animated List",
    slug: "animated-list",
    description:
      "An animated notification list for React where new items spring in at the top and older ones glide down with Motion layout animations, built with Tailwind CSS.",
    keywords: ["animated list", "notification list", "notification feed", "activity feed", "layout animation", "animatepresence", "popLayout", "live region", "motion"],
  },
  {
    name: "Bento Grid",
    slug: "bento-grid",
    description:
      "A responsive bento grid for React and Tailwind CSS with hover-reveal call-to-action cards, cursor glow and zooming background visuals for feature sections.",
    keywords: ["bento grid", "bento", "feature grid", "feature section", "landing page", "card grid", "hover reveal", "cursor glow", "motion"],
  },
  {
    name: "File Upload",
    slug: "file-upload",
    description:
      "An animated drag-and-drop file upload component for React with file validation, per-file progress bars, cancel and retry, built on a real accessible file input.",
    keywords: ["file upload", "dropzone", "drag and drop", "file input", "upload progress", "file validation", "uploader", "shadcn", "motion"],
  },
  {
    name: "Marquee",
    slug: "marquee",
    description:
      "An infinite scrolling marquee for React and Tailwind CSS with a seamless loop for logo clouds and testimonials, horizontal or vertical, with pause on hover.",
    keywords: ["marquee", "infinite scroll", "logo cloud", "logo carousel", "ticker", "testimonials", "scrolling text", "loop", "motion"],
  },
  {
    name: "Timeline",
    slug: "timeline",
    description:
      "A scroll-animated vertical timeline for React with a progress line that traces down as you scroll and sticky dates, for changelogs and roadmaps.",
    keywords: ["timeline", "changelog", "roadmap", "vertical timeline", "scroll animation", "scroll progress", "sticky", "history", "motion"],
  },
  {
    name: "Select",
    slug: "select",
    description:
      "Animated React select built on shadcn/ui and Radix, with a spring-open list, cascading options and a gliding highlight.",
    keywords: ["select", "dropdown select", "react select", "shadcn select", "radix select", "animated select", "listbox", "form"],
  },
  {
    name: "Radio Group",
    slug: "radio-group",
    description:
      "Animated React radio group built on shadcn/ui and Radix, with a springy dot and selectable radio cards whose outline glides.",
    keywords: ["radio group", "radio button", "radio cards", "plan selector", "pricing cards", "shadcn radio group", "radix radio", "form"],
  },
  {
    name: "Textarea",
    slug: "textarea",
    description:
      "Auto-growing React textarea built on shadcn/ui, with a spring auto-resize block, character counter and AI chat input.",
    keywords: ["textarea", "auto resize textarea", "character counter", "chat input", "ai prompt input", "shadcn textarea", "form"],
  },
  {
    name: "Toggle Group",
    slug: "toggle-group",
    description:
      "Animated React toggle group built on shadcn/ui and Radix, with an active pill that glides between options.",
    keywords: ["toggle group", "toggle", "segmented buttons", "text formatting toolbar", "shadcn toggle group", "radix toggle group", "animated toggle"],
  },
  {
    name: "Combobox",
    slug: "combobox",
    description:
      "Animated React combobox and multi-select autocomplete built on shadcn/ui Popover and Command (cmdk), with layout-animated filtering and removable chips.",
    keywords: ["combobox", "autocomplete", "searchable select", "multi select", "tag input", "cmdk", "shadcn combobox", "command"],
  },
  {
    name: "Pagination",
    slug: "pagination",
    description:
      "Animated React pagination for shadcn/ui with a gliding active page indicator, smart ellipsis ranges and rolling page numbers.",
    keywords: ["pagination", "pager", "page numbers", "animated pagination", "shadcn pagination", "table pagination", "navigation"],
  },
  {
    name: "Breadcrumb",
    slug: "breadcrumb",
    description:
      "Accessible React breadcrumb for shadcn/ui with a collapsible variant that folds middle items into an animated menu.",
    keywords: ["breadcrumb", "breadcrumbs", "navigation", "collapsible breadcrumb", "shadcn breadcrumb", "page path", "seo navigation"],
  },
  {
    name: "Carousel",
    slug: "carousel",
    description:
      "Dependency-free React carousel built with Motion: drag with momentum and snap, dots, arrows, keyboard, loop, autoplay and a 3D coverflow variant.",
    keywords: ["carousel", "slider", "image slider", "coverflow", "swipe", "drag", "autoplay", "gallery", "motion"],
  },
  {
    name: "Dock",
    slug: "dock",
    description:
      "macOS-style React dock where icons magnify toward the cursor with springs, with labels, active dots, keyboard focus and a vertical option.",
    keywords: ["dock", "macos dock", "magnification", "app dock", "icon bar", "toolbar", "motion values", "navigation"],
  },
  {
    name: "Navbar",
    slug: "navbar",
    description:
      "Floating React navbar that hides on scroll down and returns on scroll up, with a gliding active-link pill and an animated mobile menu.",
    keywords: ["navbar", "floating navbar", "header", "hide on scroll", "sticky header", "navigation menu", "mobile menu", "motion"],
  },
  {
    name: "Alert",
    slug: "alert",
    description:
      "Animated React alert for shadcn/ui with success, warning, info and destructive variants, dismissible alerts with auto-dismiss progress and slide-in banners.",
    keywords: ["alert", "callout", "notice", "banner", "dismissible alert", "announcement bar", "shadcn alert", "status message"],
  },
  {
    name: "Alert Dialog",
    slug: "alert-dialog",
    description:
      "Accessible animated React alert dialog for shadcn/ui with a destructive confirm flow, async loading actions and a session-timeout countdown.",
    keywords: ["alert dialog", "confirm dialog", "destructive action", "delete confirmation", "session timeout", "modal", "radix alert dialog", "shadcn"],
  },
  {
    name: "Toast",
    slug: "toast",
    description:
      "Animated React toast notifications for shadcn/ui on Sonner, with morphing loading-to-success icons, duration progress and an undo toast.",
    keywords: ["toast", "notification", "sonner", "snackbar", "undo toast", "promise toast", "shadcn toast", "alert"],
  },
  {
    name: "Skeleton",
    slug: "skeleton",
    description:
      "Shimmering React skeleton loaders for shadcn/ui with ready-made text, avatar, card and table presets and a skeleton-to-content crossfade.",
    keywords: ["skeleton", "skeleton loader", "loading placeholder", "shimmer", "content loader", "loading state", "shadcn skeleton"],
  },
  {
    name: "Hover Card",
    slug: "hover-card",
    description:
      "Animated React hover card for shadcn/ui with spring profile previews and link preview panels that grow from the trigger.",
    keywords: ["hover card", "profile card", "user preview", "link preview", "popover", "radix hover card", "shadcn hover card"],
  },
];

export const components = [...list].sort((a, b) => a.name.localeCompare(b.name));

export const componentHref = (slug: string) => `/components/${slug}`;

export function getComponent(slug: string) {
  return components.find((c) => c.slug === slug) ?? null;
}

export function searchComponents(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return components;
  return components.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.keywords.some((k) => k.toLowerCase().includes(q))
  );
}

/** Old /components/<category>/<slug> URLs, kept only to redirect them. */
export const legacyCategorySlugs = [
  "shadcn-plus",
  "techy",
  "neon",
  "hacker",
  "glass",
  "text",
  "backgrounds",
] as const;
