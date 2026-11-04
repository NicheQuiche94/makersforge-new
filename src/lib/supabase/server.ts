import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Supabase client for Server Components, Route Handlers and Server Actions.
 * Uses the anon key + the user's session cookie, so every query runs under RLS
 * with the logged-in identity (auth.uid()). This is the SAFE client for reading
 * affiliate/admin data — never the service-role client for user-facing reads.
 */
export async function createServerSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component (read-only cookies). The proxy
            // (middleware) refreshes the session cookie, so this is safe to ignore.
          }
        },
      },
    }
  );
}
