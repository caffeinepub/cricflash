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

export interface MatchDebugInfo {
  rawCount: number;
  normalizedCount: number;
  filteredCount: number;
}

export interface ClassifiedMatches {
  live: NormalizedMatch[];
  upcoming: NormalizedMatch[];
  completed: NormalizedMatch[];
  debugInfo?: MatchDebugInfo;
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

// Fallback matches shown when API is unreachable
const FALLBACK_MATCHES: ClassifiedMatches = {
  live: [
    {
      id: "fallback-live-1",
      team1: "RCB",
      team2: "CSK",
      score1: 120,
      wickets1: 4,
      overs1: 14.2,
      score2: 110,
      wickets2: 3,
      overs2: 13.0,
      rawDate: new Date().toISOString(),
      series: "IPL 2026",
      seriesCategory: "IPL" as const,
      venue: "M. Chinnaswamy Stadium, Bengaluru",
      statusText: "RCB innings: Live",
      matchType: "t20",
      status: "live" as const,
      matchDate: new Date(),
    },
  ],
  upcoming: [
    {
      id: "fallback-upcoming-1",
      team1: "India",
      team2: "Australia",
      score1: null,
      wickets1: null,
      overs1: null,
      score2: null,
      wickets2: null,
      overs2: null,
      rawDate: new Date(Date.now() + 86400000).toISOString(),
      series: "India vs Australia 2026",
      seriesCategory: "International" as const,
      venue: "Wankhede Stadium, Mumbai",
      statusText: "Match starts tomorrow",
      matchType: "t20",
      status: "upcoming" as const,
      matchDate: new Date(Date.now() + 86400000),
    },
    {
      id: "fallback-upcoming-2",
      team1: "Pakistan",
      team2: "England",
      score1: null,
      wickets1: null,
      overs1: null,
      score2: null,
      wickets2: null,
      overs2: null,
      rawDate: new Date(Date.now() + 172800000).toISOString(),
      series: "Pakistan vs England 2026",
      seriesCategory: "International" as const,
      venue: "National Stadium, Karachi",
      statusText: "Match in 2 days",
      matchType: "odi",
      status: "upcoming" as const,
      matchDate: new Date(Date.now() + 172800000),
    },
  ],
  completed: [
    {
      id: "fallback-result-1",
      team1: "MI",
      team2: "KKR",
      score1: 185,
      wickets1: 6,
      overs1: 20,
      score2: 178,
      wickets2: 8,
      overs2: 20,
      rawDate: new Date(Date.now() - 86400000).toISOString(),
      series: "IPL 2026",
      seriesCategory: "IPL" as const,
      venue: "Eden Gardens, Kolkata",
      statusText: "MI won by 7 runs",
      matchType: "t20",
      status: "result" as const,
      matchDate: new Date(Date.now() - 86400000),
    },
  ],
  debugInfo: { rawCount: 0, normalizedCount: 0, filteredCount: 0 },
};

async function fetchFromCricAPI(endpoint: string): Promise<CricMatch[]> {
  const url = `${BASE_URL}${endpoint}`;
  console.log("API URL:", url);

  const res = await fetch(url);
  if (!res.ok) throw new Error(`CricAPI HTTP error: ${res.status}`);

  const data = await res.json();
  console.log("API RESPONSE:", data);

  // CricAPI wraps results in data.data
  const matches: CricMatch[] = data?.data ?? data?.matches ?? [];
  console.log("MATCH ARRAY:", matches);

  if (!Array.isArray(matches)) {
    throw new Error(
      `Unexpected response structure: ${JSON.stringify(data).slice(0, 200)}`,
    );
  }
  return matches;
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

  let matchDate: Date | null = null;
  if (rawDate) {
    const d = new Date(rawDate);
    if (!Number.isNaN(d.getTime())) matchDate = d;
  }

  const now = new Date();
  const statusLower = statusText.toLowerCase();

  let status: NormalizedMatch["status"];

  if (
    statusLower.includes("live") ||
    statusLower.includes("progress") ||
    statusLower.includes("inning") ||
    statusLower.includes("started")
  ) {
    status = "live";
  } else if (statusLower.includes("won") || statusLower.includes("result")) {
    status = "result";
  } else if (matchDate && matchDate >= now) {
    status = "upcoming";
  } else {
    status = "result";
  }

  console.log("STATUS CHECK:", statusText, "→", status);

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
  const url = `${BASE_URL}/match_info?apikey=${API_KEY}&id=${id}`;
  console.log("API URL:", url);
  const res = await fetch(url);
  const data = await res.json();
  console.log("API RESPONSE:", data);
  if (data.status !== "success") throw new Error(data.reason || "API error");
  return data.data as MatchDetail;
}

export async function getClassifiedMatches(): Promise<ClassifiedMatches> {
  // Bump to v7 to bust stale cache
  const CACHE_KEY = "cricapi_classified_v7";
  const MAX_AGE = 90_000;

  if (isCacheValid(CACHE_KEY, MAX_AGE)) {
    const cached = readCache<ClassifiedMatches>(CACHE_KEY);
    if (cached?.debugInfo) {
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
        debugInfo: cached.debugInfo,
      };
    }
  }

