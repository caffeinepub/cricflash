# CricFlash

## Current State
- `cricapi.ts` fetches from `/currentMatches` and `/matches`, no date filtering. Status classification uses `matchStarted/matchEnded` flags from API which causes all-LIVE bugs. NormalizedMatch has a single `score` string but no per-team score1/score2/overs1/overs2 fields. No venue field in normalized form.
- `MatchCard.tsx` accepts raw `CricMatch`, shows raw `match.date` with `toLocaleDateString()` (GMT not converted to local). Status badge logic is inconsistent with normalizeMatch.
- `MatchContext.tsx` stores raw `ClassifiedMatches` (arrays of `CricMatch`), not normalized.
- `HomePage.tsx` carousel uses raw CricMatch via MatchContext.
- `LiveScorePage.tsx` uses raw CricMatch with its own `applyFilters` function.
- `MatchDetailPage.tsx` shows raw messy title, splits team scores into two separate cards, no tabs, raw status text.

## Requested Changes (Diff)

### Add
- Date range filter: today 00:00 to today+5 days 23:59 (local time). Applied to upcoming matches only (completed and live pass through).
- Smart date display helper: "Today", "Tomorrow", or "Mar 30" format, converting GMT to local.
- Enhanced `NormalizedMatch` interface: add `score1`, `score2`, `overs1`, `overs2`, `venue`, `series` fields. Keep `team1`, `team2`, `status`, `date`, `matchType`.
- Status classification logic based on score presence + date: if score array has entries AND matchStarted AND !matchEnded → live; if matchEnded OR status text has won/drawn/tied/abandoned → completed; else if matchDate > now → upcoming; else → completed.
- `MatchDetailPage` ESPN-style: header with status badge + clean "Team A vs Team B" title + series + date/venue. Single score summary card (left team, right team, bottom status). Tab system (Live, Scorecard, Info). Live tab shows batsmen table (name, runs, balls, SR) and bowler row (overs, runs, wickets). Scorecard tab shows batting and bowling tables with aligned columns. Upcoming UI shows teams + local time + venue + "Match yet to begin". Result UI shows final scores + winner text.
- `MatchContext` to store `NormalizedMatch[]` arrays instead of raw `CricMatch[]`.

### Modify
- `normalizeMatch()`: Enhance to populate score1/score2/overs1/overs2/venue/series fields from raw API. Fix status classification logic.
- `getClassifiedMatches()`: Apply date range filter to upcoming only. Bump cache key to invalidate old cache.
- `MatchCard.tsx`: Accept `NormalizedMatch` instead of `CricMatch`. Show smart date. Use normalized status for badge (live=red, upcoming=green, result=grey). Show per-team scores from score1/score2.
- `MatchContext.tsx`: Store `NormalizedMatch[]` not raw.
- `HomePage.tsx` carousel: consume `NormalizedMatch[]` from context.
- `LiveScorePage.tsx`: Consume `NormalizedMatch[]`, update `applyFilters` to work with NormalizedMatch fields.

### Remove
- Raw date display (GMT `toLocaleDateString()` without timezone handling) in MatchCard.
- Messy duplicate title from MatchDetailPage header.
- Split team score cards in MatchDetailPage (replaced by unified card).
- All-LIVE status bug.

## Implementation Plan
1. Update `NormalizedMatch` interface and `normalizeMatch()` in `cricapi.ts` — add score1/score2/overs1/overs2/venue/series, fix status logic, apply 5-day date filter to upcoming.
2. Update `MatchContext.tsx` to store `NormalizedMatch[]` and export correct types.
3. Rewrite `MatchCard.tsx` to consume `NormalizedMatch`, smart date display, correct status badges.
4. Update `HomePage.tsx` carousel to use `NormalizedMatch[]`.
5. Update `LiveScorePage.tsx` to use `NormalizedMatch[]` and updated filter function.
6. Rewrite `MatchDetailPage.tsx` with ESPN-style layout: clean header, unified score card, tabs (Live/Scorecard/Info), structured tables, mobile-optimized.
7. Validate (lint + typecheck + build).
