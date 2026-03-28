import { b as useParams, r as reactExports, g as getMatchDetail, j as jsxRuntimeExports, B as Button, A as ArrowLeft, T as Trophy } from "./index-DFODS0s7.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-CA6P5qwY.js";
import { M as MatchCardSkeleton } from "./SkeletonCard-hBk1nDTC.js";
import { C as CircleAlert } from "./circle-alert-Bswwbc_E.js";
import { R as RefreshCw } from "./refresh-cw-JiBTIZQl.js";
import { C as Calendar } from "./calendar-BkNme3wD.js";
import { M as MapPin } from "./map-pin-BoIUw9EI.js";
import { C as Clock } from "./clock-CtxgGtDy.js";
import "./index-D2f4t9UW.js";
import "./skeleton-CN0nOUP4.js";
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
function detectSeries(name, series) {
  const haystack = `${series ?? ""} ${name}`.toLowerCase();
  if (haystack.includes("ipl")) return "IPL";
  if (haystack.includes("psl")) return "PSL";
  return "International";
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
function MatchDetailPage() {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const { matchId } = useParams({ from: "/match/$matchId" });
  const [match, setMatch] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
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
  reactExports.useEffect(() => {
    fetchMatch();
  }, [fetchMatch]);
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
  let matchStatus;
  if (statusText.toLowerCase().includes("live")) {
    matchStatus = "live";
  } else if (matchDate && matchDate > now) {
    matchStatus = "upcoming";
  } else {
    matchStatus = "result";
  }
  const team1 = ((_b = (_a = match.teamInfo) == null ? void 0 : _a[0]) == null ? void 0 : _b.name) || ((_c = match.teams) == null ? void 0 : _c[0]) || "TBA";
  const team2 = ((_e = (_d = match.teamInfo) == null ? void 0 : _d[1]) == null ? void 0 : _e.name) || ((_f = match.teams) == null ? void 0 : _f[1]) || "TBA";
  const cleanTitle = `${team1} vs ${team2}`;
  const series = detectSeries(match.name ?? "", match.series);
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
  const currentInnings = allScores[allScores.length - 1];
  const crr = currentInnings && currentInnings.o > 0 ? (currentInnings.r / currentInnings.o).toFixed(2) : null;
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
      match.status && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 pt-3 border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: `text-sm font-semibold text-center ${matchStatus === "live" ? "text-cric-red" : matchStatus === "result" ? "text-foreground" : "text-muted-foreground"}`,
          children: matchStatus === "upcoming" ? "Match yet to begin" : match.status
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "live", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "w-full mb-4", "data-ocid": "match.tab", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "live", className: "flex-1", "data-ocid": "match.tab", children: "Live" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          TabsTrigger,
          {
            value: "scorecard",
            className: "flex-1",
            "data-ocid": "match.tab",
            children: "Scorecard"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "info", className: "flex-1", "data-ocid": "match.tab", children: "Info" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "live", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-4", children: [
        matchStatus === "upcoming" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-10 h-10 text-muted-foreground mx-auto mb-3" }),
          localTimeStr && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold text-foreground mb-1", children: [
            "Match begins ",
            localTimeStr
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Match yet to begin" })
        ] }),
        matchStatus === "result" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "w-10 h-10 text-muted-foreground mx-auto mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground mb-1", children: "Match Ended" }),
          match.status && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: match.status })
        ] }),
        matchStatus === "live" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          currentInnings && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2", children: "Currently Batting" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background rounded-lg p-3 border border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: currentInnings.inning }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-2xl font-extrabold text-foreground", children: [
                    currentInnings.r,
                    "/",
                    currentInnings.w
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                    currentInnings.o,
                    " overs"
                  ] })
                ] }),
                crr && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "CRR" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold text-cric-red", children: crr })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2 border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-cric-red animate-pulse inline-block" }),
            "Ball-by-ball commentary coming soon"
          ] }) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "scorecard", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-4", children: [
        allScores.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 mb-4", children: allScores.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
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
        match.scorecard && match.scorecard.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: match.scorecard.map((innings) => {
          var _a2, _b2, _c2, _d2;
          const inningsKey = ((_b2 = (_a2 = innings.batting[0]) == null ? void 0 : _a2.batsman) == null ? void 0 : _b2.id) ?? ((_d2 = (_c2 = innings.bowling[0]) == null ? void 0 : _c2.bowler) == null ? void 0 : _d2.id) ?? `${innings.batting.length}-${innings.bowling.length}`;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            innings.batting && innings.batting.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
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
                /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: innings.batting.map((b) => {
                  var _a3, _b3, _c3;
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "tr",
                    {
                      className: "border-b border-border/50 last:border-0",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2 font-medium text-foreground", children: ((_a3 = b.batsman) == null ? void 0 : _a3.name) ?? "—" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2 text-right font-bold text-foreground", children: b.r }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2 text-right text-muted-foreground", children: b.b }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2 text-right text-muted-foreground", children: b["4s"] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2 text-right text-muted-foreground", children: b["6s"] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2 text-right text-muted-foreground", children: b.sr })
                      ]
                    },
                    ((_b3 = b.batsman) == null ? void 0 : _b3.id) ?? ((_c3 = b.batsman) == null ? void 0 : _c3.name)
                  );
                }) })
              ] }) })
            ] }),
            innings.bowling && innings.bowling.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2", children: "Bowling" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs min-w-[360px]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/50", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-2 py-2 font-semibold text-muted-foreground", children: "Bowler" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-2 py-2 font-semibold text-muted-foreground", children: "O" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-2 py-2 font-semibold text-muted-foreground", children: "M" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-2 py-2 font-semibold text-muted-foreground", children: "R" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-2 py-2 font-semibold text-muted-foreground", children: "W" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-2 py-2 font-semibold text-muted-foreground", children: "Econ" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: innings.bowling.map((bwl) => {
                  var _a3, _b3, _c3;
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "tr",
                    {
                      className: "border-b border-border/50 last:border-0",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2 font-medium text-foreground", children: ((_a3 = bwl.bowler) == null ? void 0 : _a3.name) ?? "—" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2 text-right text-muted-foreground", children: bwl.o }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2 text-right text-muted-foreground", children: bwl.m }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2 text-right text-muted-foreground", children: bwl.r }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2 text-right font-bold text-foreground", children: bwl.w }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2 text-right text-muted-foreground", children: bwl.eco })
                      ]
                    },
                    ((_b3 = bwl.bowler) == null ? void 0 : _b3.id) ?? ((_c3 = bwl.bowler) == null ? void 0 : _c3.name)
                  );
                }) })
              ] }) })
            ] })
          ] }, inningsKey);
        }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center pt-2 italic", children: "Detailed scorecard not available" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "info", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-4 space-y-3", children: [
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
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
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
        ] })
      ] }) })
    ] })
  ] });
}
export {
  MatchDetailPage as default
};
