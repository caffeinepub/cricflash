import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Clock,
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
    Afghanistan: "🇦🇫",
    Zimbabwe: "🇿🇼",
    Ireland: "🇮🇪",
  };
  for (const [key, flag] of Object.entries(flags)) {
    if (name.includes(key)) return flag;
  }
  return "🏏";
}

function detectSeries(name: string, series?: string): string {
  const haystack = `${series ?? ""} ${name}`.toLowerCase();
  if (haystack.includes("ipl")) return "IPL";
  if (haystack.includes("psl")) return "PSL";
  return "International";
}

function StatusBadge({ status }: { status: "live" | "upcoming" | "result" }) {
  if (status === "live") {
    return (
      <span className="inline-flex items-center gap-1.5 bg-cric-red text-white text-xs font-bold px-3 py-1 rounded-full">
        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
        LIVE
      </span>
    );
  }
  if (status === "upcoming") {
    return (
      <span className="inline-flex items-center gap-1.5 bg-green-500/15 text-green-600 dark:text-green-400 text-xs font-bold px-3 py-1 rounded-full">
        UPCOMING
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 bg-muted text-muted-foreground text-xs font-semibold px-3 py-1 rounded-full">
      RESULT
    </span>
  );
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
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load match");
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  useEffect(() => {
    fetchMatch();
  }, [fetchMatch]);

  useEffect(() => {
    if (match) {
      const team1 = match.teams?.[0] ?? "";
      const team2 = match.teams?.[1] ?? "";
      document.title = `${team1} vs ${team2} – CricFlash`;
    }
  }, [match]);

  if (loading) {
    return (
      <div
        className="max-w-2xl mx-auto px-4 py-6 space-y-4"
        data-ocid="match.loading_state"
      >
        <div className="h-6 w-48 bg-muted rounded animate-pulse" />
        {[1, 2, 3].map((i) => (
          <MatchCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
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

  // Derive status using consistent logic with cricapi.ts normalizeMatch
  const statusText = match.status || "";
  const matchDateStr = match.dateTimeGMT || match.date;
  const matchDate = matchDateStr ? new Date(matchDateStr) : null;
  const now = new Date();

  let matchStatus: "live" | "upcoming" | "result";
  if (statusText.toLowerCase().includes("live")) {
    matchStatus = "live";
  } else if (matchDate && matchDate > now) {
    matchStatus = "upcoming";
  } else {
    matchStatus = "result";
  }

  const team1 = match.teamInfo?.[0]?.name || match.teams?.[0] || "TBA";
  const team2 = match.teamInfo?.[1]?.name || match.teams?.[1] || "TBA";
  const cleanTitle = `${team1} vs ${team2}`;
  const series = detectSeries(match.name ?? "", match.series);

  const localTimeStr = matchDate
    ? matchDate.toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const allScores = match.score ?? [];

  // Per-team score lookup
  const t1Scores = allScores.filter((s) =>
    s.inning.toLowerCase().startsWith(team1.toLowerCase()),
  );
  const t2Scores = allScores.filter((s) =>
    s.inning.toLowerCase().startsWith(team2.toLowerCase()),
  );
  const latestT1 = t1Scores[t1Scores.length - 1];
  const latestT2 = t2Scores[t2Scores.length - 1];

  // Current innings for live tab
  const currentInnings = allScores[allScores.length - 1];
  const crr =
    currentInnings && currentInnings.o > 0
      ? (currentInnings.r / currentInnings.o).toFixed(2)
      : null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-4" data-ocid="match.page">
      {/* Back button + Refresh */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          data-ocid="match.link"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
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

      {/* Header */}
      <div className="mb-4">
        <StatusBadge status={matchStatus} />
        <h1 className="text-2xl font-extrabold text-foreground mt-2 mb-1">
          {cleanTitle}
        </h1>
        <p className="text-sm text-muted-foreground">
          {series} · {match.matchType?.toUpperCase()}
        </p>
        <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
          {localTimeStr && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {localTimeStr}
            </span>
          )}
          {match.venue && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span className="truncate max-w-[220px]">{match.venue}</span>
            </span>
          )}
        </div>
      </div>

      {/* Score Summary Card */}
      <div className="bg-card border border-border rounded-xl p-4 mb-4">
        <div className="flex items-stretch justify-between gap-4">
          {/* Team 1 */}
          <div className="flex-1 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">{getTeamFlag(team1)}</span>
              <span className="font-bold text-foreground text-sm">{team1}</span>
            </div>
            {latestT1 ? (
              <>
                <p className="text-2xl font-extrabold text-foreground">
                  {latestT1.r}/{latestT1.w}
                </p>
                <p className="text-xs text-muted-foreground">
                  ({latestT1.o} ovs)
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground italic">Yet to bat</p>
            )}
          </div>

          {/* VS divider */}
          <div className="flex items-center text-xs font-bold text-muted-foreground px-2">
            VS
          </div>

          {/* Team 2 */}
          <div className="flex-1 flex flex-col gap-1 items-end text-right">
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground text-sm">{team2}</span>
              <span className="text-xl">{getTeamFlag(team2)}</span>
            </div>
            {latestT2 ? (
              <>
                <p className="text-2xl font-extrabold text-foreground">
                  {latestT2.r}/{latestT2.w}
                </p>
                <p className="text-xs text-muted-foreground">
                  ({latestT2.o} ovs)
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground italic">Yet to bat</p>
            )}
          </div>
        </div>

        {/* Status text */}
        {match.status && (
          <div className="mt-3 pt-3 border-t border-border">
            <p
              className={`text-sm font-semibold text-center ${
                matchStatus === "live"
                  ? "text-cric-red"
                  : matchStatus === "result"
                    ? "text-foreground"
                    : "text-muted-foreground"
              }`}
            >
              {matchStatus === "upcoming" ? "Match yet to begin" : match.status}
            </p>
          </div>
        )}
      </div>

      {/* Tab system */}
      <Tabs defaultValue="live">
        <TabsList className="w-full mb-4" data-ocid="match.tab">
          <TabsTrigger value="live" className="flex-1" data-ocid="match.tab">
            Live
          </TabsTrigger>
          <TabsTrigger
            value="scorecard"
            className="flex-1"
            data-ocid="match.tab"
          >
            Scorecard
          </TabsTrigger>
          <TabsTrigger value="info" className="flex-1" data-ocid="match.tab">
            Info
          </TabsTrigger>
        </TabsList>

        {/* Live Tab */}
        <TabsContent value="live">
          <div className="bg-card border border-border rounded-xl p-4">
            {matchStatus === "upcoming" && (
              <div className="text-center py-6">
                <Clock className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                {localTimeStr && (
                  <p className="font-semibold text-foreground mb-1">
                    Match begins {localTimeStr}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  Match yet to begin
                </p>
              </div>
            )}

            {matchStatus === "result" && (
              <div className="text-center py-6">
                <Trophy className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="font-semibold text-foreground mb-1">
                  Match Ended
                </p>
                {match.status && (
                  <p className="text-sm text-muted-foreground">
                    {match.status}
                  </p>
                )}
              </div>
            )}

            {matchStatus === "live" && (
              <div className="space-y-4">
                {currentInnings && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Currently Batting
                    </p>
                    <div className="bg-background rounded-lg p-3 border border-border">
                      <p className="text-sm font-semibold text-foreground">
                        {currentInnings.inning}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div>
                          <p className="text-2xl font-extrabold text-foreground">
                            {currentInnings.r}/{currentInnings.w}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {currentInnings.o} overs
                          </p>
                        </div>
                        {crr && (
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">CRR</p>
                            <p className="text-lg font-bold text-cric-red">
                              {crr}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cric-red animate-pulse inline-block" />
                    Ball-by-ball commentary coming soon
                  </p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Scorecard Tab */}
        <TabsContent value="scorecard">
          <div className="bg-card border border-border rounded-xl p-4">
            {/* Always show innings summary */}
            {allScores.length > 0 && (
              <div className="space-y-2 mb-4">
                {allScores.map((s) => (
                  <div
                    key={s.inning}
                    className="flex items-center justify-between bg-muted/40 rounded-lg px-3 py-2"
                  >
                    <span className="text-sm font-medium text-foreground truncate max-w-[160px]">
                      {s.inning}
                    </span>
                    <span className="text-sm font-bold text-foreground">
                      {s.r}/{s.w}{" "}
                      <span className="text-xs text-muted-foreground font-normal">
                        ({s.o} ov)
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Full detailed scorecard if available */}
            {match.scorecard && match.scorecard.length > 0 ? (
              <div className="space-y-6">
                {match.scorecard.map((innings) => {
                  const inningsKey =
                    innings.batting[0]?.batsman?.id ??
                    innings.bowling[0]?.bowler?.id ??
                    `${innings.batting.length}-${innings.bowling.length}`;
                  return (
                    <div key={inningsKey}>
                      {/* Batting table */}
                      {innings.batting && innings.batting.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                            Batting
                          </p>
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs min-w-[400px]">
                              <thead>
                                <tr className="border-b border-border bg-muted/50">
                                  <th className="text-left px-2 py-2 font-semibold text-muted-foreground">
                                    Batter
                                  </th>
                                  <th className="text-right px-2 py-2 font-semibold text-muted-foreground">
                                    R
                                  </th>
                                  <th className="text-right px-2 py-2 font-semibold text-muted-foreground">
                                    B
                                  </th>
                                  <th className="text-right px-2 py-2 font-semibold text-muted-foreground">
                                    4s
                                  </th>
                                  <th className="text-right px-2 py-2 font-semibold text-muted-foreground">
                                    6s
                                  </th>
                                  <th className="text-right px-2 py-2 font-semibold text-muted-foreground">
                                    SR
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {innings.batting.map((b) => (
                                  <tr
                                    key={b.batsman?.id ?? b.batsman?.name}
                                    className="border-b border-border/50 last:border-0"
                                  >
                                    <td className="px-2 py-2 font-medium text-foreground">
                                      {b.batsman?.name ?? "—"}
                                    </td>
                                    <td className="px-2 py-2 text-right font-bold text-foreground">
                                      {b.r}
                                    </td>
                                    <td className="px-2 py-2 text-right text-muted-foreground">
                                      {b.b}
                                    </td>
                                    <td className="px-2 py-2 text-right text-muted-foreground">
                                      {b["4s"]}
                                    </td>
                                    <td className="px-2 py-2 text-right text-muted-foreground">
                                      {b["6s"]}
                                    </td>
                                    <td className="px-2 py-2 text-right text-muted-foreground">
                                      {b.sr}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                      {/* Bowling table */}
                      {innings.bowling && innings.bowling.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                            Bowling
                          </p>
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs min-w-[360px]">
                              <thead>
                                <tr className="border-b border-border bg-muted/50">
                                  <th className="text-left px-2 py-2 font-semibold text-muted-foreground">
                                    Bowler
                                  </th>
                                  <th className="text-right px-2 py-2 font-semibold text-muted-foreground">
                                    O
                                  </th>
                                  <th className="text-right px-2 py-2 font-semibold text-muted-foreground">
                                    M
                                  </th>
                                  <th className="text-right px-2 py-2 font-semibold text-muted-foreground">
                                    R
                                  </th>
                                  <th className="text-right px-2 py-2 font-semibold text-muted-foreground">
                                    W
                                  </th>
                                  <th className="text-right px-2 py-2 font-semibold text-muted-foreground">
                                    Econ
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {innings.bowling.map((bwl) => (
                                  <tr
                                    key={bwl.bowler?.id ?? bwl.bowler?.name}
                                    className="border-b border-border/50 last:border-0"
                                  >
                                    <td className="px-2 py-2 font-medium text-foreground">
                                      {bwl.bowler?.name ?? "—"}
                                    </td>
                                    <td className="px-2 py-2 text-right text-muted-foreground">
                                      {bwl.o}
                                    </td>
                                    <td className="px-2 py-2 text-right text-muted-foreground">
                                      {bwl.m}
                                    </td>
                                    <td className="px-2 py-2 text-right text-muted-foreground">
                                      {bwl.r}
                                    </td>
                                    <td className="px-2 py-2 text-right font-bold text-foreground">
                                      {bwl.w}
                                    </td>
                                    <td className="px-2 py-2 text-right text-muted-foreground">
                                      {bwl.eco}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center pt-2 italic">
                Detailed scorecard not available
              </p>
            )}
          </div>
        </TabsContent>

        {/* Info Tab */}
        <TabsContent value="info">
          <div className="bg-card border border-border rounded-xl p-4 space-y-3">
            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">
                  Date &amp; Time (Local)
                </p>
                <p className="text-sm text-foreground font-medium">
                  {localTimeStr || "—"}
                </p>
              </div>
            </div>
            {match.venue && (
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Venue</p>
                  <p className="text-sm text-foreground font-medium">
                    {match.venue}
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3">
              <Trophy className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Match Type</p>
                <p className="text-sm text-foreground font-medium">
                  {match.matchType?.toUpperCase() || "—"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-base">🏆</span>
              <div>
                <p className="text-xs text-muted-foreground">Series</p>
                <p className="text-sm text-foreground font-medium">{series}</p>
              </div>
            </div>
            {match.tossWinner && (
              <div className="flex items-start gap-3">
                <span className="text-base">🪙</span>
                <div>
                  <p className="text-xs text-muted-foreground">Toss</p>
                  <p className="text-sm text-foreground font-medium">
                    {match.tossWinner} won the toss
                    {match.tossChoice
                      ? ` and chose to ${match.tossChoice}`
                      : ""}
                  </p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
