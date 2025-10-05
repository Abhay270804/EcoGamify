import { SimulationGame } from "@/components/simulation/SimulationGame";
import { SimulationGuide } from "@/components/simulation/SimulationGuide";

export default function SimulationPage() {
  return (
    <div className="container mx-auto space-y-10 py-10">
      <SimulationGuide />
      <SimulationGame />
    </div>
  );
}
