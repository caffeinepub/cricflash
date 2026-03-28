import { a as useMatches, r as reactExports, n as normalizeSeries, j as jsxRuntimeExports } from "./index-IMEFWTGH.js";
function getMonthYear(date) {
  if (!date) return "Unknown";
  return date.toLocaleString("default", { month: "long", year: "numeric" });
}
function SeriesPage() {
  const { classified } = useMatches();
  const [search, setSearch] = reactExports.useState("");
  reactExports.useEffect(() => {
    document.title = "Cricket Series – CricFlash";
  }, []);
  const seriesList = reactExports.useMemo(() => {
    const all = [
      ...classified.live,
      ...classified.upcoming,
      ...classified.completed
    ];
    const seriesMap = {};
    for (const match of all) {
      if (!match.series) continue;
      const key = normalizeSeries(match.series);
      if (!seriesMap[key]) {
        seriesMap[key] = { name: match.series, dates: [], count: 0 };
      }
      seriesMap[key].count += 1;
      if (match.matchDate) {
        seriesMap[key].dates.push(match.matchDate);
      }
    }
    return Object.entries(seriesMap).map(([key, val]) => {
      const sorted = val.dates.sort((a, b) => a.getTime() - b.getTime());
      return {
        name: val.name,
        key,
        startDate: sorted[0] ?? null,
        endDate: sorted[sorted.length - 1] ?? null,
        matchCount: val.count
      };
    });
  }, [classified]);
  const filteredSeries = reactExports.useMemo(() => {
    if (!search.trim()) return seriesList;
    const q = search.toLowerCase();
    return seriesList.filter((s) => s.name.toLowerCase().includes(q));
  }, [seriesList, search]);
  const groupedSeries = reactExports.useMemo(() => {
    const groups = {};
    for (const s of filteredSeries) {
      const key = getMonthYear(s.startDate);
      if (!groups[key]) groups[key] = [];
      groups[key].push(s);
    }
    for (const key of Object.keys(groups)) {
      groups[key].sort(
        (a, b) => {
          var _a, _b;
          return (((_a = a.startDate) == null ? void 0 : _a.getTime()) ?? 0) - (((_b = b.startDate) == null ? void 0 : _b.getTime()) ?? 0);
        }
      );
    }
    const entries = Object.entries(groups);
    entries.sort((a, b) => {
      var _a, _b, _c, _d;
      const aMin = ((_b = (_a = a[1][0]) == null ? void 0 : _a.startDate) == null ? void 0 : _b.getTime()) ?? 0;
      const bMin = ((_d = (_c = b[1][0]) == null ? void 0 : _c.startDate) == null ? void 0 : _d.getTime()) ?? 0;
      return aMin - bMin;
    });
    return entries;
  }, [filteredSeries]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1200px] mx-auto px-4 py-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-extrabold text-foreground", children: "Cricket Series" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "All active and upcoming tournaments" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "text",
        placeholder: "Search series...",
        value: search,
        onChange: (e) => setSearch(e.target.value),
        className: "w-full max-w-sm border border-border rounded-lg px-4 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-cric-red/30",
        style: { fontSize: 16 }
      }
    ) }),
    groupedSeries.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: search ? "No series match your search" : "No series data available" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-8", children: groupedSeries.map(([monthYear, items]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-1.5 mb-3", children: monthYear.toUpperCase() }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: items.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "bg-card border border-border rounded-xl px-4 py-3 flex items-center justify-between gap-3",
          "data-ocid": "series.card",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground truncate", children: s.name }),
              s.startDate && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                s.startDate.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric"
                }),
                s.endDate && s.endDate.getTime() !== s.startDate.getTime() && ` – ${s.endDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground whitespace-nowrap shrink-0", children: [
              s.matchCount,
              " match",
              s.matchCount !== 1 ? "es" : ""
            ] })
          ]
        },
        s.key
      )) })
    ] }, monthYear)) })
  ] });
}
export {
  SeriesPage as default
};
