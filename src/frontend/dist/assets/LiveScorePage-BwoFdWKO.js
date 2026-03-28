import { a as useMatches, r as reactExports, j as jsxRuntimeExports, B as Button, n as normalizeSeries, C as ChevronDown } from "./index-IMEFWTGH.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-PAOMhWH-.js";
import { M as MatchCard } from "./MatchCard-zNJSOEhq.js";
import { M as MatchCardSkeleton } from "./SkeletonCard-6_49rU3L.js";
import { R as RefreshCw } from "./refresh-cw-Cm37vGTm.js";
import { C as CircleAlert } from "./circle-alert-B_yHyY2s.js";
import "./index-Bu8HvS1Y.js";
import "./calendar-CAGHPkdX.js";
import "./map-pin-C58W4pip.js";
import "./clock-kGPCKZxX.js";
import "./skeleton-JqxoG2DC.js";
const TYPE_OPTIONS = ["All", "T20", "ODI", "Test", "T10"];
function detectSeries(series) {
  const s = (series || "").toLowerCase();
  if (s.includes("ipl") || s.includes("indian premier league")) return "IPL";
  if (s.includes("psl") || s.includes("pakistan super league")) return "PSL";
  if (s.includes("women")) return "WOMEN";
  return "INTERNATIONAL";
}
function groupAndSortBySeries(matches) {
  var _a;
  const groups = {};
  for (const match of matches) {
    const key = normalizeSeries(match.series) || "other";
    if (!groups[key]) {
      groups[key] = {
        seriesName: match.series || "Other",
        key,
        matches: [],
        nearestDate: Number.POSITIVE_INFINITY
      };
    }
    groups[key].matches.push(match);
    const t = ((_a = match.matchDate) == null ? void 0 : _a.getTime()) ?? Number.POSITIVE_INFINITY;
    if (t < groups[key].nearestDate) groups[key].nearestDate = t;
  }
  for (const g of Object.values(groups)) {
    g.matches.sort(
      (a, b) => {
        var _a2, _b;
        return (((_a2 = a.matchDate) == null ? void 0 : _a2.getTime()) ?? 0) - (((_b = b.matchDate) == null ? void 0 : _b.getTime()) ?? 0);
      }
    );
  }
  return Object.values(groups).sort((a, b) => a.nearestDate - b.nearestDate);
}
function applyFilters(matches, seriesFilter, typeFilter) {
  const filtered = matches.filter((m) => {
    const seriesOk = seriesFilter === "All" || detectSeries(m.series) === seriesFilter;
    const typeOk = typeFilter === "All" || m.matchType === typeFilter.toLowerCase();
    return seriesOk && typeOk;
  });
  return filtered;
}
function FilterDropdown({
  label,
  options,
  value,
  onChange
}) {
  const [open, setOpen] = reactExports.useState(false);
  const ref = reactExports.useRef(null);
  reactExports.useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target))
        setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", ref, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => setOpen((o) => !o),
        className: "border border-border rounded-lg px-3 py-2 text-sm flex items-center gap-2 bg-card hover:bg-muted transition-colors",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground text-xs", children: [
            label,
            ":"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: value }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ChevronDown,
            {
              className: `w-3.5 h-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`
            }
          )
        ]
      }
    ),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute z-50 mt-1 bg-card border border-border rounded-lg shadow-lg min-w-[140px]", children: options.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        className: `w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg ${value === opt ? "font-semibold text-cric-red" : ""}`,
        onClick: () => {
          onChange(opt);
          setOpen(false);
        },
        children: opt
      },
      opt
    )) })
  ] });
}
function SeriesGroupedList({ groups }) {
  if (groups.length === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: groups.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-1.5 mb-3", children: g.seriesName }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: g.matches.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(MatchCard, { match: m }, m.id)) })
  ] }, g.key)) });
}
function LiveScorePage() {
  const { classified, loading, error, refresh } = useMatches();
  const [refreshing, setRefreshing] = reactExports.useState(false);
  const [seriesFilter, setSeriesFilter] = reactExports.useState("All");
  const [typeFilter, setTypeFilter] = reactExports.useState("All");
  reactExports.useEffect(() => {
    document.title = "Live Cricket Scores – CricFlash";
  }, []);
  const dynamicSeriesOptions = reactExports.useMemo(() => {
    const all = [
      ...classified.live,
      ...classified.upcoming,
      ...classified.completed
    ];
    const seen = /* @__PURE__ */ new Set();
    const opts = ["All"];
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
    completed: completedMatches
  } = classified;
  const filteredLive = applyFilters(liveMatches, seriesFilter, typeFilter);
  const filteredUpcoming = applyFilters(
    upcomingMatches,
    seriesFilter,
    typeFilter
  );
  const filteredCompleted = applyFilters(
    completedMatches,
    seriesFilter,
    typeFilter
  );
  const visibleMatches = [
    ...filteredLive,
    ...filteredUpcoming,
    ...filteredCompleted
  ];
  console.log("VISIBLE:", visibleMatches.length);
  const liveGroups = groupAndSortBySeries(filteredLive);
  const upcomingGroups = groupAndSortBySeries(filteredUpcoming);
  const completedGroups = groupAndSortBySeries(filteredCompleted);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1200px] mx-auto px-4 py-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-extrabold text-foreground", children: "Live Cricket Scores" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Real-time scores from around the world" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          variant: "outline",
          onClick: handleRefresh,
          disabled: refreshing,
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
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 bg-destructive/10 border border-destructive/30 text-destructive rounded-xl p-4 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4 shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: error }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          size: "sm",
          variant: "outline",
          onClick: handleRefresh,
          className: "ml-auto",
          children: "Retry"
        }
      )
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: [1, 2, 3, 4, 5, 6].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(MatchCardSkeleton, {}, i)) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "live", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "w-full mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "live", className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-cric-red animate-pulse" }),
          "Live",
          liveMatches.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-xs bg-cric-red text-white rounded-full px-1.5 py-0.5 leading-none", children: liveMatches.length })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "upcoming", className: "flex-1", children: "Upcoming" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "results", className: "flex-1", children: "Results" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FilterDropdown,
          {
            label: "Series",
            options: dynamicSeriesOptions,
            value: seriesFilter,
            onChange: setSeriesFilter
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FilterDropdown,
          {
            label: "Type",
            options: [...TYPE_OPTIONS],
            value: typeFilter,
            onChange: (v) => setTypeFilter(v)
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "live", children: liveGroups.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(SeriesGroupedList, { groups: liveGroups }) : seriesFilter !== "All" || typeFilter !== "All" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg", children: "No live matches" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Try adjusting your filters" })
      ] }) : upcomingGroups.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-3", children: "No live matches right now — showing upcoming" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SeriesGroupedList,
          {
            groups: upcomingGroups.map((g) => ({
              ...g,
              matches: g.matches.slice(0, 2)
            })).filter((g) => g.matches.length > 0)
          }
        )
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg", children: "No live matches" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Check back later for live scores" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "upcoming", children: upcomingGroups.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(SeriesGroupedList, { groups: upcomingGroups }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg", children: "No upcoming matches" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: seriesFilter !== "All" || typeFilter !== "All" ? "Try adjusting your filters" : "No scheduled matches found" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "results", children: completedGroups.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(SeriesGroupedList, { groups: completedGroups }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg", children: "No results available" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: seriesFilter !== "All" || typeFilter !== "All" ? "Try adjusting your filters" : "No completed matches yet" })
      ] }) })
    ] })
  ] });
}
export {
  LiveScorePage as default
};
