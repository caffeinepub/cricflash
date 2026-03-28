const API_KEY = "76e4e258-7898-4311-ace0-4196d49df2b7";
const BASE_URL = "https://api.cricapi.com/v1";

export interface CricMatch {
  id: string;
  name: string;
  matchType: string;
  status: string;
  venue: string;
  date: string;
  dateTimeGMT: string;
  teams: string[];
  teamInfo?: { name: string; shortname: string; img: string }[];
  score?: { r: number; w: number; o: number; inning: string }[];
  series?: string;
  series_id?: string;
  fantasyEnabled?: boolean;
  bbbEnabled?: boolean;
  hasSquad?: boolean;
  matchStarted?: boolean;
  matchEnded?: boolean;
}

export interface ScorecardBatter {
  batsman: { name: string; id: string };
  r: number;
  b: number;
  "4s": number;
  "6s": number;
  sr: string;
  "dismissal-text"?: string;
}

export interface ScorecardBowler {
  bowler: { name: string; id: string };
  o: number;
  m: number;
  r: number;
  w: number;
  nb?: number;
  wd?: number;
  eco: string;
}

export interface ScorecardInnings {
  batting: ScorecardBatter[];
  bowling: ScorecardBowler[];
}

export interface MatchDetail extends CricMatch {
  players?: { name: string; id: string }[];
  tossChoice?: string;
  tossWinner?: string;
  matchWinner?: string;
  scorecard?: ScorecardInnings[];
}

export interface NormalizedMatch {
  id: string;
  team1: string;
  team2: string;
  score1: number | null;
  wickets1: number | null;
  overs1: number | null;
  score2: number | null;
  wickets2: number | null;
  overs2: number | null;
  rawDate: string;
  series: string;
  seriesCategory: "IPL" | "PSL" | "International" | "Domestic" | "Women";
  venue: string;
  statusText: string;
  matchType: string;
  status: "live" | "upcoming" | "result";
  matchDate: Date | null;
}

export interface ClassifiedMatches {
  live: NormalizedMatch[];
  upcoming: NormalizedMatch[];
  completed: NormalizedMatch[];
}

const COUNTRY_NAMES = [
  "india",
  "australia",
  "england",
  "pakistan",
  "south africa",
  "new zealand",
  "west indies",
  "bangladesh",
  "sri lanka",
  "afghanistan",
  "zimbabwe",
  "ireland",
  "netherlands",
  "scotland",
  "nepal",
  "oman",
  "uae",
  "namibia",
  "canada",
  "kenya",
  "usa",
  "singapore",
  "malaysia",
  "hong kong",
];

function detectSeriesCategory(
  series: string,
): NormalizedMatch["seriesCategory"] {
  const s = series.toLowerCase();
  if (s.includes("ipl")) return "IPL";
  if (s.includes("psl")) return "PSL";
  if (s.includes("women") || s.includes("woman")) return "Women";
  for (const country of COUNTRY_NAMES) {
    if (s.includes(country)) return "International";
  }
  return "Domestic";
}

interface CacheEntry<T> {
  data: T;
  ts: number;
}

function readCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const entry: CacheEntry<T> = JSON.parse(raw);
    return entry.data;
  } catch {
    return null;
  }
}

function writeCache<T>(key: string, data: T): void {
  try {
    const entry: CacheEntry<T> = { data, ts: Date.now() };
    localStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // ignore storage errors
  }
}

function isCacheValid(key: string, maxAgeMs: number): boolean {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return false;
    const entry: CacheEntry<unknown> = JSON.parse(raw);
    return Date.now() - entry.ts < maxAgeMs;
  } catch {
    return false;
  }
}

async function fetchAPI<T>(endpoint: string): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`CricAPI error: ${res.status}`);
  const json = await res.json();
  if (json.status !== "success") throw new Error(json.reason || "API error");
  return json.data as T;
}

export function normalizeMatch(match: CricMatch): NormalizedMatch {
  const id = match.id;
  const team1 = match.teamInfo?.[0]?.name || match.teams?.[0] || "TBD";
  const team2 = match.teamInfo?.[1]?.name || match.teams?.[1] || "TBD";

  const score1 = match.score?.[0]?.r ?? null;
  const wickets1 = match.score?.[0]?.w ?? null;
  const overs1 = match.score?.[0]?.o ?? null;

  const score2 = match.score?.[1]?.r ?? null;
  const wickets2 = match.score?.[1]?.w ?? null;
  const overs2 = match.score?.[1]?.o ?? null;

  const rawDate = match.dateTimeGMT || match.date || "";
  const series = match.series || match.name || "";
  const venue = match.venue || "";
  const statusText = match.status || "";
  const matchType = (match.matchType || "").toLowerCase();
  const seriesCategory = detectSeriesCategory(series);

  // Parse date — keep null if invalid, do NOT drop the match
  let matchDate: Date | null = null;
  if (rawDate) {
    const d = new Date(rawDate);
    if (!Number.isNaN(d.getTime())) matchDate = d;
  }

  const now = new Date();
  const statusLower = statusText.toLowerCase();

  let status: NormalizedMatch["status"];
  if (statusLower.includes("live") || statusLower.includes("in progress")) {
    status = "live";
  } else if (matchDate && matchDate >= now) {
    status = "upcoming";
  } else {
    // Invalid date OR past date → treat as result
    status = "result";
  }

  return {
    id,
    team1,
    team2,
    score1,
    wickets1,
    overs1,
    score2,
    wickets2,
    overs2,
    rawDate,
    series,
    seriesCategory,
    venue,
    statusText,
    matchType,
    status,
    matchDate,
  };
}

