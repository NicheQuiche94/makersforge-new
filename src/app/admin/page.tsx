import type { Metadata } from "next";
import { isAdminEmail, sessionEmail } from "@/lib/onboarding/auth";
import { allBookings } from "@/lib/onboarding/records";
import { createAdminClient } from "@/lib/supabase/admin";
import { SignIn } from "@/components/onboard/SignIn";
import { AdminApp } from "./AdminApp";

export const metadata: Metadata = { title: "Admin · MakersForge", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

/** Andre's admin: only emails in PORTAL_ADMIN_EMAILS get past the sign-in. */
export default async function AdminPage() {
  const email = await sessionEmail();
  if (!email) return <SignIn title="Admin" note="Sign in with your MakersForge email." />;
  if (!isAdminEmail(email)) return <SignIn title="Admin" note={`${email} isn't an admin. Sign in with your MakersForge email.`} />;

  const today = new Date().toISOString().slice(0, 10);
  const [bookings, { data: weeks }] = await Promise.all([
    allBookings(),
    createAdminClient().from("search_week_availability").select("week_start, slots, blocked, open").gt("week_start", today).order("week_start").limit(16),
  ]);
  return <AdminApp bookings={bookings} weeks={(weeks ?? []) as { week_start: string; slots: number; blocked: boolean; open: number }[]} />;
}
