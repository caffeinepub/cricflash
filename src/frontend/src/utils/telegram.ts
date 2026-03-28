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
    // ignore
  }
  return { botToken: "", chatId: "", channelLink: "" };
}

export function saveTelegramSettings(settings: TelegramSettings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

function buildMessage(article: {
  title: string;
  excerpt?: string;
  category?: string;
  slug?: string;
}): string {
  const date = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const slug = article.slug || article.title.toLowerCase().replace(/\s+/g, "-");
  const url = `${window.location.origin}/article/${slug}`;

  const lines = [
    `🔥 *${article.title}*`,
    "",
    `📅 ${date}`,
    article.category ? `🏏 ${article.category}` : "",
    "",
    "👉 Read Full:",
    url,
  ].filter((l) => l !== null);

  return lines.join("\n");
}

export async function sendToTelegram(article: {
  title: string;
  excerpt?: string;
  category?: string;
  slug?: string;
}): Promise<void> {
  const settings = loadTelegramSettings();

  if (!settings.botToken || !settings.chatId) {
    throw new Error("Telegram bot token or chat ID not configured.");
  }

  const text = buildMessage(article);

  const res = await fetch(
    `https://api.telegram.org/bot${settings.botToken}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: settings.chatId,
        text,
        parse_mode: "Markdown",
      }),
    },
  );

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.description || `Telegram API error: ${res.status}`);
  }
}

export async function testTelegramConnection(): Promise<void> {
  const settings = loadTelegramSettings();

  if (!settings.botToken || !settings.chatId) {
    throw new Error("Bot Token and Chat ID are required.");
  }

  const res = await fetch(
    `https://api.telegram.org/bot${settings.botToken}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: settings.chatId,
        text: "✅ *Telegram connected successfully* — CricFlash admin is live!",
        parse_mode: "Markdown",
      }),
    },
  );

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.description || `Telegram API error: ${res.status}`);
  }
}