  // Fetch both endpoints; each catch returns empty array so the other can still succeed
  const [currentData, matchesData] = await Promise.all([
    fetchFromCricAPI(`/currentMatches?apikey=${API_KEY}&offset=0`).catch(
      (e) => {
        console.warn("[CricFlash] currentMatches failed:", e);
        return [] as CricMatch[];
      },
    ),
    fetchFromCricAPI(`/matches?apikey=${API_KEY}&offset=0`).catch((e) => {
      console.warn("[CricFlash] matches failed:", e);
      return [] as CricMatch[];
    }),
  ]);

  // Deduplicate — currentMatches takes priority (has live data)
  const seen = new Map<string, CricMatch>();
  for (const m of currentData) seen.set(m.id, m);
  for (const m of matchesData) {
    if (!seen.has(m.id)) seen.set(m.id, m);
  }

  const allMatches = Array.from(seen.values());
  const rawCount = allMatches.length;

  console.log("RAW MATCHES count:", rawCount);
  console.log("RAW MATCHES:", allMatches);

  if (allMatches.length === 0) {
    console.warn(
      "[CricFlash] Both API calls returned empty — showing fallback data.",
    );
    return {
      ...FALLBACK_MATCHES,
      debugInfo: { rawCount: 0, normalizedCount: 0, filteredCount: 3 },
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // Relaxed: upcoming window +7 days, result window last 3 days
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + 7);
  endDate.setHours(23, 59, 59, 999);
  const pastThreshold = new Date(today);
  pastThreshold.setDate(today.getDate() - 3);

  const live: NormalizedMatch[] = [];
  const upcoming: NormalizedMatch[] = [];
  const completed: NormalizedMatch[] = [];
  let normalizedCount = 0;

  for (const m of allMatches) {
    const norm = normalizeMatch(m);
    normalizedCount++;

    if (norm.status === "live") {
      // Always include live matches regardless of date
      live.push(norm);
    } else if (norm.status === "upcoming") {
      if (
        !norm.matchDate ||
        (norm.matchDate >= today && norm.matchDate <= endDate)
      ) {
        upcoming.push(norm);
      }
    } else {
      if (!norm.matchDate || norm.matchDate >= pastThreshold) {
        completed.push(norm);
      }
    }
  }

  const filteredCount = live.length + upcoming.length + completed.length;

  console.log("NORMALIZED:", normalizedCount);
  console.log("FINAL MATCHES (filtered):", filteredCount);
  console.log("[CricFlash Debug]", {
    rawCount,
    normalizedCount,
    filteredCount,
    live: live.length,
    upcoming: upcoming.length,
    completed: completed.length,
  });

  if (filteredCount === 0) {
    console.warn(
      "[CricFlash] filteredCount = 0 after pipeline — showing fallback.",
    );
    return {
      ...FALLBACK_MATCHES,
      debugInfo: { rawCount, normalizedCount, filteredCount: 0 },
    };
  }

  upcoming.sort(
    (a, b) => (a.matchDate?.getTime() ?? 0) - (b.matchDate?.getTime() ?? 0),
  );
  completed.sort(
    (a, b) => (b.matchDate?.getTime() ?? 0) - (a.matchDate?.getTime() ?? 0),
  );

  const debugInfo: MatchDebugInfo = {
    rawCount,
    normalizedCount,
    filteredCount,
  };
  const result: ClassifiedMatches = { live, upcoming, completed, debugInfo };
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
  const data = await fetchFromCricAPI(
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
  const data = await fetchFromCricAPI(`/matches?apikey=${API_KEY}&offset=0`);
  writeCache(CACHE_KEY, data);
  return data;
}
