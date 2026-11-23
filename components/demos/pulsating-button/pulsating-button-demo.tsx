import { Bell } from "lucide-react";
import { PulsatingButton } from "@/components/dusk/pulsating-button/pulsating-button";

export default function PulsatingButtonDemo() {
  return (
    <>
      <PulsatingButton size="lg">Join the waitlist</PulsatingButton>
      <PulsatingButton size="lg" variant="outline" pulseColor="rgb(255 255 255)">
        <Bell />
        Enable alerts
      </PulsatingButton>
    </>
  );
}
