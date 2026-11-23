import { CyberButton } from "@/components/dusk/hacker/cyber-button";

export default function CyberButtonCornersDemo() {
  return (
    <>
      <CyberButton variant="outline" corners="diagonal">
        Diagonal
      </CyberButton>
      <CyberButton variant="outline" corners="reverse">
        Reverse
      </CyberButton>
      <CyberButton variant="outline" corners="all" cut={8}>
        All corners
      </CyberButton>
      <CyberButton corners="diagonal" cut={16} size="lg">
        Deep cut
      </CyberButton>
    </>
  );
}
