"use server";

/**
 * What's Appening admin actions. Each checks Andre is an admin first.
 * Nothing here publishes: issues go out from the daily job (/api/appening/cron)
 * on their slot day, and only once approved.
 */
import { revalidatePath } from "next/cache";
import { isAdminEmail, sessionEmail } from "@/lib/onboarding/auth";
import { allIssues, db, getSettings, queue, upsertEntry, type Entry } from "@/lib/appening/data";
import { draftTake } from "@/lib/appening/draft";
import { bookedEmail } from "@/lib/appening/emails";
import { plan, type Settings } from "@/lib/appening/schedule";
import { suggest } from "@/lib/appening/pick";
import { lookupStore, type Edition } from "@/lib/appening/store";
import { sendMail } from "@/lib/onboarding/mail";

async function requireAdmin() {
  if (!isAdminEmail(await sessionEmail())) throw new Error("Not allowed");
}
const done = (msg: string) => {
  revalidatePath("/admin/appening");
  return msg;
};

async function draftFor(id: string) {
  const { data: e } = await db().from("appening_entries").select("*").eq("id", id).single();
  if (!e) return;
  const d = await draftTake(e as Entry);
  if (d) await db().from("appening_entries").update({ take_draft: d.checks ? `${d.take}\n\n[Check: ${d.checks}]` : d.take }).eq("id", id);
}

export async function saveSettings(s: Partial<Settings>) {
  await requireAdmin();
  const row: Partial<Settings> = {};
  if (s.launch_on !== undefined) row.launch_on = s.launch_on && /^\d{4}-\d{2}-\d{2}$/.test(s.launch_on) ? s.launch_on : null;
  if (s.cadence === "alternate" || s.cadence === "weekly") row.cadence = s.cadence;
  if (s.first_edition === "games" || s.first_edition === "apps") row.first_edition = s.first_edition;
  await db().from("appening_settings").update(row).eq("id", true);
  return done(row.launch_on === null ? "Launch date cleared: nothing will go out" : "Saved");
}

/** New draft issue, filled with suggestions (and their takes drafted) for Andre to review. */
export async function newIssue(edition: Edition) {
  await requireAdmin();
  const issues = await allIssues();
  const number = Math.max(0, ...issues.filter((i) => i.edition === edition).map((i) => i.number)) + 1;
  const { data: issue, error } = await db().from("appening_issues").insert({ edition, number }).select("*").single();
  if (error) throw error;
  const date = plan([...issues, { ...issue, spotlights: [], list: [] }], await getSettings()).get(issue.id)!;
  const pick = suggest((await queue()).filter((e) => e.edition === edition), date);
  const book = (e: Entry, slot: "spotlight" | "list", position: number) =>
    db().from("appening_entries").update({ status: "booked", issue_id: issue.id, slot, position }).eq("id", e.id);
  await Promise.all([...pick.spotlights.map((e, n) => book(e, "spotlight", n)), ...pick.list.map((e, n) => book(e, "list", n))]);
  await Promise.all(pick.spotlights.map((e) => draftFor(e.id)));
  return done(`${edition === "games" ? "Games" : "Apps"} #${number} started with ${pick.spotlights.length} spotlights and ${pick.list.length} in the list`);
}

export async function book(entryId: string, issueId: string, slot: "spotlight" | "list") {
  await requireAdmin();
  const { count } = await db().from("appening_entries").select("id", { count: "exact", head: true }).eq("issue_id", issueId).eq("slot", slot);
  if (slot === "spotlight" && (count ?? 0) >= 3) throw new Error("Already 3 spotlights: move one to the list first");
  await db().from("appening_entries").update({ status: "booked", issue_id: issueId, slot, position: count ?? 0 }).eq("id", entryId);
  if (slot === "spotlight") {
    const { data } = await db().from("appening_entries").select("take, take_draft").eq("id", entryId).single();
    if (!data?.take && !data?.take_draft) await draftFor(entryId);
  }
  return done(slot === "spotlight" ? "Spotlighted" : "Added to the list");
}

export async function unbook(entryId: string) {
  await requireAdmin();
  await db().from("appening_entries").update({ status: "new", issue_id: null, slot: null, position: null }).eq("id", entryId);
  return done("Back in the queue");
}

export async function decline(entryId: string) {
  await requireAdmin();
  await db().from("appening_entries").update({ status: "declined", issue_id: null, slot: null }).eq("id", entryId);
  return done("Declined");
}

export async function saveTake(entryId: string, take: string) {
  await requireAdmin();
  await db().from("appening_entries").update({ take: take.trim() || null }).eq("id", entryId);
  return done("Take saved");
}

export async function redraft(entryId: string) {
  await requireAdmin();
  await draftFor(entryId);
  return done("New draft ready");
}

export async function saveIntro(issueId: string, intro: string) {
  await requireAdmin();
  await db().from("appening_issues").update({ intro: intro.trim() || null }).eq("id", issueId);
  return done("Intro saved");
}

/** Approve: needs 3 spotlights, each with a take Andre has saved. Emails the featured studios their date. */
export async function approve(issueId: string) {
  await requireAdmin();
  const issues = await allIssues();
  const i = issues.find((x) => x.id === issueId);
  if (!i) throw new Error("Issue not found");
  if (i.spotlights.length !== 3) throw new Error("Needs 3 spotlights");
  if (i.spotlights.some((e) => !e.take)) throw new Error("Save a take for every spotlight first");
  await db().from("appening_issues").update({ status: "approved", approved_at: new Date().toISOString() }).eq("id", issueId);
  const date = plan(issues.map((x) => (x.id === issueId ? { ...x, status: "approved" as const } : x)), await getSettings()).get(issueId)!;
  let mailed = 0;
  for (const e of [...i.spotlights, ...i.list]) {
    if (!e.email || e.booked_mail_at) continue;
    const m = bookedEmail(e, i, date);
    if ((await sendMail({ to: e.email, subject: m.subject, html: m.html })).ok) {
      await db().from("appening_entries").update({ booked_mail_at: new Date().toISOString() }).eq("id", e.id);
      mailed++;
    }
  }
  return done(`Approved${mailed ? ` · ${mailed} studio${mailed === 1 ? "" : "s"} told their date` : ""}`);
}

export async function unapprove(issueId: string) {
  await requireAdmin();
  await db().from("appening_issues").update({ status: "draft", approved_at: null }).eq("id", issueId).is("published_on", null);
  return done("Back to draft");
}

/** Andre adds a launch he spotted himself. */
export async function addByLink(url: string) {
  await requireAdmin();
  const app = await lookupStore(url);
  if (!app) throw new Error("Couldn't find that on the App Store or Google Play");
  const { isNew } = await upsertEntry(app, { origin: "found", signal: "Added by Andre" });
  return done(isNew ? `${app.name} added to the ${app.edition} queue` : `${app.name} was already in`);
}
