import { Link, useLocation } from "react-router-dom";
import { Map, Bookmark, BarChart3, Bell, Zap } from "lucide-react";

const NavBar = () => {
  const location = useLocation();
  const links = [
    { to: "/", icon: Map, label: "Map" },
    { to: "/saved", icon: Bookmark, label: "Saved" },
    { to: "/analytics", icon: BarChart3, label: "Analytics" },
    { to: "/alerts", icon: Bell, label: "Alerts" },
    { to: "/simulation", icon: Zap, label: "Simulate" },
  ];

  return (
    <nav className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] glass rounded-2xl shadow-lg px-2 py-1.5">
      <div className="flex items-center gap-1">
        {links.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default NavBar;
