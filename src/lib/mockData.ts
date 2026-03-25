export interface FloodZone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  riskLevel: "low" | "medium" | "high";
  waterLevel: string;
  drainageCondition: string;
  elevation: number;
  historicalFloods: number;
  rainfallIntensity: number;
}

export const MUMBAI_CENTER: [number, number] = [19.076, 72.8777];

export const floodZones: FloodZone[] = [
  { id: "1", name: "Hindmata Junction", lat: 19.0073, lng: 72.8464, riskLevel: "high", waterLevel: "1.2m", drainageCondition: "Poor", elevation: 4, historicalFloods: 12, rainfallIntensity: 85 },
  { id: "2", name: "Sion", lat: 19.0408, lng: 72.8616, riskLevel: "high", waterLevel: "0.9m", drainageCondition: "Poor", elevation: 6, historicalFloods: 10, rainfallIntensity: 78 },
  { id: "3", name: "King's Circle", lat: 19.0429, lng: 72.8664, riskLevel: "medium", waterLevel: "0.5m", drainageCondition: "Moderate", elevation: 8, historicalFloods: 7, rainfallIntensity: 62 },
  { id: "4", name: "Andheri Subway", lat: 19.1197, lng: 72.8464, riskLevel: "high", waterLevel: "1.0m", drainageCondition: "Poor", elevation: 5, historicalFloods: 9, rainfallIntensity: 80 },
  { id: "5", name: "Malad", lat: 19.1872, lng: 72.8484, riskLevel: "medium", waterLevel: "0.4m", drainageCondition: "Moderate", elevation: 10, historicalFloods: 5, rainfallIntensity: 55 },
  { id: "6", name: "Kurla", lat: 19.0726, lng: 72.8794, riskLevel: "medium", waterLevel: "0.6m", drainageCondition: "Moderate", elevation: 7, historicalFloods: 6, rainfallIntensity: 60 },
  { id: "7", name: "Bandra", lat: 19.0596, lng: 72.8295, riskLevel: "low", waterLevel: "0.2m", drainageCondition: "Good", elevation: 14, historicalFloods: 3, rainfallIntensity: 40 },
  { id: "8", name: "Worli", lat: 19.0176, lng: 72.8152, riskLevel: "low", waterLevel: "0.1m", drainageCondition: "Good", elevation: 12, historicalFloods: 2, rainfallIntensity: 35 },
  { id: "9", name: "Dadar", lat: 19.0178, lng: 72.8478, riskLevel: "medium", waterLevel: "0.5m", drainageCondition: "Moderate", elevation: 9, historicalFloods: 6, rainfallIntensity: 58 },
  { id: "10", name: "Chembur", lat: 19.0522, lng: 72.8994, riskLevel: "high", waterLevel: "0.8m", drainageCondition: "Poor", elevation: 5, historicalFloods: 8, rainfallIntensity: 72 },
  { id: "11", name: "Powai", lat: 19.1176, lng: 72.9060, riskLevel: "low", waterLevel: "0.15m", drainageCondition: "Good", elevation: 18, historicalFloods: 2, rainfallIntensity: 30 },
  { id: "12", name: "Vikhroli", lat: 19.1100, lng: 72.9273, riskLevel: "medium", waterLevel: "0.45m", drainageCondition: "Moderate", elevation: 8, historicalFloods: 5, rainfallIntensity: 52 },
  { id: "13", name: "Matunga", lat: 19.0272, lng: 72.8560, riskLevel: "medium", waterLevel: "0.55m", drainageCondition: "Moderate", elevation: 7, historicalFloods: 6, rainfallIntensity: 59 },
  { id: "14", name: "Lower Parel", lat: 18.9983, lng: 72.8310, riskLevel: "low", waterLevel: "0.1m", drainageCondition: "Good", elevation: 15, historicalFloods: 1, rainfallIntensity: 28 },
  { id: "15", name: "Dharavi", lat: 19.0420, lng: 72.8550, riskLevel: "high", waterLevel: "0.95m", drainageCondition: "Poor", elevation: 4, historicalFloods: 11, rainfallIntensity: 82 },
];

export const alerts = [
  { id: "a1", title: "Heavy Rainfall Warning", severity: "high" as const, location: "Hindmata Junction", time: "2 hours ago", description: "Expected rainfall of 200mm in next 6 hours. High flood risk.", lat: 19.0073, lng: 72.8464 },
  { id: "a2", title: "Waterlogging Alert", severity: "medium" as const, location: "Andheri Subway", time: "4 hours ago", description: "Water accumulation reported. Avoid area if possible.", lat: 19.1197, lng: 72.8464 },
  { id: "a3", title: "Drainage Overflow", severity: "high" as const, location: "Sion", time: "5 hours ago", description: "Drainage system at capacity. Flooding imminent.", lat: 19.0408, lng: 72.8616 },
  { id: "a4", title: "Tide Warning", severity: "medium" as const, location: "Worli", time: "6 hours ago", description: "High tide expected at 14:30. Coastal areas may see increased water levels.", lat: 19.0176, lng: 72.8152 },
  { id: "a5", title: "Road Closure", severity: "low" as const, location: "King's Circle", time: "8 hours ago", description: "Preventive road closure due to expected heavy rainfall.", lat: 19.0429, lng: 72.8664 },
];

export const rainfallTrends = [
  { month: "Jan", rainfall: 5 },
  { month: "Feb", rainfall: 3 },
  { month: "Mar", rainfall: 2 },
  { month: "Apr", rainfall: 8 },
  { month: "May", rainfall: 35 },
  { month: "Jun", rainfall: 520 },
  { month: "Jul", rainfall: 840 },
  { month: "Aug", rainfall: 560 },
  { month: "Sep", rainfall: 340 },
  { month: "Oct", rainfall: 120 },
  { month: "Nov", rainfall: 30 },
  { month: "Dec", rainfall: 8 },
];

export const heatmapData: [number, number, number][] = floodZones.map(z => [
  z.lat, z.lng, z.rainfallIntensity / 100
]);
