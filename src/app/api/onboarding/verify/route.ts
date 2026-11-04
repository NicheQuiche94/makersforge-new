import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

/** POST { email, code } → checks the code and signs them in (session cookie). */
export async function POST(req: Request) {
  const { email, code } = await req.json().catch(() => ({}));
  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.verifyOtp({ email: String(email || "").trim().toLowerCase(), token: String(code || "").trim(), type: "email" });
  if (error) {
    console.warn("onboarding verify:", error.message);
    return NextResponse.json({ error: "That code didn't work. Check it, or send a new one." }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
