import { c as createLucideIcon, d as useParams, s as useArticle, r as reactExports, j as jsxRuntimeExports, B as Button, L as Link, A as ArrowLeft } from "./index-j1Env-oC.js";
import { S as Skeleton, C as Calendar } from "./skeleton-DUYq6DRP.js";
import { C as CircleAlert } from "./circle-alert-B8VuEOdb.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
  ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }]
];
const User = createLucideIcon("user", __iconNode);
const CRICKET_IMAGES = [
  "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200",
  "https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=1200",
  "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1200",
  "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=1200"
];
const RELATED_SECTIONS = [
  "Team Form",
  "Key Players",
  "Pitch Report",
  "Match Prediction"
];
function getArticleImage(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = hash * 31 + id.charCodeAt(i) | 0;
  return CRICKET_IMAGES[Math.abs(hash) % CRICKET_IMAGES.length];
}
function formatDate(createdAt) {
  const ms = Number(createdAt) / 1e6;
  return new Date(ms).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}
function ArticleDetailPage() {
  const { id } = useParams({ from: "/article/$id" });
  const { data: article, isLoading, isError, refetch } = useArticle(id);
  reactExports.useEffect(() => {
    if (article) document.title = `${article.title} – CricFlash`;
  }, [article]);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "max-w-[800px] mx-auto px-4 py-8 space-y-6",
        "data-ocid": "article.loading_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-48" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64 w-full rounded-2xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-3/4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3, 4].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }, n)) })
        ]
      }
    );
  }
  if (isError) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-[800px] mx-auto px-4 py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-3 bg-destructive/10 border border-destructive/30 text-destructive rounded-xl p-4",
        "data-ocid": "article.error_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Failed to load article" }),
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
    ) });
  }
  if (!article) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[800px] mx-auto px-4 py-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Article not found." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/news",
          className: "text-cric-red hover:underline text-sm mt-2 inline-block",
          children: "Back to News"
        }
      )
    ] });
  }
  const paragraphs = article.content.split("\n\n").filter(Boolean);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[800px] mx-auto px-4 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to: "/news",
        className: "flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors",
        "data-ocid": "article.link",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
          "Back to News"
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: getArticleImage(article.id),
        alt: article.title,
        loading: "lazy",
        className: "w-full h-64 md:h-80 object-cover rounded-2xl mb-6"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-4 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-cric-red text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wider", children: "Cricket" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3 h-3" }),
        formatDate(article.createdAt)
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-3 h-3" }),
        "Admin"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl md:text-3xl font-extrabold text-foreground leading-snug mb-6", children: article.title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: paragraphs.map((para) => {
      const key = para.slice(0, 40);
      if (para.startsWith("## "))
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "h2",
          {
            className: "text-xl font-bold text-foreground mt-8 mb-3",
            children: para.slice(3)
          },
          key
        );
      if (para.startsWith("### "))
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "h3",
          {
            className: "text-lg font-semibold text-foreground mt-6 mb-2",
            children: para.slice(4)
          },
          key
        );
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: "text-base text-foreground/90 leading-relaxed",
          children: para
        },
        key
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 pt-6 border-t border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-foreground mb-4", children: "Related Sections" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: RELATED_SECTIONS.map((section) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "bg-card border border-border rounded-xl p-4",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: section }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Analysis coming soon" })
          ]
        },
        section
      )) })
    ] })
  ] });
}
export {
  ArticleDetailPage as default
};
