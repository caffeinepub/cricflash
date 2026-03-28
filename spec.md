# CricFlash

## Current State
- Telegram API calls made directly from frontend (utils/telegram.ts) causing CORS errors
- Admin panel has basic automation buttons (Fetch, Generate, Publish All)
- No auto scheduler system
- No duplicate prevention for article generation
- No log system
- Backend (Motoko) has no HTTP outcall capability

## Requested Changes (Diff)

### Add
- Backend `sendTelegramMessage(botToken, chatId, message)` function using HTTP outcalls component
- Auto Scheduler system in AdminPage: toggle ON/OFF, Run Now button, daily 07:00 trigger
- `runDailyAutomation()` function: fetch → normalize → generate → publish → telegram
- Duplicate prevention: check matchId + articleType before generating
- Log system: lastRunTime, articlesCreated, errors — displayed in admin panel
- Delay between bulk Telegram messages (1-2 sec)

### Modify
- `utils/telegram.ts`: remove all direct `fetch("https://api.telegram.org/...")` calls; replace with calls to backend canister `sendTelegramMessage`
- `AdminPage.tsx`: wire Test button and publish flow to new backend-proxied telegram function; add scheduler UI section and log display
- `backend.d.ts`: add `sendTelegramMessage` signature
- `main.mo`: add sendTelegramMessage HTTP outcall function

### Remove
- All direct frontend fetch calls to `api.telegram.org`

## Implementation Plan
1. Select `http-outcalls` component
2. Update `main.mo` to add `sendTelegramMessage` via HTTP outcalls
3. Regenerate backend bindings (backend.d.ts)
4. Rewrite `utils/telegram.ts` to proxy through backend canister
5. Update `AdminPage.tsx`:
   - Import updated telegram utilities
   - Add Scheduler section: toggle + Run Now button
   - Add Log section: last run time, articles created, errors
   - Implement `runDailyAutomation()` with duplicate prevention
   - Add setInterval scheduler (checks every minute for 07:00)
   - Bulk Telegram sends with 1.5s delay between messages
