# CricFlash

## Current State
- `cricapi.ts` fetches `/currentMatches` + `/matches`, merges, normalizes, classifies (live/upcoming/result)
- `NormalizedMatch` has: id, team1, team2, scores, rawDate, series, seriesCategory, venue, statusText, matchType, status, matchDate, startingSoon
- `LiveScorePage` uses STATIC SERIES_OPTIONS = ["All", "IPL", "PSL", "International", "Domestic", "Women"]
- `MatchCard` shows: series category badge, matchType, team names + scores, statusText, series (truncated), venue, date
- `MatchDetailPage` already calls `/match_info?id=` and shows venue, date, toss, series, scorecard tabs
- No `/series` endpoint is used
- Match number (e.g. "46th Match") is NOT extracted from match name

## Requested Changes (Diff)

### Add
- `matchNumber` field to `NormalizedMatch` — extracted from `match.name` using regex (e.g. "IPL 2026, 46th Match" → "46th Match")
- `fetchSeriesList()` function in `cricapi.ts` calling `/series?apikey=...` — returns top series (IPL, PSL, etc.)
- Dynamic series filter in `LiveScorePage` — derive unique series labels from loaded match data instead of static array; generate options as: "All" + unique `seriesCategory` values + unique top-level series names from matches
- Match number displayed on `MatchCard` — show "46th Match" in small text below series badge if available
- Match description (`match.name`) shown in `MatchDetailPage` Info tab and in the header subtitle
- Series endpoint fetched alongside match data in `MatchContext` (optional parallel fetch, non-blocking)

### Modify
- `normalizeMatch()`: extract `matchNumber` from `match.name` with regex `/(\d+(?:st|nd|rd|th) Match)/i`
- `NormalizedMatch` interface: add `matchNumber: string | null`
- `LiveScorePage`: replace `SERIES_OPTIONS` static array with `useMemo` that derives options from `classified` data — extract unique `seriesCategory` values; also add raw series name matching for "IPL", "PSL" etc. Keep filter logic working.
- `MatchCard`: show `matchNumber` below the series/type row if non-null (small muted text)
- `MatchDetailPage`: in header, show `match.name` as subtitle (the full description like "IPL 2026, 46th Match"); ensure Info tab shows toss prominently
- Cache key bumped to `v10` to flush stale data without matchNumber

### Remove
- Nothing removed — no UI changes, no component removal

## Implementation Plan
1. Update `NormalizedMatch` interface to add `matchNumber: string | null`
2. Update `normalizeMatch()` to extract matchNumber from `match.name`
3. Add `fetchSeriesList()` in `cricapi.ts`
4. Bump cache key to `v10`
5. Update `MatchCard` to show matchNumber
6. Update `LiveScorePage` to use dynamic series filter derived from match data
7. Update `MatchDetailPage` to show `match.name` as full description in header and Info tab
