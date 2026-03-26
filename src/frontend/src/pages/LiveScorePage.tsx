import { Button } from "@/components/ui/button";
import { AlertCircle, Clock, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import MatchCard from "../components/MatchCard";
import { MatchCardSkeleton } from "../components/SkeletonCard";
import { type CricMatch, getLiveMatches } from "../services/cricapi";

const REFRESH_INTERVAL = 150;

export default function LiveScorePage() {
  const [matches, setMatches] = useState<CricMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    document.title = "Live Cricket Scores – CricFlash";
  }, []);

  const fetchMatches = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const data = await getLiveMatches();
      setMatches(data);
      setCountdown(REFRESH_INTERVAL);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load matches");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMatches();
    const interval = setInterval(() => fetchMatches(), REFRESH_INTERVAL * 1000);
    return () => clearInterval(interval);
  }, [fetchMatches]);

  useEffect(() => {
    const timer = setInterval(
      () => setCountdown((c) => (c <= 1 ? REFRESH_INTERVAL : c - 1)),
      1000,
    );
    return () => clearInterval(timer);
  }, []);

  const liveMatches = matches.filter((m) => m.matchStarted && !m.matchEnded);
  const recentMatches = matches.filter((m) => m.matchEnded);
  const upcomingMatches = matches.filter((m) => !m.matchStarted);

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">
            Live Cricket Scores
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time scores from around the world
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="flex items-center gap-1.5 text-sm text-muted-foreground"
            data-ocid="live.loading_state"
          >
            <Clock className="w-4 h-4" />
            Refreshes in {countdown}s
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => fetchMatches(true)}
            disabled={refreshing}
            data-ocid="live.button"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 mr-1.5 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <div
          className="flex items-center gap-3 bg-destructive/10 border border-destructive/30 text-destructive rounded-xl p-4 mb-6"
          data-ocid="live.error_state"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <p className="text-sm">{error}</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => fetchMatches(true)}
            className="ml-auto"
          >
            Retry
          </Button>
        </div>
      )}

      {loading ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          data-ocid="live.loading_state"
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <MatchCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          {liveMatches.length > 0 && (
            <section className="mb-8">
              <h2 className="flex items-center gap-2 text-lg font-bold text-foreground mb-4">
                <span className="w-2 h-2 rounded-full bg-cric-red animate-pulse" />
                Live Now ({liveMatches.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {liveMatches.map((m, i) => (
                  <div key={m.id} data-ocid={`live.item.${i + 1}`}>
                    <MatchCard match={m} />
                  </div>
                ))}
              </div>
            </section>
          )}
          {upcomingMatches.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-foreground mb-4">
                Upcoming Matches
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingMatches.slice(0, 9).map((m, i) => (
                  <div key={m.id} data-ocid={`live.item.${i + 1}`}>
                    <MatchCard match={m} />
                  </div>
                ))}
              </div>
            </section>
          )}
          {recentMatches.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-foreground mb-4">
                Recent Results
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentMatches.slice(0, 6).map((m, i) => (
                  <div key={m.id} data-ocid={`live.item.${i + 1}`}>
                    <MatchCard match={m} />
                  </div>
                ))}
              </div>
            </section>
          )}
          {matches.length === 0 && !error && (
            <div className="text-center py-16" data-ocid="live.empty_state">
              <p className="text-muted-foreground text-lg">No matches found</p>
              <p className="text-sm text-muted-foreground mt-1">
                Check back later for live scores
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
