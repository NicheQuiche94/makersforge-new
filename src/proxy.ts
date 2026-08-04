import { NextResponse, type NextRequest } from "next/server";

/**
 * Password gate for the internal team handbook (/handbook + the manual files
 * under it). HTTP Basic Auth over HTTPS — genuinely server-side, runs on the
 * edge before anything is served, so the docs are never reachable without the
 * password. Not linked publicly and noindex'd on top.
 *
 * Credentials come from env: HANDBOOK_PASSWORD (any username accepted). Set it
 * in Vercel (Production + Preview) and .env.local. A default is used until then
 * so the page works on first deploy — change it via the env var.
 */
export const config = { matcher: ["/handbook", "/handbook/:path*"] };

export function proxy(req: NextRequest) {
  const expected = process.env.HANDBOOK_PASSWORD || "welcome-to-the-desk";
  const header = req.headers.get("authorization") || "";

  if (header.startsWith("Basic ")) {
    try {
      const [, pass] = atob(header.slice(6)).split(":");
      if (pass === expected) return NextResponse.next();
    } catch {
      /* malformed header → fall through to challenge */
    }
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="MakersForge team handbook", charset="UTF-8"',
      "Cache-Control": "no-store",
    },
  });
}
