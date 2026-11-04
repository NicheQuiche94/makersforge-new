import type { Metadata } from "next";
import { isAdminEmail, sessionEmail } from "@/lib/onboarding/auth";
import { SignIn } from "@/components/onboard/SignIn";
import { TermsPreview } from "./Preview";

export const metadata: Metadata = { title: "Terms review · MakersForge", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

/** Andre-only: the Terms of Business template with sample details, new and fixed clauses marked. */
export default async function Page() {
  return isAdminEmail(await sessionEmail()) ? <TermsPreview /> : <SignIn title="Terms review" note="Admin only. Sign in with your MakersForge email." />;
}
