import { useEffect, useMemo, useState } from "react";
import { useMatches } from "../contexts/MatchContext";
import { normalizeSeries } from "../services/cricapi";

interface SeriesItem {
  name: string;
  key: string;
  startDate: Date | null;
  endDate: Date | null;
  matchCount: number;
}

function getMonthYear(date: Date | null): string {
  if (!date) return "Unknown";
  return date.toLocaleString("default", { month: "long", year: "numeric" });
}

export default function SeriesPage() {
  const { classified } = useMatches();
  const [search, setSearch] = useState("");

  useEffect(() => {
    document.title = "Cricket Series – CricFlash";
  }, []);

  // Extract unique series from all matches
  const seriesList = useMemo((): SeriesItem[] => {
    const all = [
      ...classified.live,
      ...classified.upcoming,
      ...classified.completed,
    ];

    const seriesMap: Record<
      string,
      { name: string; dates: Date[]; count: number }
    > = {};

    for (const match of all) {
      if (!match.series) continue;
      const key = normalizeSeries(match.series);
      if (!seriesMap[key]) {
        seriesMap[key] = { name: match.series, dates: [], count: 0 };
      }
      seriesMap[key].count += 1;
      if (match.matchDate) {
        seriesMap[key].dates.push(match.matchDate);
      }
    }

    return Object.entries(seriesMap).map(([key, val]) => {
      const sorted = val.dates.sort((a, b) => a.getTime() - b.getTime());
      return {
        name: val.name,
        key,
        startDate: sorted[0] ?? null,
        endDate: sorted[sorted.length - 1] ?? null,
        matchCount: val.count,
      };
    });
  }, [classified]);

  // Filter by search
  const filteredSeries = useMemo(() => {
    if (!search.trim()) return seriesList;
    const q = search.toLowerCase();
    return seriesList.filter((s) => s.name.toLowerCase().includes(q));
  }, [seriesList, search]);

  // Group by start month
  const groupedSeries = useMemo(() => {
    const groups: Record<string, SeriesItem[]> = {};
    for (const s of filteredSeries) {
      const key = getMonthYear(s.startDate);
      if (!groups[key]) groups[key] = [];
      groups[key].push(s);
    }
    // Sort each group by startDate
    for (const key of Object.keys(groups)) {
      groups[key].sort(
        (a, b) => (a.startDate?.getTime() ?? 0) - (b.startDate?.getTime() ?? 0),
      );
    }
    // Return as ordered array (by earliest series in group)
    const entries = Object.entries(groups);
    entries.sort((a, b) => {
      const aMin = a[1][0]?.startDate?.getTime() ?? 0;
      const bMin = b[1][0]?.startDate?.getTime() ?? 0;
      return aMin - bMin;
    });
    return entries;
  }, [filteredSeries]);

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6">
      <div className="mb-5">
        <h1 className="text-2xl font-extrabold text-foreground">
          Cricket Series
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          All active and upcoming tournaments
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search series..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm border border-border rounded-lg px-4 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-cric-red/30"
          style={{ fontSize: 16 }}
        />
      </div>

      {groupedSeries.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">
            {search
              ? "No series match your search"
              : "No series data available"}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {groupedSeries.map(([monthYear, items]) => (
            <div key={monthYear}>
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-1.5 mb-3">
                {monthYear.toUpperCase()}
              </h2>
              <div className="space-y-2">
                {items.map((s) => (
                  <div
                    key={s.key}
                    className="bg-card border border-border rounded-xl px-4 py-3 flex items-center justify-between gap-3"
                    data-ocid="series.card"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground truncate">
                        {s.name}
                      </p>
                      {s.startDate && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {s.startDate.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                          {s.endDate &&
                            s.endDate.getTime() !== s.startDate.getTime() &&
                            ` – ${s.endDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                      {s.matchCount} match{s.matchCount !== 1 ? "es" : ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
