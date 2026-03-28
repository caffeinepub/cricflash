import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, ChevronDown, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import MatchCard from "../components/MatchCard";
import { MatchCardSkeleton } from "../components/SkeletonCard";
import { useMatches } from "../contexts/MatchContext";
import type { NormalizedMatch } from "../services/cricapi";

const TYPE_OPTIONS = ["All", "T20", "ODI", "Test", "T10"] as const;
type TypeFilter = (typeof TYPE_OPTIONS)[number];

function applyFilters(
  matches: NormalizedMatch[],
  seriesFilter: string,
  typeFilter: TypeFilter,
): NormalizedMatch[] {
  return matches.filter((m) => {
    const seriesOk =
      seriesFilter === "All" || m.seriesCategory === seriesFilter;
    const typeOk =
      typeFilter === "All" || m.matchType === typeFilter.toLowerCase();
    return seriesOk && typeOk;
  });
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

export default function LiveScorePage() {
  const { classified, loading, error, refresh } = useMatches();
  const [refreshing, setRefreshing] = useState(false);
  const [seriesFilter, setSeriesFilter] = useState<string>("All");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("All");

  useEffect(() => {
    document.title = "Live Cricket Scores – CricFlash";
  }, []);

  // Build dynamic series options from loaded match data
  const dynamicSeriesOptions = useMemo(() => {
    const all = [
      ...classified.live,
      ...classified.upcoming,
      ...classified.completed,
    ];
    const seen = new Set<string>();
    const opts: string[] = ["All"];
    for (const m of all) {
      if (m.seriesCategory && !seen.has(m.seriesCategory)) {
        seen.add(m.seriesCategory);
        opts.push(m.seriesCategory);
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

  // Split upcoming: near (<=2 days) vs future (>2 days)
  const now = new Date();
  const in2Days = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
  const nearUpcoming = filteredUpcoming.filter(
    (m) => !m.matchDate || m.matchDate <= in2Days,
  );
  const futureUpcoming = filteredUpcoming.filter(
    (m) => m.matchDate && m.matchDate > in2Days,
  );

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
            {filteredLive.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredLive.map((m, i) => (
                  <div key={m.id} data-ocid={`live.item.${i + 1}`}>
                    <MatchCard match={m} />
                  </div>
                ))}
              </div>
            ) : seriesFilter !== "All" || typeFilter !== "All" ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">No live matches</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting your filters
                </p>
              </div>
            ) : filteredUpcoming.length > 0 ? (
              <div>
                <p className="text-sm text-muted-foreground mb-3">
                  No live matches right now — showing upcoming
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredUpcoming.slice(0, 2).map((m, i) => (
                    <div key={m.id} data-ocid={`live.item.${i + 1}`}>
                      <MatchCard match={m} />
                    </div>
                  ))}
                </div>
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
            {filteredUpcoming.length > 0 ? (
              <div className="space-y-6">
                {/* Near matches (today + tomorrow) first */}
                {nearUpcoming.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                      Today &amp; Tomorrow
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {nearUpcoming.map((m, i) => (
                        <div key={m.id} data-ocid={`live.item.${i + 1}`}>
                          <MatchCard match={m} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* Future matches */}
                {futureUpcoming.length > 0 && (
                  <div>
                    {nearUpcoming.length > 0 && (
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                        Upcoming
                      </p>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {futureUpcoming.map((m, i) => (
                        <div key={m.id} data-ocid={`live.item.${i + 1}`}>
                          <MatchCard match={m} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
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
            {filteredCompleted.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCompleted.map((m, i) => (
                  <div key={m.id} data-ocid={`live.item.${i + 1}`}>
                    <MatchCard match={m} />
                  </div>
                ))}
              </div>
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
