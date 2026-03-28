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
  startingSoon: boolean;
  matchNumber: string | null;
}

export interface ClassifiedMatches {
  live: NormalizedMatch[];
  upcoming: NormalizedMatch[];
  completed: NormalizedMatch[];
}

export interface CricSeries {
  id: string;
  name: string;
  startdt?: string;
  enddt?: string;
  odi?: number;
  t20?: number;
  test?: number;
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
    /* ignore */
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
      seriesCategory: "IPL",
      venue: "M. Chinnaswamy Stadium, Bengaluru",
      statusText: "RCB innings: Live",
      matchType: "t20",
      status: "live",
      matchDate: new Date(),
      startingSoon: false,
      matchNumber: null,
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
      seriesCategory: "International",
      venue: "Wankhede Stadium, Mumbai",
      statusText: "Match starts tomorrow",
      matchType: "t20",
      status: "upcoming",
      matchDate: new Date(Date.now() + 86400000),
      startingSoon: false,
      matchNumber: null,
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
      seriesCategory: "International",
      venue: "National Stadium, Karachi",
      statusText: "Match in 2 days",
      matchType: "odi",
      status: "upcoming",
      matchDate: new Date(Date.now() + 172800000),
      startingSoon: false,
      matchNumber: null,
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
      seriesCategory: "IPL",
      venue: "Eden Gardens, Kolkata",
      statusText: "MI won by 7 runs",
      matchType: "t20",
      status: "result",
      matchDate: new Date(Date.now() - 86400000),
      startingSoon: false,
      matchNumber: null,
    },
  ],
};

async function fetchFromCricAPI(endpoint: string): Promise<CricMatch[]> {
  const url = `${BASE_URL}${endpoint}`;
  console.log("[CricFlash] API URL:", url);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`CricAPI HTTP error: ${res.status}`);
  const data = await res.json();
  console.log("[CricFlash] API RESPONSE:", data);
  const matches: CricMatch[] = data?.data ?? data?.matches ?? [];
  if (!Array.isArray(matches)) {
    throw new Error(
      `Unexpected response structure: ${JSON.stringify(data).slice(0, 200)}`,
    );
  }
  return matches;
}

/**
 * Normalize a match with optional source hint.
 * currentSource = true means it came from /currentMatches (live/result biased)
 * currentSource = false means it came from /matches (upcoming biased)
 */
export function normalizeMatch(
  match: CricMatch,
  fromCurrentMatches = false,
): NormalizedMatch {
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

  // Extract match number from match name (e.g. "46th Match")
  const matchNumberMatch = (match.name || "").match(
    /(\d+(?:st|nd|rd|th)\s+Match)/i,
  );
  const matchNumber = matchNumberMatch ? matchNumberMatch[1] : null;

  let matchDate: Date | null = null;
  if (rawDate) {
    const d = new Date(rawDate);
    if (!Number.isNaN(d.getTime())) matchDate = d;
  }

  const now = new Date();
  const statusLower = statusText.toLowerCase();

  let status: NormalizedMatch["status"];

  // Check text for live/result indicators regardless of source
  if (
    statusLower.includes("live") ||
    statusLower.includes("progress") ||
    statusLower.includes("inning") ||
    statusLower.includes("stumps") ||
    statusLower.includes("day") ||
    statusLower.includes("session") ||
    statusLower.includes("started")
  ) {
    status = "live";
  } else if (
    statusLower.includes("won") ||
    statusLower.includes("lost") ||
    statusLower.includes("result") ||
    statusLower.includes("finished")
  ) {
    status = "result";
  } else if (fromCurrentMatches) {
    // From currentMatches but no live/result text — treat as result if past, else live
    if (matchDate && matchDate > now) {
      status = "upcoming";
    } else {
      status = "result";
    }
  } else {
    // From /matches endpoint — default to upcoming if in the future
    if (matchDate && matchDate >= now) {
      status = "upcoming";
    } else {
      status = "result";
    }
  }

  // "Starting Soon" = upcoming match within the next 24 hours
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const startingSoon =
    status === "upcoming" && matchDate !== null && matchDate <= in24h;

  console.log(
    "[CricFlash] STATUS:",
    JSON.stringify(statusText),
    "→",
    status,
    "| source:",
    fromCurrentMatches ? "current" : "fixtures",
  );

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
    startingSoon,
    matchNumber,
  };
}

