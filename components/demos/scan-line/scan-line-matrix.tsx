import { MatrixRain } from "@/components/dusk/hacker/matrix-rain";
import { ScanLine } from "@/components/dusk/hacker/scan-line";

export default function ScanLineMatrixDemo() {
  return (
    <ScanLine className="h-80 w-full rounded-lg bg-black" barDuration={6}>
      <MatrixRain fontSize={14} />
    </ScanLine>
  );
}
