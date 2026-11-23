import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import CarouselDemo from "@/components/demos/carousel/carousel-demo";
import CarouselMultipleDemo from "@/components/demos/carousel/carousel-multiple";
import CarouselAutoplayDemo from "@/components/demos/carousel/carousel-autoplay";
import CoverflowCarouselDemo from "@/components/demos/carousel/coverflow-carousel-demo";

const demo = (file: string) => `components/demos/carousel/${file}`;

const config: DocConfig = {
  title: "Carousel",
  intro:
    "A dependency-free React carousel and slider built on Motion and Tailwind CSS: swipe or drag with momentum and snap-to-slide springs, Previous / Next buttons, dots, arrow keys, an endless loop and autoplay that pauses on hover and focus — plus a 3D coverflow variant. No Embla, fully accessible.",
  tags: ["No Embla", "Drag & swipe with momentum", "Loop & autoplay", "3D coverflow", "WAI-ARIA carousel", "prefers-reduced-motion"],
  hero: { Demo: CarouselDemo, file: demo("carousel-demo.tsx"), minHeight: 440 },
  install: {
    registry: "carousel",
    source: "components/dusk/carousel/carousel.tsx",
    deps: "motion lucide-react",
    note: (
      <>
        The Previous / Next and play buttons use the DuskUI Button, which the registry installs for you.
        Same part names as shadcn&apos;s Carousel, but no <Code>embla-carousel-react</Code>.
      </>
    ),
  },
  usage: {
    filename: "gallery.tsx",
    code: `import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/dusk/carousel/carousel"

export function Gallery({ photos }: { photos: { src: string; alt: string }[] }) {
  return (
    <Carousel loop aria-label="Gallery">
      <CarouselContent>
        {photos.map((photo) => (
          <CarouselItem key={photo.src}>
            <img src={photo.src} alt={photo.alt} className="rounded-xl" />
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="mt-4 flex items-center justify-between">
        <CarouselPrevious />
        <CarouselDots />
        <CarouselNext />
      </div>
    </Carousel>
  )
}`,
  },
  examples: [
    {
      id: "multiple",
      title: "Several per view",
      description: (
        <>
          Size slides with <Code>basis-*</Code> on <Code>CarouselItem</Code> and space them with{" "}
          <Code>gap-*</Code> on <Code>CarouselContent</Code>. Without <Code>loop</Code> the track stops at
          the last slide and dots cover only the reachable positions. Tabbing to a hidden card slides it
          into view, and a drag never clicks the link under it.
        </>
      ),
      Demo: CarouselMultipleDemo,
      file: demo("carousel-multiple.tsx"),
      minHeight: 360,
    },
    {
      id: "autoplay",
      title: "Autoplay",
      description: (
        <>
          <Code>autoplay</Code> takes <Code>true</Code> (every 5s) or an interval in ms. It pauses while
          hovered, dragged, focused from the keyboard or in a background tab, and stays off under reduced
          motion unless the user presses play. <Code>CarouselPlayToggle</Code> provides the pause control
          WCAG requires.
        </>
      ),
      Demo: CarouselAutoplayDemo,
      file: demo("carousel-autoplay.tsx"),
      minHeight: 300,
    },
  ],
  blocksIntro:
    "Variations built on Carousel. Each installs on its own and pulls in Carousel automatically.",
  blocks: [
    {
      id: "coverflow-carousel",
      title: "Coverflow Carousel",
      registry: "coverflow-carousel",
      source: "components/dusk/carousel/coverflow-carousel.tsx",
      deps: "motion",
      description: (
        <>
          The selected slide faces you while its neighbours tilt away, recede and dim — driven every frame by
          the track&apos;s motion value, so it follows your finger mid-drag. Swap <Code>CarouselItem</Code> for{" "}
          <Code>CoverflowItem</Code> and give slides a width smaller than the viewport. Build your own effects
          the same way with <Code>useCarouselSlide()</Code>.
        </>
      ),
      Demo: CoverflowCarouselDemo,
      file: demo("coverflow-carousel-demo.tsx"),
      minHeight: 380,
      props: [
        { name: "rotate", type: "number", default: "42", description: "Max tilt of side slides, in degrees (halved under reduced motion)." },
        { name: "depth", type: "number", default: "140", description: "How far side slides recede, in px." },
        { name: "overlap", type: "number", default: "0.18", description: "How much side slides tuck in behind the selected one (0–0.5)." },
        { name: "loop", type: "boolean", default: "true", description: "Loops by default; all other Carousel props apply (align is always center)." },
      ],
    },
  ],
  api: {
    intro: (
      <>
        <Code>Carousel</Code> also accepts any div prop. Parts: <Code>CarouselContent</Code> (viewport + track;{" "}
        <Code>className</Code> goes to the track, <Code>viewportClassName</Code> to the viewport),{" "}
        <Code>CarouselItem</Code>, <Code>CarouselPrevious</Code>, <Code>CarouselNext</Code>,{" "}
        <Code>CarouselDots</Code> and <Code>CarouselPlayToggle</Code>. Hooks: <Code>useCarousel()</Code> for
        custom controls and <Code>useCarouselSlide()</Code> for per-slide effects.
      </>
    ),
    props: [
      { name: "loop", type: "boolean", default: "false", description: "Wrap around endlessly. With too few slides to fill the loop, the arrows rewind instead." },
      { name: "align", type: '"start" | "center"', default: '"start"', description: "Where the selected slide rests." },
      { name: "autoplay", type: "boolean | number", default: "false", description: "Advance automatically: true for 5s, or an interval in ms." },
      { name: "defaultIndex", type: "number", default: "0", description: "Snap selected on mount." },
      { name: "onIndexChange", type: "(index: number) => void", description: "Called when the selected snap changes." },
      { name: "draggable", type: "boolean", default: "true", description: "Allow dragging and swiping." },
      { name: "aria-label", type: "string", default: '"Carousel"', description: "Names the carousel region. Make it specific." },
      { name: "useCarousel()", type: "{ selected, snapCount, canPrev, canNext, prev, next, goTo, playing, togglePlaying }", description: "State and actions for custom controls inside <Carousel>." },
      { name: "useCarouselSlide()", type: "{ index, count, progress: MotionValue<number> }", description: "Inside a CarouselItem: distance from rest in slides (0 = selected), updated per frame." },
    ],
  },
  accessibility: [
    "The root is a region with aria-roledescription=\"carousel\" and your aria-label; each slide is a group with aria-roledescription=\"slide\" and a label like “3 of 5”, per the WAI-ARIA carousel pattern.",
    "Left / Right arrow keys move between slides while focus is inside. Tabbing to a slide's content scrolls it into view, and the viewport uses overflow: clip so focus can't scroll it out of sync.",
    "Previous / Next use aria-disabled at the ends so focus is kept; dots mark the selected slide with aria-current and every control has aria-controls pointing at the track.",
    "User-initiated changes are announced politely (“Slide 2 of 5”); autoplay changes are not.",
    "Autoplay pauses on hover, keyboard focus, drag and hidden tabs, includes a pause / play button, and is off under prefers-reduced-motion until the user starts it.",
    "Under prefers-reduced-motion slides change instantly instead of springing.",
  ],
};

export function CarouselDocs() {
  return <ComponentDocs config={config} />;
}
