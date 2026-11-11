import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/appening/data";
import styles from "../appening.module.css";

export const metadata: Metadata = { title: "Unsubscribe · What's Appening", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const valid = (t?: string) => !!t && /^[a-f0-9]{24}$/.test(t);

async function unsubscribe(form: FormData) {
  "use server";
  const t = String(form.get("t") || "");
  if (valid(t)) await db().from("appening_subscribers").update({ unsubscribed_at: new Date().toISOString() }).eq("token", t);
  redirect("/whats-appening/unsubscribe?done=1");
}

/* From the link in every issue email. A button, not a bare link, so email
   link scanners can't unsubscribe people by opening the URL. */
export default async function Unsubscribe({ searchParams }: { searchParams: Promise<{ t?: string; done?: string }> }) {
  const { t, done } = await searchParams;
  return (
    <section className={styles.wrap}>
      <div className={`container ${styles.done}`}>
        {done ? (
          <>
            <h2>You&apos;re unsubscribed</h2>
            <p>You won&apos;t get What&apos;s Appening by email any more.</p>
          </>
        ) : valid(t) ? (
          <form action={unsubscribe} className={styles.done}>
            <h2>Unsubscribe from What&apos;s Appening?</h2>
            <input type="hidden" name="t" value={t} />
            <button className={styles.go}>Unsubscribe</button>
          </form>
        ) : (
          <>
            <h2>That link didn&apos;t work</h2>
            <p>Reply to any issue and we&apos;ll take you off by hand.</p>
          </>
        )}
        <Link href="/whats-appening" className={styles.ghost}>
          Back to What&apos;s Appening →
        </Link>
      </div>
    </section>
  );
}
