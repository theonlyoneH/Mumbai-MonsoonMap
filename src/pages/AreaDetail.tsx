import { useParams, Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import { ArrowLeft, Waves, Droplets, Mountain, History } from "lucide-react";
import { floodZones } from "@/lib/mockData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const createIcon = (risk: string) =>
  L.divIcon({
    className: "custom-marker",
    html: `<div style="width:14px;height:14px;border-radius:50%;background:${risk === "high" ? "#ef4444" : risk === "medium" ? "#eab308" : "#22c55e"};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });

const historicalData = [
  { year: "2018", floods: 2 },
  { year: "2019", floods: 4 },
  { year: "2020", floods: 3 },
  { year: "2021", floods: 5 },
  { year: "2022", floods: 3 },
  { year: "2023", floods: 6 },
  { year: "2024", floods: 4 },
];

const AreaDetail = () => {
  const { id } = useParams<{ id: string }>();
  const zone = floodZones.find((z) => z.id === id);

  if (!zone) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Area not found</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col md:flex-row">
      <div className="h-64 md:h-full md:w-2/5 relative">
        <MapContainer center={[zone.lat, zone.lng]} zoom={14} className="h-full w-full" zoomControl={false}>
          <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
          <Marker position={[zone.lat, zone.lng]} icon={createIcon(zone.riskLevel)} />
        </MapContainer>
        <Link
          to="/"
          className="absolute top-4 left-4 z-[1000] glass rounded-xl p-2.5 shadow-lg hover:bg-accent/50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8">
        <div>
          <h1 className="text-2xl font-bold">{zone.name}</h1>
          <span className={`inline-block text-xs px-2.5 py-1 rounded-full mt-2 font-medium ${
            zone.riskLevel === "high" ? "bg-risk-high/10 text-risk-high" :
            zone.riskLevel === "medium" ? "bg-risk-medium/10 text-risk-medium" :
            "bg-risk-low/10 text-risk-low"
          }`}>
            {zone.riskLevel.charAt(0).toUpperCase() + zone.riskLevel.slice(1)} Risk
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: Waves, label: "Water Level", value: zone.waterLevel },
            { icon: Droplets, label: "Drainage", value: zone.drainageCondition },
            { icon: Mountain, label: "Elevation", value: `${zone.elevation}m` },
            { icon: History, label: "Historical Floods", value: `${zone.historicalFloods} events` },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-secondary/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Icon className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
              <p className="text-lg font-semibold">{value}</p>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-sm font-semibold mb-4">Historical Flood Events</h2>
          <div className="h-48 bg-secondary/30 rounded-xl p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={historicalData}>
                <XAxis dataKey="year" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="floods" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreaDetail;
