import { NextResponse, type NextRequest } from "next/server";
import { HANDBOOK_COOKIE, handbookPassword, handbookToken } from "@/lib/handbookAuth";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Edge proxy (Next 16 middleware) for two separate jobs:
 *
 *  1. /handbook: the internal team handbook. Unauthenticated requests are
 *     redirected to a branded /handbook/login page; a valid handbook_ok cookie
 *     lets them through. noindex on top.
 *
 *  2. Client self-onboarding (/start, /account, /admin, /api/onboarding):
 *     refreshes the Supabase sign-in session so pages and routes see who's
 *     signed in. Who may see what is checked in the pages and routes themselves.
 */
export const config = {
  matcher: ["/handbook", "/handbook/:path*", "/start", "/account", "/account/:path*", "/admin", "/admin/:path*", "/api/onboarding/:path*"],
};

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith("/handbook")) return updateSession(req);

  if (pathname === "/handbook/login") return NextResponse.next(); // the login page is open

  const expected = await handbookToken(handbookPassword());
  if (req.cookies.get(HANDBOOK_COOKIE)?.value === expected) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/handbook/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}
