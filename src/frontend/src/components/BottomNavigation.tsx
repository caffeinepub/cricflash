import { Link, useRouterState } from "@tanstack/react-router";
import { Activity, Home, Newspaper } from "lucide-react";

const TABS = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Activity, label: "Matches", path: "/live-score" },
  { icon: Newspaper, label: "News", path: "/news" },
];

export default function BottomNavigation() {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border">
      <div className="flex items-stretch h-14">
        {TABS.map(({ icon: Icon, label, path }) => {
          const isActive = pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors ${
                isActive ? "text-cric-red" : "text-muted-foreground"
              }`}
              data-ocid="nav.link"
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
