import { j as jsxRuntimeExports, L as Link } from "./index-j1Env-oC.js";
import { C as Calendar } from "./skeleton-DUYq6DRP.js";
const CRICKET_IMAGES = [
  "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800",
  "https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=800",
  "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800",
  "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=800",
  "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=800",
  "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800"
];
function getFallbackImage(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = hash * 31 + id.charCodeAt(i) | 0;
  return CRICKET_IMAGES[Math.abs(hash) % CRICKET_IMAGES.length];
}
function formatDate(createdAt) {
  const ms = Number(createdAt) / 1e6;
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
function ArticleCard({
  article,
  variant = "grid",
  category
}) {
  var _a;
  const img = ((_a = article.imageUrl) == null ? void 0 : _a.trim()) ? article.imageUrl : getFallbackImage(article.id);
  const displayCategory = category || article.category;
  const excerpt = article.content.slice(0, 120) + (article.content.length > 120 ? "..." : "");
  const dateStr = formatDate(article.createdAt);
  if (variant === "hero") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to: "/article/$id",
        params: { id: article.id },
        className: "block relative rounded-2xl overflow-hidden group",
        "data-ocid": "article.card",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: img,
              alt: article.title,
              loading: "lazy",
              className: "w-full h-[380px] object-cover group-hover:scale-105 transition-transform duration-500"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 hero-gradient" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-0 left-0 p-6 w-3/5", children: [
            displayCategory && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block bg-cric-red text-white text-xs font-bold px-2 py-1 rounded mb-2 uppercase tracking-wider", children: displayCategory }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl md:text-2xl font-bold text-white line-clamp-3 leading-snug", children: article.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs text-gray-300 flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3 h-3" }),
              dateStr
            ] })
          ] })
        ]
      }
    );
  }
  if (variant === "horizontal") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to: "/article/$id",
        params: { id: article.id },
        className: "flex gap-4 group",
        "data-ocid": "article.card",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: img,
              alt: article.title,
              loading: "lazy",
              className: "w-28 h-20 object-cover rounded-xl shrink-0 group-hover:opacity-80 transition-opacity"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            displayCategory && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-cric-red font-semibold uppercase tracking-wider", children: displayCategory }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground line-clamp-2 leading-snug mt-0.5", children: article.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1 flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3 h-3" }),
              dateStr
            ] })
          ] })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Link,
    {
      to: "/article/$id",
      params: { id: article.id },
      className: "block group",
      "data-ocid": "article.card",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl overflow-hidden shadow-card hover:border-cric-border transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: img,
            alt: article.title,
            loading: "lazy",
            className: "w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", children: [
          displayCategory && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block bg-cric-red/10 text-cric-red text-xs font-semibold px-2 py-0.5 rounded mb-2 uppercase tracking-wider", children: displayCategory }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-sm text-foreground line-clamp-2 leading-snug", children: article.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-2 line-clamp-2", children: excerpt }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-2 flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3 h-3" }),
            dateStr
          ] })
        ] })
      ] })
    }
  );
}
export {
  ArticleCard as A
};
