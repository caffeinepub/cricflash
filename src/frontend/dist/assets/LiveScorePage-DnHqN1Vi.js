import { a as useMatches, r as reactExports, j as jsxRuntimeExports, B as Button, C as ChevronDown } from "./index-DExhfFjt.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-BPgGiFhz.js";
import { M as MatchCard } from "./MatchCard-BxbynEXE.js";
import { M as MatchCardSkeleton } from "./SkeletonCard-k6yQ5z9k.js";
import { R as RefreshCw } from "./refresh-cw-t7772vqi.js";
import { C as CircleAlert } from "./circle-alert-CK7lUOFW.js";
import "./index-Cgmh-5us.js";
import "./calendar-BKjVqbwH.js";
import "./map-pin-zCXAaO68.js";
import "./skeleton-BnMYrfNi.js";
const SERIES_OPTIONS = ["All", "IPL", "PSL", "International"];
const TYPE_OPTIONS = ["All", "T20", "ODI", "Test"];
function applyFilters(matches, seriesFilter, typeFilter) {
  return matches.filter((m) => {
    const seriesOk = seriesFilter === "All" || seriesFilter === "IPL" && m.series === "IPL" || seriesFilter === "PSL" && m.series === "PSL" || seriesFilter === "International" && m.series === "International";
    const typeOk = typeFilter === "All" || m.matchType.toUpperCase() === typeFilter.toUpperCase();
    return seriesOk && typeOk;
  });
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
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
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
function LiveScorePage() {
  const { classified, loading, error, refresh } = useMatches();
  const [refreshing, setRefreshing] = reactExports.useState(false);
  const [seriesFilter, setSeriesFilter] = reactExports.useState("All");
  const [typeFilter, setTypeFilter] = reactExports.useState("All");
  reactExports.useEffect(() => {
    document.title = "Live Cricket Scores – CricFlash";
  }, []);
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1200px] mx-auto px-4 py-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6", children: [
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
              onClick: handleRefresh,
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
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "live", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "w-full mb-4", "data-ocid": "live.tab", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "live", className: "flex-1", "data-ocid": "live.tab", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-cric-red animate-pulse" }),
          "Live",
          liveMatches.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-xs bg-cric-red text-white rounded-full px-1.5 py-0.5 leading-none", children: liveMatches.length })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          TabsTrigger,
          {
            value: "upcoming",
            className: "flex-1",
            "data-ocid": "live.tab",
            children: "Upcoming"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          TabsTrigger,
          {
            value: "results",
            className: "flex-1",
            "data-ocid": "live.tab",
            children: "Results"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FilterDropdown,
          {
            label: "Series",
            options: SERIES_OPTIONS,
            value: seriesFilter,
            onChange: setSeriesFilter
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FilterDropdown,
          {
            label: "Type",
            options: TYPE_OPTIONS,
            value: typeFilter,
            onChange: setTypeFilter
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "live", children: filteredLive.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: filteredLive.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": `live.item.${i + 1}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(MatchCard, { match: m }) }, m.id)) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-16", "data-ocid": "live.empty_state", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg", children: "No live matches" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: seriesFilter !== "All" || typeFilter !== "All" ? "Try adjusting your filters" : "Check back later for live scores" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "upcoming", children: filteredUpcoming.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: filteredUpcoming.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": `live.item.${i + 1}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(MatchCard, { match: m }) }, m.id)) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-16", "data-ocid": "live.empty_state", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg", children: "No upcoming matches" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: seriesFilter !== "All" || typeFilter !== "All" ? "Try adjusting your filters" : "No scheduled matches in the next 5 days" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "results", children: filteredCompleted.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: filteredCompleted.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": `live.item.${i + 1}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(MatchCard, { match: m }) }, m.id)) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-16", "data-ocid": "live.empty_state", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg", children: "No results available" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: seriesFilter !== "All" || typeFilter !== "All" ? "Try adjusting your filters" : "No completed matches yet" })
      ] }) })
    ] })
  ] });
}
export {
  LiveScorePage as default
};
