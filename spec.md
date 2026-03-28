# CricFlash

## Current State
Admin panel at `/admin` has article management, automated content generation (Fetch Matches, Generate Articles, Publish All), and article CRUD. Articles are stored via backend with localStorage fallback. Publish is handled by `handleSubmitArticle` (single) and `handlePublishAll` (bulk). No Telegram integration exists.

## Requested Changes (Diff)

### Add
- `src/frontend/src/utils/telegram.ts` — `sendToTelegram(article)` utility that reads bot token + chat ID from localStorage (`cricflash_telegram_settings`), sends POST to `https://api.telegram.org/bot{token}/sendMessage` with Markdown-formatted message, throws on failure.
- Telegram Settings section in AdminPage: fields for Bot Token, Chat ID, Channel Link; Save Settings button (persists to localStorage); Test Connection button (sends test message to real Telegram API).
- Auto-call `sendToTelegram(article)` after single article publish (when `formPublished === true`).
- Loop call in `handlePublishAll` to send each newly published article to Telegram.

### Modify
- `AdminPage.tsx`: add Telegram state (botToken, chatId, channelLink), load from localStorage on mount, save handler, test handler, wire into publish flows.

### Remove
- Nothing.

## Implementation Plan
1. Create `src/frontend/src/utils/telegram.ts` with `sendToTelegram(article)` and `testTelegramConnection()` functions.
2. Add Telegram Settings section in AdminPage after the automation dashboard — fields, save button, test button with loading/error states.
3. After `createArticleMutation` succeeds with `status: 'published'`, call `sendToTelegram` (non-blocking, errors logged to console + toast warning).
4. After each article is published in `handlePublishAll`, call `sendToTelegram` similarly.
5. Show warning toasts if token/chatId missing when trying to send.
