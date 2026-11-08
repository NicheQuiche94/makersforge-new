"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { draftAd, type Answers, type Brief } from "@/lib/hiringNeeds";
import g from "../job-ad-grading-tool/grader.module.css";
import s from "./needs.module.css";

/* The brief, as the email link shows it (Andre 2026-11-08). "Draft my job ad"
   hands a draft built from it to the grading tool; ?draft=1 (the email's
   button) does that straight away. */
export function BriefView({ b, a, email, autoDraft = false }: { b: Brief; a: Answers; email: string; autoDraft?: boolean }) {
  const router = useRouter();
  const toAd = () => {
    if (b.kind !== "hire") return;
    try {
      sessionStorage.setItem("mf-draft-ad", JSON.stringify({ title: b.title, text: draftAd(b, a), email }));
    } catch {}
    router.push("/job-ad-grading-tool?from=brief");
  };
  const fired = useRef(false);
  useEffect(() => {
    if (autoDraft && !fired.current) {
      fired.current = true;
      toAd();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoDraft]);

  const disclaimer = (
    <p className={s.disclaimer}>
      This is where first principles lead, based only on what you&apos;ve told us. You know your studio, your team and your budget better
      than any tool can, so treat it as a starting point and use your own judgement before you hire.
    </p>
  );

  if (b.kind === "none")
    return (
      <div className={g.result}>
        <div className={s.brief}>
          <h2>You might not need to hire</h2>
          <p>{b.reason}</p>
          {disclaimer}
          <Link href="/what-am-i-hiring-for" className={s.back}>Start again</Link>
        </div>
      </div>
    );

  return (
    <div className={g.result}>
      <div className={s.brief}>
        <p className={s.kicker}>Your next hire</p>
        <h2>{b.sentence}</h2>
        <p className={s.why}>{b.why}</p>
        <dl className={s.facts}>
          <div><dt>Role</dt><dd>{b.title}</dd></div>
          <div><dt>Type</dt><dd>{b.type}</dd></div>
          <div><dt>Time</dt><dd>{b.hours}</dd></div>
          <div><dt>For</dt><dd>{b.length}</dd></div>
          <div><dt>Level</dt><dd>{b.level}</dd></div>
          <div><dt>Focus</dt><dd>{b.focus}</dd></div>
        </dl>
        {b.outcome && (
          <p className={s.outcome}>
            <b>Hired to:</b> {b.outcome}
            {a.by ? `, by ${a.by}` : ""}
          </p>
        )}
        <p className={s.label}>The must-haves</p>
        <ul className={s.musts}>{b.musts.map((m) => <li key={m}>{m}</li>)}</ul>
        {b.more.length > 0 && <p className={s.more}>You also have gaps in: {b.more.join(", ")}. Hire for the outcome above first; it&apos;s the one the rest depends on.</p>}
        {disclaimer}
      </div>

      <div className={g.offer}>
        <div>
          <h3>Turn this into a job ad</h3>
          <p>We&apos;ll draft it from your brief, with gaps marked for you to fill, then grade it so it scores well first time.</p>
        </div>
        <button type="button" className={g.goLight} onClick={toAd}>Draft my job ad →</button>
      </div>

      <div className={g.bridge}>
        <p>Or skip the ad: see how every way to hire this role compares on cost, speed and your team&apos;s hours.</p>
        <Link href="/compare" className={g.go}>Compare hiring routes →</Link>
      </div>
    </div>
  );
}
