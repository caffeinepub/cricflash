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
  series_id?: string;
  fantasyEnabled?: boolean;
  bbbEnabled?: boolean;
  hasSquad?: boolean;
  matchStarted?: boolean;
  matchEnded?: boolean;
}

export interface MatchDetail extends CricMatch {
  players?: { name: string; id: string }[];
  tossChoice?: string;
  tossWinner?: string;
  matchWinner?: string;
}

export interface NormalizedMatch {
  id: string;
  team1: string;
  team2: string;
  score1: string;
  score2: string;
  overs1: string;
  overs2: string;
  status: "live" | "completed" | "upcoming";
  date: Date | null;
  venue: string;
  series: string;
  matchType: string;
  statusText: string;
  raw: CricMatch;
}

export interface ClassifiedMatches {
  live: NormalizedMatch[];
  upcoming: NormalizedMatch[];
  completed: NormalizedMatch[];
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

export async function getMatchDetail(id: string): Promise<MatchDetail> {
  return fetchAPI<MatchDetail>(`/match_info?apikey=${API_KEY}&id=${id}`);
}

/**
 * Normalize a raw CricAPI match into a structured format.
 * Status is derived from data fields — not blindly trusted from API.
 */
export function normalizeMatch(m: CricMatch): NormalizedMatch {
  const teams = m.teams ?? [];
  const team1 = teams[0] ?? "TBA";
  const team2 = teams[1] ?? "TBA";

  // Extract per-team scores from score array
  const t1Scores = (m.score ?? []).filter((s) => s.inning.startsWith(team1));
  const t2Scores = (m.score ?? []).filter((s) => s.inning.startsWith(team2));

  const latestT1 = t1Scores[t1Scores.length - 1];
  const latestT2 = t2Scores[t2Scores.length - 1];

  const score1 = latestT1 ? `${latestT1.r}/${latestT1.w}` : "";
  const score2 = latestT2 ? `${latestT2.r}/${latestT2.w}` : "";
  const overs1 = latestT1 ? String(latestT1.o) : "";
  const overs2 = latestT2 ? String(latestT2.o) : "";

  // Determine status from data, NOT blindly from API status field
  const hasLiveScore =
    (m.score ?? []).length > 0 && m.matchStarted && !m.matchEnded;
  const isEnded =
    m.matchEnded === true || /won|drawn|tied|abandoned/i.test(m.status ?? "");
  const dateStr = m.dateTimeGMT || m.date;
  const matchDate = dateStr ? new Date(dateStr) : null;

  let status: "live" | "completed" | "upcoming";
  if (hasLiveScore) {
    status = "live";
  } else if (isEnded) {
    status = "completed";
  } else if (matchDate && matchDate > new Date()) {
    status = "upcoming";
  } else {
    status = "completed"; // past with no score = treat as completed
  }

  // Detect series category reliably
  const nameLower = (m.name ?? "").toLowerCase();
  let series = "International";
  if (nameLower.includes("ipl")) series = "IPL";
  else if (nameLower.includes("psl")) series = "PSL";

  return {
    id: m.id,
    team1,
    team2,
    score1,
    score2,
    overs1,
    overs2,
    status,
    date: matchDate,
    venue: m.venue || "",
    series,
    matchType: m.matchType?.toUpperCase() || "",
    statusText: m.status || "",
    raw: m,
  };
}

/**
 * Fetch all matches from CricAPI exactly once, deduplicate, normalize, classify, and sort.
 * Upcoming matches are filtered to today → today+5 days.
 */
export async function getClassifiedMatches(): Promise<ClassifiedMatches> {
  const CACHE_KEY = "cricapi_classified_v3";
  const MAX_AGE = 90_000;
  if (isCacheValid(CACHE_KEY, MAX_AGE)) {
    const cached = readCache<ClassifiedMatches>(CACHE_KEY);
    if (cached) {
      // Rehydrate dates (parsed from JSON as strings)
      const rehydrate = (matches: NormalizedMatch[]) =>
        matches.map((m) => ({
          ...m,
          date: m.date ? new Date(m.date) : null,
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

  // Deduplicate by id — currentMatches takes priority (has live score data)
  const seen = new Map<string, CricMatch>();
  for (const m of currentData) seen.set(m.id, m);
  for (const m of matchesData) {
    if (!seen.has(m.id)) seen.set(m.id, m);
  }

  const live: NormalizedMatch[] = [];
  const upcoming: NormalizedMatch[] = [];
  const completed: NormalizedMatch[] = [];

  // Date window for upcoming matches
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
  );
  const endDate = new Date(startOfToday);
  endDate.setDate(endDate.getDate() + 5);
  endDate.setHours(23, 59, 59, 999);

  for (const m of seen.values()) {
    const norm = normalizeMatch(m);
    if (norm.status === "live") {
      live.push(norm);
    } else if (norm.status === "completed") {
      completed.push(norm);
    } else {
      // Filter upcoming to today → today+5 days
      const d = norm.date;
      if (d && d >= startOfToday && d <= endDate) {
        upcoming.push(norm);
      }
    }
  }

  // Upcoming: nearest first
  upcoming.sort((a, b) => {
    const da = a.date?.getTime() ?? 0;
    const db = b.date?.getTime() ?? 0;
    return da - db;
  });

  // Completed: most recent first
  completed.sort((a, b) => {
    const da = a.date?.getTime() ?? 0;
    const db = b.date?.getTime() ?? 0;
    return db - da;
  });

  const result: ClassifiedMatches = { live, upcoming, completed };
  writeCache(CACHE_KEY, result);
  return result;
}
