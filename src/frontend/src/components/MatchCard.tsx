import { Link } from "@tanstack/react-router";
import { Calendar, MapPin } from "lucide-react";
import type { NormalizedMatch } from "../services/cricapi";

interface MatchCardProps {
  match: NormalizedMatch;
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

function formatMatchDate(date: Date | null): string {
  if (!date) return "";
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const matchDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  if (matchDay.getTime() === today.getTime()) return "Today";
  if (matchDay.getTime() === tomorrow.getTime()) return "Tomorrow";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function StatusBadge({ status }: { status: NormalizedMatch["status"] }) {
  if (status === "live") {
    return (
      <span className="flex items-center gap-1 bg-cric-red text-white text-xs font-bold px-2 py-0.5 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        LIVE
      </span>
    );
  }
  if (status === "upcoming") {
    return (
      <span className="text-xs font-semibold bg-green-500/15 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full">
        Upcoming
      </span>
    );
  }
  return (
    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
      Result
    </span>
  );
}

function CardContent({ match }: { match: NormalizedMatch }) {
  const {
    team1,
    team2,
    score1,
    score2,
    overs1,
    overs2,
    status,
    date,
    venue,
    series,
    matchType,
    statusText,
  } = match;

  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-card hover:border-cric-border transition-colors">
      {/* Top row: series/type + status badge */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-1.5">
          {series !== "International" && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-orange-500/15 text-orange-600 dark:text-orange-400">
              {series}
            </span>
          )}
          {matchType && (
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {matchType}
            </span>
          )}
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Teams and scores */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{getTeamFlag(team1)}</span>
            <span className="font-semibold text-sm text-foreground">
              {team1}
            </span>
          </div>
          {score1 && (
            <span className="text-sm font-bold text-foreground">
              {score1}
              {overs1 && (
                <span className="text-xs text-muted-foreground font-normal ml-1">
                  ({overs1})
                </span>
              )}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{getTeamFlag(team2)}</span>
            <span className="font-semibold text-sm text-foreground">
              {team2}
            </span>
          </div>
          {score2 && (
            <span className="text-sm font-bold text-foreground">
              {score2}
              {overs2 && (
                <span className="text-xs text-muted-foreground font-normal ml-1">
                  ({overs2})
                </span>
              )}
            </span>
          )}
        </div>
      </div>

      {/* Status text */}
      {statusText && (
        <p className="text-xs text-cric-red font-medium truncate mb-2">
          {statusText.slice(0, 60)}
          {statusText.length > 60 ? "…" : ""}
        </p>
      )}

      {/* Meta: date / venue */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        {date && (
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatMatchDate(date)}
          </span>
        )}
        {venue && (
          <span className="flex items-center gap-1 truncate">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">
              {venue.slice(0, 35)}
              {venue.length > 35 ? "…" : ""}
            </span>
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
