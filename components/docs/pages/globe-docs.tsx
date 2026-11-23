import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import GlobeDemo from "@/components/demos/globe/globe-demo";
import GlobeArcs from "@/components/demos/globe/globe-arcs";
import GlobeColors from "@/components/demos/globe/globe-colors";

const demo = (file: string) => `components/demos/globe/${file}`;

const config: DocConfig = {
  title: "Globe",
  intro:
    "An interactive 3D globe for React built on WebGL with cobe: pin markers by latitude and longitude, draw arcs between cities, and let visitors drag it around with spring momentum. Neutral land dots with mint markers by default, sharp on high-DPI screens, responsive, and paused whenever it's off-screen.",
  tags: ["WebGL", "Markers & arcs", "Drag with momentum", "Keyboard rotation", "Pauses off-screen", "Reduced-motion safe"],
  hero: { Demo: GlobeDemo, file: demo("globe-demo.tsx"), minHeight: 560 },
  install: {
    registry: "globe",
    source: "components/dusk/globe/globe.tsx",
    deps: "cobe motion",
    note: (
      <>
        The globe is square and fills the width of its parent up to <Code>max-w-[600px]</Code>; override it with{" "}
        <Code>className</Code>. Colors accept any CSS color, including theme variables like{" "}
        <Code>var(--color-primary)</Code>.
      </>
    ),
  },
  usage: {
    filename: "network.tsx",
    code: `import { Globe } from "@/components/dusk/globe/globe"

export function Network() {
  return (
    <Globe
      className="max-w-md"
      markers={[
        { location: [37.77, -122.42], label: "San Francisco" },
        { location: [51.51, -0.13], label: "London" },
        { location: [35.68, 139.65], size: 0.08, label: "Tokyo" },
      ]}
    />
  )
}`,
  },
  examples: [
    {
      id: "arcs",
      title: "Arcs",
      description: (
        <>
          Pass <Code>arcs</Code> with <Code>from</Code> and <Code>to</Code> coordinates to draw routes. Each marker and arc
          can set its own <Code>color</Code>; <Code>phi</Code> and <Code>theta</Code> set the starting rotation and tilt.
        </>
      ),
      Demo: GlobeArcs,
      file: demo("globe-arcs.tsx"),
      minHeight: 380,
    },
    {
      id: "colors",
      title: "Colors and static globes",
      description: (
        <>
          Retint with <Code>baseColor</Code>, <Code>glowColor</Code> and <Code>markerColor</Code>. Set{" "}
          <Code>autoRotate</Code> and <Code>draggable</Code> to <Code>false</Code> for a still globe; the render loop then
          stops entirely after the first frame.
        </>
      ),
      Demo: GlobeColors,
      file: demo("globe-colors.tsx"),
      minHeight: 340,
    },
  ],
  api: {
    intro: (
      <>
        Any other <Code>div</Code> prop is passed to the root. Markers and arcs update in place without rebuilding the
        WebGL context; changing a color, <Code>phi</Code>, <Code>theta</Code> or the map settings rebuilds it.
      </>
    ),
    props: [
      { name: "markers", type: "GlobeMarker[]", default: "[]", description: "Points to pin: { location: [lat, lng], size?, color?, label? }." },
      { name: "arcs", type: "GlobeArc[]", default: "[]", description: "Curved routes: { from: [lat, lng], to: [lat, lng], color? }." },
      { name: "autoRotate", type: "boolean", default: "true", description: "Spin on its own. Always off under reduced motion." },
      { name: "speed", type: "number", default: "0.2", description: "Auto-rotation speed in radians per second." },
      { name: "draggable", type: "boolean", default: "true", description: "Rotate by dragging (with momentum) and with the arrow keys." },
      { name: "phi", type: "number", default: "0", description: "Starting longitude rotation in radians." },
      { name: "theta", type: "number", default: "0.25", description: "Tilt toward the viewer in radians." },
      { name: "baseColor", type: "string", default: '"oklch(0.4 0 0)"', description: "Color of the land dots." },
      { name: "markerColor", type: "string", default: '"var(--color-primary)"', description: "Default marker color." },
      { name: "glowColor", type: "string", default: '"oklch(0.18 0 0)"', description: "Soft rim light. Keep it close to the background." },
      { name: "arcColor", type: "string", default: '"oklch(0.7 0 0)"', description: "Default arc color." },
      { name: "dark", type: "number", default: "1", description: "1 for a dark globe, 0 for a light one." },
      { name: "diffuse", type: "number", default: "1.2", description: "Lighting falloff toward the edges." },
      { name: "mapBrightness", type: "number", default: "6", description: "Brightness of the land dots." },
      { name: "mapSamples", type: "number", default: "16000", description: "Number of dots drawn for the map. Lower is lighter." },
      { name: "label", type: "string", default: '"Interactive globe"', description: "Accessible name." },
      { name: "fallback", type: "ReactNode", description: "Shown instead of the globe when WebGL is unavailable. Defaults to a soft CSS sphere." },
    ],
  },
  accessibility: [
    <>The globe has an accessible name (<Code>label</Code>), and markers with a <Code>label</Code> are listed for screen readers.</>,
    "When draggable it is focusable: the arrow keys rotate and tilt it (hold Shift for bigger steps).",
    "With prefers-reduced-motion it never auto-rotates and drags move it directly, without momentum.",
    "Rendering stops while the globe is off-screen or the tab is hidden, and the WebGL context is released on unmount.",
    "Without WebGL a static fallback keeps the layout intact.",
  ],
};

export function GlobeDocs() {
  return <ComponentDocs config={config} />;
}
