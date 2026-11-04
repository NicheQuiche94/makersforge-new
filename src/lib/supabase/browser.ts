"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client for Client Components (login form, sign-out). Reads/writes the
 * session cookie in the browser. Anon key only — RLS still governs everything.
 */
export function createBrowserSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_PORTAL_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_PORTAL_SUPABASE_ANON_KEY!
  );
}
