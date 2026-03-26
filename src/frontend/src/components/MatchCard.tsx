import { Link } from "@tanstack/react-router";
import { Calendar, MapPin } from "lucide-react";
import type { CricMatch } from "../services/cricapi";

interface MatchCardProps {
  match: CricMatch;
  showLink?: boolean;
}

function getTeamFlag(name: string): string {
  const flags: Record<string, string> = {
    India: "🇮🇳",
    Australia: "🇦🇺",
    England: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    Pakistan: "🇵🇰",
    "South Africa": "🇿🇦",
    "New Zealand": "🇳🇿",
    "West Indies": "🏝️",
    Bangladesh: "🇧🇩",
    "Sri Lanka": "🇱🇰",
    Afghanistan: "🇦🇫",
    Zimbabwe: "🇿🇼",
    Ireland: "🇮🇪",
  };
  for (const [key, flag] of Object.entries(flags)) {
    if (name.includes(key)) return flag;
  }
  return "🏏";
}

function CardContent({ match }: { match: CricMatch }) {
  const isLive = match.matchStarted && !match.matchEnded;
  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-card hover:border-cric-border transition-colors">
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
          {match.matchType}
        </span>
        {isLive ? (
          <span className="flex items-center gap-1 bg-cric-red text-white text-xs font-bold px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            LIVE
          </span>
        ) : match.matchEnded ? (
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            Ended
          </span>
        ) : (
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            Upcoming
          </span>
        )}
      </div>
      <div className="space-y-2">
        {match.teams.map((team) => {
          const score = match.score?.find((s) => s.inning.startsWith(team));
          return (
            <div key={team} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">{getTeamFlag(team)}</span>
                <span className="font-semibold text-sm text-foreground">
                  {team}
                </span>
              </div>
              {score && (
                <span className="text-sm font-bold text-foreground">
                  {score.r}/{score.w}
                  <span className="text-xs text-muted-foreground font-normal ml-1">
                    ({score.o})
                  </span>
                </span>
              )}
            </div>
          );
        })}
      </div>
      {match.status && (
        <p className="mt-3 text-xs text-cric-red font-medium">{match.status}</p>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        {match.venue && (
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {match.venue.slice(0, 40)}
            {match.venue.length > 40 ? "..." : ""}
          </span>
        )}
        {match.date && (
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(match.date).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
}

export default function MatchCard({ match, showLink = true }: MatchCardProps) {
  if (!showLink) return <CardContent match={match} />;
  return (
    <Link to="/match/$matchId" params={{ matchId: match.id }}>
      <CardContent match={match} />
    </Link>
  );
}
