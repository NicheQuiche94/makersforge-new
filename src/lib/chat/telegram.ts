/**
 * Founder chat ↔ Andre's Telegram (2026-11-04). Visitor messages are sent
 * to Andre by the MakersForge Chat bot; he answers with Telegram's Reply, and
 * the webhook (/api/chat/telegram) matches the reply to the conversation.
 *
 * Env: TELEGRAM_BOT_TOKEN (from @BotFather), TELEGRAM_CHAT_ID (Andre's chat
 * with the bot), TELEGRAM_WEBHOOK_SECRET (checked on every webhook call).
 */
const api = (method: string) => `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/${method}`;

export async function telegram<T = unknown>(method: string, body: object): Promise<T | null> {
  if (!process.env.TELEGRAM_BOT_TOKEN) return null;
  const r = await fetch(api(method), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const d = await r.json().catch(() => ({}));
  if (!d.ok) {
    console.error("telegram", method, d.description);
    return null;
  }
  return d.result as T;
}

/** Message Andre; returns the Telegram message id (so his Reply can be matched back). */
export async function toAndre(text: string, replyTo?: number) {
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!chat) return null;
  const m = await telegram<{ message_id: number }>("sendMessage", {
    chat_id: chat,
    text,
    disable_web_page_preview: true,
    ...(replyTo ? { reply_parameters: { message_id: replyTo, allow_sending_without_reply: true } } : {}),
  });
  return m?.message_id ?? null;
}
