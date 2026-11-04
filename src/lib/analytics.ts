/**
 * PostHog product analytics (Andre 2026-11-04), consent-gated like GA and
 * Apollo (see components/consent/Consent.tsx).
 *
 *  - Dormant until NEXT_PUBLIC_POSTHOG_KEY holds a real project key (phc_…),
 *    so this is safe to ship before the project exists.
 *  - Opted out by default: no events and no cookie until the visitor accepts.
 *  - Never runs on the client portal, admin or preview pages: client and
 *    candidate data stays out of a third party.
 *  - Session replays mask every input, and any element marked .ph-mask
 *    (the founder chat's messages).
 */
import posthog from "posthog-js";

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";
const CONSENT = "mf-consent"; // shared with the cookie banner: "granted" | "denied"

const EXCLUDED = /^\/(account|admin|login|emails-preview|terms-preview)(\/|$)/;

export const analyticsConfigured = () => typeof KEY === "string" && KEY.startsWith("phc_");
export const isExcludedPath = (path: string | null | undefined) => !!path && EXCLUDED.test(path);

const consented = () => {
  try {
    return localStorage.getItem(CONSENT) === "granted";
  } catch {
    return false;
  }
};

let started = false;

/**
 * Starts PostHog once, only after consent (not even its config script loads
 * before Accept, as the banner promises), never on an excluded page.
 */
export function initAnalytics() {
  if (started || !analyticsConfigured() || !consented() || isExcludedPath(window.location.pathname)) return;
  started = true;
  posthog.init(KEY!, {
    api_host: HOST,
    person_profiles: "identified_only",
    capture_pageview: false, // captured on route change, so UTM params ride along
    capture_pageleave: true,
    autocapture: true,
    persistence: "localStorage+cookie",
    opt_out_capturing_by_default: true,
    opt_out_persistence_by_default: true,
    session_recording: { maskAllInputs: true, maskTextSelector: ".ph-mask" },
  });
  // Opt in straight away (not in `loaded`) so the first pageview isn't dropped.
  if (consented()) posthog.opt_in_capturing();
}

/** The visitor clicked Accept: start recording from this page. */
export function grantAnalytics() {
  if (!analyticsConfigured()) return;
  initAnalytics();
  // initAnalytics opts in as consent is already stored; record the page they accepted on.
  if (started) posthog.capture("$pageview", { $current_url: window.location.href });
}

export function denyAnalytics() {
  if (started) posthog.opt_out_capturing();
}

/** Route change: a pageview on public pages; recording stops on excluded ones. */
export function pageview(path: string) {
  initAnalytics(); // e.g. arrived on the portal, then moved on to a public page
  if (!started) return;
  if (isExcludedPath(path)) {
    posthog.stopSessionRecording();
    return;
  }
  if (consented()) posthog.capture("$pageview", { $current_url: window.location.href });
}

/** A named event (booking steps, chat sent). No-op without consent; never send personal details. */
export function track(event: string, props?: Record<string, string | number | boolean>) {
  if (!started || !consented()) return;
  posthog.capture(event, props);
}
