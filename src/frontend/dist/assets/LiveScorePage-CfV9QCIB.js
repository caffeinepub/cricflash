import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, B as Button } from "./index-j1Env-oC.js";
import { M as MatchCard } from "./MatchCard-BZv5PaPT.js";
import { M as MatchCardSkeleton } from "./SkeletonCard-BEnWgYZL.js";
import { g as getLiveMatches, R as RefreshCw } from "./cricapi-wOqUhz2l.js";
import { C as CircleAlert } from "./circle-alert-B8VuEOdb.js";
import "./map-pin-Ch6tZm94.js";
import "./skeleton-DUYq6DRP.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polyline", { points: "12 6 12 12 16 14", key: "68esgv" }]
];
const Clock = createLucideIcon("clock", __iconNode);
const REFRESH_INTERVAL = 150;
function LiveScorePage() {
  const [matches, setMatches] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const [countdown, setCountdown] = reactExports.useState(REFRESH_INTERVAL);
  const [refreshing, setRefreshing] = reactExports.useState(false);
  reactExports.useEffect(() => {
    document.title = "Live Cricket Scores – CricFlash";
  }, []);
  const fetchMatches = reactExports.useCallback(async (manual = false) => {
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
  reactExports.useEffect(() => {
    fetchMatches();
    const interval = setInterval(() => fetchMatches(), REFRESH_INTERVAL * 1e3);
    return () => clearInterval(interval);
  }, [fetchMatches]);
  reactExports.useEffect(() => {
    const timer = setInterval(
      () => setCountdown((c) => c <= 1 ? REFRESH_INTERVAL : c - 1),
      1e3
    );
    return () => clearInterval(timer);
  }, []);
  const liveMatches = matches.filter((m) => m.matchStarted && !m.matchEnded);
  const recentMatches = matches.filter((m) => m.matchEnded);
  const upcomingMatches = matches.filter((m) => !m.matchStarted);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1200px] mx-auto px-4 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-extrabold text-foreground", children: "Live Cricket Scores" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Real-time scores from around the world" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: "flex items-center gap-1.5 text-sm text-muted-foreground",
            "data-ocid": "live.loading_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4" }),
              "Refreshes in ",
              countdown,
              "s"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: "outline",
            onClick: () => fetchMatches(true),
            disabled: refreshing,
            "data-ocid": "live.button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                RefreshCw,
                {
                  className: `w-3.5 h-3.5 mr-1.5 ${refreshing ? "animate-spin" : ""}`
                }
              ),
              "Refresh"
            ]
          }
        )
      ] })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-3 bg-destructive/10 border border-destructive/30 text-destructive rounded-xl p-4 mb-6",
        "data-ocid": "live.error_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: error }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              variant: "outline",
              onClick: () => fetchMatches(true),
              className: "ml-auto",
              children: "Retry"
            }
          )
        ]
      }
    ),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
        "data-ocid": "live.loading_state",
        children: [1, 2, 3, 4, 5, 6].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(MatchCardSkeleton, {}, i))
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      liveMatches.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "flex items-center gap-2 text-lg font-bold text-foreground mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-cric-red animate-pulse" }),
          "Live Now (",
          liveMatches.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: liveMatches.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": `live.item.${i + 1}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(MatchCard, { match: m }) }, m.id)) })
      ] }),
      upcomingMatches.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-foreground mb-4", children: "Upcoming Matches" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: upcomingMatches.slice(0, 9).map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": `live.item.${i + 1}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(MatchCard, { match: m }) }, m.id)) })
      ] }),
      recentMatches.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-foreground mb-4", children: "Recent Results" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: recentMatches.slice(0, 6).map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": `live.item.${i + 1}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(MatchCard, { match: m }) }, m.id)) })
      ] }),
      matches.length === 0 && !error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-16", "data-ocid": "live.empty_state", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg", children: "No matches found" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Check back later for live scores" })
      ] })
    ] })
  ] });
}
export {
  LiveScorePage as default
};
