"use client";

/**
 * The emailed "Sign in" link lands on /account with the session in the URL
 * hash (#access_token=…). The browser Supabase client picks it up and stores
 * the cookie; then we reload so the server sees who's signed in.
 */
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase/browser";

export function SessionFromLink() {
  const router = useRouter();
  useEffect(() => {
    if (!window.location.hash.includes("access_token")) return;
    const p = new URLSearchParams(window.location.hash.slice(1));
    const access_token = p.get("access_token");
    const refresh_token = p.get("refresh_token");
    if (!access_token || !refresh_token) return;
    createBrowserSupabase()
      .auth.setSession({ access_token, refresh_token })
      .then(() => {
        history.replaceState(null, "", window.location.pathname);
        router.refresh();
      });
  }, [router]);
  return null;
}
