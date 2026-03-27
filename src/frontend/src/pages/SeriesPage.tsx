import { Link } from "@tanstack/react-router";
import { useEffect } from "react";

const currentYear = new Date().getFullYear();

const SERIES = [
  {
    name: `IPL ${currentYear}`,
    format: "T20",
    badge: "IPL",
    badgeColor: "bg-cric-red",
    path: "/ipl",
    description: "Indian Premier League — 10 teams battle for the trophy",
  },
  {
    name: `PSL ${currentYear}`,
    format: "T20",
    badge: "PSL",
    badgeColor: "bg-emerald-600",
    path: "/psl",
    description: "Pakistan Super League — The best of Pakistani cricket",
  },
  {
    name: `ICC Champions Trophy ${currentYear}`,
    format: "ODI",
    badge: "ICC",
    badgeColor: "bg-blue-600",
    path: "/international",
    description: "The premier 50-over international tournament",
  },
  {
    name: `The Ashes ${currentYear}`,
    format: "Test",
    badge: "Test",
    badgeColor: "bg-amber-700",
    path: "/international",
    description: "England vs Australia — Cricket's greatest rivalry",
  },
  {
    name: "World Test Championship",
    format: "Test",
    badge: "WTC",
    badgeColor: "bg-slate-600",
    path: "/international",
    description: "The pinnacle of Test cricket",
  },
];

const FORMAT_COLORS: Record<string, string> = {
  T20: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  ODI: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Test: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

export default function SeriesPage() {
  useEffect(() => {
    document.title = `Cricket Series ${currentYear} – CricFlash`;
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-foreground">
          Cricket Series
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Follow your favourite tournaments
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SERIES.map((s) => (
          <Link
            key={s.name}
            to={s.path}
            className="group bg-card border border-border rounded-xl p-5 flex flex-col gap-3 hover:border-cric-red/50 hover:shadow-md transition-all"
            data-ocid="series.card"
          >
            <div className="flex items-start justify-between gap-2">
              <span
                className={`text-xs font-bold text-white px-2 py-0.5 rounded ${s.badgeColor}`}
              >
                {s.badge}
              </span>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded ${
                  FORMAT_COLORS[s.format] || "bg-muted text-muted-foreground"
                }`}
              >
                {s.format}
              </span>
            </div>
            <div>
              <h2 className="font-bold text-foreground group-hover:text-cric-red transition-colors">
                {s.name}
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                {s.description}
              </p>
            </div>
            <div className="flex items-center justify-between mt-auto pt-2 border-t border-border">
              <span className="text-xs text-muted-foreground">
                {currentYear} Season
              </span>
              <span className="text-xs font-semibold text-cric-red">
                View Coverage →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
