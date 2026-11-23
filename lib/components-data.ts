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
      "Animated React card components for shadcn/ui: a subtle cursor-following border highlight, 3D tilt and a shimmer skeleton loading card, built with Motion and Tailwind CSS.",
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
      "A flowing data stream effect for React: faint packets move along lanes on a high-DPI canvas, a lightweight hero accent.",
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
      "A dot grid background for React with a subtle cursor-following spotlight that lights up nearby dots.",
    keywords: ["dot grid", "dot pattern", "spotlight", "mouse follow", "background", "motion values"],
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
      "React glassmorphism card with Tailwind backdrop blur, a hairline border, film grain and optional 3D tilt.",
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
      "Neon text effect for React with one soft text-shadow and optional breathe or flicker animation, staying real, selectable and SEO-friendly.",
    keywords: ["glow text", "neon text", "text shadow", "text effect", "flicker", "heading", "tailwind"],
  },
  {
    name: "Hologram Card",
    slug: "hologram-card",
    description:
      "A holographic React card with faint iridescent foil, a rainbow rim and a gentle 3D tilt toward the cursor, built with Motion.",
    keywords: ["hologram card", "holographic effect", "3d tilt card", "iridescent", "framer motion", "react", "tailwind"],
  },
  {
    name: "Ice Input",
    slug: "ice-input",
    description:
      "Frosted-glass React input with a frost-spread focus animation, built on the DuskUI Input.",
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
      "An animated meteor shower background for React with soft shooting stars and fading tails.",
    keywords: ["meteors", "shooting stars", "meteor shower", "night sky", "animated background", "stars", "card background"],
  },
  {
    name: "Neon Border",
    slug: "neon-border",
    description:
      "Animated neon border for any React element, with a thin travelling light beam, an adjustable glow and hover trigger.",
    keywords: ["neon border", "animated border", "glowing border", "border beam", "conic gradient", "card", "tailwind"],
  },
  {
    name: "Neon Button",
    slug: "neon-button",
    description:
      "React neon button with one soft glow that brightens on hover and focus, a flicker-on effect, any color and a width-stable loading state.",
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
      "Accessible React loading spinner with a plasma effect made of gooey orbiting blobs.",
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
      "An animated tech grid background for React with faint lines, a scan line and a retro perspective floor.",
    keywords: ["grid background", "retro grid", "perspective grid", "cyberpunk grid", "react", "tailwind"],
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
      "A responsive bento grid for React and Tailwind CSS with hover-reveal call-to-action cards and zooming background visuals for feature sections.",
    keywords: ["bento grid", "bento", "feature grid", "feature section", "landing page", "card grid", "hover reveal", "motion"],
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
  {
    name: "Confetti",
    slug: "confetti",
    description:
      "Dependency-free React canvas confetti with an imperative confetti() helper and a ConfettiButton, with custom origin, spread, colors and shapes, skipped under reduced motion.",
    keywords: ["confetti", "celebration", "canvas confetti", "confetti button", "party", "success animation", "burst", "fireworks"],
  },
  {
    name: "Sparkles Text",
    slug: "sparkles-text",
    description:
      "React sparkling text effect where small stars pop in and out around a heading, deterministic and hydration-safe, with color and density props.",
    keywords: ["sparkles text", "sparkle effect", "glitter text", "animated heading", "text effect", "stars", "magic text", "motion"],
  },
  {
    name: "Animated Beam",
    slug: "animated-beam",
    description:
      "Animated SVG beam for React that connects two elements with a curved path and a gradient pulse, ideal for integration and data-flow diagrams.",
    keywords: ["animated beam", "svg beam", "connector line", "integration diagram", "data flow", "gradient pulse", "how it works", "motion"],
  },
  {
    name: "Orbiting Circles",
    slug: "orbiting-circles",
    description:
      "React orbiting icons that travel around a centre on multiple circular rings, upright and evenly spaced, with pause on hover and reduced-motion support.",
    keywords: ["orbiting circles", "orbit animation", "orbiting icons", "tech stack", "integrations", "circular animation", "solar system", "motion"],
  },
  {
    name: "Lens",
    slug: "lens",
    description:
      "React magnifying glass lens that follows the cursor over images or any content with configurable zoom and size, plus keyboard and touch support.",
    keywords: ["lens", "magnifier", "magnifying glass", "image zoom", "zoom on hover", "product image", "loupe", "motion values"],
  },
  {
    name: "Theme Toggle",
    slug: "theme-toggle",
    description:
      "Animated dark mode toggle for React with a sun-to-moon morphing icon and a circular View Transitions reveal that works with next-themes or any element.",
    keywords: ["theme toggle", "dark mode toggle", "light dark switch", "view transitions", "next-themes", "sun moon icon", "react theme switcher"],
  },
  {
    name: "Morphing Text",
    slug: "morphing-text",
    description:
      "Morphing text animation for React where words melt into each other with a gooey SVG filter or blur crossfade, with no layout shift.",
    keywords: ["morphing text", "gooey text", "text morph", "blur text animation", "animated headline", "rotating words", "text effect"],
  },
  {
    name: "Expandable Card",
    slug: "expandable-card",
    description:
      "Expandable cards for React that morph into an accessible overlay panel with shared layout animations, built on Radix Dialog and Motion.",
    keywords: ["expandable card", "card to modal", "shared layout animation", "layoutId", "morphing card", "radix dialog", "framer motion card"],
  },
  {
    name: "Device Mockup",
    slug: "device-mockup",
    description:
      "Pure CSS Safari browser and iPhone mockups for React that wrap screenshots or live components, scale responsively and tilt in 3D.",
    keywords: ["device mockup", "iphone mockup", "browser mockup", "safari mockup", "phone frame", "screenshot frame", "css mockup"],
  },
  {
    name: "Pricing Table",
    slug: "pricing-table",
    description:
      "Animated React pricing table with a monthly/yearly toggle, rolling prices, a highlighted popular plan and accessible feature lists.",
    keywords: ["pricing table", "pricing cards", "pricing page", "monthly yearly toggle", "saas pricing", "animated pricing", "shadcn pricing"],
  },
  {
    name: "Command",
    slug: "command",
    description:
      "Animated React command menu and \u2318K command palette for shadcn/ui with cmdk filtering, a gliding highlight, recent items and nested pages.",
    keywords: ["command", "command palette", "cmdk", "cmd k", "ctrl k", "spotlight", "search", "launcher", "shadcn", "motion"],
  },
  {
    name: "Context Menu",
    slug: "context-menu",
    description:
      "Accessible animated React context menu for shadcn/ui that springs open from the cursor, with sub-menus, checkbox and radio items and a gliding highlight.",
    keywords: ["context menu", "right click menu", "right-click", "menu", "submenu", "radix", "shadcn", "motion"],
  },
  {
    name: "Navigation Menu",
    slug: "navigation-menu",
    description:
      "Animated React navigation menu and mega menu for shadcn/ui with a morphing viewport, direction-aware panel slides and a gliding hover highlight.",
    keywords: ["navigation menu", "mega menu", "nav menu", "header menu", "dropdown navigation", "navbar", "radix", "shadcn", "motion"],
  },
  {
    name: "Sheet",
    slug: "sheet",
    description:
      "Animated React sheet and side drawer for shadcn/ui with stacked nested sheets, drag-to-close side panels and a fade-only reduced-motion mode.",
    keywords: ["sheet", "drawer", "side panel", "side sheet", "slide over", "off-canvas", "modal", "radix", "shadcn", "motion"],
  },
  {
    name: "Scroll Area",
    slug: "scroll-area",
    description:
      "Custom React scroll area for shadcn/ui with fading scrollbars, edge fade masks that appear only when there's more content, and a scroll progress bar.",
    keywords: ["scroll area", "scrollbar", "custom scrollbar", "scroll fade", "scroll shadow", "scroll progress", "reading progress", "radix", "shadcn", "motion"],
  },
  {
    name: "Table",
    slug: "table",
    description:
      "Animated React table and data table for shadcn/ui with sorting, filtering, row selection, pagination and expandable rows, built with Motion.",
    keywords: ["react table", "shadcn table", "data table", "sortable table", "expandable rows", "tailwind table", "motion"],
  },
  {
    name: "Calendar",
    slug: "calendar",
    description:
      "Animated React calendar, date picker and date range picker with presets, built on react-day-picker v10, shadcn/ui and Motion.",
    keywords: ["react calendar", "shadcn calendar", "date picker", "date range picker", "react-day-picker", "tailwind calendar"],
  },
  {
    name: "Kbd",
    slug: "kbd",
    description:
      "React keyboard key (Kbd) components styled as keycaps, with an animated shortcut display that lights up as you press \u2318K or Ctrl+K.",
    keywords: ["kbd", "keyboard shortcut", "react hotkeys", "keycap", "shadcn kbd", "useShortcut"],
  },
  {
    name: "Empty State",
    slug: "empty",
    description:
      "React empty state component with shadcn/ui's Empty API and an animated empty state with a floating illustration, built with Motion.",
    keywords: ["empty state", "react empty state", "shadcn empty", "no results", "zero state", "tailwind"],
  },
  {
    name: "Spinner",
    slug: "spinner",
    description:
      "Accessible React loading spinner plus five animated Motion loaders (dots, bars, ring, orbit, pulse) that respect reduced motion.",
    keywords: ["react spinner", "loading spinner", "loader", "shadcn spinner", "tailwind loader", "loading indicator"],
  },
  {
    name: "Menubar",
    slug: "menubar",
    description:
      "Animated React menubar for shadcn/ui with desktop-app style menus, sub-menus, checkbox and radio items and a gliding highlight.",
    keywords: ["menubar", "menu bar", "app menu", "desktop menu", "radix menubar", "shadcn menubar", "motion"],
  },
  {
    name: "Resizable",
    slug: "resizable",
    description:
      "Resizable React panels for shadcn/ui on react-resizable-panels v4, with handles that highlight while dragging and an IDE-style collapsible layout.",
    keywords: ["resizable", "resizable panels", "split pane", "panel group", "ide layout", "shadcn resizable", "react-resizable-panels"],
  },
  {
    name: "Collapsible",
    slug: "collapsible",
    description:
      "Animated React collapsible for shadcn/ui with spring height, rotating chevron and a show-more block for long content.",
    keywords: ["collapsible", "expand collapse", "show more", "read more", "disclosure", "radix collapsible", "shadcn"],
  },
  {
    name: "Drawer",
    slug: "drawer",
    description:
      "Animated React drawer for shadcn/ui on vaul, with snap points and a responsive dialog that becomes a drawer on mobile.",
    keywords: ["drawer", "bottom sheet", "vaul", "responsive dialog", "snap points", "mobile drawer", "shadcn drawer"],
  },
  {
    name: "Chart",
    slug: "chart",
    description:
      "Animated React charts for shadcn/ui on Recharts v3 \u2014 area, bar and radial stat charts with themed tooltips.",
    keywords: ["chart", "react charts", "recharts", "area chart", "bar chart", "radial chart", "dashboard", "shadcn chart"],
  },
  {
    name: "Field",
    slug: "field",
    description:
      "Accessible React form fields for shadcn/ui with labels, descriptions, animated error messages and a validated sign-up form.",
    keywords: ["field", "form field", "label", "form validation", "error message", "react form", "shadcn field"],
  },
  {
    name: "Input Group",
    slug: "input-group",
    description:
      "React input group for shadcn/ui with icons, buttons and text addons, plus copy and URL inputs.",
    keywords: ["input group", "input addon", "input with button", "copy input", "url input", "shadcn input group", "form"],
  },
  {
    name: "Button Group",
    slug: "button-group",
    description:
      "React button group for shadcn/ui that joins buttons, with an animated selection indicator and a split button.",
    keywords: ["button group", "segmented buttons", "split button", "toolbar", "shadcn button group", "joined buttons"],
  },
  {
    name: "Number Input",
    slug: "number-input",
    description:
      "Animated React number input with stepper buttons, rolling digits, press-and-hold repeat and keyboard support.",
    keywords: ["number input", "stepper", "quantity input", "spinbutton", "increment decrement", "counter input", "react"],
  },
  {
    name: "Tag Input",
    slug: "tag-input",
    description:
      "Animated React tag input with chips that pop in, keyboard removal, duplicate detection and suggestions.",
    keywords: ["tag input", "chips input", "tags", "multi value input", "keywords input", "token input", "react"],
  },
  {
    name: "Hyper Text",
    slug: "hyper-text",
    description:
      "React hyper text effect where letters scramble and decode into place on hover or in view, with no layout shift.",
    keywords: ["hyper text", "text scramble", "decode text", "glitch text", "hacker text", "text effect", "motion"],
  },
  {
    name: "Text Animate",
    slug: "text-animate",
    description:
      "React text animation with blur, fade, slide and scale presets by character, word or line, SEO-friendly.",
    keywords: ["text animate", "text animation", "blur in text", "staggered text", "headline animation", "text effect", "motion"],
  },
  {
    name: "Flip Words",
    slug: "flip-words",
    description:
      "React flip words effect where a word in a headline flips in 3D to the next one with a springy width.",
    keywords: ["flip words", "rotating words", "3d text", "animated headline", "word switcher", "text effect", "motion"],
  },
  {
    name: "Highlighter",
    slug: "highlighter",
    description:
      "Hand-drawn style React highlighter that marks, underlines or circles inline text as it scrolls into view.",
    keywords: ["highlighter", "text highlight", "underline animation", "marker", "rough notation", "annotate text", "motion"],
  },
  {
    name: "Aurora Text",
    slug: "aurora-text",
    description:
      "React aurora gradient text effect with a slowly moving multi-colour fill on real, selectable text.",
    keywords: ["aurora text", "gradient text", "animated gradient", "colorful text", "headline", "text effect", "tailwind"],
  },
  {
    name: "Blur Fade",
    slug: "blur-fade",
    description:
      "React blur fade entrance animation that reveals content from blur and offset as it scrolls into view, with stagger.",
    keywords: ["blur fade", "fade in", "scroll animation", "entrance animation", "reveal on scroll", "stagger", "motion"],
  },
  {
    name: "Custom Cursor",
    slug: "custom-cursor",
    description:
      "Smooth custom cursor for React with a trailing ring that grows over links and buttons and shows hover labels.",
    keywords: ["custom cursor", "cursor follower", "mouse follower", "cursor animation", "pointer", "interactive", "motion"],
  },
  {
    name: "Scratch to Reveal",
    slug: "scratch-to-reveal",
    description:
      "React scratch card component that reveals hidden content as users scratch, with an accessible reveal button.",
    keywords: ["scratch to reveal", "scratch card", "reveal", "coupon", "prize", "canvas", "interactive"],
  },
  {
    name: "Progressive Blur",
    slug: "progressive-blur",
    description:
      "React progressive blur that fades content into a smooth layered backdrop blur at any edge of a scroll area.",
    keywords: ["progressive blur", "blur edge", "backdrop blur", "fade edge", "scroll fade", "glass", "tailwind"],
  },
  {
    name: "File Tree",
    slug: "file-tree",
    description:
      "Accessible animated React file tree with keyboard navigation, file icons and expandable folders.",
    keywords: ["file tree", "tree view", "file explorer", "folder tree", "sidebar tree", "treeview", "react"],
  },
  {
    name: "Shine Border",
    slug: "shine-border",
    description:
      "Animated shine border for React that sweeps a soft multi-colour sheen around any card or element.",
    keywords: ["shine border", "animated border", "gradient border", "card border", "glow border", "border animation", "tailwind"],
  },
  {
    name: "Rainbow Button",
    slug: "rainbow-button",
    description:
      "React rainbow button with an animated gradient border, built on the shadcn-compatible DuskUI Button.",
    keywords: ["rainbow button", "gradient button", "glow button", "animated button", "cta button", "shadcn button", "tailwind"],
  },
  {
    name: "Pulsating Button",
    slug: "pulsating-button",
    description:
      "React pulsating button with expanding pulse rings that draw attention to a call to action.",
    keywords: ["pulsating button", "pulse button", "attention button", "cta", "animated button", "ripple rings", "tailwind"],
  },
  {
    name: "Interactive Hover Button",
    slug: "interactive-hover-button",
    description:
      "React button where a dot expands to fill the button on hover while the label swaps with a sliding arrow.",
    keywords: ["interactive hover button", "hover button", "animated button", "arrow button", "cta", "pill button", "tailwind"],
  },
  {
    name: "Moving Border",
    slug: "moving-border",
    description:
      "React moving border effect where a soft beam travels around a button or card's rounded edge.",
    keywords: ["moving border", "border beam", "animated border", "glowing border", "button border", "card border", "motion"],
  },
  {
    name: "Retro Grid",
    slug: "retro-grid",
    description:
      "Synthwave retro grid background for React with a faint perspective floor scrolling toward the horizon and an optional sun.",
    keywords: ["retro grid", "synthwave", "perspective grid", "80s background", "vaporwave", "animated background", "tailwind"],
  },
  {
    name: "Flickering Grid",
    slug: "flickering-grid",
    description:
      "Canvas flickering grid background for React with softly flickering squares and an optional text mask.",
    keywords: ["flickering grid", "grid background", "canvas", "pixel grid", "animated background", "text mask", "react"],
  },
  {
    name: "Ripple",
    slug: "ripple",
    description:
      "Animated ripple background for React with concentric circles that pulse outward, plus click-to-ripple.",
    keywords: ["ripple", "ripple effect", "pulse circles", "concentric circles", "animated background", "click ripple", "tailwind"],
  },
  {
    name: "Wavy Background",
    slug: "wavy-background",
    description:
      "Animated wavy background for React with layered flowing noise waves drawn on canvas.",
    keywords: ["wavy background", "waves", "canvas animation", "noise", "animated background", "hero background", "react"],
  },
  {
    name: "Lamp",
    slug: "lamp",
    description:
      "Lamp light effect for React where light cones widen from a thin bar above your heading.",
    keywords: ["lamp", "lamp effect", "spotlight", "light cone", "hero section", "glow", "motion"],
  },
  {
    name: "Globe",
    slug: "globe",
    description:
      "Interactive 3D globe for React on cobe with markers, auto-rotation and drag with spring momentum.",
    keywords: ["globe", "3d globe", "cobe", "world map", "webgl", "markers", "interactive"],
  },
  {
    name: "Icon Cloud",
    slug: "icon-cloud",
    description:
      "Interactive 3D icon cloud for React that rotates a sphere of icons and logos you can drag to steer.",
    keywords: ["icon cloud", "tag cloud", "3d sphere", "tech stack", "logos", "interactive", "motion"],
  },
  {
    name: "Card Stack",
    slug: "card-stack",
    description:
      "Swipeable React card stack where the top card is dragged or flicked away and the rest spring forward.",
    keywords: ["card stack", "swipe cards", "tinder cards", "stacked cards", "drag", "carousel", "motion"],
  },
  {
    name: "Countdown",
    slug: "countdown",
    description:
      "Animated React countdown timer with rolling digits for days, hours, minutes and seconds, hydration-safe.",
    keywords: ["countdown", "countdown timer", "timer", "launch countdown", "flip clock", "rolling digits", "react"],
  },
  {
    name: "Vanish Input",
    slug: "vanish-input",
    description:
      "React input with cycling placeholders whose text dissolves into particles on submit.",
    keywords: ["vanish input", "placeholder animation", "search input", "ai prompt", "particles", "input effect", "motion"],
  },
  {
    name: "Image Compare",
    slug: "image-compare",
    description:
      "Accessible before/after image comparison slider for React with drag, touch and keyboard control.",
    keywords: ["image compare", "before after", "comparison slider", "image slider", "reveal", "react", "accessible"],
  },
  {
    name: "Sortable List",
    slug: "sortable-list",
    description:
      "Drag-to-reorder React list on Motion Reorder with handles, layout springs and keyboard reordering.",
    keywords: ["sortable list", "drag and drop", "reorder", "drag to sort", "list", "motion", "accessible"],
  },
  {
    name: "Kanban",
    slug: "kanban",
    description:
      "Dependency-free React kanban board with drag between columns, reordering and keyboard moves.",
    keywords: ["kanban", "kanban board", "drag and drop", "task board", "trello", "columns", "react"],
  },
  {
    name: "Rating",
    slug: "rating",
    description:
      "Accessible animated React star rating with hover preview, half stars and read-only mode.",
    keywords: ["rating", "star rating", "stars", "review", "feedback", "input", "react"],
  },
  {
    name: "Stepper",
    slug: "stepper",
    description:
      "Animated React stepper for multi-step forms with a progress line, direction-aware panels and validation.",
    keywords: ["stepper", "multi step form", "wizard", "steps", "onboarding", "progress", "react"],
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
