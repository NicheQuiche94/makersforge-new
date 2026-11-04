/**
 * Loading bookings for the admin and the client portal, and turning one into
 * the details the email templates need. Service role: callers check who's
 * signed in first.
 */
import { createAdminClient } from "@/lib/supabase/admin";
import type { EmailData } from "@/lib/clientEmails";
import { fiveDays, gbp, shortDate, shortlistDate } from "@/lib/plans";

export type RoleRow = {
  id: string;
  position: number;
  title: string | null;
  location: string | null;
  budget: string | null;
  musts: string | null;
  spec_text: string | null;
  spec_file_path: string | null;
  search_week: string;
  shortlist_sent_at: string | null;
  hired_at: string | null;
  fee: number | null;
  invoice_amount: number | null;
};
export type BookingRow = {
  id: string;
  ref: string;
  plan: "permanent" | "contract" | "batch";
  retained: boolean;
  fees: number[];
  retainer: number;
  retainer_paid_at: string | null;
  brief_confirmed_at: string | null;
  status: string;
  terms_pdf_path: string | null;
  change_request: string | null;
  created_at: string;
  account: {
    id: string;
    company: string;
    legal_name: string | null;
    company_number: string | null;
    address: string | null;
    vat_number: string | null;
    po_number: string | null;
    accounts_email: string | null;
    tracker_url: string | null;
  };
  user: { email: string; name: string | null; title: string | null };
  roles: RoleRow[];
  signature: { name: string; title: string; email: string; ip: string | null; signed_at: string; terms_hash: string } | null;
};

const SELECT = `id, ref, plan, retained, fees, retainer, retainer_paid_at, brief_confirmed_at, status, terms_pdf_path, change_request, created_at,
  account:client_accounts(id, company, legal_name, company_number, address, vat_number, po_number, accounts_email, tracker_url),
  user:client_users(email, name, title),
  roles:booking_roles(id, position, title, location, budget, musts, spec_text, spec_file_path, search_week, shortlist_sent_at, hired_at, fee, invoice_amount),
  signature:booking_signatures(name, title, email, ip, signed_at, terms_hash)`;

function tidy(b: Record<string, unknown>): BookingRow {
  const row = b as unknown as BookingRow & { signature: BookingRow["signature"] | BookingRow["signature"][] };
  return {
    ...row,
    roles: [...(row.roles ?? [])].sort((a, z) => a.position - z.position),
    signature: Array.isArray(row.signature) ? (row.signature[0] ?? null) : row.signature,
  };
}

export async function allBookings(): Promise<BookingRow[]> {
  const { data, error } = await createAdminClient().from("bookings").select(SELECT).neq("status", "cancelled").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(tidy);
}

export async function bookingsForEmail(email: string): Promise<BookingRow[]> {
  const db = createAdminClient();
  const { data: u } = await db.from("client_users").select("account_id").eq("email", email.toLowerCase()).maybeSingle();
  if (!u) return [];
  const { data, error } = await db.from("bookings").select(SELECT).eq("account_id", u.account_id).neq("status", "cancelled").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(tidy);
}

export async function bookingById(id: string): Promise<BookingRow | null> {
  const { data } = await createAdminClient().from("bookings").select(SELECT).eq("id", id).maybeSingle();
  return data ? tidy(data) : null;
}

const UK = /\b[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}\b|united kingdom|\bUK\b|england|scotland|wales/i;

export function planLabel(b: Pick<BookingRow, "plan" | "retained" | "roles" | "fees">) {
  const n = b.plan === "batch" ? b.fees.length : b.roles.length;
  return (
    (b.plan === "batch" ? `Batch of ${n} roles` : b.plan === "contract" ? `Contractor${n > 1 ? ` × ${n}` : ""}` : `Permanent hire${n > 1 ? ` × ${n}` : ""}`) +
    (b.retained ? " · retained" : "")
  );
}

/** The template details for any email about this booking. */
export function emailData(b: BookingRow): EmailData {
  const names = b.roles.map((r, i) => r.title || `Role ${i + 1}`);
  const first = b.roles[0]?.search_week;
  return {
    company: b.account.company,
    legal: b.account.legal_name || b.account.company,
    number: b.account.company_number || "",
    address: b.account.address || "",
    vat: b.account.vat_number || undefined,
    po: b.account.po_number || undefined,
    contact: b.user.name || b.user.email,
    first: (b.user.name || "there").split(/\s+/)[0],
    email: b.user.email,
    accounts: b.account.accounts_email || b.user.email,
    plan: planLabel(b),
    roles: names,
    week: fiveDays(first),
    weekStart: shortDate(first),
    shortlist: shortlistDate(first),
    retainer: b.retained ? gbp(b.retainer) : undefined,
    signedBy: b.signature ? `${b.signature.name}, ${b.signature.title}` : "",
    signedAt: b.signature ? new Date(b.signature.signed_at).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Europe/London" }) : "",
    ukClient: UK.test(b.account.address || "") || /^GB/i.test(b.account.vat_number || ""),
    schedule: names.map((r, i) => [r, fiveDays(b.roles[i].search_week), shortlistDate(b.roles[i].search_week)]),
  };
}
