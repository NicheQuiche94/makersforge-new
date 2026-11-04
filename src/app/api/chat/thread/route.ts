import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/** GET ?visitorId= → this visitor's messages (and marks them as here, so replies aren't also emailed). */
export async function GET(req: Request) {
  const visitorId = new URL(req.url).searchParams.get("visitorId") || "";
  if (!/^[0-9a-f-]{36}$/i.test(visitorId)) return NextResponse.json({ messages: [] });
  const db = createAdminClient();
  const { data: thread } = await db.from("chat_threads").select("id, email").eq("visitor_id", visitorId).maybeSingle();
  if (!thread) return NextResponse.json({ messages: [] });
  const [{ data: messages }] = await Promise.all([
    db.from("chat_messages").select("id, sender, body, at").eq("thread_id", thread.id).order("at"),
    db.from("chat_threads").update({ last_seen_at: new Date().toISOString() }).eq("id", thread.id),
  ]);
  return NextResponse.json({ messages: messages ?? [], hasEmail: !!thread.email }, { headers: { "Cache-Control": "no-store" } });
}
