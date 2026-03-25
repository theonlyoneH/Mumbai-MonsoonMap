import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { floodZones } from "@/lib/mockData";
import { motion, AnimatePresence } from "framer-motion";

interface SearchBarProps {
  onSelectLocation: (lat: number, lng: number, id: string) => void;
}

const SearchBar = ({ onSelectLocation }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const results = query.length > 0
    ? floodZones.filter(z => z.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-md px-4">
      <div className="glass rounded-xl shadow-lg">
        <div className="flex items-center gap-3 px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Search area in Mumbai..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          {query && (
            <button onClick={() => { setQuery(""); setOpen(false); }}>
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>
      <AnimatePresence>
        {open && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="glass rounded-xl shadow-lg mt-2 overflow-hidden"
          >
            {results.map((zone) => (
              <button
                key={zone.id}
                onClick={() => {
                  onSelectLocation(zone.lat, zone.lng, zone.id);
                  setQuery(zone.name);
                  setOpen(false);
                }}
                className="w-full px-4 py-3 text-left text-sm hover:bg-accent/50 transition-colors flex items-center justify-between"
              >
                <span>{zone.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  zone.riskLevel === "high" ? "bg-risk-high/10 text-risk-high" :
                  zone.riskLevel === "medium" ? "bg-risk-medium/10 text-risk-medium" :
                  "bg-risk-low/10 text-risk-low"
                }`}>
                  {zone.riskLevel}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
