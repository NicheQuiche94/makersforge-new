import type { Metadata } from "next";
import { isAdminEmail, sessionEmail } from "@/lib/onboarding/auth";
import { SignIn } from "@/components/onboard/SignIn";
import { EmailsPreview } from "./Preview";

export const metadata: Metadata = { title: "Email review · MakersForge", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

/** Andre-only: every client email as it lands, for reviewing wording. */
export default async function Page() {
  return isAdminEmail(await sessionEmail()) ? <EmailsPreview /> : <SignIn title="Email review" note="Admin only. Sign in with your MakersForge email." />;
}
