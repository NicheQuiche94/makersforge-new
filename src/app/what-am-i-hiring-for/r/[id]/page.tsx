import type { Metadata } from "next";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Answers, Brief } from "@/lib/hiringNeeds";
import { BriefView } from "../../BriefView";
import g from "../../../job-ad-grading-tool/grader.module.css";

export const metadata: Metadata = {
  title: "Your hiring brief · MakersForge",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

/* The brief the email links to (Andre 2026-11-08). */
export default async function BriefPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ draft?: string }> }) {
  const { id } = await params;
  const { draft } = await searchParams;
  const { data: row } = /^[a-f0-9]{10}$/.test(id)
    ? await createAdminClient().from("hiring_briefs").select("id, email, answers, brief").eq("id", id).maybeSingle()
    : { data: null };

  return (
    <section className={g.wrap}>
      <div className="container">
        {row ? (
          <>
            <header className={g.head}>
              <h1 className={g.display}>
                Your hiring <span className="gr">brief</span>
              </h1>
            </header>
            <BriefView b={row.brief as Brief} a={row.answers as Answers} email={row.email} autoDraft={draft === "1"} />
          </>
        ) : (
          <header className={g.head}>
            <h1 className={g.display}>We couldn&apos;t find that brief</h1>
            <p className={g.lede}>
              <Link href="/what-am-i-hiring-for">Work out your next hire →</Link>
            </p>
          </header>
        )}
      </div>
    </section>
  );
}
