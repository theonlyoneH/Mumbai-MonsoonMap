import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Droplets, Mountain, PipetteIcon, AlertTriangle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

interface FiltersState {
  rainfallIntensity: number;
  showElevation: boolean;
  showDrainage: boolean;
  riskLevels: { low: boolean; medium: boolean; high: boolean };
}

interface FiltersPanelProps {
  open: boolean;
  onToggle: () => void;
  filters: FiltersState;
  onFiltersChange: (filters: FiltersState) => void;
}

const FiltersPanel = ({ open, onToggle, filters, onFiltersChange }: FiltersPanelProps) => {
  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute top-20 left-4 z-[1000] w-72"
          >
            <div className="glass rounded-xl shadow-lg p-5 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Filters</h3>
                <button onClick={onToggle} className="text-muted-foreground hover:text-foreground transition-colors">
                  <ChevronLeft className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Droplets className="h-4 w-4 text-primary" />
                  <span>Rainfall Intensity</span>
                </div>
                <Slider
                  value={[filters.rainfallIntensity]}
                  onValueChange={([v]) => onFiltersChange({ ...filters, rainfallIntensity: v })}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <span className="text-xs text-muted-foreground">{filters.rainfallIntensity}mm/hr</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Mountain className="h-4 w-4 text-primary" />
                  <span>Elevation Layer</span>
                </div>
                <Switch
                  checked={filters.showElevation}
                  onCheckedChange={(v) => onFiltersChange({ ...filters, showElevation: v })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <PipetteIcon className="h-4 w-4 text-primary" />
                  <span>Drainage Proximity</span>
                </div>
                <Switch
                  checked={filters.showDrainage}
                  onCheckedChange={(v) => onFiltersChange({ ...filters, showDrainage: v })}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-primary" />
                  <span>Risk Level</span>
                </div>
                <div className="flex gap-2">
                  {(["low", "medium", "high"] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() =>
                        onFiltersChange({
                          ...filters,
                          riskLevels: { ...filters.riskLevels, [level]: !filters.riskLevels[level] },
                        })
                      }
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                        filters.riskLevels[level]
                          ? level === "high" ? "bg-risk-high text-white"
                            : level === "medium" ? "bg-risk-medium text-white"
                            : "bg-risk-low text-white"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!open && (
        <button
          onClick={onToggle}
          className="absolute top-20 left-4 z-[1000] glass rounded-xl shadow-lg p-3 hover:bg-accent/50 transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </>
  );
};

export default FiltersPanel;
export type { FiltersState };
