import { j as jsxRuntimeExports, L as Link } from "./index-Dx0VHhmn.js";
import { C as Calendar } from "./calendar-Di8bOqwf.js";
import { M as MapPin } from "./map-pin-EjyW9VV3.js";
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
function formatMatchDate(date) {
  if (!date) return "";
  const now = /* @__PURE__ */ new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const matchDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  if (matchDay.getTime() === today.getTime()) return "Today";
  if (matchDay.getTime() === tomorrow.getTime()) return "Tomorrow";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function StatusBadge({ status }) {
  if (status === "live") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 bg-cric-red text-white text-xs font-bold px-2 py-0.5 rounded-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-white animate-pulse" }),
      "LIVE"
    ] });
  }
  if (status === "upcoming") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold bg-green-500/15 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full", children: "Upcoming" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full", children: "Result" });
}
function CardContent({ match }) {
  const {
    team1,
    team2,
    score1,
    wickets1,
    overs1,
    score2,
    wickets2,
    overs2,
    status,
    matchDate,
    venue,
    series,
    matchType,
    statusText,
    seriesCategory
  } = match;
  const bothNull = score1 === null && score2 === null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-4 shadow-card hover:border-cric-border transition-colors", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
        seriesCategory !== "International" && seriesCategory !== "Domestic" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-orange-500/15 text-orange-600 dark:text-orange-400", children: seriesCategory }),
        matchType && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: matchType })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg", children: getTeamFlag(team1) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm text-foreground", children: team1 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold text-foreground", children: [
          score1 !== null ? `${score1}${wickets1 !== null ? `/${wickets1}` : ""}` : "",
          overs1 !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground font-normal ml-1", children: [
            "(",
            overs1,
            ")"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg", children: getTeamFlag(team2) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm text-foreground", children: team2 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold text-foreground", children: [
          score2 !== null ? `${score2}${wickets2 !== null ? `/${wickets2}` : ""}` : "",
          overs2 !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground font-normal ml-1", children: [
            "(",
            overs2,
            ")"
          ] })
        ] })
      ] })
    ] }),
    bothNull && status === "upcoming" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground italic mb-2", children: "Match not started" }),
    statusText && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-cric-red font-medium truncate mb-2", children: [
      statusText.slice(0, 60),
      statusText.length > 60 ? "…" : ""
    ] }),
    series && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground truncate mb-1", children: [
      series.slice(0, 50),
      series.length > 50 ? "…" : ""
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3 text-xs text-muted-foreground", children: [
      matchDate && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3 h-3" }),
        formatMatchDate(matchDate)
      ] }),
      venue && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 truncate", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3 h-3 shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "truncate", children: [
          venue.slice(0, 35),
          venue.length > 35 ? "…" : ""
        ] })
      ] })
    ] })
  ] });
}
function MatchCard({ match, showLink = true }) {
  if (!showLink) return /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { match });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/match/$matchId", params: { matchId: match.id }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { match }) });
}
export {
  MatchCard as M
};
