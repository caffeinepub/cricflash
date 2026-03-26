import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  const year = new Date().getFullYear();
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate({ to: "/" });
    }
  };

  return (
    <div className="max-w-[800px] mx-auto px-4 py-12">
      <button
        type="button"
        onClick={handleBack}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <h1 className="text-3xl font-extrabold tracking-tight mb-2">
        Privacy <span className="text-cric-red">Policy</span>
      </h1>
      <p className="text-sm text-muted-foreground mb-10">
        Last updated: January {year}
      </p>

      <div className="space-y-8 text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-foreground text-lg font-bold mb-2">
            1. Information We Collect
          </h2>
          <p>
            CricFlash is a read-only cricket news and scores platform. We do not
            require account registration. When you visit our site, standard web
            server logs may record your IP address, browser type, referring
            page, and time of visit for operational purposes.
          </p>
        </section>

        <section>
          <h2 className="text-foreground text-lg font-bold mb-2">
            2. How We Use Information
          </h2>
          <p>Any information collected is used solely to:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Operate and maintain the CricFlash website</li>
            <li>Monitor site performance and diagnose technical issues</li>
            <li>Improve the user experience</li>
          </ul>
          <p className="mt-3">
            We do not sell, trade, or rent your personal information to third
            parties.
          </p>
        </section>

        <section>
          <h2 className="text-foreground text-lg font-bold mb-2">3. Cookies</h2>
          <p>
            CricFlash uses minimal local storage to remember your theme
            preference (light/dark mode). No tracking cookies or third-party
            advertising cookies are used.
          </p>
        </section>

        <section>
          <h2 className="text-foreground text-lg font-bold mb-2">
            4. Third-Party Services
          </h2>
          <p>
            Live cricket data is sourced from{" "}
            <a
              href="https://www.cricapi.com"
              target="_blank"
              rel="noreferrer"
              className="text-cric-red hover:underline"
            >
              CricAPI
            </a>
            . Please review their privacy policy for details on how they handle
            data.
          </p>
        </section>

        <section>
          <h2 className="text-foreground text-lg font-bold mb-2">
            5. Data Security
          </h2>
          <p>
            We implement reasonable technical measures to protect the site.
            However, no method of transmission over the internet is 100% secure.
            Use the site at your own risk.
          </p>
        </section>

        <section>
          <h2 className="text-foreground text-lg font-bold mb-2">
            6. Children's Privacy
          </h2>
          <p>
            CricFlash is intended for general audiences. We do not knowingly
            collect personal information from children under 13.
          </p>
        </section>

        <section>
          <h2 className="text-foreground text-lg font-bold mb-2">
            7. Changes to This Policy
          </h2>
          <p>
            We may update this policy periodically. Continued use of CricFlash
            after changes constitutes acceptance of the revised policy.
          </p>
        </section>

        <section>
          <h2 className="text-foreground text-lg font-bold mb-2">8. Contact</h2>
          <p>
            Questions about this policy? Email us at{" "}
            <a
              href="mailto:support@cricflash.com"
              className="text-cric-red hover:underline"
            >
              support@cricflash.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
