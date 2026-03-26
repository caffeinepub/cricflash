import { Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { type CricMatch, getLiveMatches } from "../services/cricapi";

function StatusBadge({ match }: { match: CricMatch }) {
  if (match.matchStarted && !match.matchEnded) {
    return (
      <span className="inline-flex items-center gap-1 bg-cric-red text-white text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0">
        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
        LIVE
      </span>
    );
  }
  if (match.matchEnded) {
    return (
      <span className="inline-flex items-center bg-zinc-600 text-zinc-200 text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0">
        ENDED
      </span>
    );
  }
  return (
    <span className="inline-flex items-center bg-zinc-700 text-zinc-300 text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0">
      UPCOMING
    </span>
  );
}

export default function LiveTicker() {
  const [matches, setMatches] = useState<CricMatch[]>([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data = await getLiveMatches();
        if (!cancelled) setMatches(data.slice(0, 8));
      } catch {
        // silently fail ticker
      }
    };
    load();
    const interval = setInterval(load, 90_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  if (matches.length === 0) return null;

  const items = [...matches, ...matches];

  return (
    <div className="bg-zinc-900 border-b border-zinc-700 overflow-hidden">
      <div className="max-w-[1200px] mx-auto flex items-center">
        <div className="shrink-0 flex items-center gap-1.5 px-3 py-2.5 bg-cric-red">
          <Zap className="w-3 h-3 text-white" fill="white" />
          <span className="text-white text-xs font-bold tracking-widest">
            LIVE
          </span>
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="ticker-track" style={{ animationDuration: "40s" }}>
            {items.map((m, idx) => (
              <span
                key={`${m.id}-${idx}`}
                className="inline-flex items-center gap-2.5 px-6 py-2 whitespace-nowrap"
              >
                <StatusBadge match={m} />
                <span className="text-sm font-semibold text-white">
                  {m.name}
                </span>
                {m.score && m.score.length > 0 && (
                  <span className="text-zinc-300 text-xs">
                    {m.score
                      .map((s) => `${s.inning}: ${s.r}/${s.w} (${s.o} ov)`)
                      .join(" | ")}
                  </span>
                )}
                <span className="text-zinc-600 opacity-60">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
