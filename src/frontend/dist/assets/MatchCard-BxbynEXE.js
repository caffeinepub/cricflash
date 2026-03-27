import { j as jsxRuntimeExports, L as Link } from "./index-DExhfFjt.js";
import { C as Calendar } from "./calendar-BKjVqbwH.js";
import { M as MapPin } from "./map-pin-zCXAaO68.js";
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
    score2,
    overs1,
    overs2,
    status,
    date,
    venue,
    series,
    matchType,
    statusText
  } = match;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-4 shadow-card hover:border-cric-border transition-colors", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
        series !== "International" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-orange-500/15 text-orange-600 dark:text-orange-400", children: series }),
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
        score1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold text-foreground", children: [
          score1,
          overs1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground font-normal ml-1", children: [
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
        score2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold text-foreground", children: [
          score2,
          overs2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground font-normal ml-1", children: [
            "(",
            overs2,
            ")"
          ] })
        ] })
      ] })
    ] }),
    statusText && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-cric-red font-medium truncate mb-2", children: [
      statusText.slice(0, 60),
      statusText.length > 60 ? "…" : ""
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3 text-xs text-muted-foreground", children: [
      date && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3 h-3" }),
        formatMatchDate(date)
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
