import { d as createLucideIcon, u as useArticles, r as reactExports, j as jsxRuntimeExports, L as Link, a as useMatches } from "./index-riatzkdn.js";
import { M as MatchCard } from "./MatchCard-EK-s_142.js";
import { M as MatchCardSkeleton } from "./SkeletonCard-BKZYgjZw.js";
import "./calendar-e9ImB8ZN.js";
import "./map-pin-BKJ1qx-Q.js";
import "./skeleton-dNm4zy8B.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]];
const ChevronRight = createLucideIcon("chevron-right", __iconNode);
function formatDate(createdAt) {
  const ms = Number(createdAt) / 1e6;
  return new Date(ms).toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
function stripHtml(html) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}
function CategoryBadge({ category }) {
  const colorMap = {
    IPL: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
    PSL: "bg-green-500/15 text-green-600 dark:text-green-400",
    International: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
    News: "bg-muted text-muted-foreground"
  };
  const cls = colorMap[category] ?? "bg-muted text-muted-foreground";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `text-[11px] font-semibold px-2 py-0.5 rounded-full ${cls}`,
      children: category
    }
  );
}
function MatchCarousel() {
  const { classified, loading } = useMatches();
  const { live, upcoming, completed } = classified;
  const allMatches = [...live, ...upcoming, ...completed];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-bold text-foreground", children: "Matches" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/live-score",
          className: "text-xs text-cric-red hover:underline flex items-center gap-0.5",
          "data-ocid": "home.link",
          children: [
            "View all ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3.5 h-3.5" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3 overflow-x-auto pb-2 no-scrollbar", children: loading ? [1, 2, 3].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 w-72", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MatchCardSkeleton, {}) }, n)) : allMatches.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground py-4", children: "No matches available" }) : allMatches.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 w-72", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MatchCard, { match: m }) }, m.id)) })
  ] });
}
function FeaturedArticle({ article }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-bold text-foreground mb-3", children: "Featured" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to: "/article/$id",
        params: { id: article.id },
        className: "block bg-card border border-border rounded-xl overflow-hidden hover:border-cric-red/50 transition-colors",
        "data-ocid": "home.card",
        children: [
          article.imageUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: article.imageUrl,
              alt: article.title,
              className: "w-full h-48 object-cover",
              loading: "lazy"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
              article.category && /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryBadge, { category: article.category }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: formatDate(article.createdAt) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-lg text-foreground leading-snug line-clamp-2", children: article.title })
          ] })
        ]
      }
    )
  ] });
}
function ArticleRowCard({ article }) {
  const excerptText = article.excerpt || stripHtml(article.content).slice(0, 100);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to: "/article/$id",
      params: { id: article.id },
      className: "flex gap-3 py-3 border-b border-border last:border-0 hover:opacity-80 transition-opacity",
      "data-ocid": "home.link",
      children: [
        article.imageUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: article.imageUrl,
            alt: article.title,
            className: "w-20 h-20 rounded-lg object-cover shrink-0",
            loading: "lazy"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground line-clamp-2 leading-snug", children: article.title }),
          excerptText && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 line-clamp-2", children: excerptText })
        ] })
      ]
    }
  );
}
function CompactArticleCard({ article }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to: "/article/$id",
      params: { id: article.id },
      className: "flex gap-3 items-start py-2.5 border-b border-border last:border-0 hover:opacity-80 transition-opacity",
      "data-ocid": "home.link",
      children: [
        article.imageUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: article.imageUrl,
            alt: article.title,
            className: "w-16 h-16 rounded object-cover shrink-0",
            loading: "lazy"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          article.category && /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryBadge, { category: article.category }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground line-clamp-2 leading-snug mt-1", children: article.title })
        ] })
      ]
    }
  );
}
function HomePage() {
  const { data: allArticles = [], isLoading: loadingArticles } = useArticles();
  reactExports.useEffect(() => {
    document.title = "CricFlash – Live Cricket Scores, News & Updates";
  }, []);
  const published = allArticles.filter((a) => a.status === "published").sort((a, b) => Number(b.createdAt) - Number(a.createdAt));
  const featuredArticle = published.find((a) => a.featured) ?? null;
  const latestNews = published.filter((a) => !featuredArticle || a.id !== featuredArticle.id).slice(0, 5);
  const shownIds = /* @__PURE__ */ new Set([
    ...featuredArticle ? [featuredArticle.id] : [],
    ...latestNews.map((a) => a.id)
  ]);
  const getCategory = (cat) => published.filter(
    (a) => {
      var _a;
      return !shownIds.has(a.id) && ((_a = a.category) == null ? void 0 : _a.toLowerCase()) === cat.toLowerCase();
    }
  ).slice(0, 5);
  const iplArticles = getCategory("IPL");
  const pslArticles = getCategory("PSL");
  const intlArticles = getCategory("International");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1200px] mx-auto px-4 py-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(MatchCarousel, {}),
    !loadingArticles && featuredArticle && /* @__PURE__ */ jsxRuntimeExports.jsx(FeaturedArticle, { article: featuredArticle }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-bold text-foreground", children: "Latest News" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/news",
            className: "text-xs text-cric-red hover:underline flex items-center gap-0.5",
            "data-ocid": "home.link",
            children: [
              "View all ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3.5 h-3.5" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border rounded-xl px-4", children: loadingArticles ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 py-3", children: [1, 2, 3].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex gap-3 py-3 border-b border-border last:border-0",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-lg bg-muted animate-pulse shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 bg-muted animate-pulse rounded w-3/4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 bg-muted animate-pulse rounded w-full" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 bg-muted animate-pulse rounded w-2/3" })
            ] })
          ]
        },
        n
      )) }) : latestNews.length > 0 ? latestNews.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx(ArticleRowCard, { article: a }, a.id)) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: "py-8 text-sm text-muted-foreground text-center",
          "data-ocid": "home.empty_state",
          children: "No articles yet. Check back soon!"
        }
      ) })
    ] }),
    !loadingArticles && iplArticles.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-bold text-foreground", children: "IPL" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/ipl",
            className: "text-xs text-cric-red hover:underline flex items-center gap-0.5",
            "data-ocid": "home.link",
            children: [
              "View all ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3.5 h-3.5" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border rounded-xl px-4", children: iplArticles.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx(CompactArticleCard, { article: a }, a.id)) })
    ] }),
    !loadingArticles && pslArticles.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-bold text-foreground", children: "PSL" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/psl",
            className: "text-xs text-cric-red hover:underline flex items-center gap-0.5",
            "data-ocid": "home.link",
            children: [
              "View all ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3.5 h-3.5" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border rounded-xl px-4", children: pslArticles.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx(CompactArticleCard, { article: a }, a.id)) })
    ] }),
    !loadingArticles && intlArticles.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-bold text-foreground", children: "International" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/international",
            className: "text-xs text-cric-red hover:underline flex items-center gap-0.5",
            "data-ocid": "home.link",
            children: [
              "View all ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3.5 h-3.5" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border rounded-xl px-4", children: intlArticles.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx(CompactArticleCard, { article: a }, a.id)) })
    ] })
  ] });
}
export {
  HomePage as default
};
