const API_KEY = "76e4e258-7898-4311-ace0-4196d49df2b7";
const BASE_URL = "https://api.cricapi.com/v1";

// ─────────────────────────────────────────────────────────────────────────────
// Raw API types
// ─────────────────────────────────────────────────────────────────────────────

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
  batsman: { name: string; id: string } | string;
  r: number;
  b: number;
  "4s": number;
  "6s": number;
  sr: string;
  "dismissal-text"?: string;
}

export interface ScorecardBowler {
  bowler: { name: string; id: string } | string;
  o: number;
  m: number;
  r: number;
  w: number;
  nb?: number;
  wd?: number;
  eco: string;
}

export interface CommentaryBall {
  ball?: number | string;
  text?: string;
  runs?: number;
  wicket?: boolean;
  batter?: string;
  bowler?: string;
  title?: string;
  commentary?: string;
}

export interface CommentaryOver {
  over: number | string;
  balls?: CommentaryBall[];
  ball?: CommentaryBall[];
}

export interface ScorecardInnings {
  inning?: string;
  batting: ScorecardBatter[];
  bowling: ScorecardBowler[];
  overs?: CommentaryOver[];
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

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1 — Safe date parsing (never drops a match for bad date)
// ─────────────────────────────────────────────────────────────────────────────

export function parseDate(raw: string | undefined | null): Date | null {
  if (!raw) return null;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2 — Remove duplicates by id / unique_id
// ─────────────────────────────────────────────────────────────────────────────

function removeDuplicates(matches: CricMatch[]): CricMatch[] {
  const seen = new Set<string>();
  return matches.filter((m) => {
    const id = m.id;
    if (!id || seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 3 — Local 5-minute cache (raw matches array)
// ─────────────────────────────────────────────────────────────────────────────

const RAW_CACHE_KEY = "cricflash_matches_cache_v1";
const RAW_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function saveToCache(data: CricMatch[]): void {
  try {
    localStorage.setItem(
      RAW_CACHE_KEY,
      JSON.stringify({ data, time: Date.now() }),
    );
  } catch {
    /* storage full — ignore */
  }
}

function getCachedMatches(): CricMatch[] {
  try {
    const raw = localStorage.getItem(RAW_CACHE_KEY);
    if (!raw) return [];
    const cache: { data: CricMatch[]; time: number } = JSON.parse(raw);
    const isExpired = Date.now() - cache.time > RAW_CACHE_TTL;
    return isExpired ? [] : cache.data;
  } catch {
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 4 — Validation (reject clearly broken records)
// ─────────────────────────────────────────────────────────────────────────────

function isValidMatch(match: CricMatch): boolean {
  return (
    !!match &&
    !!(match.teamInfo?.length || match.teams?.length) &&
    !!(match.dateTimeGMT || match.date)
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 5 — Central data service: fetch → deduplicate → cache
// ─────────────────────────────────────────────────────────────────────────────

async function getAllMatches(): Promise<CricMatch[]> {
  try {
    const [currentRes, upcomingRes] = await Promise.all([
      fetch(`${BASE_URL}/currentMatches?apikey=${API_KEY}&offset=0`).then((r) =>
        r.json(),
      ),
      fetch(`${BASE_URL}/matches?apikey=${API_KEY}&offset=0`).then((r) =>
        r.json(),
      ),
    ]);

    const all: CricMatch[] = [
      ...((currentRes?.data as CricMatch[]) || []),
      ...((upcomingRes?.data as CricMatch[]) || []),
    ];

    if (all.length === 0) {
      console.warn("[CricFlash] API returned empty — using cache");
      return getCachedMatches();
    }

    const deduped = removeDuplicates(all);
    saveToCache(deduped);
    return deduped;
  } catch (error) {
    console.error("[CricFlash] API FAILED", error);
    const cached = getCachedMatches();
    if (cached.length > 0) {
      console.log("[CricFlash] Serving from cache", cached.length, "matches");
    }
    return cached;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 6 — Status detection
// ─────────────────────────────────────────────────────────────────────────────

function getStatus(
  statusText: string,
  matchDate: Date | null,
): NormalizedMatch["status"] {
  const text = (statusText || "").toLowerCase();

  if (text.includes("live") || text.includes("progress")) return "live";

  if (
    text.includes("won") ||
    text.includes("lost") ||
    text.includes("result") ||
    text.includes("finished")
  )
    return "result";

  // Default: use date to decide
  const now = new Date();
  if (matchDate && matchDate < now) return "result";
  return "upcoming";
}

// ─────────────────────────────────────────────────────────────────────────────
// Series helpers
// ─────────────────────────────────────────────────────────────────────────────

export function normalizeSeries(name: string | undefined | null): string {
  if (!name) return "other";
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .trim();
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
  if (s.includes("ipl") || s.includes("indian premier league")) return "IPL";
  if (s.includes("psl") || s.includes("pakistan super league")) return "PSL";
  if (s.includes("women") || s.includes("woman")) return "Women";
  for (const country of COUNTRY_NAMES) {
    if (s.includes(country)) return "International";
  }
  return "Domestic";
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 7 — Normalize once (after fetch + dedup + validate)
// ─────────────────────────────────────────────────────────────────────────────

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
  const series = match.series || match.name || "Other";
  const venue = match.venue || "";
  const statusText = match.status || "";
  const matchType = (match.matchType || "").toLowerCase();
  const seriesCategory = detectSeriesCategory(series);

  // Parse date safely — never drop the match if invalid
  const matchDate = parseDate(rawDate);

  const matchNumberMatch = (match.name || "").match(
    /(\d+(?:st|nd|rd|th)\s+Match)/i,
  );
  const matchNumber = matchNumberMatch ? matchNumberMatch[1] : null;

  const status = getStatus(statusText, matchDate);

  const now = new Date();
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const startingSoon =
    status === "upcoming" && matchDate !== null && matchDate <= in24h;

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

// ─────────────────────────────────────────────────────────────────────────────
// Fallback data — shown when API and cache both fail
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// Classified-match cache (short-lived, for avoiding repeat calls within 90s)
// ─────────────────────────────────────────────────────────────────────────────

const CLASSIFIED_CACHE_KEY = "cricflash_classified_v13";
const CLASSIFIED_CACHE_TTL = 90_000;

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
    localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() }));
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

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC: getClassifiedMatches — single entry point for all match UI
// Pipeline: fetch → dedupe → saveToCache → validate → normalize → classify
// ─────────────────────────────────────────────────────────────────────────────

export async function getClassifiedMatches(): Promise<ClassifiedMatches> {
  // Short-circuit: reuse classified result if fetched within last 90s
  if (isCacheValid(CLASSIFIED_CACHE_KEY, CLASSIFIED_CACHE_TTL)) {
    const cached = readCache<ClassifiedMatches>(CLASSIFIED_CACHE_KEY);
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

  // Fetch raw matches (with built-in cache fallback on failure)
  const rawMatches = await getAllMatches();

  if (rawMatches.length === 0) {
    console.warn(
      "[CricFlash] No matches from API or cache — using fallback data",
    );
    return FALLBACK_MATCHES;
  }

  // Validate: reject clearly broken records
  const cleanMatches = rawMatches.filter(isValidMatch);

  // Normalize once
  const normalizedMatches = cleanMatches.map((m) => normalizeMatch(m));

  // Classify — NO date filtering, keep all matches
  const live: NormalizedMatch[] = [];
  const upcoming: NormalizedMatch[] = [];
  const completed: NormalizedMatch[] = [];

  console.log("TOTAL:", normalizedMatches.length);

  for (const m of normalizedMatches) {
    if (m.status === "live") {
      live.push(m);
    } else if (m.status === "upcoming") {
      upcoming.push(m);
    } else {
      completed.push(m);
    }
  }

  const byDateAsc = (a: NormalizedMatch, b: NormalizedMatch) =>
    (a.matchDate?.getTime() ?? 0) - (b.matchDate?.getTime() ?? 0);
  const byDateDesc = (a: NormalizedMatch, b: NormalizedMatch) =>
    (b.matchDate?.getTime() ?? 0) - (a.matchDate?.getTime() ?? 0);

  upcoming.sort(byDateAsc);
  completed.sort(byDateDesc);
  live.sort(byDateAsc);

  const total = live.length + upcoming.length + completed.length;
  if (total === 0) {
    console.warn("[CricFlash] All matches filtered out — using fallback data");
    return FALLBACK_MATCHES;
  }

  const result: ClassifiedMatches = { live, upcoming, completed };
  writeCache(CLASSIFIED_CACHE_KEY, result);
  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// Match detail & scorecard (unchanged)
// ─────────────────────────────────────────────────────────────────────────────

export async function getMatchDetail(id: string): Promise<MatchDetail> {
  const url = `${BASE_URL}/match_info?apikey=${API_KEY}&id=${id}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.status !== "success") throw new Error(data.reason || "API error");
  return data.data as MatchDetail;
}

export interface MatchScorecardData {
  scorecard: ScorecardInnings[];
}

export async function getMatchScorecard(
  id: string,
): Promise<MatchScorecardData | null> {
  try {
    const url = `${BASE_URL}/match_scorecard?apikey=${API_KEY}&id=${id}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.status !== "success" || !data.data) return null;
    const raw = data.data;
    const scorecard: ScorecardInnings[] = Array.isArray(raw.scorecard)
      ? raw.scorecard
      : Array.isArray(raw)
        ? raw
        : [];
    return { scorecard };
  } catch {
    return null;
  }
}

export async function fetchSeriesList(): Promise<CricSeries[]> {
  const CACHE_KEY = "cricapi_series_v1";
  const MAX_AGE = 3_600_000;
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

// Legacy helpers (kept for admin automation panel)
export async function getLiveMatches(): Promise<CricMatch[]> {
  const CACHE_KEY = "cricapi_live_matches";
  const MAX_AGE = 90_000;
  if (isCacheValid(CACHE_KEY, MAX_AGE))
    return readCache<CricMatch[]>(CACHE_KEY) ?? [];
  try {
    const res = await fetch(
      `${BASE_URL}/currentMatches?apikey=${API_KEY}&offset=0`,
    );
    const data = await res.json();
    const matches: CricMatch[] = data?.data ?? [];
    writeCache(CACHE_KEY, matches);
    return matches;
  } catch {
    return [];
  }
}

export async function getUpcomingMatches(): Promise<CricMatch[]> {
  const CACHE_KEY = "cricapi_upcoming_matches";
  const MAX_AGE = 3_600_000;
  if (isCacheValid(CACHE_KEY, MAX_AGE))
    return readCache<CricMatch[]>(CACHE_KEY) ?? [];
  try {
    const res = await fetch(`${BASE_URL}/matches?apikey=${API_KEY}&offset=0`);
    const data = await res.json();
    const matches: CricMatch[] = data?.data ?? [];
    writeCache(CACHE_KEY, matches);
    return matches;
  } catch {
    return [];
  }
}
