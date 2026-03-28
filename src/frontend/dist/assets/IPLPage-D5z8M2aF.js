import { u as useArticles, r as reactExports, j as jsxRuntimeExports, B as Button } from "./index-DlXUMBw0.js";
import { A as ArticleCard } from "./ArticleCard-BfW6nu-k.js";
import { A as ArticleCardSkeleton } from "./SkeletonCard-CUgEqxbQ.js";
import { C as CircleAlert } from "./circle-alert-DQ-_G2XI.js";
import "./calendar-BPnF82cU.js";
import "./skeleton-DMGvSbP9.js";
const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
function IPLPage() {
  const { data: articles = [], isLoading, isError, refetch } = useArticles();
  const iplArticles = articles.filter(
    (a) => a.category === "IPL" && a.status !== "draft"
  );
  reactExports.useEffect(() => {
    document.title = `IPL ${currentYear} – CricFlash`;
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1200px] mx-auto px-4 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mb-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "bg-cric-red text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wider", children: [
        "IPL ",
        currentYear
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-extrabold text-foreground", children: "Indian Premier League" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Latest IPL news, scores, and analysis" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative rounded-2xl overflow-hidden mb-8 bg-gradient-to-r from-cric-red to-orange-600", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-8 py-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/70 text-sm font-medium uppercase tracking-widest mb-2", children: "Indian Premier League" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-3xl font-extrabold text-white", children: [
          "IPL ",
          currentYear,
          " Season"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/80 mt-2 text-sm", children: "India's biggest cricket tournament. 10 teams, 74 matches." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-8 top-1/2 -translate-y-1/2 text-6xl opacity-20", children: "🏏" })
    ] }),
    isError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-3 bg-destructive/10 border border-destructive/30 text-destructive rounded-xl p-4 mb-6",
        "data-ocid": "ipl.error_state",
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
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
        "data-ocid": "ipl.loading_state",
        children: [1, 2, 3].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(ArticleCardSkeleton, {}, n))
      }
    ) : iplArticles.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center py-16 bg-card border border-border rounded-xl",
        "data-ocid": "ipl.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-4xl mb-4", children: "🏏" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg", children: "No IPL articles yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "IPL content will appear here once published" })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", children: iplArticles.map((a, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": `ipl.item.${i + 1}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArticleCard, { article: a, variant: "grid", category: a.category }) }, a.id)) })
  ] });
}
export {
  IPLPage as default
};
