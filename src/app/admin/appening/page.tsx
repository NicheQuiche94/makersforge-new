import type { Metadata } from "next";
import { isAdminEmail, sessionEmail } from "@/lib/onboarding/auth";
import { SignIn } from "@/components/onboard/SignIn";
import { allIssues, db, getSettings, queue } from "@/lib/appening/data";
import { plan } from "@/lib/appening/schedule";
import { AppeningAdmin } from "./AppeningAdmin";

export const metadata: Metadata = { title: "What's Appening · Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AppeningAdminPage() {
  const email = await sessionEmail();
  if (!email || !isAdminEmail(email)) return <SignIn title="Admin" note="Sign in with your MakersForge email." />;
  const [settings, issues, q, { count: subscribers }] = await Promise.all([
    getSettings(),
    allIssues(),
    queue(),
    db().from("appening_subscribers").select("email", { count: "exact", head: true }).is("unsubscribed_at", null),
  ]);
  const dates = Object.fromEntries(plan(issues, settings));
  return <AppeningAdmin settings={settings} issues={issues} queue={q} dates={dates} subscribers={subscribers ?? 0} />;
}
