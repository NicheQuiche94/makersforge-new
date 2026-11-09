"use server";

/**
 * Andre's admin actions. Every one checks the signed-in email is an admin
 * (PORTAL_ADMIN_EMAILS) before touching anything, then sends the matching
 * approved email from lib/clientEmails.ts.
 */
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminEmail, sessionEmail } from "@/lib/onboarding/auth";
import { bookingById, emailData } from "@/lib/onboarding/records";
import { hireInvoice } from "@/lib/onboarding/pricing";
import { clientEmails } from "@/lib/clientEmails";
import { ANDRE, sendMail } from "@/lib/onboarding/mail";
import { money } from "@/lib/plans";

async function requireAdmin() {
  const email = await sessionEmail();
  if (!isAdminEmail(email)) throw new Error("Not allowed");
}
const db = () => createAdminClient();
const event = (booking_id: string, kind: string, detail: Record<string, unknown> = {}) => db().from("booking_events").insert({ booking_id, kind, detail });
const mailFor = async (bookingId: string, extra: Record<string, unknown> = {}) => {
  const b = await bookingById(bookingId);
  if (!b) throw new Error("Booking not found");
  return { b, mail: Object.fromEntries(clientEmails({ ...emailData(b), ...extra }).map((e) => [e.id, e])) };
};

export async function confirmBrief(bookingId: string) {
  await requireAdmin();
  await db().from("bookings").update({ brief_confirmed_at: new Date().toISOString(), status: "confirmed" }).eq("id", bookingId);
  await event(bookingId, "brief_confirmed");
  const { b, mail } = await mailFor(bookingId);
  await sendMail({ to: b.user.email, subject: mail.confirmed.subject, html: mail.confirmed.html });
  revalidatePath("/admin");
  return "Brief confirmed · client emailed";
}

export async function markRetainerPaid(bookingId: string) {
  await requireAdmin();
  await db().from("bookings").update({ retainer_paid_at: new Date().toISOString() }).eq("id", bookingId);
  await event(bookingId, "retainer_paid");
  revalidatePath("/admin");
  return "Retainer marked paid";
}

/** Shortlist for one role is in their tracker. The first time, this also saves the tracker link and sends the "how your tracker works" email. */
export async function sendShortlist(bookingId: string, roleId: string, trackerUrl?: string) {
  await requireAdmin();
  const before = await bookingById(bookingId);
  if (!before) throw new Error("Booking not found");
  const tracker = (trackerUrl || "").trim();
  const firstTime = !before.account.tracker_url;
  if (firstTime) {
    if (!/^https:\/\/(www\.)?airtable\.com\//.test(tracker)) throw new Error("Paste their Airtable link first");
    await db().from("client_accounts").update({ tracker_url: tracker }).eq("id", before.account.id);
  }
  await db().from("booking_roles").update({ shortlist_sent_at: new Date().toISOString() }).eq("id", roleId);
  await db().from("bookings").update({ status: "shortlist_sent" }).eq("id", bookingId);
  const role = before.roles.find((r) => r.id === roleId);
  await event(bookingId, "shortlist_sent", { role: role?.title });
  const { b, mail } = await mailFor(bookingId, { shortlistRole: role?.title || "your role", tracker: tracker || before.account.tracker_url });
  const e = firstTime ? mail.tracker : mail.shortlist;
  await sendMail({ to: b.user.email, subject: e.subject, html: e.html });
  revalidatePath("/admin");
  return firstTime ? "Shortlist sent with their tracker invite" : "Shortlist sent · client emailed";
}

/** A hire: works out the fee for this hire (in order), takes off any retainer credit, and emails Andre the invoice details. */
export async function markHired(bookingId: string, roleId: string) {
  await requireAdmin();
  const b = await bookingById(bookingId);
  if (!b) throw new Error("Booking not found");
  const role = b.roles.find((r) => r.id === roleId);
  if (!role || role.hired_at) return "Already marked hired";
  const hiresBefore = b.roles.filter((r) => r.hired_at).length;

  if (b.plan === "contract") {
    const monthly = b.fees[b.roles.indexOf(role)] ?? b.fees[0] ?? 1000;
    await db().from("booking_roles").update({ hired_at: new Date().toISOString(), fee: monthly, invoice_amount: monthly }).eq("id", roleId);
    await event(bookingId, "hired", { role: role.title, monthly });
    const { mail } = await mailFor(bookingId, { hire: { role: role.title || "Contractor", nth: hiresBefore + 1, fee: `${money(monthly, b.currency)} a month`, note: "while engaged, invoiced monthly", amount: `${money(monthly, b.currency)} (first month)` } });
    await sendMail({ to: ANDRE, subject: mail["invoice-hire"].subject, html: mail["invoice-hire"].html });
  } else {
    const inv = hireInvoice(b, hiresBefore);
    await db().from("booking_roles").update({ hired_at: new Date().toISOString(), fee: inv.fee, invoice_amount: inv.invoice }).eq("id", roleId);
    await event(bookingId, "hired", { role: role.title, ...inv });
    const { mail } = await mailFor(bookingId, {
      hire: {
        role: role.title || `Role ${role.position}`,
        nth: hiresBefore + 1,
        fee: money(inv.fee, b.currency),
        note: b.retained ? "15% retained discount" : undefined,
        credit: inv.credit ? `−${money(inv.credit, b.currency)}` : undefined,
        amount: inv.invoice ? money(inv.invoice, b.currency) : `${money(0, b.currency)} (covered by the retainer)`,
      },
    });
    await sendMail({ to: ANDRE, subject: mail["invoice-hire"].subject, html: mail["invoice-hire"].html });
  }
  if (b.roles.every((r) => r.hired_at || r.id === roleId)) await db().from("bookings").update({ status: "complete" }).eq("id", bookingId);
  revalidatePath("/admin");
  return "Hire marked · invoice details emailed to you";
}

export async function setWeekBlocked(weekStart: string, blocked: boolean) {
  await requireAdmin();
  await db().from("search_weeks").update({ blocked }).eq("week_start", weekStart);
  revalidatePath("/admin");
  return blocked ? "Week blocked" : "Week reopened";
}

/** A short-lived download link for a private file (signed terms, a spec). */
export async function fileLink(path: string) {
  await requireAdmin();
  const { data } = await db().storage.from("onboarding").createSignedUrl(path, 300);
  return data?.signedUrl ?? null;
}
