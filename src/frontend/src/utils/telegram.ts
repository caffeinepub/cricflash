const STORAGE_KEY = "cricflash_telegram_settings";

export interface TelegramSettings {
  botToken: string;
  chatId: string;
  channelLink: string;
}

export function loadTelegramSettings(): TelegramSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return { botToken: "", chatId: "", channelLink: "" };
}

export function saveTelegramSettings(settings: TelegramSettings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function buildTelegramMessage(article: {
  title: string;
  excerpt?: string;
  category?: string;
  slug?: string;
}): string {
  const slug = article.slug || article.title.toLowerCase().replace(/\s+/g, "-");
  const url = `${window.location.origin}/article/${slug}`;
  return [
    `🔥 <b>${article.title}</b>`,
    "",
    article.excerpt ? article.excerpt : "",
    "",
    "👉 Read more:",
    url,
  ]
    .filter((l) => l !== null)
    .join("\n");
}
