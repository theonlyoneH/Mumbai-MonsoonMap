import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

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
    let heat: L.Layer | null = null;

    import("leaflet.heat").then(() => {
      heat = (L as any).heatLayer(points, {
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
      heat!.addTo(map);
    }).catch((err) => {
      console.warn("leaflet.heat failed to load:", err);
    });

    return () => {
      if (heat) map.removeLayer(heat);
    };
  }, [map, points, options]);

  return null;
};

export default HeatmapLayer;
