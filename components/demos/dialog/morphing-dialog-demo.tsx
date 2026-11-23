import { Mountain } from "lucide-react";
import {
  MorphingDialog,
  MorphingDialogClose,
  MorphingDialogContent,
  MorphingDialogDescription,
  MorphingDialogMedia,
  MorphingDialogSubtitle,
  MorphingDialogTitle,
  MorphingDialogTrigger,
} from "@/components/dusk/dialog/morphing-dialog";

function Artwork() {
  return (
    <div className="grid size-full place-items-center bg-[radial-gradient(120%_90%_at_20%_0%,color-mix(in_oklab,var(--color-primary)_55%,transparent),transparent_60%),linear-gradient(160deg,#0f2a24,#05100d)]">
      <Mountain className="size-10 text-white/80" aria-hidden />
    </div>
  );
}

export default function MorphingDialogDemo() {
  return (
    <MorphingDialog>
      <MorphingDialogTrigger className="w-64">
        <MorphingDialogMedia className="h-40">
          <Artwork />
        </MorphingDialogMedia>
        <span className="block p-4">
          <MorphingDialogTitle>Northern Ridge</MorphingDialogTitle>
          <MorphingDialogSubtitle>Photo series · 12 shots</MorphingDialogSubtitle>
        </span>
      </MorphingDialogTrigger>
      <MorphingDialogContent>
        <MorphingDialogMedia className="h-64">
          <Artwork />
        </MorphingDialogMedia>
        <div className="p-6">
          <MorphingDialogTitle>Northern Ridge</MorphingDialogTitle>
          <MorphingDialogSubtitle>Photo series · 12 shots</MorphingDialogSubtitle>
          <MorphingDialogDescription className="mt-4 space-y-3">
            <p>
              Shot over three mornings above the tree line, chasing the few minutes when the fog
              lifts off the valley and the ridge catches the first light.
            </p>
            <p>Press Escape, click outside or use the close button — focus returns to the card.</p>
          </MorphingDialogDescription>
        </div>
        <MorphingDialogClose />
      </MorphingDialogContent>
    </MorphingDialog>
  );
}
