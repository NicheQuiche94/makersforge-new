import { NextResponse } from "next/server";
import { availability } from "@/lib/onboarding/db";

/** GET → [{ start: "2026-11-09", open: 2 }, …] for the booking calendar. */
export async function GET() {
  try {
    return NextResponse.json(await availability(), { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("onboarding weeks", err);
    return NextResponse.json({ error: "unavailable" }, { status: 500 });
  }
}