export async function getMatchDetail(id: string): Promise<MatchDetail> {
  const url = `${BASE_URL}/match_info?apikey=${API_KEY}&id=${id}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.status !== "success") throw new Error(data.reason || "API error");
  return data.data as MatchDetail;
}

export async function fetchSeriesList(): Promise<CricSeries[]> {
  const CACHE_KEY = "cricapi_series_v1";
  const MAX_AGE = 3_600_000; // 1 hour
  if (isCacheValid(CACHE_KEY, MAX_AGE)) {
    return readCache<CricSeries[]>(CACHE_KEY) ?? [];
  }
  try {
    const url = `${BASE_URL}/series?apikey=${API_KEY}&offset=0`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const series: CricSeries[] = data?.data ?? [];
    writeCache(CACHE_KEY, series);
    return series;
  } catch (e) {
    console.warn("[CricFlash] fetchSeriesList failed:", e);
    return [];
  }
}

export async function getClassifiedMatches(): Promise<ClassifiedMatches> {
  const CACHE_KEY = "cricapi_classified_v10";
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

  // Fetch BOTH endpoints in parallel
  const [currentData, fixturesData] = await Promise.all([
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

  if (currentData.length === 0 && fixturesData.length === 0) {
    console.warn(
      "[CricFlash] Both endpoints returned empty — showing fallback.",
    );
    return FALLBACK_MATCHES;
  }

  // Merge: currentMatches takes priority (has live score data)
  const seen = new Map<string, { match: CricMatch; fromCurrent: boolean }>();
  for (const m of currentData) seen.set(m.id, { match: m, fromCurrent: true });
  for (const m of fixturesData) {
    if (!seen.has(m.id)) seen.set(m.id, { match: m, fromCurrent: false });
  }

  console.log("[CricFlash] Total unique matches after merge:", seen.size);

  // Normalize after merge, preserving source
  const normalized: NormalizedMatch[] = [];
  for (const { match, fromCurrent } of seen.values()) {
    normalized.push(normalizeMatch(match, fromCurrent));
  }

  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const pastThreshold = new Date(today);
  pastThreshold.setDate(today.getDate() - 3);

  const live: NormalizedMatch[] = [];
  const upcoming: NormalizedMatch[] = [];
  const completed: NormalizedMatch[] = [];

  for (const m of normalized) {
    if (m.status === "live") {
      live.push(m);
    } else if (m.status === "upcoming") {
      if (!m.matchDate || m.matchDate >= today) {
        upcoming.push(m);
      }
    } else {
      // result
      if (!m.matchDate || m.matchDate >= pastThreshold) {
        completed.push(m);
      }
    }
  }

  // Sort all by date ascending (nearest first)
  const byDateAsc = (a: NormalizedMatch, b: NormalizedMatch) =>
    (a.matchDate?.getTime() ?? 0) - (b.matchDate?.getTime() ?? 0);
  const byDateDesc = (a: NormalizedMatch, b: NormalizedMatch) =>
    (b.matchDate?.getTime() ?? 0) - (a.matchDate?.getTime() ?? 0);

  upcoming.sort(byDateAsc);
  completed.sort(byDateDesc);
  // live matches: sort by date ascending too
  live.sort(byDateAsc);

  console.log("[CricFlash] Pipeline:", {
    live: live.length,
    upcoming: upcoming.length,
    completed: completed.length,
  });

  const filteredCount = live.length + upcoming.length + completed.length;
  if (filteredCount === 0) {
    console.warn("[CricFlash] filteredCount = 0 — showing fallback.");
    return FALLBACK_MATCHES;
  }

  const result: ClassifiedMatches = { live, upcoming, completed };
  writeCache(CACHE_KEY, result);
  return result;
}

// Legacy helpers
export async function getLiveMatches(): Promise<CricMatch[]> {
  const CACHE_KEY = "cricapi_live_matches";
  const MAX_AGE = 90_000;
  if (isCacheValid(CACHE_KEY, MAX_AGE))
    return readCache<CricMatch[]>(CACHE_KEY) ?? [];
  const data = await fetchFromCricAPI(
    `/currentMatches?apikey=${API_KEY}&offset=0`,
  );
  writeCache(CACHE_KEY, data);
  return data;
}

export async function getUpcomingMatches(): Promise<CricMatch[]> {
  const CACHE_KEY = "cricapi_upcoming_matches";
  const MAX_AGE = 3_600_000;
  if (isCacheValid(CACHE_KEY, MAX_AGE))
    return readCache<CricMatch[]>(CACHE_KEY) ?? [];
  const data = await fetchFromCricAPI(`/matches?apikey=${API_KEY}&offset=0`);
  writeCache(CACHE_KEY, data);
  return data;
}
