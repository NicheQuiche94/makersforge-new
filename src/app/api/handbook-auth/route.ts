import { NextResponse } from "next/server";
import { HANDBOOK_COOKIE, handbookPassword, handbookToken } from "@/lib/handbookAuth";

/**
 * /api/handbook-auth — checks the handbook password and sets the gate cookie.
 * Wrong password → 401. Right password → an httpOnly token cookie the edge proxy
 * validates. The password itself is never stored in the cookie.
 */
export async function POST(request: Request) {
  const { password } = await request.json().catch(() => ({}));
  if (!password || password !== handbookPassword()) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(HANDBOOK_COOKIE, await handbookToken(password), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return res;
}
