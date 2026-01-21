import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface ToggleDetailsButtonProps {
  showDetails: boolean;
  onToggle: () => void;
}

export const ToggleDetailsButton = ({
  showDetails,
  onToggle,
}: ToggleDetailsButtonProps) => {
  return (
    <div className="text-center mb-6">
      <Button
        onClick={onToggle}
        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg px-8 py-6 text-lg"
        size="lg"
      >
        {showDetails ? "Ocultar" : "Ver"} Análise Completa
        <ChevronDown
          className={`w-5 h-5 ml-2 transition-transform ${
            showDetails ? "rotate-180" : ""
          }`}
        />
      </Button>
    </div>
  );
};
