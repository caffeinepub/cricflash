import { Link } from "@tanstack/react-router";
import { Calendar, Clock, MapPin } from "lucide-react";
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

function formatMatchTime(date: Date | null): string {
  if (!date) return "";
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function StatusBadge({
  status,
  startingSoon,
}: { status: NormalizedMatch["status"]; startingSoon: boolean }) {
  if (status === "live") {
    return (
      <span className="flex items-center gap-1 bg-cric-red text-white text-xs font-bold px-2 py-0.5 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        LIVE
      </span>
    );
  }
  if (status === "upcoming") {
    if (startingSoon) {
      return (
        <span className="flex items-center gap-1 bg-amber-500/15 text-amber-600 dark:text-amber-400 text-xs font-bold px-2 py-0.5 rounded-full">
          <Clock className="w-3 h-3" />
          Starting Soon
        </span>
      );
    }
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
    wickets1,
    overs1,
    score2,
    wickets2,
    overs2,
    status,
    startingSoon,
    matchDate,
    venue,
    series,
    matchType,
    statusText,
    seriesCategory,
    matchNumber,
  } = match;

  const bothNull = score1 === null && score2 === null;

  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-card hover:border-cric-border transition-colors">
      {/* Top row: series/type + status badge */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-1.5">
          {seriesCategory !== "International" &&
            seriesCategory !== "Domestic" && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-orange-500/15 text-orange-600 dark:text-orange-400">
                {seriesCategory}
              </span>
            )}
          {matchType && (
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {matchType}
            </span>
          )}
        </div>
        <StatusBadge status={status} startingSoon={startingSoon} />
      </div>

      {/* Match number (e.g. "46th Match") */}
      {matchNumber && (
        <p className="text-[10px] text-muted-foreground mt-0.5 mb-2">
          {matchNumber}
        </p>
      )}

      {/* Teams and scores */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{getTeamFlag(team1)}</span>
            <span className="font-semibold text-sm text-foreground">
              {team1}
            </span>
          </div>
          <span className="text-sm font-bold text-foreground">
            {score1 !== null
              ? `${score1}${wickets1 !== null ? `/${wickets1}` : ""}`
              : ""}
            {overs1 !== null && (
              <span className="text-xs text-muted-foreground font-normal ml-1">
                ({overs1})
              </span>
            )}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{getTeamFlag(team2)}</span>
            <span className="font-semibold text-sm text-foreground">
              {team2}
            </span>
          </div>
          <span className="text-sm font-bold text-foreground">
            {score2 !== null
              ? `${score2}${wickets2 !== null ? `/${wickets2}` : ""}`
              : ""}
            {overs2 !== null && (
              <span className="text-xs text-muted-foreground font-normal ml-1">
                ({overs2})
              </span>
            )}
          </span>
        </div>
      </div>

      {bothNull && status === "upcoming" && (
        <p className="text-xs text-muted-foreground italic mb-2">
          Match not started
        </p>
      )}

      {statusText && (
        <p className="text-xs text-cric-red font-medium truncate mb-2">
          {statusText.slice(0, 60)}
          {statusText.length > 60 ? "…" : ""}
        </p>
      )}

      {series && (
        <p className="text-[10px] text-muted-foreground truncate mb-1">
          {series.slice(0, 50)}
          {series.length > 50 ? "…" : ""}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        {matchDate && (
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatMatchDate(matchDate)}
            {status === "upcoming" && (
              <span className="ml-1">{formatMatchTime(matchDate)}</span>
            )}
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
