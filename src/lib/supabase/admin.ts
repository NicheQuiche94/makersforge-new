import { createClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client using the SERVICE ROLE key. This bypasses RLS, so
 * it must NEVER be imported into a client component or shipped to the browser.
 * It exists so the tokenised lead-capture flow can write company/contact/role
 * rows on behalf of an affiliate who is not logged in — the affiliate proves
 * identity with their submit_token, and the server does the privileged write.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_PORTAL_SUPABASE_URL;
  const key = process.env.PORTAL_SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase admin client not configured (NEXT_PUBLIC_PORTAL_SUPABASE_URL / PORTAL_SUPABASE_SERVICE_ROLE_KEY)."
    );
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
