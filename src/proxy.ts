import { NextResponse, type NextRequest } from "next/server";
import { HANDBOOK_COOKIE, handbookPassword, handbookToken } from "@/lib/handbookAuth";

/**
 * Gate for the internal team handbook (/handbook + the manual files under it).
 * Instead of a browser Basic-Auth popup, unauthenticated requests are redirected
 * to a branded /handbook/login page. A valid handbook_ok cookie (set by the
 * login API once the password checks out) lets them through. noindex on top.
 */
export const config = { matcher: ["/handbook", "/handbook/:path*"] };

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/handbook/login") return NextResponse.next(); // the login page is open

  const expected = await handbookToken(handbookPassword());
  if (req.cookies.get(HANDBOOK_COOKIE)?.value === expected) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/handbook/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}
