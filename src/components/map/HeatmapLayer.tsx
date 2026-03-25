import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";

interface HeatmapLayerProps {
  points: [number, number, number][];
  options?: {
    radius?: number;
    blur?: number;
    maxZoom?: number;
    minOpacity?: number;
    gradient?: Record<number, string>;
  };
}

const HeatmapLayer = ({ points, options = {} }: HeatmapLayerProps) => {
  const map = useMap();

  useEffect(() => {
    const heat = L.heatLayer(points, {
      radius: 35,
      blur: 25,
      maxZoom: 17,
      minOpacity: 0.4,
      gradient: {
        0.2: "#3b82f6",
        0.4: "#06b6d4",
        0.6: "#eab308",
        0.8: "#f97316",
        1.0: "#ef4444",
      },
      ...options,
    });

    heat.addTo(map);
    return () => { map.removeLayer(heat); };
  }, [map, points, options]);

  return null;
};

export default HeatmapLayer;
