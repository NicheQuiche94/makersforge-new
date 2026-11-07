import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sessionEmail } from "@/lib/onboarding/auth";
import { availability, schedule } from "@/lib/onboarding/db";
import { priceDeal } from "@/lib/onboarding/pricing";
import { checkCode, claimCode } from "@/lib/compareGifts";
import { toAndre } from "@/lib/chat/telegram";
import { termsDoc, termsHtml } from "@/lib/onboarding/terms";
import { htmlToPdf } from "@/lib/onboarding/pdf";
import { ANDRE, sendMail } from "@/lib/onboarding/mail";
import { clientEmails, type EmailData } from "@/lib/clientEmails";
import { fiveDays, gbp, shortDate, shortlistDate, type PlanId } from "@/lib/plans";

/**
 * POST multipart/form-data: `data` (JSON, below) + `spec-<n>` files.
 * Signs the booking (or, with changeRequest, holds it and asks Andre).
 *
 * data = { start, plan, retained, roles, briefs: [{ title, location, budget, musts, spec }],
 *          you: { name, company }, bill: { legal, number, address, vat, accounts, po },
 *          sign: { name, title }, changeRequest? }
 */
export const runtime = "nodejs";
export const maxDuration = 60;

const PLANS: PlanId[] = ["permanent", "contract", "batch"];
const UK = /\b[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}\b|united kingdom|\bUK\b|england|scotland|wales/i;
const clip = (s: unknown, n = 2000) => String(s ?? "").trim().slice(0, n);
const bad = (msg: string, status = 400) => NextResponse.json({ error: msg }, { status });

