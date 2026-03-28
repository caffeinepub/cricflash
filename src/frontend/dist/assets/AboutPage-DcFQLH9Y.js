import { e as useNavigate, j as jsxRuntimeExports, A as ArrowLeft, Z as Zap } from "./index-DSMNH8Gm.js";
function AboutPage() {
  const navigate = useNavigate();
  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate({ to: "/" });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[800px] mx-auto px-4 py-12", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: handleBack,
        className: "flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
          "Back"
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-cric-red flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-5 h-5 text-white", fill: "white" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-3xl font-extrabold tracking-tight", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: "CRIC" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-cric-red", children: "FLASH" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 text-muted-foreground leading-relaxed", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground text-lg", children: "CricFlash is your go-to destination for real-time cricket coverage — live scores, breaking news, IPL updates, and international match analysis, all in one place." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-foreground text-xl font-bold mb-2", children: "Our Mission" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Cricket moves fast. CricFlash moves faster. We deliver live ball-by-ball data, curated news, and expert match previews so fans never miss a moment — whether it's a last-ball thriller in the IPL or a Test match epic in Edgbaston." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-foreground text-xl font-bold mb-2", children: "What We Cover" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "list-disc list-inside space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Live scores and match updates via CricAPI" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "IPL season coverage — team news, points table, match analysis" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "International cricket — Tests, ODIs, and T20Is from all major boards" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "In-depth articles, pitch reports, and player form guides" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Upcoming fixtures and series schedules" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-foreground text-xl font-bold mb-2", children: "Built for Fans" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "CricFlash is built by cricket fans, for cricket fans. We prioritise speed, clarity, and mobile-friendliness so you can follow the action from anywhere — stadium, sofa, or commute." })
      ] })
    ] })
  ] });
}
export {
  AboutPage as default
};
