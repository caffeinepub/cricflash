import { r as reactExports, e as useNavigate, f as getUpcomingMatches, j as jsxRuntimeExports, A as ArrowLeft, L as Link } from "./index-DJUMNUlM.js";
import { R as RefreshCw } from "./refresh-cw-Crv8m3W_.js";
import { C as Calendar } from "./calendar-LnQU8DzS.js";
import { C as Clock } from "./clock-BBXbijUY.js";
const SERIES_FILTERS = ["All", "IPL", "PSL", "International"];
const TYPE_FILTERS = ["All", "T20", "ODI", "Test"];
function applyFilters(matches, seriesFilter, typeFilter) {
  return matches.filter((m) => {
    var _a, _b;
    const name = ((_a = m.name) == null ? void 0 : _a.toLowerCase()) || "";
    const type = ((_b = m.matchType) == null ? void 0 : _b.toLowerCase()) || "";
    const seriesOk = seriesFilter === "All" || seriesFilter === "IPL" && name.includes("ipl") || seriesFilter === "PSL" && name.includes("psl") || seriesFilter === "International" && !name.includes("ipl") && !name.includes("psl");
    const typeOk = typeFilter === "All" || type.includes(typeFilter.toLowerCase());
    return seriesOk && typeOk;
  });
}
function getMatchLabel(match) {
  const name = match.name || "";
  const lower = name.toLowerCase();
  if (lower.includes("ipl")) return "IPL";
  if (lower.includes("psl")) return "PSL";
  if (lower.includes("test")) return "TEST";
  if (lower.includes("odi")) return "ODI";
  if (match.matchType) return match.matchType.toUpperCase();
  return "MATCH";
}
function getLabelColor(label) {
  switch (label) {
    case "IPL":
      return "bg-orange-500/15 text-orange-600 dark:text-orange-400";
    case "PSL":
      return "bg-green-500/15 text-green-600 dark:text-green-400";
    case "TEST":
      return "bg-purple-500/15 text-purple-600 dark:text-purple-400";
    case "ODI":
      return "bg-blue-500/15 text-blue-600 dark:text-blue-400";
    default:
      return "bg-muted text-muted-foreground";
  }
}
function formatDateTime(dateStr) {
  if (!dateStr) return { date: "TBD", time: "" };
  const d = new Date(dateStr);
  const date = d.toLocaleDateString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  });
  const time = d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
  return { date, time };
}
function UpcomingMatchesPage() {
  const [matches, setMatches] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const [lastUpdated, setLastUpdated] = reactExports.useState(null);
  const [seriesFilter, setSeriesFilter] = reactExports.useState("All");
  const [typeFilter, setTypeFilter] = reactExports.useState("All");
  const navigate = useNavigate();
  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate({ to: "/" });
    }
  };
  const loadMatches = reactExports.useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true);
    setError(null);
    try {
      const data = await getUpcomingMatches();
      const filtered = data.filter((m) => !m.matchStarted && !m.matchEnded).sort((a, b) => {
        const da = a.dateTimeGMT || a.date || "";
        const db = b.dateTimeGMT || b.date || "";
        return da.localeCompare(db);
      });
      setMatches(filtered);
      setLastUpdated(/* @__PURE__ */ new Date());
    } catch {
      setError("Failed to load upcoming matches. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);
  reactExports.useEffect(() => {
    document.title = "Upcoming Matches – CricFlash";
    loadMatches();
  }, [loadMatches]);
  const filteredMatches = applyFilters(matches, seriesFilter, typeFilter);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1200px] mx-auto px-4 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: handleBack,
          className: "flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
            "Back"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-extrabold text-foreground", children: "Upcoming Matches" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "All scheduled cricket matches sorted by date" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          lastUpdated && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            "Updated",
            " ",
            lastUpdated.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => loadMatches(true),
              disabled: loading,
              className: "flex items-center gap-1.5 text-xs font-semibold text-cric-red hover:opacity-80 transition-opacity disabled:opacity-40",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  RefreshCw,
                  {
                    className: `w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`
                  }
                ),
                "Refresh"
              ]
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-muted-foreground shrink-0", children: "Series:" }),
        SERIES_FILTERS.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setSeriesFilter(f),
            className: `shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${seriesFilter === f ? "bg-cric-red text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`,
            "data-ocid": "upcoming.toggle",
            children: f
          },
          f
        ))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-muted-foreground shrink-0", children: "Type:" }),
        TYPE_FILTERS.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setTypeFilter(f),
            className: `shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${typeFilter === f ? "bg-cric-red text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`,
            "data-ocid": "upcoming.toggle",
            children: f
          },
          f
        ))
      ] })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-destructive/10 border border-destructive/20 text-destructive rounded-xl p-4 mb-6 text-sm", children: error }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: [1, 2, 3, 4, 5, 6].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "h-44 rounded-2xl bg-card border border-border animate-pulse"
      },
      n
    )) }) : filteredMatches.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center py-20 bg-card border border-border rounded-2xl",
        "data-ocid": "upcoming.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-5xl mb-4", children: "🏏" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-semibold text-foreground", children: seriesFilter !== "All" || typeFilter !== "All" ? "No matches match your filters" : "No upcoming matches found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: seriesFilter !== "All" || typeFilter !== "All" ? "Try selecting different filters" : "Check back soon for scheduled matches" })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mb-4", children: [
        filteredMatches.length,
        " match",
        filteredMatches.length !== 1 ? "es" : "",
        " scheduled"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: filteredMatches.map((match, idx) => {
        var _a, _b;
        const label = getMatchLabel(match);
        const { date, time } = formatDateTime(
          match.dateTimeGMT || match.date
        );
        const teamA = ((_a = match.teams) == null ? void 0 : _a[0]) || "TBD";
        const teamB = ((_b = match.teams) == null ? void 0 : _b[1]) || "TBD";
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/match/$matchId",
            params: { matchId: match.id },
            "data-ocid": `upcoming.item.${idx + 1}`,
            className: "block bg-card border border-border rounded-2xl p-5 hover:border-cric-red/50 hover:shadow-md transition-all group",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `text-xs font-bold px-2.5 py-1 rounded-full ${getLabelColor(label)}`,
                    children: label
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-green-600 dark:text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full", children: "UPCOMING" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground group-hover:text-cric-red transition-colors line-clamp-2", children: teamA }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-semibold my-1", children: "VS" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground group-hover:text-cric-red transition-colors line-clamp-2", children: teamB })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border pt-3 space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3.5 h-3.5 text-muted-foreground" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: date })
                ] }),
                time && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3.5 h-3.5 text-muted-foreground" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: time })
                ] })
              ] })
            ]
          },
          match.id
        );
      }) })
    ] })
  ] });
}
export {
  UpcomingMatchesPage as default
};
