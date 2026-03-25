import { useState, useCallback, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import { floodZones, heatmapData, MUMBAI_CENTER, FloodZone } from "@/lib/mockData";
import HeatmapLayer from "@/components/map/HeatmapLayer";
import SearchBar from "@/components/map/SearchBar";
import FiltersPanel, { FiltersState } from "@/components/map/FiltersPanel";
import BottomDrawer from "@/components/map/BottomDrawer";
import FloatingActions from "@/components/map/FloatingActions";
import NavBar from "@/components/NavBar";

const riskColors = { low: "#22c55e", medium: "#eab308", high: "#ef4444" };

const createIcon = (risk: "low" | "medium" | "high") =>
  L.divIcon({
    className: "custom-marker",
    html: `<div style="width:12px;height:12px;border-radius:50%;background:${riskColors[risk]};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });

function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function MapFlyTo({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  map.flyTo(center, zoom, { duration: 1 });
  return null;
}

const Index = () => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState<FloodZone | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [flyTarget, setFlyTarget] = useState<{ center: [number, number]; zoom: number } | null>(null);
  const [filters, setFilters] = useState<FiltersState>({
    rainfallIntensity: 50,
    showElevation: false,
    showDrainage: false,
    riskLevels: { low: true, medium: true, high: true },
  });

  const filteredZones = useMemo(() => {
    return floodZones.filter((z) => {
      if (!filters.riskLevels[z.riskLevel]) return false;
      if (z.rainfallIntensity < filters.rainfallIntensity - 20) return false;
      return true;
    });
  }, [filters]);

  const filteredHeatmap = useMemo(() => {
    return heatmapData.filter((_, i) => {
      const zone = floodZones[i];
      if (!zone) return true;
      return filters.riskLevels[zone.riskLevel];
    }).map(([lat, lng, intensity]) => [
      lat, lng, Math.min(1, intensity * (filters.rainfallIntensity / 50))
    ] as [number, number, number]);
  }, [filters]);

  const handleMapClick = useCallback((lat: number, lng: number) => {
    const nearest = floodZones.reduce((closest, zone) => {
      const dist = Math.sqrt(Math.pow(zone.lat - lat, 2) + Math.pow(zone.lng - lng, 2));
      const closestDist = Math.sqrt(Math.pow(closest.lat - lat, 2) + Math.pow(closest.lng - lng, 2));
      return dist < closestDist ? zone : closest;
    }, floodZones[0]);

    const distance = Math.sqrt(Math.pow(nearest.lat - lat, 2) + Math.pow(nearest.lng - lng, 2));
    if (distance < 0.02) {
      setSelectedZone(nearest);
    } else {
      setSelectedZone(null);
    }
  }, []);

  const handleSelectLocation = useCallback((lat: number, lng: number, id: string) => {
    const zone = floodZones.find(z => z.id === id);
    if (zone) setSelectedZone(zone);
    setFlyTarget({ center: [lat, lng], zoom: 14 });
  }, []);

  const handleLocate = useCallback(() => {
    navigator.geolocation?.getCurrentPosition((pos) => {
      setFlyTarget({ center: [pos.coords.latitude, pos.coords.longitude], zoom: 14 });
    });
  }, []);

  const handleReset = useCallback(() => {
    setFlyTarget({ center: MUMBAI_CENTER, zoom: 12 });
    setSelectedZone(null);
  }, []);

  return (
    <div className="h-screen w-screen relative overflow-hidden">
      <MapContainer
        center={MUMBAI_CENTER}
        zoom={12}
        className="h-full w-full"
        zoomControl={false}
        attributionControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {showHeatmap && <HeatmapLayer points={filteredHeatmap} />}
        {filteredZones.map((zone) => (
          <Marker
            key={zone.id}
            position={[zone.lat, zone.lng]}
            icon={createIcon(zone.riskLevel)}
            eventHandlers={{
              click: () => setSelectedZone(zone),
            }}
          >
            <Popup className="custom-popup">
              <div className="text-sm">
                <p className="font-medium">{zone.name}</p>
                <p className="text-muted-foreground capitalize">{zone.riskLevel} risk</p>
              </div>
            </Popup>
          </Marker>
        ))}
        <MapClickHandler onMapClick={handleMapClick} />
        {flyTarget && <MapFlyTo center={flyTarget.center} zoom={flyTarget.zoom} />}
      </MapContainer>

      <NavBar />
      <SearchBar onSelectLocation={handleSelectLocation} />
      <FiltersPanel
        open={filtersOpen}
        onToggle={() => setFiltersOpen(!filtersOpen)}
        filters={filters}
        onFiltersChange={setFilters}
      />
      <BottomDrawer zone={selectedZone} onClose={() => setSelectedZone(null)} />
      <FloatingActions
        onLocate={handleLocate}
        onToggleLayers={() => setShowHeatmap(!showHeatmap)}
        onReset={handleReset}
      />
    </div>
  );
};

export default Index;
