import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { toAndre } from "@/lib/chat/telegram";

/**
 * POST { visitorId, text, name?, email?, page } → stores the message and
 * sends it to Andre's Telegram. The visitor id is a random UUID the widget
 * keeps in the browser; it's the only thing that ties them to their thread.
 */
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  const visitorId = String(b.visitorId || "");
  const text = String(b.text || "").trim().slice(0, 4000);
  const name = String(b.name || "").trim().slice(0, 120);
  const email = String(b.email || "").trim().toLowerCase().slice(0, 200);
  const page = String(b.page || "").slice(0, 300);
  if (!UUID.test(visitorId) || !text) return NextResponse.json({ error: "Please type a message." }, { status: 400 });
  if (email && !EMAIL.test(email)) return NextResponse.json({ error: "That email doesn't look right." }, { status: 400 });

  const db = createAdminClient();
  let { data: thread } = await db.from("chat_threads").select("id, name, email").eq("visitor_id", visitorId).maybeSingle();
  if (!thread) {
    const { data, error } = await db.from("chat_threads").insert({ visitor_id: visitorId, name: name || null, email: email || null, first_page: page }).select("id, name, email").single();
    if (error) throw error;
    thread = data;
  } else if ((name && name !== thread.name) || (email && email !== thread.email)) {
    await db.from("chat_threads").update({ ...(name && { name }), ...(email && { email }) }).eq("id", thread.id);
    thread = { ...thread, name: name || thread.name, email: email || thread.email };
  }

  // Simple flood guard: 20 messages a thread per hour.
  const since = new Date(Date.now() - 3600_000).toISOString();
  const { count } = await db.from("chat_messages").select("id", { count: "exact", head: true }).eq("thread_id", thread.id).eq("sender", "visitor").gte("at", since);
  if ((count ?? 0) >= 20) return NextResponse.json({ error: "That's a lot of messages! Andre will reply to what you've sent." }, { status: 429 });

  // Keep his replies threaded under the latest message from this person.
  const { data: last } = await db.from("chat_messages").select("telegram_id").eq("thread_id", thread.id).eq("sender", "visitor").not("telegram_id", "is", null).order("at", { ascending: false }).limit(1).maybeSingle();
  const who = [thread.name || "Someone", thread.email].filter(Boolean).join(" · ");
  const tgId = await toAndre(`💬 ${who}\n📍 ${page || "makersforge.gg"}\n\n${text}\n\n↩️ Reply to this message to answer`, last?.telegram_id ?? undefined);

  await db.from("chat_messages").insert({ thread_id: thread.id, sender: "visitor", body: text, page, telegram_id: tgId });
  await db.from("chat_threads").update({ last_message_at: new Date().toISOString(), last_seen_at: new Date().toISOString() }).eq("id", thread.id);
  return NextResponse.json({ ok: true, delivered: !!tgId });
}
