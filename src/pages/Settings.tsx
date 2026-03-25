import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const Settings = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 glass border-b border-border/50 px-6 py-4 flex items-center gap-4">
        <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-semibold">Settings</h1>
      </header>

      <div className="max-w-lg mx-auto p-6 space-y-6">
        <div className="space-y-4">
          <h2 className="text-sm font-semibold">Preferences</h2>
          <div className="bg-card rounded-xl border border-border/50 divide-y divide-border/50">
            <div className="flex items-center justify-between p-4">
              <span className="text-sm">Dark Mode</span>
              <Switch />
            </div>
            <div className="flex items-center justify-between p-4">
              <span className="text-sm">Metric Units</span>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold">Notifications</h2>
          <div className="bg-card rounded-xl border border-border/50 divide-y divide-border/50">
            <div className="flex items-center justify-between p-4">
              <span className="text-sm">Flood Alerts</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4">
              <span className="text-sm">Weather Updates</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4">
              <span className="text-sm">Simulation Results</span>
              <Switch />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
