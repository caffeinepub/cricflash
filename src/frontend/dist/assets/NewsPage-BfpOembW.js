import { b as useArticles, r as reactExports, j as jsxRuntimeExports, B as Button } from "./index-j1Env-oC.js";
import { A as ArticleCard } from "./ArticleCard-CH7IOS_V.js";
import { A as ArticleCardSkeleton } from "./SkeletonCard-BEnWgYZL.js";
import { C as CircleAlert } from "./circle-alert-B8VuEOdb.js";
import "./skeleton-DUYq6DRP.js";
function NewsPage() {
  const { data: articles = [], isLoading, isError, refetch } = useArticles();
  reactExports.useEffect(() => {
    document.title = "Cricket News – CricFlash";
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1200px] mx-auto px-4 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-extrabold text-foreground", children: "Cricket News" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Latest cricket news from around the world" })
    ] }),
    isError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-3 bg-destructive/10 border border-destructive/30 text-destructive rounded-xl p-4 mb-6",
        "data-ocid": "news.error_state",
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
        "data-ocid": "news.loading_state",
        children: [1, 2, 3, 4, 5, 6].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(ArticleCardSkeleton, {}, n))
      }
    ) : articles.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center py-16 bg-card border border-border rounded-xl",
        "data-ocid": "news.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg", children: "No articles yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Check back soon for the latest cricket news" })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", children: articles.map((a, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": `news.item.${i + 1}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArticleCard, { article: a, variant: "grid", category: "News" }) }, a.id)) })
  ] });
}
export {
  NewsPage as default
};
