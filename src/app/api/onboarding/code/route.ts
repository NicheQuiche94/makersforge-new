import { NextResponse } from "next/server";
import { isWorkEmail, sendSignInCode } from "@/lib/onboarding/auth";

/** POST { email, first } → emails a 6-digit sign-in code (and a magic link). */
export async function POST(req: Request) {
  const { email, first } = await req.json().catch(() => ({}));
  const e = String(email || "").trim().toLowerCase();
  if (!isWorkEmail(e)) return NextResponse.json({ error: "Please use your work email." }, { status: 400 });
  try {
    await sendSignInCode(e, String(first || "").trim(), new URL(req.url).origin);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("onboarding code", err);
    return NextResponse.json({ error: "We couldn't send your code. Please try again in a minute." }, { status: 500 });
  }
}
