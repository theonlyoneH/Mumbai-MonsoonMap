import { Link } from "react-router-dom";
import { ArrowLeft, AlertTriangle, AlertCircle, Info } from "lucide-react";
import { alerts } from "@/lib/mockData";

const severityConfig = {
  high: { icon: AlertTriangle, color: "text-risk-high", bg: "bg-risk-high/10" },
  medium: { icon: AlertCircle, color: "text-risk-medium", bg: "bg-risk-medium/10" },
  low: { icon: Info, color: "text-risk-low", bg: "bg-risk-low/10" },
};

const Alerts = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 glass border-b border-border/50 px-6 py-4 flex items-center gap-4">
        <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-semibold">Flood Alerts</h1>
      </header>

      <div className="max-w-lg mx-auto p-6 space-y-3">
        {alerts.map((alert) => {
          const config = severityConfig[alert.severity];
          const Icon = config.icon;
          return (
            <Link
              key={alert.id}
              to={`/?lat=${alert.lat}&lng=${alert.lng}`}
              className="block bg-card rounded-xl border border-border/50 p-4 hover:bg-accent/30 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className={`${config.bg} rounded-lg p-2 shrink-0`}>
                  <Icon className={`h-4 w-4 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">{alert.title}</p>
                    <span className="text-xs text-muted-foreground shrink-0">{alert.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{alert.location}</p>
                  <p className="text-xs text-muted-foreground mt-1">{alert.description}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Alerts;