export async function getMatchDetail(id: string): Promise<MatchDetail> {
  return fetchAPI<MatchDetail>(`/match_info?apikey=${API_KEY}&id=${id}`);
}

export async function getClassifiedMatches(): Promise<ClassifiedMatches> {
  const CACHE_KEY = "cricapi_classified_v5";
  const MAX_AGE = 90_000;
  if (isCacheValid(CACHE_KEY, MAX_AGE)) {
    const cached = readCache<ClassifiedMatches>(CACHE_KEY);
    if (cached) {
      const rehydrate = (matches: NormalizedMatch[]) =>
        matches.map((m) => ({
          ...m,
          matchDate: m.matchDate
            ? new Date(m.matchDate as unknown as string)
            : null,
        }));
      return {
        live: rehydrate(cached.live),
        upcoming: rehydrate(cached.upcoming),
        completed: rehydrate(cached.completed),
      };
    }
  }

  const [currentData, matchesData] = await Promise.all([
    fetchAPI<CricMatch[]>(`/currentMatches?apikey=${API_KEY}&offset=0`).catch(
      () => [] as CricMatch[],
    ),
    fetchAPI<CricMatch[]>(`/matches?apikey=${API_KEY}&offset=0`).catch(
      () => [] as CricMatch[],
    ),
  ]);

  // Deduplicate — currentMatches takes priority (has live data)
  const seen = new Map<string, CricMatch>();
  for (const m of currentData) seen.set(m.id, m);
  for (const m of matchesData) {
    if (!seen.has(m.id)) seen.set(m.id, m);
  }

  const allMatches = Array.from(seen.values());
  console.log("TOTAL:", allMatches.length);

  // Date window
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + 5);
  endDate.setHours(23, 59, 59, 999);
  const pastThreshold = new Date(today);
  pastThreshold.setDate(today.getDate() - 2);

  const live: NormalizedMatch[] = [];
  const upcoming: NormalizedMatch[] = [];
  const completed: NormalizedMatch[] = [];

  for (const m of allMatches) {
    const norm = normalizeMatch(m);

    if (norm.status === "live") {
      // ALL live matches — no date restriction
      live.push(norm);
    } else if (norm.status === "upcoming") {
      if (!norm.matchDate) {
        // Invalid date but status is upcoming — keep as fallback
        upcoming.push(norm);
      } else if (norm.matchDate >= today && norm.matchDate <= endDate) {
        upcoming.push(norm);
      }
      // Matches beyond 5 days are silently dropped
    } else {
      // Result: allow last 2 days OR invalid date matches (keep as fallback)
      if (!norm.matchDate || norm.matchDate >= pastThreshold) {
        completed.push(norm);
      }
    }
  }

  const afterFilter = live.length + upcoming.length + completed.length;
  console.log("AFTER FILTER:", afterFilter);
  if (afterFilter === 0) {
    console.warn(
      "[CricFlash] AFTER FILTER = 0. Check date parsing or API response.",
    );
  }

  // Sorting
  upcoming.sort(
    (a, b) => (a.matchDate?.getTime() ?? 0) - (b.matchDate?.getTime() ?? 0),
  );
  completed.sort(
    (a, b) => (b.matchDate?.getTime() ?? 0) - (a.matchDate?.getTime() ?? 0),
  );

  const sampleMatch = [...live, ...upcoming, ...completed][0] ?? null;
  console.log("[CricFlash Debug]", {
    totalMatches: allMatches.length,
    afterDateFilter: afterFilter,
    sampleMatch,
  });

  const result: ClassifiedMatches = { live, upcoming, completed };
  writeCache(CACHE_KEY, result);
  return result;
}

// Legacy helpers
export async function getLiveMatches(): Promise<CricMatch[]> {
  const CACHE_KEY = "cricapi_live_matches";
  const MAX_AGE = 90_000;
  if (isCacheValid(CACHE_KEY, MAX_AGE)) {
    return readCache<CricMatch[]>(CACHE_KEY) ?? [];
  }
  const data = await fetchAPI<CricMatch[]>(
    `/currentMatches?apikey=${API_KEY}&offset=0`,
  );
  writeCache(CACHE_KEY, data);
  return data;
}

export async function getUpcomingMatches(): Promise<CricMatch[]> {
  const CACHE_KEY = "cricapi_upcoming_matches";
  const MAX_AGE = 3_600_000;
  if (isCacheValid(CACHE_KEY, MAX_AGE)) {
    return readCache<CricMatch[]>(CACHE_KEY) ?? [];
  }
  const data = await fetchAPI<CricMatch[]>(
    `/matches?apikey=${API_KEY}&offset=0`,
  );
  writeCache(CACHE_KEY, data);
  return data;
}
