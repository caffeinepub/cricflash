import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Zap } from "lucide-react";

export default function AboutPage() {
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

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-cric-red flex items-center justify-center shrink-0">
          <Zap className="w-5 h-5 text-white" fill="white" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          <span className="text-foreground">CRIC</span>
          <span className="text-cric-red">FLASH</span>
        </h1>
      </div>

      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p className="text-foreground text-lg">
          CricFlash is your go-to destination for real-time cricket coverage —
          live scores, breaking news, IPL updates, and international match
          analysis, all in one place.
        </p>

        <section>
          <h2 className="text-foreground text-xl font-bold mb-2">
            Our Mission
          </h2>
          <p>
            Cricket moves fast. CricFlash moves faster. We deliver live
            ball-by-ball data, curated news, and expert match previews so fans
            never miss a moment — whether it's a last-ball thriller in the IPL
            or a Test match epic in Edgbaston.
          </p>
        </section>

        <section>
          <h2 className="text-foreground text-xl font-bold mb-2">
            What We Cover
          </h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Live scores and match updates via CricAPI</li>
            <li>
              IPL season coverage — team news, points table, match analysis
            </li>
            <li>
              International cricket — Tests, ODIs, and T20Is from all major
              boards
            </li>
            <li>In-depth articles, pitch reports, and player form guides</li>
            <li>Upcoming fixtures and series schedules</li>
          </ul>
        </section>

        <section>
          <h2 className="text-foreground text-xl font-bold mb-2">
            Built for Fans
          </h2>
          <p>
            CricFlash is built by cricket fans, for cricket fans. We prioritise
            speed, clarity, and mobile-friendliness so you can follow the action
            from anywhere — stadium, sofa, or commute.
          </p>
        </section>
      </div>
    </div>
  );
}
