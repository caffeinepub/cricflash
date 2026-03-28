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
import {
  type MatchDetail,
  type MatchScorecardData,
  type ScorecardInnings,
  getMatchDetail,
  getMatchScorecard,
} from "../services/cricapi";

function getBatterName(b: ScorecardInnings["batting"][number]): string {
  if (!b.batsman) return "—";
  if (typeof b.batsman === "string") return b.batsman;
  return b.batsman.name ?? "—";
}

function getBowlerName(b: ScorecardInnings["bowling"][number]): string {
  if (!b.bowler) return "—";
  if (typeof b.bowler === "string") return b.bowler;
  return b.bowler.name ?? "—";
}

function getBatterKey(
  b: ScorecardInnings["batting"][number],
  i: number,
): string {
  if (!b.batsman) return String(i);
  if (typeof b.batsman === "string") return b.batsman + i;
  return (b.batsman as { name: string; id: string }).id ?? String(i);
}

function getBowlerKey(
  b: ScorecardInnings["bowling"][number],
  i: number,
): string {
  if (!b.bowler) return String(i);
  if (typeof b.bowler === "string") return b.bowler + i;
  return (b.bowler as { name: string; id: string }).id ?? String(i);
}

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

function formatMatchStatus(
  statusText: string,
  matchStatus: "live" | "upcoming" | "result",
  matchDate: Date | null,
): string {
  if (matchStatus === "upcoming") {
    if (!matchDate) return "Upcoming";
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const matchDay = new Date(
      matchDate.getFullYear(),
      matchDate.getMonth(),
      matchDate.getDate(),
    );
    const timeStr = matchDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    if (matchDay.getTime() === today.getTime()) return `Today ${timeStr}`;
    if (matchDay.getTime() === tomorrow.getTime()) return `Tomorrow ${timeStr}`;
    return `${matchDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} ${timeStr}`;
  }
  return statusText;
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

function ScorecardTab({
  scorecard,
  scorecardLoading,
  scorecardError,
  allScores,
}: {
  scorecard: ScorecardInnings[] | null;
  scorecardLoading: boolean;
  scorecardError: string | null;
  allScores: { r: number; w: number; o: number; inning: string }[];
}) {
  if (scorecardLoading) {
    return (
      <div className="bg-card border border-border rounded-xl p-4 space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-8 bg-muted rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (scorecardError) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 text-center">
        <p className="text-sm text-muted-foreground">{scorecardError}</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-4">
      {/* Innings summary */}
      {allScores.length > 0 && (
        <div className="space-y-2">
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

      {scorecard && scorecard.length > 0 ? (
        <div className="space-y-8 mt-2">
          {scorecard.map((innings, idx) => (
            <div key={innings.inning ?? idx}>
              {innings.inning && (
                <p className="text-xs font-bold uppercase tracking-wider text-foreground mb-3 border-b border-border pb-1">
                  {innings.inning}
                </p>
              )}

              {/* Batting table */}
              {innings.batting && innings.batting.length > 0 && (
                <div className="mb-5">
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
                        {innings.batting.map((b, i) => (
                          <tr
                            key={getBatterKey(b, i)}
                            className="border-b border-border/50 last:border-0"
                          >
                            <td className="px-2 py-2 font-medium text-foreground">
                              {getBatterName(b)}
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
                            R
                          </th>
                          <th className="text-right px-2 py-2 font-semibold text-muted-foreground">
                            W
                          </th>
                          <th className="text-right px-2 py-2 font-semibold text-muted-foreground">
                            ECO
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {innings.bowling.map((bwl, i) => (
                          <tr
                            key={getBowlerKey(bwl, i)}
                            className="border-b border-border/50 last:border-0"
                          >
                            <td className="px-2 py-2 font-medium text-foreground">
                              {getBowlerName(bwl)}
                            </td>
                            <td className="px-2 py-2 text-right text-muted-foreground">
                              {bwl.o}
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
          ))}
        </div>
      ) : (
        allScores.length === 0 && (
          <p className="text-xs text-muted-foreground text-center italic">
            Scorecard not available
          </p>
        )
      )}
    </div>
  );
}

function CommentaryTab({
  scorecard,
}: { scorecard: ScorecardInnings[] | null }) {
  if (!scorecard || scorecard.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Commentary not available
        </p>
      </div>
    );
  }

  const allOvers = scorecard.flatMap((innings) => {
    const overs = innings.overs ?? ([] as unknown[]);
    return (Array.isArray(overs) ? overs : []).map((ov: unknown) => ({
      innings: innings.inning ?? "",
      ...(ov as object),
    }));
  });

  if (allOvers.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Over-by-over commentary not available
        </p>
      </div>
    );
  }

  // Group by innings
  const byInnings: Record<string, typeof allOvers> = {};
  for (const ov of allOvers) {
    const k = ov.innings || "Innings";
    if (!byInnings[k]) byInnings[k] = [];
    byInnings[k].push(ov);
  }

  return (
    <div className="space-y-6">
      {Object.entries(byInnings).map(([inningsName, overs]) => (
        <div key={inningsName}>
          {inningsName && (
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-1.5 mb-3">
              {inningsName}
            </p>
          )}
          <div className="space-y-3">
            {[...overs].reverse().map((ov, i) => {
              const overNum = (ov as { over?: number | string }).over;
              const balls = ((ov as { balls?: unknown[]; ball?: unknown[] })
                .balls ??
                (ov as { balls?: unknown[]; ball?: unknown[] }).ball ??
                []) as Array<{
                ball?: number | string;
                text?: string;
                commentary?: string;
                runs?: number;
                wicket?: boolean;
              }>;
              return (
                <div
                  key={String(overNum ?? i)}
                  className="bg-card border border-border rounded-xl p-3"
                >
                  <p className="text-xs font-bold text-foreground mb-2">
                    Over {overNum}
                  </p>
                  {balls.length > 0 ? (
                    <ul className="space-y-1">
                      {balls.map((ball, bi) => {
                        const desc = ball.text ?? ball.commentary ?? "";
                        const runs = ball.runs;
                        const isWicket = ball.wicket;
                        return (
                          <li
                            key={String(ball.ball ?? bi)}
                            className={`text-xs flex items-start gap-2 ${
                              isWicket
                                ? "text-cric-red font-semibold"
                                : "text-muted-foreground"
                            }`}
                          >
                            <span className="shrink-0 w-4 text-right text-muted-foreground font-mono">
                              {ball.ball ?? bi + 1}.
                            </span>
                            <span>
                              {isWicket && "🔴 WICKET – "}
                              {desc ||
                                (runs === 0
                                  ? "Dot ball"
                                  : runs === 4
                                    ? "FOUR!"
                                    : runs === 6
                                      ? "SIX!"
                                      : `${runs} run${(runs ?? 0) > 1 ? "s" : ""}`)}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      No ball data
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MatchDetailPage() {
  const { matchId } = useParams({ from: "/match/$matchId" });
  const [match, setMatch] = useState<MatchDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Scorecard state (fetched separately)
  const [scorecardData, setScorecardData] = useState<MatchScorecardData | null>(
    null,
  );
  const [scorecardLoading, setScorecardLoading] = useState(false);
  const [scorecardError, setScorecardError] = useState<string | null>(null);

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

  const fetchScorecard = useCallback(async () => {
    if (!matchId) return;
    setScorecardLoading(true);
    setScorecardError(null);
    try {
      const data = await getMatchScorecard(matchId);
      if (!data) {
        setScorecardError("Scorecard not available");
      } else {
        setScorecardData(data);
      }
    } catch {
      setScorecardError("Scorecard not available");
    } finally {
      setScorecardLoading(false);
    }
  }, [matchId]);

  useEffect(() => {
    fetchMatch();
    fetchScorecard();
  }, [fetchMatch, fetchScorecard]);

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

  const statusText = match.status || "";
  const matchDateStr = match.dateTimeGMT || match.date;
  const matchDate = matchDateStr ? new Date(matchDateStr) : null;
  const now = new Date();
  const statusLower = statusText.toLowerCase();

  let matchStatus: "live" | "upcoming" | "result";
  if (
    statusLower.includes("live") ||
    statusLower.includes("progress") ||
    statusLower.includes("inning") ||
    statusLower.includes("stumps") ||
    statusLower.includes("day") ||
    statusLower.includes("session")
  ) {
    matchStatus = "live";
  } else if (matchDate && matchDate > now) {
    matchStatus = "upcoming";
  } else {
    matchStatus = "result";
  }

  const team1 = match.teamInfo?.[0]?.name || match.teams?.[0] || "TBA";
  const team2 = match.teamInfo?.[1]?.name || match.teams?.[1] || "TBA";
  const cleanTitle = `${team1} vs ${team2}`;
  const series = match.series || match.name || "";

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

  const t1Scores = allScores.filter((s) =>
    s.inning.toLowerCase().startsWith(team1.toLowerCase()),
  );
  const t2Scores = allScores.filter((s) =>
    s.inning.toLowerCase().startsWith(team2.toLowerCase()),
  );
  const latestT1 = t1Scores[t1Scores.length - 1];
  const latestT2 = t2Scores[t2Scores.length - 1];

  const displayStatus = formatMatchStatus(statusText, matchStatus, matchDate);

  // Merge scorecard from detail + scorecard endpoint (scorecard endpoint preferred)
  const activeScorecard: ScorecardInnings[] | null =
    scorecardData?.scorecard && scorecardData.scorecard.length > 0
      ? scorecardData.scorecard
      : match.scorecard && match.scorecard.length > 0
        ? (match.scorecard as ScorecardInnings[])
        : null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-4" data-ocid="match.page">
      {/* Back + Refresh */}
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
            {displayStatus || "Match yet to begin"}
          </p>
        </div>
      </div>

      {/* Tab system */}
      <Tabs defaultValue="info">
        <TabsList className="w-full mb-4" data-ocid="match.tab">
          <TabsTrigger value="info" className="flex-1" data-ocid="match.tab">
            Info
          </TabsTrigger>
          <TabsTrigger
            value="scorecard"
            className="flex-1"
            data-ocid="match.tab"
          >
            Scorecard
          </TabsTrigger>
          <TabsTrigger
            value="commentary"
            className="flex-1"
            data-ocid="match.tab"
          >
            Commentary
          </TabsTrigger>
        </TabsList>

        {/* Info Tab */}
        <TabsContent value="info">
          <div className="bg-card border border-border rounded-xl p-4 space-y-3">
            {/* Teams */}
            <div className="flex items-start gap-3">
              <span className="text-base">🏏</span>
              <div>
                <p className="text-xs text-muted-foreground">Teams</p>
                <p className="text-sm text-foreground font-medium">
                  {team1} vs {team2}
                </p>
              </div>
            </div>
            {/* Status */}
            <div className="flex items-start gap-3">
              <span className="text-base">
                {matchStatus === "live"
                  ? "🔴"
                  : matchStatus === "result"
                    ? "🏆"
                    : "⏰"}
              </span>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <p
                  className={`text-sm font-medium ${
                    matchStatus === "live" ? "text-cric-red" : "text-foreground"
                  }`}
                >
                  {displayStatus || "—"}
                </p>
              </div>
            </div>
            {/* Date */}
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
            {/* Venue */}
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
            {/* Match type */}
            <div className="flex items-start gap-3">
              <Trophy className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Match Type</p>
                <p className="text-sm text-foreground font-medium">
                  {match.matchType?.toUpperCase() || "—"}
                </p>
              </div>
            </div>
            {/* Series */}
            {series && (
              <div className="flex items-start gap-3">
                <span className="text-base">🏆</span>
                <div>
                  <p className="text-xs text-muted-foreground">Series</p>
                  <p className="text-sm text-foreground font-medium">
                    {series}
                  </p>
                </div>
              </div>
            )}
            {/* Toss */}
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
            {/* Upcoming countdown */}
            {matchStatus === "upcoming" && (
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Starts</p>
                  <p className="text-sm text-green-600 dark:text-green-400 font-semibold">
                    {displayStatus}
                  </p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Scorecard Tab */}
        <TabsContent value="scorecard">
          <ScorecardTab
            scorecard={activeScorecard}
            scorecardLoading={scorecardLoading}
            scorecardError={scorecardError}
            allScores={allScores}
          />
        </TabsContent>

        {/* Commentary Tab */}
        <TabsContent value="commentary">
          <CommentaryTab scorecard={activeScorecard} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
