import { u as useArticles, r as reactExports, j as jsxRuntimeExports, B as Button } from "./index-Dx0VHhmn.js";
import { A as ArticleCard } from "./ArticleCard-CwWmbCCm.js";
import { A as ArticleCardSkeleton } from "./SkeletonCard-97BsFWa8.js";
import { C as CircleAlert } from "./circle-alert-BEcj9HOn.js";
import "./calendar-Di8bOqwf.js";
import "./skeleton-BLZky7P2.js";
const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
const nextYear = currentYear + 1;
const TOURNAMENTS = [
  {
    name: `ICC Champions Trophy ${currentYear}`,
    emoji: "🏆",
    status: "Ongoing"
  },
  { name: "World Test Championship", emoji: "🌍", status: "Ongoing" },
  { name: `The Ashes ${currentYear}`, emoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", status: "Upcoming" },
  { name: `ICC T20 World Cup ${nextYear}`, emoji: "⚡", status: "Upcoming" }
];
function InternationalPage() {
  const { data: articles = [], isLoading, isError, refetch } = useArticles();
  const intlArticles = articles.filter(
    (a) => a.category === "International" && a.status !== "draft"
  );
  reactExports.useEffect(() => {
    document.title = "International Cricket – CricFlash";
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1200px] mx-auto px-4 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-extrabold text-foreground", children: "International Cricket" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "ICC tournaments, series, and international matches" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8", children: TOURNAMENTS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-card border border-border rounded-xl p-4 text-center hover:border-cric-border transition-colors",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl block mb-2", children: t.emoji }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground line-clamp-2", children: t.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${t.status === "Ongoing" ? "bg-cric-red/10 text-cric-red" : "bg-muted text-muted-foreground"}`,
              children: t.status
            }
          )
        ]
      },
      t.name
    )) }),
    isError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-3 bg-destructive/10 border border-destructive/30 text-destructive rounded-xl p-4 mb-6",
        "data-ocid": "intl.error_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "Failed to load articles" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              variant: "outline",
              onClick: () => refetch(),
              className: "ml-auto",
              children: "Retry"
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-foreground mb-4", children: "Latest International News" }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
        "data-ocid": "intl.loading_state",
        children: [1, 2, 3].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(ArticleCardSkeleton, {}, n))
      }
    ) : intlArticles.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center py-16 bg-card border border-border rounded-xl",
        "data-ocid": "intl.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-4xl mb-4", children: "🌍" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg", children: "No international articles yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Content will appear here once published" })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", children: intlArticles.map((a, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": `intl.item.${i + 1}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      ArticleCard,
      {
        article: a,
        variant: "grid",
        category: "International"
      }
    ) }, a.id)) })
  ] });
}
export {
  InternationalPage as default
};
