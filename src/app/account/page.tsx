import type { Metadata } from "next";
import { sessionEmail } from "@/lib/onboarding/auth";
import { bookingsForEmail } from "@/lib/onboarding/records";
import { availability } from "@/lib/onboarding/db";
import { SignIn } from "@/components/onboard/SignIn";
import { SessionFromLink } from "@/components/onboard/SessionFromLink";
import { AccountApp } from "./AccountApp";

export const metadata: Metadata = { title: "Your account · MakersForge", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

/** The client portal: only the signed-in person's own company's bookings. */
export default async function AccountPage() {
  const email = await sessionEmail();
  if (!email)
    return (
      <>
        <SessionFromLink />
        <SignIn title="Your account" note="Sign in with the work email you booked with. We'll send you a 6-digit code." />
      </>
    );
  const [bookings, weeks] = await Promise.all([bookingsForEmail(email), availability().catch(() => [])]);
  const slotsLeft = weeks.filter((w) => w.start.slice(0, 7) === weeks[0]?.start.slice(0, 7)).reduce((n, w) => n + w.open, 0);
  return <AccountApp email={email} bookings={bookings} slotsLeft={slotsLeft} month={weeks[0] ? new Date(`${weeks[0].start}T12:00:00Z`).toLocaleDateString("en-GB", { month: "long" }) : ""} />;
}
