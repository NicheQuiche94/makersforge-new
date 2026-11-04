/**
 * Sign-in for clients and Andre. Supabase makes the one-time code and the
 * magic link; we send them ourselves (Resend, our own design) instead of
 * Supabase's built-in mailer. The code is typed straight into /start so
 * nobody leaves the page; the link signs them into /account.
 */
import { createAdminClient } from "@/lib/supabase/admin";
import { createServerSupabase } from "@/lib/supabase/server";
import { clientEmails } from "@/lib/clientEmails";
import { sendMail } from "./mail";

const FREE_MAIL = /@(gmail|googlemail|outlook|hotmail|live|yahoo|icloud|me|aol|proton|protonmail|gmx|mail)\./i;
export const isWorkEmail = (e: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e) && !FREE_MAIL.test(e);

/** Emails that may use /admin (comma-separated PORTAL_ADMIN_EMAILS). */
export const isAdminEmail = (email?: string | null) =>
  !!email && (process.env.PORTAL_ADMIN_EMAILS || "").toLowerCase().split(",").map((s) => s.trim()).includes(email.toLowerCase());

export async function sendSignInCode(email: string, first: string, origin: string) {
  const admin = createAdminClient();
  // Make sure the auth user exists; "already registered" is fine.
  await admin.auth.admin.createUser({ email }).catch(() => undefined);
  const { data, error } = await admin.auth.admin.generateLink({ type: "magiclink", email, options: { redirectTo: `${origin}/account` } });
  if (error || !data?.properties) throw new Error(error?.message || "could not make a sign-in code");
  const { email_otp: code, action_link: link } = data.properties;
  // Only the sign-in email is used; the rest of the template data can be blank.
  const blank = { company: "", legal: "", number: "", address: "", contact: "", email, accounts: "", plan: "", roles: [""], week: "", weekStart: "", shortlist: "", signedBy: "", signedAt: "", ukClient: true };
  const e = clientEmails({ ...blank, first: first || "there", code, link }).find((x) => x.id === "signin")!;
  await sendMail({ to: email, subject: e.subject, html: e.html });
}

/** The signed-in person's email, or null. */
export async function sessionEmail() {
  const supabase = await createServerSupabase();
  const { data } = await supabase.auth.getUser();
  return data.user?.email?.toLowerCase() ?? null;
}
