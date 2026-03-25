import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, MapPin, Trash2 } from "lucide-react";
import { floodZones } from "@/lib/mockData";

const Saved = () => {
  const [savedIds, setSavedIds] = useState(["1", "3", "7", "11"]);
  const saved = floodZones.filter((z) => savedIds.includes(z.id));

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 glass border-b border-border/50 px-6 py-4 flex items-center gap-4">
        <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-semibold">Saved Locations</h1>
      </header>

      <div className="max-w-lg mx-auto p-6 space-y-3">
        {saved.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No saved locations yet.</p>
        ) : (
          saved.map((zone) => (
            <div key={zone.id} className="bg-card rounded-xl border border-border/50 p-4 flex items-center justify-between">
              <Link to={`/area/${zone.id}`} className="flex items-center gap-3 flex-1">
                <MapPin className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm font-medium">{zone.name}</p>
                  <span className={`text-xs capitalize ${
                    zone.riskLevel === "high" ? "text-risk-high" :
                    zone.riskLevel === "medium" ? "text-risk-medium" : "text-risk-low"
                  }`}>{zone.riskLevel} risk</span>
                </div>
              </Link>
              <button
                onClick={() => setSavedIds((ids) => ids.filter((i) => i !== zone.id))}
                className="text-muted-foreground hover:text-destructive transition-colors p-1"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Saved;
