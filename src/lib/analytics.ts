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

/**
 * The team's own browsers (Andre 2026-11-06): open any page with
 * ?internal=on once per device and that browser is never tracked again
 * (PostHog, GA, Apollo, Vercel); ?internal=off undoes it.
 */
const INTERNAL = "mf-internal";
export function isInternal() {
  try {
    return localStorage.getItem(INTERNAL) === "1";
  } catch {
    return false;
  }
}
/** Reads ?internal=on|off, remembers it, and takes it off the address bar. */
export function applyInternalFlag() {
  const url = new URL(window.location.href);
  const v = url.searchParams.get("internal");
  if (v !== "on" && v !== "off") return;
  try {
    if (v === "on") localStorage.setItem(INTERNAL, "1");
    else localStorage.removeItem(INTERNAL);
  } catch {}
  if (v === "on" && started) posthog.opt_out_capturing();
  url.searchParams.delete("internal");
  window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
}

const consented = () => {
  // Local copies of the site (dev servers, tests) are never tracked.
  if (isInternal() || /^(localhost|127.|0.0.0.0)/.test(window.location.hostname)) return false;
  try {
    return localStorage.getItem(CONSENT) === "granted";
  } catch {
    return false;
  }
};

let started = false;
// Tagged mailshot link (components/consent/MailRef): who this visitor is, kept in memory only.
let mailRef: string | null = null;

/*
 * Campaign tags (Andre 2026-11-06): links carry utm_* so we know where a visit
 * came from, but "?utm_campaign=…" looks like junk to the person who lands.
 * Read them once, keep them in memory, and take them off the address bar;
 * PostHog gets them as session properties so attribution still works.
 */
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
let utm: Record<string, string> = {};
export function captureAndCleanUtm() {
  const url = new URL(window.location.href);
  const found = UTM_KEYS.filter((k) => url.searchParams.get(k));
  if (!found.length) return;
  utm = Object.fromEntries(found.map((k) => [k, url.searchParams.get(k)!]));
  found.forEach((k) => url.searchParams.delete(k));
  window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
  if (started) posthog.register_for_session(utm);
}
/** The campaign tags this visit arrived with (for our own counters). */
export const arrivalUtm = () => utm;

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
  if (Object.keys(utm).length) posthog.register_for_session(utm);
  if (mailRef) posthog.identify(`mail:${mailRef}`);
}

/** They came from a tagged mailshot link: with consent, PostHog files the visit under that ref. */
/* Which A/B variant this page is showing (e.g. the /compare headline), for our own counter. Read once. */
let pageVariant: string | null = null;
export const setPageVariant = (v: string) => (pageVariant = v);
export const takePageVariant = () => {
  const v = pageVariant;
  pageVariant = null;
  return v;
};

/** The tagged-link code this visit arrived with, if any (for our own counter). */
export const currentMailRef = () => mailRef;

export function setMailRef(ref: string) {
  mailRef = ref;
  if (started && consented()) posthog.identify(`mail:${ref}`);
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
