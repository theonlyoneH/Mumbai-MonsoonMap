import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Droplets, Waves } from "lucide-react";
import { MapContainer, TileLayer } from "react-leaflet";
import { Slider } from "@/components/ui/slider";
import { MUMBAI_CENTER, heatmapData } from "@/lib/mockData";
import HeatmapLayer from "@/components/map/HeatmapLayer";

const Simulation = () => {
  const [rainfall, setRainfall] = useState(50);
  const [drainageEff, setDrainageEff] = useState(50);

  const simHeatmap = useMemo(() => {
    const rainfallFactor = rainfall / 50;
    const drainageFactor = 1 - drainageEff / 100;
    return heatmapData.map(([lat, lng, intensity]) => [
      lat, lng, Math.min(1, intensity * rainfallFactor * (1 + drainageFactor))
    ] as [number, number, number]);
  }, [rainfall, drainageEff]);

  return (
    <div className="h-screen flex flex-col">
      <header className="sticky top-0 z-10 glass border-b border-border/50 px-6 py-4 flex items-center gap-4">
        <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-semibold">Flood Simulation</h1>
      </header>

      <div className="flex-1 relative">
        <MapContainer center={MUMBAI_CENTER} zoom={12} className="h-full w-full" zoomControl={false}>
          <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
          <HeatmapLayer points={simHeatmap} />
        </MapContainer>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-sm px-4">
          <div className="glass rounded-xl shadow-lg p-5 space-y-5">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Droplets className="h-4 w-4 text-primary" />
                <span>Rainfall Intensity</span>
                <span className="ml-auto text-xs text-muted-foreground">{rainfall}mm/hr</span>
              </div>
              <Slider value={[rainfall]} onValueChange={([v]) => setRainfall(v)} max={100} step={5} />
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Waves className="h-4 w-4 text-primary" />
                <span>Drainage Efficiency</span>
                <span className="ml-auto text-xs text-muted-foreground">{drainageEff}%</span>
              </div>
              <Slider value={[drainageEff]} onValueChange={([v]) => setDrainageEff(v)} max={100} step={5} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simulation;
