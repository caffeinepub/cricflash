import { c as createLucideIcon } from "./index-j1Env-oC.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
];
const RefreshCw = createLucideIcon("refresh-cw", __iconNode);
const API_KEY = "76e4e258-7898-4311-ace0-4196d49df2b7";
const BASE_URL = "https://api.cricapi.com/v1";
function readCache(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const entry = JSON.parse(raw);
    return entry.data;
  } catch {
    return null;
  }
}
function writeCache(key, data) {
  try {
    const entry = { data, ts: Date.now() };
    localStorage.setItem(key, JSON.stringify(entry));
  } catch {
  }
}
function isCacheValid(key, maxAgeMs) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return false;
    const entry = JSON.parse(raw);
    return Date.now() - entry.ts < maxAgeMs;
  } catch {
    return false;
  }
}
async function fetchAPI(endpoint) {
  const url = `${BASE_URL}${endpoint}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`CricAPI error: ${res.status}`);
  const json = await res.json();
  if (json.status !== "success") throw new Error(json.reason || "API error");
  return json.data;
}
async function getLiveMatches() {
  const CACHE_KEY = "cricapi_live_matches";
  const MAX_AGE = 9e4;
  if (isCacheValid(CACHE_KEY, MAX_AGE)) {
    return readCache(CACHE_KEY) ?? [];
  }
  const data = await fetchAPI(
    `/currentMatches?apikey=${API_KEY}&offset=0`
  );
  writeCache(CACHE_KEY, data);
  return data;
}
async function getUpcomingMatches() {
  const CACHE_KEY = "cricapi_upcoming_matches";
  const MAX_AGE = 36e5;
  if (isCacheValid(CACHE_KEY, MAX_AGE)) {
    return readCache(CACHE_KEY) ?? [];
  }
  const data = await fetchAPI(
    `/matches?apikey=${API_KEY}&offset=0`
  );
  writeCache(CACHE_KEY, data);
  return data;
}
async function getMatchDetail(id) {
  return fetchAPI(`/match_info?apikey=${API_KEY}&id=${id}`);
}
export {
  RefreshCw as R,
  getUpcomingMatches as a,
  getMatchDetail as b,
  getLiveMatches as g
};
