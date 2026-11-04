import { NextResponse } from "next/server";
import { sessionEmail } from "@/lib/onboarding/auth";

/** GET → { email } of whoever is signed in (null if nobody), so /start can skip the code. */
export async function GET() {
  return NextResponse.json({ email: await sessionEmail() }, { headers: { "Cache-Control": "no-store" } });
}
