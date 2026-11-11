import type { Metadata } from "next";
import Link from "next/link";
import { isAdminEmail, sessionEmail } from "@/lib/onboarding/auth";
import { SignIn } from "@/components/onboard/SignIn";
import { allIssues, getSettings, type Entry, type IssueWithEntries } from "@/lib/appening/data";
import { plan, provisionalLaunch } from "@/lib/appening/schedule";
import { appliedEmail, bookedEmail, issueEmail, liveEmail } from "@/lib/appening/emails";

export const metadata: Metadata = { title: "What's Appening emails · Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const sampleEntry: Entry = {
  id: "x", created_at: "", origin: "applied", edition: "games", store: "ios", store_id: "1", store_url: "https://apps.apple.com",
  name: "Sample Quest", publisher: "Sample Studio", icon_url: null, genre: "Puzzle", release_date: null, store_text: null, screenshots: [],
  website: null, email: "you@studio.com", contact_name: "Sam Taylor", pitch: null, hiring: true, tagline: null, highlights: [], trailer_url: null, other_store_url: null, model: null, markets: null, team: null, proof: null, studio_about: null, studio_linkedin: null, builders: [], signal: null, status: "booked",
  issue_id: "i", slot: "spotlight", position: 0, take_draft: null, take: "A sample take.", booked_mail_at: null, live_mail_at: null,
};

/** Andre-only: every What's Appening email, using the latest issue (or a sample). */
export default async function Page() {
  if (!isAdminEmail(await sessionEmail())) return <SignIn title="Email review" note="Admin only. Sign in with your MakersForge email." />;
  const issues = await allIssues();
  const i: IssueWithEntries = issues.sort((a, b) => b.number - a.number)[0] ?? {
    id: "i", created_at: "", edition: "games", number: 1, intro: null, status: "approved", approved_at: null, published_on: null, emailed_at: null, spotlights: [sampleEntry], list: [],
  };
  const e = i.spotlights[0] ?? sampleEntry;
  const date = plan(issues, await getSettings()).get(i.id) ?? provisionalLaunch();
  const mails = [
    ["1. Studio applies", "to the studio", appliedEmail({ ...e, contact_name: e.contact_name || "Sam" })],
    ["2. Issue approved", "to each featured studio that gave an email", bookedEmail(e, i, date)],
    ["3. Issue day", "to each featured studio", liveEmail(e, i)],
    ["4. Issue day", "to subscribers", issueEmail(i, "0".repeat(24))],
  ] as const;
  return (
    <div style={{ padding: "110px 20px 60px", background: "var(--bg)", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gap: 28 }}>
        <Link href="/admin/appening" style={{ fontWeight: 700, color: "var(--dim)" }}>
          ← What&apos;s Appening admin
        </Link>
        <h1 style={{ margin: 0 }}>What&apos;s Appening emails (draft wording)</h1>
        {mails.map(([title, to, m]) => (
          <section key={title} style={{ display: "grid", gap: 8 }}>
            <h2 style={{ margin: 0, fontSize: 18 }}>
              {title} <span style={{ color: "var(--mute)", fontWeight: 600 }}>· {to}</span>
            </h2>
            <p style={{ margin: 0 }}>
              <b>Subject:</b> {m.subject}
            </p>
            <iframe srcDoc={m.html} title={title} style={{ width: "100%", height: title.startsWith("4") ? 1100 : 520, border: "1px solid var(--hair)", borderRadius: 16, background: "#f4efe8" }} />
          </section>
        ))}
      </div>
    </div>
  );
}
