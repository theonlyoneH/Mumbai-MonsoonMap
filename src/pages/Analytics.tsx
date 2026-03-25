import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { rainfallTrends, floodZones } from "@/lib/mockData";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const floodProne = floodZones
  .filter((z) => z.riskLevel === "high")
  .sort((a, b) => b.rainfallIntensity - a.rainfallIntensity);

const Analytics = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 glass border-b border-border/50 px-6 py-4 flex items-center gap-4">
        <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-semibold">Analytics</h1>
      </header>

      <div className="max-w-2xl mx-auto p-6 space-y-8">
        <div>
          <h2 className="text-sm font-semibold mb-4">Monthly Rainfall Trends (mm)</h2>
          <div className="h-56 bg-secondary/30 rounded-xl p-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={rainfallTrends}>
                <defs>
                  <linearGradient id="rain" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="rainfall" stroke="hsl(217, 91%, 60%)" fill="url(#rain)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold mb-4">Most Flood-Prone Areas</h2>
          <div className="h-48 bg-secondary/30 rounded-xl p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={floodProne} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={110} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="historicalFloods" fill="hsl(0, 84%, 60%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
