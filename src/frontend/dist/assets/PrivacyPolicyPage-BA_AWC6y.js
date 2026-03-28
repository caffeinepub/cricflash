import { e as useNavigate, j as jsxRuntimeExports, A as ArrowLeft } from "./index-DJUMNUlM.js";
function PrivacyPolicyPage() {
  const year = (/* @__PURE__ */ new Date()).getFullYear();
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
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-3xl font-extrabold tracking-tight mb-2", children: [
      "Privacy ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-cric-red", children: "Policy" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mb-10", children: [
      "Last updated: January ",
      year
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 text-muted-foreground leading-relaxed", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-foreground text-lg font-bold mb-2", children: "1. Information We Collect" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "CricFlash is a read-only cricket news and scores platform. We do not require account registration. When you visit our site, standard web server logs may record your IP address, browser type, referring page, and time of visit for operational purposes." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-foreground text-lg font-bold mb-2", children: "2. How We Use Information" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Any information collected is used solely to:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "list-disc list-inside mt-2 space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Operate and maintain the CricFlash website" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Monitor site performance and diagnose technical issues" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Improve the user experience" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3", children: "We do not sell, trade, or rent your personal information to third parties." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-foreground text-lg font-bold mb-2", children: "3. Cookies" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "CricFlash uses minimal local storage to remember your theme preference (light/dark mode). No tracking cookies or third-party advertising cookies are used." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-foreground text-lg font-bold mb-2", children: "4. Third-Party Services" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          "Live cricket data is sourced from",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: "https://www.cricapi.com",
              target: "_blank",
              rel: "noreferrer",
              className: "text-cric-red hover:underline",
              children: "CricAPI"
            }
          ),
          ". Please review their privacy policy for details on how they handle data."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-foreground text-lg font-bold mb-2", children: "5. Data Security" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "We implement reasonable technical measures to protect the site. However, no method of transmission over the internet is 100% secure. Use the site at your own risk." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-foreground text-lg font-bold mb-2", children: "6. Children's Privacy" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "CricFlash is intended for general audiences. We do not knowingly collect personal information from children under 13." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-foreground text-lg font-bold mb-2", children: "7. Changes to This Policy" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "We may update this policy periodically. Continued use of CricFlash after changes constitutes acceptance of the revised policy." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-foreground text-lg font-bold mb-2", children: "8. Contact" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          "Questions about this policy? Email us at",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: "mailto:support@cricflash.com",
              className: "text-cric-red hover:underline",
              children: "support@cricflash.com"
            }
          ),
          "."
        ] })
      ] })
    ] })
  ] });
}
export {
  PrivacyPolicyPage as default
};
