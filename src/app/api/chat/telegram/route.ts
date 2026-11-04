import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { toAndre } from "@/lib/chat/telegram";
import { layout } from "@/lib/clientEmails";
import { sendMail } from "@/lib/onboarding/mail";

/**
 * Telegram webhook: Andre's replies. Only accepted with the secret header
 * Telegram sends (set when the webhook is registered) and only from his own
 * chat. A Reply to one of the bot's messages becomes a message in that
 * visitor's chat window; if they're not on the site any more and left an
 * email, it's emailed to them too.
 */
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function POST(req: Request) {
  if (!process.env.TELEGRAM_WEBHOOK_SECRET || req.headers.get("x-telegram-bot-api-secret-token") !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return new NextResponse("forbidden", { status: 403 });
  }
  const update = await req.json().catch(() => ({}));
  const msg = update.message;
  if (!msg?.text || String(msg.chat?.id) !== String(process.env.TELEGRAM_CHAT_ID)) return NextResponse.json({ ok: true });

  const replyTo = msg.reply_to_message?.message_id;
  if (!replyTo) {
    // A loose message would otherwise vanish, so explain once; /start is just Telegram opening the chat.
    if (!String(msg.text).startsWith("/"))
      await toAndre("To answer someone, swipe left on (or long-press → Reply) their message, then type your answer.");
    return NextResponse.json({ ok: true });
  }

  const db = createAdminClient();
  // Their message, or an earlier reply of Andre's in the same conversation.
  const { data: hit } = await db.from("chat_messages").select("thread_id").eq("telegram_id", replyTo).limit(1).maybeSingle();
  if (!hit) {
    await toAndre("I couldn't match that reply to a conversation. Reply to the visitor's message itself.");
    return NextResponse.json({ ok: true });
  }
  const body = String(msg.text).slice(0, 4000);
  await db.from("chat_messages").insert({ thread_id: hit.thread_id, sender: "andre", body, telegram_id: msg.message_id });
  await db.from("chat_threads").update({ last_message_at: new Date().toISOString() }).eq("id", hit.thread_id);

  // Not on the site in the last 2 minutes and left an email → send it there too.
  const { data: t } = await db.from("chat_threads").select("email, name, last_seen_at").eq("id", hit.thread_id).single();
  if (t?.email && Date.now() - new Date(t.last_seen_at).getTime() > 120_000) {
    const first = (t.name || "").split(/\s+/)[0] || "there";
    await sendMail({
      to: t.email,
      subject: "Andre replied to your message",
      html: layout(
        `<p style="margin:0 0 14px">Hi ${esc(first)},</p><p style="margin:0 0 14px;white-space:pre-wrap">${esc(body)}</p><p style="margin:0 0 14px">Andre<br><span style="color:#5b5f69;font-size:14px">Founder, MakersForge</span></p><p style="margin:0;color:#5b5f69;font-size:14px">Just reply to this email to carry on.</p>`,
        "Andre replied to your message",
      ),
    });
    await db.from("chat_messages").update({ emailed_at: new Date().toISOString() }).eq("telegram_id", msg.message_id);
  }
  return NextResponse.json({ ok: true });
}
