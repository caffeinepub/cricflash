import { u as useArticles, r as reactExports, j as jsxRuntimeExports, B as Button } from "./index-DSMNH8Gm.js";
import { A as ArticleCard } from "./ArticleCard-CWdmWKAo.js";
import { A as ArticleCardSkeleton } from "./SkeletonCard-DVvb7s_u.js";
import { C as CircleAlert } from "./circle-alert-D23UDnz3.js";
import "./calendar-BH_Gzxl4.js";
import "./skeleton-BKz-Lw0k.js";
const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
function PSLPage() {
  const { data: articles = [], isLoading, isError, refetch } = useArticles();
  const pslArticles = articles.filter(
    (a) => a.category === "PSL" && a.status !== "draft"
  );
  reactExports.useEffect(() => {
    document.title = `PSL ${currentYear} – CricFlash`;
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1200px] mx-auto px-4 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mb-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wider", children: [
        "PSL ",
        currentYear
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-extrabold text-foreground", children: "Pakistan Super League" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Latest PSL news, scores, and analysis" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative rounded-2xl overflow-hidden mb-8 bg-gradient-to-r from-green-700 to-teal-600", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-8 py-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/70 text-sm font-medium uppercase tracking-widest mb-2", children: "Pakistan Super League" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-3xl font-extrabold text-white", children: [
          "PSL ",
          currentYear,
          " Season"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/80 mt-2 text-sm", children: "Pakistan's premier T20 league. Top teams, world-class players." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-8 top-1/2 -translate-y-1/2 text-6xl opacity-20", children: "🏏" })
    ] }),
    isError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-3 bg-destructive/10 border border-destructive/30 text-destructive rounded-xl p-4 mb-6",
        "data-ocid": "psl.error_state",
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
        "data-ocid": "psl.loading_state",
        children: [1, 2, 3].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(ArticleCardSkeleton, {}, n))
      }
    ) : pslArticles.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center py-16 bg-card border border-border rounded-xl",
        "data-ocid": "psl.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-4xl mb-4", children: "🏏" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg", children: "No PSL articles yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "PSL content will appear here once published" })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", children: pslArticles.map((a, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": `psl.item.${i + 1}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArticleCard, { article: a, variant: "grid", category: a.category }) }, a.id)) })
  ] });
}
export {
  PSLPage as default
};