export async function POST(req: Request) {
  const email = await sessionEmail();
  if (!email) return bad("Please confirm your email first.", 401);

  const form = await req.formData();
  let d;
  try {
    d = JSON.parse(String(form.get("data")));
  } catch {
    return bad("Something went wrong with your booking. Please try again.");
  }

  // ---- validate what they sent
  const plan = d.plan as PlanId;
  if (!PLANS.includes(plan)) return bad("Please choose a plan.");
  const briefs = (Array.isArray(d.briefs) ? d.briefs : []).slice(0, 5).map((b: Record<string, unknown>) => ({
    title: clip(b.title, 200),
    location: clip(b.location, 200),
    budget: clip(b.budget, 200),
    musts: clip(b.musts, 1000),
    spec: clip(b.spec, 20000),
  }));
  if (!briefs.length) return bad("Please tell us about at least one role.");
  const you = { name: clip(d.you?.name, 200), company: clip(d.you?.company, 200) };
  const bill = { legal: clip(d.bill?.legal, 200), number: clip(d.bill?.number, 40), address: clip(d.bill?.address, 500), vat: clip(d.bill?.vat, 40), accounts: clip(d.bill?.accounts, 200).toLowerCase(), po: clip(d.bill?.po, 80) };
  const changeRequest = clip(d.changeRequest, 4000);
  const sign = { name: clip(d.sign?.name, 200), title: clip(d.sign?.title, 200) };
  if (!you.name || !you.company) return bad("Please add your name and company.");
  if (!changeRequest && (!bill.legal || !bill.number || !bill.address || !bill.accounts)) return bad("Please add your company details.");
  if (!changeRequest && (!sign.name || !sign.title)) return bad("Please type your name and job title to sign.");

  // ---- price and schedule on the server (never trust the browser's numbers)
  const roles = plan === "batch" ? Math.max(Number(d.roles) || 2, briefs.length) : briefs.length;
  // A Christmas gift code (from /compare): checked here, never trusted from the browser.
  const gift = d.code ? await checkCode(createAdminClient(), String(d.code)) : null;
  if (gift && !gift.ok) return bad(`${gift.error} Remove the code from the link to book without it.`, 409);
  const discount = gift?.ok ? { pct: gift.pct, code: gift.code } : undefined;
  const priority = gift?.ok && gift.special;
  const deal = priceDeal(plan, !!d.retained, roles, discount?.pct);
  const weeks = await availability();
  const slots = schedule(weeks, String(d.start), Math.max(briefs.length, 1));
  if (!slots) return bad("Sorry, those search weeks have just filled up. Please pick another week.", 409);

  const db = createAdminClient();

  // ---- the client account and person (reuse if they've booked before)
  const { data: existing } = await db.from("client_users").select("id, account_id").eq("email", email).maybeSingle();
  let accountId = existing?.account_id as string | undefined;
  let userId = existing?.id as string | undefined;
  const accountFields = {
    company: you.company,
    ...(bill.legal && { legal_name: bill.legal }),
    ...(bill.number && { company_number: bill.number }),
    ...(bill.address && { address: bill.address }),
    ...(bill.vat && { vat_number: bill.vat }),
    ...(bill.po && { po_number: bill.po }),
    ...(bill.accounts && { accounts_email: bill.accounts }),
  };
  if (!accountId) {
    const { data: acc, error } = await db.from("client_accounts").insert(accountFields).select("id").single();
    if (error) throw error;
    accountId = acc.id;
    const { data: usr, error: uErr } = await db.from("client_users").insert({ account_id: accountId, email, name: you.name, title: sign.title || null }).select("id").single();
    if (uErr) throw uErr;
    userId = usr.id;
  } else {
    await db.from("client_accounts").update(accountFields).eq("id", accountId);
    await db.from("client_users").update({ name: you.name, ...(sign.title && { title: sign.title }) }).eq("id", userId!);
  }

  // ---- spec files → private storage
  const folder = crypto.randomUUID();
  const specPaths: (string | null)[] = [];
  for (let i = 0; i < briefs.length; i++) {
    const f = form.get(`spec-${i}`);
    if (f instanceof File && f.size > 0 && f.size < 15_000_000) {
      const p = `specs/${folder}/${i + 1}-${f.name.replace(/[^\w.\-]+/g, "_")}`;
      const { error } = await db.storage.from("onboarding").upload(p, f, { contentType: f.type || "application/octet-stream" });
      specPaths.push(error ? null : p);
    } else specPaths.push(null);
  }

  // ---- book every role in one go (the database refuses if a week just filled)
  const today = new Date();
  const dateLong = today.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const termsIn = { variant: plan, retained: deal.retained, roles: deal.roles, date: dateLong, client: bill.legal || you.company, clientNumber: bill.number, clientAddress: bill.address, discount };
  const { hash } = termsDoc(termsIn);
  const { data: bookingId, error: bErr } = await db.rpc("create_booking", {
    p_account: accountId,
    p_user: userId,
    p_plan: plan,
    p_retained: deal.retained,
    p_fees: deal.fees,
    p_retainer: deal.retainer,
    p_terms_version: hash,
    p_change_request: changeRequest || null,
    p_roles: briefs.map((b: (typeof briefs)[number], i: number) => ({
      title: b.title || null,
      location: b.location || null,
      budget: b.budget || null,
      musts: b.musts || null,
      spec_text: b.spec || null,
      spec_file_path: specPaths[i],
      search_week: slots[i],
    })),
  });
  if (bErr) {
    if (/week_full/.test(bErr.message)) return bad("Sorry, those search weeks have just filled up. Please pick another week.", 409);
    throw bErr;
  }
  const { data: booking } = await db.from("bookings").select("id, ref").eq("id", bookingId).single();
  const ref = booking!.ref as string;
  if (discount) {
    await claimCode(db, discount.code, bookingId as string);
    await db.from("booking_events").insert({ booking_id: bookingId, kind: "christmas_code", detail: { code: discount.code, pct: discount.pct, firstFee: deal.fees[0], priority } });
    await toAndre(`🎁 ${you.company} booked with gift code ${discount.code} (${discount.pct}% off the first fee, now ${deal.fees[0].toLocaleString("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 })}). Ref ${ref}.${priority ? " Priority search promised." : ""}`).catch(() => {});
  }

  // ---- emails need these details either way
  const roleNames = briefs.map((b: (typeof briefs)[number], i: number) => b.title || `Role ${i + 1}`);
  const planLabel =
    (plan === "batch" ? `Batch of ${deal.roles} roles` : plan === "contract" ? `Contractor${briefs.length > 1 ? ` × ${briefs.length}` : ""}` : `Permanent hire${briefs.length > 1 ? ` × ${briefs.length}` : ""}`) +
    (deal.retained ? " · retained" : "");
  const signedAt = today.toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Europe/London" });
  const ed: EmailData = {
    company: you.company,
    legal: bill.legal || you.company,
    number: bill.number,
    address: bill.address,
    vat: bill.vat || undefined,
    po: bill.po || undefined,
    contact: you.name,
    first: you.name.split(/\s+/)[0],
    email,
    accounts: bill.accounts,
    plan: planLabel,
    roles: roleNames,
    week: fiveDays(slots[0]),
    weekStart: shortDate(slots[0]),
    shortlist: shortlistDate(slots[0]),
    retainer: deal.retained ? gbp(deal.retainer) : undefined,
    signedBy: `${sign.name}, ${sign.title}`,
    signedAt,
    ukClient: UK.test(bill.address) || /^GB/i.test(bill.vat),
    schedule: roleNames.map((r: string, i: number) => [r, fiveDays(slots[i]), shortlistDate(slots[i])] as [string, string, string]),
  };
  const mail = Object.fromEntries(clientEmails(ed).map((e) => [e.id, e]));

  // ---- change requested: hold the booking, tell Andre, nothing signed yet
  if (changeRequest) {
    await db.from("booking_events").insert({ booking_id: bookingId, kind: "change_requested", detail: { text: changeRequest } });
    await sendMail({ to: ANDRE, subject: `Terms change request: ${you.company} (${ref})`, html: `${mail.alert.html.replace("</h1>", ` · change requested</h1><p style="margin:0 0 14px"><b>They asked:</b> ${changeRequest.replace(/</g, "&lt;")}</p>`)}` });
    return NextResponse.json({ ok: true, ref, requested: true });
  }

  // ---- the signature record + signed PDF
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
  await db.from("booking_signatures").insert({ booking_id: bookingId, name: sign.name, title: sign.title, email, ip, user_agent: req.headers.get("user-agent")?.slice(0, 300), terms_hash: hash });
  let pdf: Buffer | null = null;
  try {
    const { html } = termsHtml(termsIn, { name: sign.name, title: sign.title, email, signedAt, ip, ref });
    pdf = await htmlToPdf(html);
    const path = `terms/${bookingId}.pdf`;
    const { error } = await db.storage.from("onboarding").upload(path, pdf, { contentType: "application/pdf", upsert: true });
    if (!error) await db.from("bookings").update({ terms_pdf_path: path }).eq("id", bookingId);
  } catch (err) {
    // The booking stands; Andre gets told and can resend the PDF from the admin.
    console.error("terms pdf", err);
    await db.from("booking_events").insert({ booking_id: bookingId, kind: "pdf_failed", detail: { message: String(err).slice(0, 300) } });
  }
  await db.from("booking_events").insert({ booking_id: bookingId, kind: "signed", detail: { name: sign.name, title: sign.title, ip, hash } });

  // ---- emails: client confirmation + signed terms; Andre's alert (+ invoice details if retained)
  const file = `MakersForge-Terms-${you.company.replace(/[^\w]+/g, "")}-${ref}.pdf`;
  await Promise.all([
    sendMail({ to: email, subject: mail.booked.subject, html: mail.booked.html }),
    sendMail({ to: email, subject: mail.terms.subject, html: mail.terms.html, attachments: pdf ? [{ filename: file, content: pdf }] : undefined }),
    sendMail({ to: ANDRE, subject: `${mail.alert.subject} (${ref})`, html: mail.alert.html, attachments: pdf ? [{ filename: file, content: pdf }] : undefined }),
    deal.retained ? sendMail({ to: ANDRE, subject: mail["invoice-retainer"].subject, html: mail["invoice-retainer"].html }) : null,
  ]);

  return NextResponse.json({ ok: true, ref, retainer: deal.retainer, weeks: slots });
}
