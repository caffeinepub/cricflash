import { Button } from "@/components/ui/button";
import { Link, useParams } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  MapPin,
  RefreshCw,
  Trophy,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { MatchCardSkeleton } from "../components/SkeletonCard";
import { type MatchDetail, getMatchDetail } from "../services/cricapi";

function getTeamFlag(name: string): string {
  const flags: Record<string, string> = {
    India: "🇮🇳",
    Australia: "🇦🇺",
    England: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    Pakistan: "🇵🇰",
    "South Africa": "🇿🇦",
    "New Zealand": "🇳🇿",
    "West Indies": "🏝️",
    Bangladesh: "🇧🇩",
    "Sri Lanka": "🇱🇰",
  };
  for (const [key, flag] of Object.entries(flags)) {
    if (name.includes(key)) return flag;
  }
  return "🏏";
}

export default function MatchDetailPage() {
  const { matchId } = useParams({ from: "/match/$matchId" });
  const [match, setMatch] = useState<MatchDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatch = useCallback(async () => {
    if (!matchId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getMatchDetail(matchId);
      setMatch(data);
      document.title = `${data.name} – CricFlash`;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load match");
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  useEffect(() => {
    fetchMatch();
  }, [fetchMatch]);

  if (loading) {
    return (
      <div
        className="max-w-[1200px] mx-auto px-4 py-8 space-y-4"
        data-ocid="match.loading_state"
      >
        <div className="h-6 w-48 bg-muted rounded" />
        {[1, 2, 3].map((i) => (
          <MatchCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <div
          className="flex items-center gap-3 bg-destructive/10 border border-destructive/30 text-destructive rounded-xl p-4"
          data-ocid="match.error_state"
        >
          <AlertCircle className="w-4 h-4" />
          <p className="text-sm">{error}</p>
          <Button
            size="sm"
            variant="outline"
            onClick={fetchMatch}
            className="ml-auto"
            data-ocid="match.button"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!match) return null;

  const isLive = match.matchStarted && !match.matchEnded;

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/live-score"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          data-ocid="match.link"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Live Scores
        </Link>
        <Button
          size="sm"
          variant="outline"
          onClick={fetchMatch}
          data-ocid="match.button"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          Refresh
        </Button>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {match.matchType}
          </span>
          {isLive && (
            <span className="flex items-center gap-1 bg-cric-red text-white text-xs font-bold px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              LIVE
            </span>
          )}
          {match.matchEnded && (
            <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
              Match Ended
            </span>
          )}
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-foreground mb-6">
          {match.name}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {match.teams.map((team) => {
            const scores =
              match.score?.filter((s) => s.inning.startsWith(team)) ?? [];
            return (
              <div
                key={team}
                className="bg-background rounded-xl p-4 border border-border"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{getTeamFlag(team)}</span>
                  <h2 className="font-bold text-foreground">{team}</h2>
                </div>
                {scores.length > 0 ? (
                  scores.map((s, si) => (
                    <div key={`${s.inning}-${si}`}>
                      <p className="text-3xl font-extrabold text-foreground">
                        {s.r}/{s.w}
                      </p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {s.o} overs • {s.inning}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">Yet to bat</p>
                )}
              </div>
            );
          })}
        </div>
        {match.status && (
          <div className="mt-4 p-3 bg-cric-red/10 border border-cric-red/20 rounded-xl">
            <p className="text-sm font-semibold text-cric-red">
              {match.status}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-bold text-foreground mb-3">Match Information</h3>
          <div className="space-y-2">
            {match.venue && (
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Venue</p>
                  <p className="text-sm text-foreground">{match.venue}</p>
                </div>
              </div>
            )}
            {match.date && (
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="text-sm text-foreground">
                    {new Date(match.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            )}
            {match.tossWinner && (
              <div className="flex items-start gap-2">
                <Trophy className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Toss</p>
                  <p className="text-sm text-foreground">
                    {match.tossWinner} won the toss
                    {match.tossChoice
                      ? ` and chose to ${match.tossChoice}`
                      : ""}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        {match.players && match.players.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-bold text-foreground mb-3">Playing XI</h3>
            <div className="grid grid-cols-2 gap-1">
              {match.players.map((p) => (
                <p
                  key={p.id}
                  className="text-sm text-foreground py-1 border-b border-border last:border-0"
                >
                  {p.name}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-bold text-foreground mb-2">Live Commentary</h3>
        <p className="text-muted-foreground text-sm">
          🎙️ Live commentary coming soon. Stay tuned for ball-by-ball updates.
        </p>
      </div>
    </div>
  );
}
