import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refreshes the Supabase auth session on portal requests so Server Components
 * see a valid session (and expired tokens get rotated). Returns the response
 * carrying any refreshed auth cookies. Public portal routes (the tokenised lead
 * link) simply have no session and pass straight through.
 */
export async function updateSession(req: NextRequest): Promise<NextResponse> {
  let res = NextResponse.next({ request: req });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
          res = NextResponse.next({ request: req });
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Touching getUser() triggers the token refresh + cookie rotation.
  await supabase.auth.getUser();
  return res;
}
