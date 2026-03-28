# CricFlash Admin Automation

## Current State

AdminPage.tsx has a two-column layout: left is the article form, right is the article list. Articles are stored in localStorage via useQueries.ts. cricapi.ts has `getClassifiedMatches()` which normalizes match data with date filtering (today → +5 days). MatchContext.tsx provides global match state.

## Requested Changes (Diff)

### Add
- **Automation Dashboard section** at top of AdminPage (above existing form/list grid), with:
  - 3 buttons: `Fetch Matches`, `Generate Articles`, `Publish All`
  - Stats row: Total Matches Fetched, Total Articles Generated, Total Published
  - Fetched matches list (collapsible/scrollable) below the buttons for visibility
- **`useAdminAutomation` hook** (or inline state in AdminPage) managing:
  - `fetchedMatches: NormalizedMatch[]` stored in component state + localStorage (`cricflash_admin_matches`)
  - `rawApiResponse` stored separately in localStorage (`cricflash_admin_raw`) for debugging
  - `fetchMatches()`: calls `getClassifiedMatches()`, stores raw + normalized, deduplicates by id
  - `generateArticles()`: for each fetched match, creates 4 draft articles (Dream11 Prediction, Match Prediction, Pitch Report, Playing XI) using structured templates
  - `publishAll()`: updates all draft articles to published
- **Article generation templates**: for each match produce SEO title + full content body:
  - Category auto-assigned: series contains "ipl" → IPL, "psl" → PSL, else International/Domestic
  - Slug auto-generated: e.g. `rcb-vs-srh-dream11-prediction-2026`
  - Skip duplicates: check existing articles by matchId+type before creating
- **Debug logging**: `console.log('[Admin Automation]', { totalFetched, afterFilter, articlesGenerated })`

### Modify
- `AdminPage.tsx`: add automation section at top, import `NormalizedMatch` from cricapi, use existing `useCreateArticle`/`useUpdateArticle` mutations for article storage, use `getClassifiedMatches` directly
- `useQueries.ts`: add `matchId` and `type` fields to article payload (optional fields, backward compat)

### Remove
- Nothing removed from existing UI

## Implementation Plan

1. Extend Article type in `useQueries.ts` to support optional `matchId` and `articleType` fields when saving
2. In `AdminPage.tsx`, add automation state: `fetchedMatches`, `isFetchingMatches`, `isGenerating`, `isPublishing`
3. `handleFetchMatches()`: call `getClassifiedMatches()`, flatten live+upcoming+completed, store in state and localStorage
4. `handleGenerateArticles()`: iterate matches × 4 types, check duplicates, call `createArticleMutation` for each new article
5. `handlePublishAll()`: load all articles, update status=published for drafts via `updateArticleMutation`
6. Render automation panel above existing grid: stats row + 3 buttons + fetched matches mini-list
7. Article content templates with proper SEO titles and structured content (match details, pitch report, playing XI, prediction, tips)
