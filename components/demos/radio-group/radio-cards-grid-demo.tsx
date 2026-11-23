import { Bike, Plane, Truck } from "lucide-react";
import { RadioCard, RadioCards } from "@/components/dusk/radio-group/radio-cards";

export default function RadioCardsGridDemo() {
  return (
    <RadioCards
      defaultValue="standard"
      name="shipping"
      aria-label="Shipping speed"
      className="w-full max-w-xl grid-cols-1 sm:grid-cols-3"
    >
      <RadioCard value="economy" icon={<Bike />} title="Economy" description="5–7 days · Free" />
      <RadioCard value="standard" icon={<Truck />} title="Standard" description="2–3 days · $4.99" />
      <RadioCard value="express" icon={<Plane />} title="Express" description="Next day · $14.99" />
    </RadioCards>
  );
}
