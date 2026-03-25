import { motion, AnimatePresence } from "framer-motion";
import { X, Droplets, AlertTriangle, Waves } from "lucide-react";
import { FloodZone } from "@/lib/mockData";
import { useNavigate } from "react-router-dom";

interface BottomDrawerProps {
  zone: FloodZone | null;
  onClose: () => void;
}

const BottomDrawer = ({ zone, onClose }: BottomDrawerProps) => {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {zone && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="absolute bottom-0 left-0 right-0 z-[1000] px-4 pb-4"
        >
          <div className="glass rounded-xl shadow-2xl max-w-lg mx-auto">
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-base">{zone.name}</h3>
                  <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 font-medium ${
                    zone.riskLevel === "high" ? "bg-risk-high/10 text-risk-high" :
                    zone.riskLevel === "medium" ? "bg-risk-medium/10 text-risk-medium" :
                    "bg-risk-low/10 text-risk-low"
                  }`}>
                    {zone.riskLevel.charAt(0).toUpperCase() + zone.riskLevel.slice(1)} Risk
                  </span>
                </div>
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="flex items-center gap-2 bg-secondary/50 rounded-lg p-3">
                  <Waves className="h-4 w-4 text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Water Level</p>
                    <p className="text-sm font-medium">{zone.waterLevel}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-secondary/50 rounded-lg p-3">
                  <Droplets className="h-4 w-4 text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Drainage</p>
                    <p className="text-sm font-medium">{zone.drainageCondition}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-secondary/50 rounded-lg p-3">
                  <AlertTriangle className="h-4 w-4 text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Elevation</p>
                    <p className="text-sm font-medium">{zone.elevation}m</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate(`/area/${zone.id}`)}
                className="mt-4 w-full bg-primary text-primary-foreground rounded-lg py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BottomDrawer;
