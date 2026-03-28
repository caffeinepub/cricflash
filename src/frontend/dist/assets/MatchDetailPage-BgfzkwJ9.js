import { b as useParams, r as reactExports, g as getMatchDetail, c as getMatchScorecard, j as jsxRuntimeExports, B as Button, A as ArrowLeft, T as Trophy } from "./index-IMEFWTGH.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-PAOMhWH-.js";
import { M as MatchCardSkeleton } from "./SkeletonCard-6_49rU3L.js";
import { C as CircleAlert } from "./circle-alert-B_yHyY2s.js";
import { R as RefreshCw } from "./refresh-cw-Cm37vGTm.js";
import { C as Calendar } from "./calendar-CAGHPkdX.js";
import { M as MapPin } from "./map-pin-C58W4pip.js";
import { C as Clock } from "./clock-kGPCKZxX.js";
import "./index-Bu8HvS1Y.js";
import "./skeleton-JqxoG2DC.js";
function getBatterName(b) {
  if (!b.batsman) return "—";
  if (typeof b.batsman === "string") return b.batsman;
  return b.batsman.name ?? "—";
}
function getBowlerName(b) {
  if (!b.bowler) return "—";
  if (typeof b.bowler === "string") return b.bowler;
  return b.bowler.name ?? "—";
}
function getBatterKey(b, i) {
  if (!b.batsman) return String(i);
  if (typeof b.batsman === "string") return b.batsman + i;
  return b.batsman.id ?? String(i);
}
function getBowlerKey(b, i) {
  if (!b.bowler) return String(i);
  if (typeof b.bowler === "string") return b.bowler + i;
  return b.bowler.id ?? String(i);
}
function getTeamFlag(name) {
  const flags = {
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
    Ireland: "🇮🇪"
  };
  for (const [key, flag] of Object.entries(flags)) {
    if (name.includes(key)) return flag;
  }
  return "🏏";
}
function formatMatchStatus(statusText, matchStatus, matchDate) {
  if (matchStatus === "upcoming") {
    if (!matchDate) return "Upcoming";
    const now = /* @__PURE__ */ new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const matchDay = new Date(
      matchDate.getFullYear(),
      matchDate.getMonth(),
      matchDate.getDate()
    );
    const timeStr = matchDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
    if (matchDay.getTime() === today.getTime()) return `Today ${timeStr}`;
    if (matchDay.getTime() === tomorrow.getTime()) return `Tomorrow ${timeStr}`;
    return `${matchDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} ${timeStr}`;
  }
  return statusText;
}
function StatusBadge({ status }) {
  if (status === "live") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 bg-cric-red text-white text-xs font-bold px-3 py-1 rounded-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-white animate-pulse" }),
      "LIVE"
    ] });
  }
  if (status === "upcoming") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center gap-1.5 bg-green-500/15 text-green-600 dark:text-green-400 text-xs font-bold px-3 py-1 rounded-full", children: "UPCOMING" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center gap-1.5 bg-muted text-muted-foreground text-xs font-semibold px-3 py-1 rounded-full", children: "RESULT" });
}
function ScorecardTab({
  scorecard,
  scorecardLoading,
  scorecardError,
  allScores
}) {
  if (scorecardLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border rounded-xl p-4 space-y-2", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 bg-muted rounded animate-pulse" }, i)) });
  }
  if (scorecardError) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border rounded-xl p-6 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: scorecardError }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-4 space-y-4", children: [
    allScores.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: allScores.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center justify-between bg-muted/40 rounded-lg px-3 py-2",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground truncate max-w-[160px]", children: s.inning }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold text-foreground", children: [
            s.r,
            "/",
            s.w,
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground font-normal", children: [
              "(",
              s.o,
              " ov)"
            ] })
          ] })
        ]
      },
      s.inning
    )) }),
    scorecard && scorecard.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-8 mt-2", children: scorecard.map((innings, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      innings.inning && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold uppercase tracking-wider text-foreground mb-3 border-b border-border pb-1", children: innings.inning }),
      innings.batting && innings.batting.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2", children: "Batting" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs min-w-[400px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-2 py-2 font-semibold text-muted-foreground", children: "Batter" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-2 py-2 font-semibold text-muted-foreground", children: "R" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-2 py-2 font-semibold text-muted-foreground", children: "B" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-2 py-2 font-semibold text-muted-foreground", children: "4s" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-2 py-2 font-semibold text-muted-foreground", children: "6s" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-2 py-2 font-semibold text-muted-foreground", children: "SR" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: innings.batting.map((b, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "tr",
            {
              className: "border-b border-border/50 last:border-0",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2 font-medium text-foreground", children: getBatterName(b) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2 text-right font-bold text-foreground", children: b.r }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2 text-right text-muted-foreground", children: b.b }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2 text-right text-muted-foreground", children: b["4s"] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2 text-right text-muted-foreground", children: b["6s"] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2 text-right text-muted-foreground", children: b.sr })
              ]
            },
            getBatterKey(b, i)
          )) })
        ] }) })
      ] }),
      innings.bowling && innings.bowling.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2", children: "Bowling" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs min-w-[360px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-2 py-2 font-semibold text-muted-foreground", children: "Bowler" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-2 py-2 font-semibold text-muted-foreground", children: "O" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-2 py-2 font-semibold text-muted-foreground", children: "R" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-2 py-2 font-semibold text-muted-foreground", children: "W" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-2 py-2 font-semibold text-muted-foreground", children: "ECO" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: innings.bowling.map((bwl, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "tr",
            {
              className: "border-b border-border/50 last:border-0",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2 font-medium text-foreground", children: getBowlerName(bwl) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2 text-right text-muted-foreground", children: bwl.o }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2 text-right text-muted-foreground", children: bwl.r }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2 text-right font-bold text-foreground", children: bwl.w }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2 text-right text-muted-foreground", children: bwl.eco })
              ]
            },
            getBowlerKey(bwl, i)
          )) })
        ] }) })
      ] })
    ] }, innings.inning ?? idx)) }) : allScores.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center italic", children: "Scorecard not available" })
  ] });
}
function CommentaryTab({
  scorecard
}) {
  if (!scorecard || scorecard.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border rounded-xl p-6 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Commentary not available" }) });
  }
  const allOvers = scorecard.flatMap((innings) => {
    const overs = innings.overs ?? [];
    return (Array.isArray(overs) ? overs : []).map((ov) => ({
      innings: innings.inning ?? "",
      ...ov
    }));
  });
  if (allOvers.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border rounded-xl p-6 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Over-by-over commentary not available" }) });
  }
  const byInnings = {};
  for (const ov of allOvers) {
    const k = ov.innings || "Innings";
    if (!byInnings[k]) byInnings[k] = [];
    byInnings[k].push(ov);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: Object.entries(byInnings).map(([inningsName, overs]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    inningsName && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-1.5 mb-3", children: inningsName }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [...overs].reverse().map((ov, i) => {
      const overNum = ov.over;
      const balls = ov.balls ?? ov.ball ?? [];
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "bg-card border border-border rounded-xl p-3",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-bold text-foreground mb-2", children: [
              "Over ",
              overNum
            ] }),
            balls.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1", children: balls.map((ball, bi) => {
              const desc = ball.text ?? ball.commentary ?? "";
              const runs = ball.runs;
              const isWicket = ball.wicket;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "li",
                {
                  className: `text-xs flex items-start gap-2 ${isWicket ? "text-cric-red font-semibold" : "text-muted-foreground"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "shrink-0 w-4 text-right text-muted-foreground font-mono", children: [
                      ball.ball ?? bi + 1,
                      "."
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      isWicket && "🔴 WICKET – ",
                      desc || (runs === 0 ? "Dot ball" : runs === 4 ? "FOUR!" : runs === 6 ? "SIX!" : `${runs} run${(runs ?? 0) > 1 ? "s" : ""}`)
                    ] })
                  ]
                },
                String(ball.ball ?? bi)
              );
            }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "No ball data" })
          ]
        },
        String(overNum ?? i)
      );
    }) })
  ] }, inningsName)) });
}
function MatchDetailPage() {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const { matchId } = useParams({ from: "/match/$matchId" });
  const [match, setMatch] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const [scorecardData, setScorecardData] = reactExports.useState(
    null
  );
  const [scorecardLoading, setScorecardLoading] = reactExports.useState(false);
  const [scorecardError, setScorecardError] = reactExports.useState(null);
  const fetchMatch = reactExports.useCallback(async () => {
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
  const fetchScorecard = reactExports.useCallback(async () => {
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
  reactExports.useEffect(() => {
    fetchMatch();
    fetchScorecard();
  }, [fetchMatch, fetchScorecard]);
  reactExports.useEffect(() => {
    var _a2, _b2;
    if (match) {
      const team12 = ((_a2 = match.teams) == null ? void 0 : _a2[0]) ?? "";
      const team22 = ((_b2 = match.teams) == null ? void 0 : _b2[1]) ?? "";
      document.title = `${team12} vs ${team22} – CricFlash`;
    }
  }, [match]);
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "max-w-2xl mx-auto px-4 py-6 space-y-4",
        "data-ocid": "match.loading_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-6 w-48 bg-muted rounded animate-pulse" }),
          [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(MatchCardSkeleton, {}, i))
        ]
      }
    );
  }
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-2xl mx-auto px-4 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-3 bg-destructive/10 border border-destructive/30 text-destructive rounded-xl p-4",
        "data-ocid": "match.error_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: error }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "outline",
              onClick: fetchMatch,
              className: "ml-auto",
              "data-ocid": "match.button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3.5 h-3.5 mr-1" }),
                "Retry"
              ]
            }
          )
        ]
      }
    ) });
  }
  if (!match) return null;
  const statusText = match.status || "";
  const matchDateStr = match.dateTimeGMT || match.date;
  const matchDate = matchDateStr ? new Date(matchDateStr) : null;
  const now = /* @__PURE__ */ new Date();
  const statusLower = statusText.toLowerCase();
  let matchStatus;
  if (statusLower.includes("live") || statusLower.includes("progress") || statusLower.includes("inning") || statusLower.includes("stumps") || statusLower.includes("day") || statusLower.includes("session")) {
    matchStatus = "live";
  } else if (matchDate && matchDate > now) {
    matchStatus = "upcoming";
  } else {
    matchStatus = "result";
  }
  const team1 = ((_b = (_a = match.teamInfo) == null ? void 0 : _a[0]) == null ? void 0 : _b.name) || ((_c = match.teams) == null ? void 0 : _c[0]) || "TBA";
  const team2 = ((_e = (_d = match.teamInfo) == null ? void 0 : _d[1]) == null ? void 0 : _e.name) || ((_f = match.teams) == null ? void 0 : _f[1]) || "TBA";
  const cleanTitle = `${team1} vs ${team2}`;
  const series = match.series || match.name || "";
  const localTimeStr = matchDate ? matchDate.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }) : "";
  const allScores = match.score ?? [];
  const t1Scores = allScores.filter(
    (s) => s.inning.toLowerCase().startsWith(team1.toLowerCase())
  );
  const t2Scores = allScores.filter(
    (s) => s.inning.toLowerCase().startsWith(team2.toLowerCase())
  );
  const latestT1 = t1Scores[t1Scores.length - 1];
  const latestT2 = t2Scores[t2Scores.length - 1];
  const displayStatus = formatMatchStatus(statusText, matchStatus, matchDate);
  const activeScorecard = (scorecardData == null ? void 0 : scorecardData.scorecard) && scorecardData.scorecard.length > 0 ? scorecardData.scorecard : match.scorecard && match.scorecard.length > 0 ? match.scorecard : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto px-4 py-4", "data-ocid": "match.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => window.history.back(),
          className: "flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors",
          "data-ocid": "match.link",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
            "Back"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          variant: "outline",
          onClick: fetchMatch,
          "data-ocid": "match.button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3.5 h-3.5 mr-1.5" }),
            "Refresh"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: matchStatus }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-extrabold text-foreground mt-2 mb-1", children: cleanTitle }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        series,
        " · ",
        (_g = match.matchType) == null ? void 0 : _g.toUpperCase()
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground", children: [
        localTimeStr && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3.5 h-3.5" }),
          localTimeStr
        ] }),
        match.venue && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3.5 h-3.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate max-w-[220px]", children: match.venue })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-4 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-stretch justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl", children: getTeamFlag(team1) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-foreground text-sm", children: team1 })
          ] }),
          latestT1 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-2xl font-extrabold text-foreground", children: [
              latestT1.r,
              "/",
              latestT1.w
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "(",
              latestT1.o,
              " ovs)"
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground italic", children: "Yet to bat" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center text-xs font-bold text-muted-foreground px-2", children: "VS" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-1 items-end text-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-foreground text-sm", children: team2 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl", children: getTeamFlag(team2) })
          ] }),
          latestT2 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-2xl font-extrabold text-foreground", children: [
              latestT2.r,
              "/",
              latestT2.w
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "(",
              latestT2.o,
              " ovs)"
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground italic", children: "Yet to bat" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 pt-3 border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: `text-sm font-semibold text-center ${matchStatus === "live" ? "text-cric-red" : matchStatus === "result" ? "text-foreground" : "text-muted-foreground"}`,
          children: displayStatus || "Match yet to begin"
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "info", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "w-full mb-4", "data-ocid": "match.tab", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "info", className: "flex-1", "data-ocid": "match.tab", children: "Info" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          TabsTrigger,
          {
            value: "scorecard",
            className: "flex-1",
            "data-ocid": "match.tab",
            children: "Scorecard"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          TabsTrigger,
          {
            value: "commentary",
            className: "flex-1",
            "data-ocid": "match.tab",
            children: "Commentary"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "info", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-4 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base", children: "🏏" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Teams" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-foreground font-medium", children: [
              team1,
              " vs ",
              team2
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base", children: matchStatus === "live" ? "🔴" : matchStatus === "result" ? "🏆" : "⏰" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: `text-sm font-medium ${matchStatus === "live" ? "text-cric-red" : "text-foreground"}`,
                children: displayStatus || "—"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-4 h-4 text-muted-foreground mt-0.5 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Date & Time (Local)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground font-medium", children: localTimeStr || "—" })
          ] })
        ] }),
        match.venue && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-4 h-4 text-muted-foreground mt-0.5 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Venue" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground font-medium", children: match.venue })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "w-4 h-4 text-muted-foreground mt-0.5 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Match Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground font-medium", children: ((_h = match.matchType) == null ? void 0 : _h.toUpperCase()) || "—" })
          ] })
        ] }),
        series && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base", children: "🏆" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Series" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground font-medium", children: series })
          ] })
        ] }),
        match.tossWinner && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base", children: "🪙" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Toss" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-foreground font-medium", children: [
              match.tossWinner,
              " won the toss",
              match.tossChoice ? ` and chose to ${match.tossChoice}` : ""
            ] })
          ] })
        ] }),
        matchStatus === "upcoming" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4 text-muted-foreground mt-0.5 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Starts" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-green-600 dark:text-green-400 font-semibold", children: displayStatus })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "scorecard", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        ScorecardTab,
        {
          scorecard: activeScorecard,
          scorecardLoading,
          scorecardError,
          allScores
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "commentary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CommentaryTab, { scorecard: activeScorecard }) })
    ] })
  ] });
}
export {
  MatchDetailPage as default
};
