import { FlickeringGrid } from "@/components/dusk/flickering-grid/flickering-grid";

export default function FlickeringGridText() {
  return (
    <div className="relative h-64 w-full overflow-hidden rounded-xl border border-white/10 bg-background">
      <FlickeringGrid text="DUSK" squareSize={3} gap={3} maxOpacity={0.6} flickerChance={0.3} fontWeight={900} />
      {/* The canvas is decorative, so the word is repeated for assistive tech. */}
      <h3 className="sr-only">Dusk</h3>
    </div>
  );
}
