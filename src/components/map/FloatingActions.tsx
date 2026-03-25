import { Locate, Layers, RotateCcw } from "lucide-react";
import { MUMBAI_CENTER } from "@/lib/mockData";

interface FloatingActionsProps {
  onLocate: () => void;
  onToggleLayers: () => void;
  onReset: () => void;
}

const FloatingActions = ({ onLocate, onToggleLayers, onReset }: FloatingActionsProps) => {
  const buttons = [
    { icon: Locate, onClick: onLocate, label: "My location" },
    { icon: Layers, onClick: onToggleLayers, label: "Layers" },
    { icon: RotateCcw, onClick: onReset, label: "Reset" },
  ];

  return (
    <div className="absolute bottom-24 right-4 z-[1000] flex flex-col gap-2">
      {buttons.map(({ icon: Icon, onClick, label }) => (
        <button
          key={label}
          onClick={onClick}
          title={label}
          className="glass rounded-full p-3 shadow-lg hover:bg-accent/50 transition-colors"
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
};

export default FloatingActions;
