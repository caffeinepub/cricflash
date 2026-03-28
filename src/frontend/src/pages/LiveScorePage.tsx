import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, ChevronDown, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import MatchCard from "../components/MatchCard";
import { MatchCardSkeleton } from "../components/SkeletonCard";
import { useMatches } from "../contexts/MatchContext";
import { type NormalizedMatch, normalizeSeries } from "../services/cricapi";

const TYPE_OPTIONS = ["All", "T20", "ODI", "Test", "T10"] as const;
type TypeFilter = (typeof TYPE_OPTIONS)[number];

interface SeriesGroup {
  seriesName: string;
  key: string;
  matches: NormalizedMatch[];
  nearestDate: number;
}

function detectSeries(series: string): string {
  const s = (series || "").toLowerCase();
  if (s.includes("ipl") || s.includes("indian premier league")) return "IPL";
  if (s.includes("psl") || s.includes("pakistan super league")) return "PSL";
  if (s.includes("women")) return "WOMEN";
  return "INTERNATIONAL";
}

function groupAndSortBySeries(matches: NormalizedMatch[]): SeriesGroup[] {
  const groups: Record<string, SeriesGroup> = {};

  for (const match of matches) {
    const key = normalizeSeries(match.series) || "other";
    if (!groups[key]) {
      groups[key] = {
        seriesName: match.series || "Other",
        key,
        matches: [],
        nearestDate: Number.POSITIVE_INFINITY,
      };
    }
    groups[key].matches.push(match);
    const t = match.matchDate?.getTime() ?? Number.POSITIVE_INFINITY;
    if (t < groups[key].nearestDate) groups[key].nearestDate = t;
  }

  // Sort matches inside each series by date ascending
  for (const g of Object.values(groups)) {
    g.matches.sort(
      (a, b) => (a.matchDate?.getTime() ?? 0) - (b.matchDate?.getTime() ?? 0),
    );
  }

  // Sort series by nearest match date
  return Object.values(groups).sort((a, b) => a.nearestDate - b.nearestDate);
}

function applyFilters(
  matches: NormalizedMatch[],
  seriesFilter: string,
  typeFilter: TypeFilter,
): NormalizedMatch[] {
  const filtered = matches.filter((m) => {
    const seriesOk =
      seriesFilter === "All" || detectSeries(m.series) === seriesFilter;
    const typeOk =
      typeFilter === "All" || m.matchType === typeFilter.toLowerCase();
    return seriesOk && typeOk;
  });
  return filtered;
}

function FilterDropdown({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="border border-border rounded-lg px-3 py-2 text-sm flex items-center gap-2 bg-card hover:bg-muted transition-colors"
      >
        <span className="text-muted-foreground text-xs">{label}:</span>
        <span className="font-medium">{value}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 bg-card border border-border rounded-lg shadow-lg min-w-[140px]">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg ${
                value === opt ? "font-semibold text-cric-red" : ""
              }`}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SeriesGroupedList({ groups }: { groups: SeriesGroup[] }) {
  if (groups.length === 0) return null;
  return (
    <div className="space-y-6">
      {groups.map((g) => (
        <div key={g.key}>
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-1.5 mb-3">
            {g.seriesName}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {g.matches.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function LiveScorePage() {
  const { classified, loading, error, refresh } = useMatches();
  const [refreshing, setRefreshing] = useState(false);
  const [seriesFilter, setSeriesFilter] = useState<string>("All");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("All");

  useEffect(() => {
    document.title = "Live Cricket Scores – CricFlash";
  }, []);

  const dynamicSeriesOptions = useMemo(() => {
    const all = [
      ...classified.live,
      ...classified.upcoming,
      ...classified.completed,
    ];
    const seen = new Set<string>();
    const opts: string[] = ["All"];
    for (const m of all) {
      const cat = detectSeries(m.series);
      if (!seen.has(cat)) {
        seen.add(cat);
        opts.push(cat);
      }
    }
    return opts;
  }, [classified]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const {
    live: liveMatches,
    upcoming: upcomingMatches,
    completed: completedMatches,
  } = classified;

  const filteredLive = applyFilters(liveMatches, seriesFilter, typeFilter);
  const filteredUpcoming = applyFilters(
    upcomingMatches,
    seriesFilter,
    typeFilter,
  );
  const filteredCompleted = applyFilters(
    completedMatches,
    seriesFilter,
    typeFilter,
  );

  const visibleMatches = [
    ...filteredLive,
    ...filteredUpcoming,
    ...filteredCompleted,
  ];
  console.log("VISIBLE:", visibleMatches.length);

  const liveGroups = groupAndSortBySeries(filteredLive);
  const upcomingGroups = groupAndSortBySeries(filteredUpcoming);
  const completedGroups = groupAndSortBySeries(filteredCompleted);

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">
            Live Cricket Scores
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Real-time scores from around the world
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw
            className={`w-3.5 h-3.5 mr-1.5 ${refreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-destructive/10 border border-destructive/30 text-destructive rounded-xl p-4 mb-6">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <p className="text-sm">{error}</p>
          <Button
            size="sm"
            variant="outline"
            onClick={handleRefresh}
            className="ml-auto"
          >
            Retry
          </Button>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <MatchCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <Tabs defaultValue="live">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="live" className="flex-1">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cric-red animate-pulse" />
                Live
                {liveMatches.length > 0 && (
                  <span className="ml-1 text-xs bg-cric-red text-white rounded-full px-1.5 py-0.5 leading-none">
                    {liveMatches.length}
                  </span>
                )}
              </span>
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="flex-1">
              Upcoming
            </TabsTrigger>
            <TabsTrigger value="results" className="flex-1">
              Results
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-2 mb-4">
            <FilterDropdown
              label="Series"
              options={dynamicSeriesOptions}
              value={seriesFilter}
              onChange={setSeriesFilter}
            />
            <FilterDropdown
              label="Type"
              options={[...TYPE_OPTIONS]}
              value={typeFilter}
              onChange={(v) => setTypeFilter(v as TypeFilter)}
            />
          </div>

          <TabsContent value="live">
            {liveGroups.length > 0 ? (
              <SeriesGroupedList groups={liveGroups} />
            ) : seriesFilter !== "All" || typeFilter !== "All" ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">No live matches</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting your filters
                </p>
              </div>
            ) : upcomingGroups.length > 0 ? (
              <div>
                <p className="text-sm text-muted-foreground mb-3">
                  No live matches right now — showing upcoming
                </p>
                <SeriesGroupedList
                  groups={upcomingGroups
                    .map((g) => ({
                      ...g,
                      matches: g.matches.slice(0, 2),
                    }))
                    .filter((g) => g.matches.length > 0)}
                />
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">No live matches</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Check back later for live scores
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="upcoming">
            {upcomingGroups.length > 0 ? (
              <SeriesGroupedList groups={upcomingGroups} />
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">
                  No upcoming matches
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {seriesFilter !== "All" || typeFilter !== "All"
                    ? "Try adjusting your filters"
                    : "No scheduled matches found"}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="results">
            {completedGroups.length > 0 ? (
              <SeriesGroupedList groups={completedGroups} />
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">
                  No results available
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {seriesFilter !== "All" || typeFilter !== "All"
                    ? "Try adjusting your filters"
                    : "No completed matches yet"}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
