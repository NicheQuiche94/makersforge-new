"use client";
/**
 * Known visitor (Andre 2026-11-08): once someone has given their email to one
 * of our free tools, the others don't ask again. They see "Sending to
 * you@studio.com · Not you?" instead of an empty email box, so every tool
 * after the first is one click. The emails we send carry the same token
 * (?l=…), so it works on a new device too.
 *
 * The token is "<email, base64url>.<id>", where id is a short signature of
 * the email made on our server (lib/leadToken): a stable visitor ID for our
 * counters and PostHog, without passing the email itself around.
 *
 * Kept in this browser's localStorage only; it's their own email, stored
 * because they gave it to us to receive something.
 */
import { useEffect, useState } from "react";

const KEY = "mf-lead";
export const LEAD_EVENT = "mf-lead";
export type Lead = { email: string; id: string; token: string };

const decode = (token: string): Lead | null => {
  const [b, id] = token.split(".");
  if (!b || !/^[A-Za-z0-9_-]{8,16}$/.test(id || "")) return null;
  try {
    const email = atob(b.replace(/-/g, "+").replace(/_/g, "/"));
    return /^\S+@\S+\.\S+$/.test(email) ? { email, id, token } : null;
  } catch {
    return null;
  }
};

export function getLead(): Lead | null {
  try {
    return decode(localStorage.getItem(KEY) || "");
  } catch {
    return null;
  }
}

export function setLead(token?: string | null) {
  if (!token || !decode(token)) return;
  try {
    localStorage.setItem(KEY, token);
  } catch {}
  window.dispatchEvent(new Event(LEAD_EVENT));
}

export function forgetLead() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
  window.dispatchEvent(new Event(LEAD_EVENT));
}

/** Reads ?l=… from an email link, remembers it, and takes it off the address bar. */
export function captureLeadParam() {
  const url = new URL(window.location.href);
  const t = url.searchParams.get("l");
  if (!t) return;
  setLead(t);
  url.searchParams.delete("l");
  window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
}

/** The known visitor, kept up to date across tools on the page. */
export function useLead() {
  const [lead, set] = useState<Lead | null>(null);
  useEffect(() => {
    const read = () => set(getLead());
    read();
    window.addEventListener(LEAD_EVENT, read);
    return () => window.removeEventListener(LEAD_EVENT, read);
  }, []);
  return { lead, forget: forgetLead };
}
