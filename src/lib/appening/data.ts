/** What's Appening: reads and writes (server only, service role). */
import { randomBytes } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Edition, StoreApp } from "./store";
import type { Settings } from "./schedule";

export type Builder = { name: string; role?: string | null; linkedin?: string | null };
export type Entry = {
  id: string;
  created_at: string;
  origin: "applied" | "found";
  edition: Edition;
  store: "ios" | "android";
  store_id: string;
  store_url: string;
  name: string;
  publisher: string | null;
  icon_url: string | null;
  genre: string | null;
  release_date: string | null;
  store_text: string | null;
  screenshots: string[];
  website: string | null;
  email: string | null;
  contact_name: string | null;
  pitch: string | null;
  hiring: boolean | null;
  // "sell it" (optional, from the form)
  tagline: string | null;
  highlights: string[];
  trailer_url: string | null;
  other_store_url: string | null;
  model: string | null;
  markets: string | null;
  team: string | null;
  proof: string | null;
  studio_about: string | null;
  studio_linkedin: string | null;
  builders: Builder[];
  signal: string | null;
  status: "new" | "booked" | "declined";
  issue_id: string | null;
  slot: "spotlight" | "list" | null;
  position: number | null;
  take_draft: string | null;
  take: string | null;
  booked_mail_at: string | null;
  live_mail_at: string | null;
};
export type Issue = {
  id: string;
  created_at: string;
  edition: Edition;
  number: number;
  intro: string | null;
  status: "draft" | "approved";
  approved_at: string | null;
  published_on: string | null;
  emailed_at: string | null;
};
export type IssueWithEntries = Issue & { spotlights: Entry[]; list: Entry[] };

export const db = () => createAdminClient();

/** Before it is configured (local dev without Supabase env) everything reads as empty. */
const configured = () => !!(process.env.NEXT_PUBLIC_PORTAL_SUPABASE_URL && process.env.PORTAL_SUPABASE_SERVICE_ROLE_KEY);

export async function getSettings(): Promise<Settings> {
  const fallback: Settings = { launch_on: null, cadence: "alternate", first_edition: "games" };
  if (!configured()) return fallback;
  const { data } = await db().from("appening_settings").select("launch_on, cadence, first_edition").eq("id", true).maybeSingle();
  return (data as Settings) ?? fallback;
}

export function attach(issues: Issue[], entries: Entry[]): IssueWithEntries[] {
  const by = (i: Issue, slot: "spotlight" | "list") =>
    entries.filter((e) => e.issue_id === i.id && e.slot === slot).sort((a, b) => (a.position ?? 99) - (b.position ?? 99));
  return issues.map((i) => ({ ...i, spotlights: by(i, "spotlight"), list: by(i, "list") }));
}

export async function allIssues(): Promise<IssueWithEntries[]> {
  if (!configured()) return [];
  const [{ data: issues }, { data: entries }] = await Promise.all([
    db().from("appening_issues").select("*").order("number"),
    db().from("appening_entries").select("*").not("issue_id", "is", null),
  ]);
  return attach((issues ?? []) as Issue[], (entries ?? []) as Entry[]);
}

/** Published issues only, newest first: what the public pages show. */
export async function publishedIssues(): Promise<IssueWithEntries[]> {
  return (await allIssues()).filter((i) => i.published_on).sort((a, b) => b.published_on!.localeCompare(a.published_on!));
}

export async function queue(): Promise<Entry[]> {
  if (!configured()) return [];
  const { data } = await db().from("appening_entries").select("*").eq("status", "new").order("created_at", { ascending: false }).limit(400);
  return (data ?? []) as Entry[];
}

/** Insert or refresh an entry from a store lookup. An application always wins over a radar find. */
export async function upsertEntry(app: StoreApp, extra: Partial<Entry> & { origin: "applied" | "found" }) {
  const { data: existing } = await db().from("appening_entries").select("id, origin, status").eq("store", app.store).eq("store_id", app.storeId).maybeSingle();
  const row = {
    edition: app.edition,
    store: app.store,
    store_id: app.storeId,
    store_url: app.storeUrl,
    name: app.name,
    publisher: app.publisher,
    icon_url: app.iconUrl,
    genre: app.genre,
    release_date: extra.release_date ?? app.releaseDate,
    store_text: app.storeText,
    screenshots: app.screenshots,
    website: app.website,
    ...extra,
  };
  if (existing) {
    // A radar find never overwrites what a studio told us.
    if (existing.origin === "applied" && extra.origin === "found") return { id: existing.id as string, isNew: false };
    await db().from("appening_entries").update(row).eq("id", existing.id);
    return { id: existing.id as string, isNew: false };
  }
  const { data, error } = await db().from("appening_entries").insert(row).select("id").single();
  if (error) throw error;
  return { id: data.id as string, isNew: true };
}

export async function subscribe(email: string, source: string, editions: Edition[] = ["games", "apps"]) {
  const { data: existing } = await db().from("appening_subscribers").select("email, token").eq("email", email).maybeSingle();
  if (existing) {
    await db().from("appening_subscribers").update({ unsubscribed_at: null, editions }).eq("email", email);
    return { token: existing.token as string, isNew: false };
  }
  const token = randomBytes(12).toString("hex");
  await db().from("appening_subscribers").insert({ email, token, source, editions });
  return { token, isNew: true };
}
