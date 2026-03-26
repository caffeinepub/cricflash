import { j as jsxRuntimeExports, L as Link } from "./index-j1Env-oC.js";
import { M as MapPin } from "./map-pin-Ch6tZm94.js";
import { C as Calendar } from "./skeleton-DUYq6DRP.js";
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
function CardContent({ match }) {
  const isLive = match.matchStarted && !match.matchEnded;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-4 shadow-card hover:border-cric-border transition-colors", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-medium uppercase tracking-wider", children: match.matchType }),
      isLive ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 bg-cric-red text-white text-xs font-bold px-2 py-0.5 rounded-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-white animate-pulse" }),
        "LIVE"
      ] }) : match.matchEnded ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full", children: "Ended" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full", children: "Upcoming" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: match.teams.map((team) => {
      var _a;
      const score = (_a = match.score) == null ? void 0 : _a.find((s) => s.inning.startsWith(team));
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg", children: getTeamFlag(team) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm text-foreground", children: team })
        ] }),
        score && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold text-foreground", children: [
          score.r,
          "/",
          score.w,
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground font-normal ml-1", children: [
            "(",
            score.o,
            ")"
          ] })
        ] })
      ] }, team);
    }) }),
    match.status && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-xs text-cric-red font-medium", children: match.status }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground", children: [
      match.venue && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3 h-3" }),
        match.venue.slice(0, 40),
        match.venue.length > 40 ? "..." : ""
      ] }),
      match.date && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3 h-3" }),
        new Date(match.date).toLocaleDateString()
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
