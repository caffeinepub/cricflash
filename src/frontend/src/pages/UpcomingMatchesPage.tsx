import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Clock, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { type CricMatch, getUpcomingMatches } from "../services/cricapi";

const SERIES_FILTERS = ["All", "IPL", "PSL", "International"] as const;
const TYPE_FILTERS = ["All", "T20", "ODI", "Test"] as const;
type SeriesFilter = (typeof SERIES_FILTERS)[number];
type TypeFilter = (typeof TYPE_FILTERS)[number];

function applyFilters(
  matches: CricMatch[],
  seriesFilter: SeriesFilter,
  typeFilter: TypeFilter,
): CricMatch[] {
  return matches.filter((m) => {
    const name = m.name?.toLowerCase() || "";
    const type = m.matchType?.toLowerCase() || "";
    const seriesOk =
      seriesFilter === "All" ||
      (seriesFilter === "IPL" && name.includes("ipl")) ||
      (seriesFilter === "PSL" && name.includes("psl")) ||
      (seriesFilter === "International" &&
        !name.includes("ipl") &&
        !name.includes("psl"));
    const typeOk =
      typeFilter === "All" || type.includes(typeFilter.toLowerCase());
    return seriesOk && typeOk;
  });
}

function getMatchLabel(match: CricMatch): string {
  const name = match.name || "";
  const lower = name.toLowerCase();
  if (lower.includes("ipl")) return "IPL";
  if (lower.includes("psl")) return "PSL";
  if (lower.includes("test")) return "TEST";
  if (lower.includes("odi")) return "ODI";
  if (match.matchType) return match.matchType.toUpperCase();
  return "MATCH";
}

function getLabelColor(label: string): string {
  switch (label) {
    case "IPL":
      return "bg-orange-500/15 text-orange-600 dark:text-orange-400";
    case "PSL":
      return "bg-green-500/15 text-green-600 dark:text-green-400";
    case "TEST":
      return "bg-purple-500/15 text-purple-600 dark:text-purple-400";
    case "ODI":
      return "bg-blue-500/15 text-blue-600 dark:text-blue-400";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function formatDateTime(dateStr: string): { date: string; time: string } {
  if (!dateStr) return { date: "TBD", time: "" };
  const d = new Date(dateStr);
  const date = d.toLocaleDateString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return { date, time };
}

export default function UpcomingMatchesPage() {
  const [matches, setMatches] = useState<CricMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [seriesFilter, setSeriesFilter] = useState<SeriesFilter>("All");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("All");
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate({ to: "/" });
    }
  };

  const loadMatches = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true);
    setError(null);
    try {
      const data = await getUpcomingMatches();
      const filtered = data
        .filter((m) => !m.matchStarted && !m.matchEnded)
        .sort((a, b) => {
          const da = a.dateTimeGMT || a.date || "";
          const db = b.dateTimeGMT || b.date || "";
          return da.localeCompare(db);
        });
      setMatches(filtered);
      setLastUpdated(new Date());
    } catch {
      setError("Failed to load upcoming matches. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = "Upcoming Matches \u2013 CricFlash";
    loadMatches();
  }, [loadMatches]);

  const filteredMatches = applyFilters(matches, seriesFilter, typeFilter);

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">
              Upcoming Matches
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              All scheduled cricket matches sorted by date
            </p>
          </div>
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="text-xs text-muted-foreground">
                Updated{" "}
                {lastUpdated.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
            <button
              type="button"
              onClick={() => loadMatches(true)}
              disabled={loading}
              className="flex items-center gap-1.5 text-xs font-semibold text-cric-red hover:opacity-80 transition-opacity disabled:opacity-40"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-semibold text-muted-foreground shrink-0">
            Series:
          </span>
          {SERIES_FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setSeriesFilter(f)}
              className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                seriesFilter === f
                  ? "bg-cric-red text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
              data-ocid="upcoming.toggle"
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-semibold text-muted-foreground shrink-0">
            Type:
          </span>
          {TYPE_FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setTypeFilter(f)}
              className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                typeFilter === f
                  ? "bg-cric-red text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
              data-ocid="upcoming.toggle"
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-xl p-4 mb-6 text-sm">
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="h-44 rounded-2xl bg-card border border-border animate-pulse"
            />
          ))}
        </div>
      ) : filteredMatches.length === 0 ? (
        <div
          className="text-center py-20 bg-card border border-border rounded-2xl"
          data-ocid="upcoming.empty_state"
        >
          <p className="text-5xl mb-4">🏏</p>
          <p className="text-lg font-semibold text-foreground">
            {seriesFilter !== "All" || typeFilter !== "All"
              ? "No matches match your filters"
              : "No upcoming matches found"}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {seriesFilter !== "All" || typeFilter !== "All"
              ? "Try selecting different filters"
              : "Check back soon for scheduled matches"}
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-4">
            {filteredMatches.length} match
            {filteredMatches.length !== 1 ? "es" : ""} scheduled
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMatches.map((match, idx) => {
              const label = getMatchLabel(match);
              const { date, time } = formatDateTime(
                match.dateTimeGMT || match.date,
              );
              const teamA = match.teams?.[0] || "TBD";
              const teamB = match.teams?.[1] || "TBD";
              return (
                <Link
                  key={match.id}
                  to="/match/$matchId"
                  params={{ matchId: match.id }}
                  data-ocid={`upcoming.item.${idx + 1}`}
                  className="block bg-card border border-border rounded-2xl p-5 hover:border-cric-red/50 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${getLabelColor(label)}`}
                    >
                      {label}
                    </span>
                    <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full">
                      UPCOMING
                    </span>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm font-bold text-foreground group-hover:text-cric-red transition-colors line-clamp-2">
                      {teamA}
                    </p>
                    <p className="text-xs text-muted-foreground font-semibold my-1">
                      VS
                    </p>
                    <p className="text-sm font-bold text-foreground group-hover:text-cric-red transition-colors line-clamp-2">
                      {teamB}
                    </p>
                  </div>
                  <div className="border-t border-border pt-3 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {date}
                      </span>
                    </div>
                    {time && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {time}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
