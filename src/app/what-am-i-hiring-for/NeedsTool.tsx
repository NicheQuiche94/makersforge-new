"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AREAS, GENRES, HAVE, HOURS, LENGTH, MODELS, SKILLS, brief, draftAd, type Answers } from "@/lib/hiringNeeds";
import g from "../job-ad-grading-tool/grader.module.css";
import s from "./needs.module.css";

/* MOCKUP (Andre 2026-11-08): one question at a time, first principles. What
   are you trying to fix → what would fix it → what skills does that take →
   does your team have them, with room → how much work is there → what kind
   of game. Email, then the brief, which can become a job ad. */
const START: Answers = { problem: "own", problemText: "", outcome: "", by: "", skills: [], have: {}, hours: 40, length: "ongoing", model: "", genres: [] };
const STEPS = ["problem", "outcome", "skills", "have", "amount", "game", "email"] as const;

export function NeedsTool() {
  const router = useRouter();
  const [a, setA] = useState<Answers>(START);
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const set = (p: Partial<Answers>) => setA((x) => ({ ...x, ...p }));
  const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const [summary, setSummary] = useState("");
  const [thinking, setThinking] = useState(false);

  // After the outcome: read their words and suggest the skills it takes.
  const suggest = async () => {
    setThinking(true);
    const r = await fetch("/api/hiring-needs/skills", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ problem: a.problemText, outcome: a.outcome }) })
      .then((x) => x.json())
      .catch(() => null);
    setThinking(false);
    if (r?.skills) set({ skills: r.skills, have: {} });
    setSummary(r?.summary || "");
    setStep(2);
  };

  const can = [
    a.problemText.trim().length > 10,
    a.outcome.trim().length > 5,
    a.skills.length > 0,
    a.skills.every((k) => a.have[k]),
    true,
    !!a.model && a.genres.length > 0,
    /^\S+@\S+\.\S+$/.test(email),
  ][step];

  const next = () => (step === 1 ? suggest() : step < STEPS.length - 1 ? setStep(step + 1) : setDone(true));
  const b = done ? brief(a) : null;

  const toAd = () => {
    if (!b || b.kind !== "hire") return;
    try {
      sessionStorage.setItem("mf-draft-ad", JSON.stringify({ title: b.title, text: draftAd(b, a), email }));
    } catch {}
    router.push("/job-ad-grading-tool?from=brief");
  };

  return (
    <section className={g.wrap}>
      <div className="container">
        <header className={g.head}>
          <span className={g.mock}>Mockup: questions, logic and wording are drafts</span>
          <h1 className={g.display}>
            What should your next hire <span className="gr">actually</span> be?
          </h1>
          <p className={g.lede}>Six quick questions from first principles. You&apos;ll get the hire you need, written up as a role brief you can turn into a job ad.</p>
        </header>

        {!done ? (
          <div className={`${g.card} ${s.quiz}`}>
            <div className={s.progress}><i style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} /></div>
            <p className={s.count}>Question {Math.min(step + 1, 6)} of 6{step === 6 ? ": nearly there" : ""}</p>

            {step === 0 && (
              <>
                <h2 className={s.q}>What are you trying to fix?</h2>
                <p className={s.sub}>Start with the problem, not the job title. In your own words: a sentence or two is plenty.</p>
                <label className={g.field}>
                  <textarea
                    value={a.problemText}
                    onChange={(e) => set({ problemText: e.target.value })}
                    rows={4}
                    placeholder="e.g. Our CPIs doubled this year and we can't scale spend past £5k a day without losing money. Or: our art team can't keep up with the content our live events need."
                  />
                </label>
              </>
            )}

            {step === 1 && (
              <>
                <h2 className={s.q}>What would fixed look like, and by when?</h2>
                <p className={s.sub}>The outcome is what you&apos;re really hiring for. Be specific: numbers if you have them.</p>
                <label className={g.field}>
                  <span>The outcome</span>
                  <input value={a.outcome} onChange={(e) => set({ outcome: e.target.value })} placeholder="e.g. scale spend to £20k a day at 120% D180 ROAS" />
                </label>
                <label className={g.field}>
                  <span>By when <i>(optional)</i></span>
                  <input value={a.by} onChange={(e) => set({ by: e.target.value })} placeholder="e.g. the end of Q2" />
                </label>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className={s.q}>What skills does getting there take?</h2>
                {summary && <p className={s.understood}>{summary}</p>}
                <p className={s.sub}>{a.skills.length ? "We've picked the ones it most needs. Add or remove any." : "Pick the ones it needs."}</p>
                {AREAS.map((ar) => (
                  <div key={ar.id} className={s.area}>
                    <p>{ar.label}</p>
                    <div className={s.chips}>
                      {SKILLS.filter((k) => k.area === ar.id).map((k) => (
                        <button key={k.id} type="button" className={`${s.chip} ${a.skills.includes(k.id) ? s.on : ""}`} onClick={() => set({ skills: toggle(a.skills, k.id) })}>
                          {k.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            )}

            {step === 3 && (
              <>
                <h2 className={s.q}>Does anyone in your team have these, with room to use them?</h2>
                <p className={s.sub}>Be honest about capacity and level: that&apos;s what decides the hire.</p>
                {a.skills.map((k) => (
                  <div key={k} className={s.haveRow}>
                    <b>{SKILLS.find((x) => x.id === k)!.label}</b>
                    <div className={s.chips}>
                      {HAVE.map((h) => (
                        <button key={h.id} type="button" className={`${s.chip} ${a.have[k] === h.id ? s.on : ""}`} onClick={() => set({ have: { ...a.have, [k]: h.id } })}>
                          {h.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            )}

            {step === 4 && (
              <>
                <h2 className={s.q}>How much of this work is there?</h2>
                <p className={s.sub}>This decides between a contractor and a permanent hire.</p>
                <p className={s.label}>Hours of work a week</p>
                <div className={s.chips}>
                  {HOURS.map((h) => (
                    <button key={h.id} type="button" className={`${s.chip} ${a.hours === h.id ? s.on : ""}`} onClick={() => set({ hours: h.id })}>{h.label}</button>
                  ))}
                </div>
                <p className={s.label}>For how long</p>
                <div className={s.chips}>
                  {LENGTH.map((l) => (
                    <button key={l.id} type="button" className={`${s.chip} ${a.length === l.id ? s.on : ""}`} onClick={() => set({ length: l.id })}>{l.label}</button>
                  ))}
                </div>
              </>
            )}

            {step === 5 && (
              <>
                <h2 className={s.q}>What kind of game or app is it?</h2>
                <p className={s.sub}>So the brief asks for the right experience.</p>
                <p className={s.label}>How it makes money</p>
                <div className={s.chips}>
                  {MODELS.map((m) => (
                    <button key={m} type="button" className={`${s.chip} ${a.model === m ? s.on : ""}`} onClick={() => set({ model: m })}>{m}</button>
                  ))}
                </div>
                <p className={s.label}>Genre (pick any)</p>
                <div className={s.chips}>
                  {GENRES.map((x) => (
                    <button key={x} type="button" className={`${s.chip} ${a.genres.includes(x) ? s.on : ""}`} onClick={() => set({ genres: toggle(a.genres, x) })}>{x}</button>
                  ))}
                </div>
              </>
            )}

            {step === 6 && (
              <>
                <h2 className={s.q}>Where should we send your brief?</h2>
                <p className={s.sub}>You&apos;ll get your role brief by email, with a draft job ad ready to fill in.</p>
                <label className={g.field}>
                  <span>Work email</span>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@studio.com" />
                </label>
              </>
            )}

            <div className={s.nav}>
              {step > 0 ? <button type="button" className={s.back} onClick={() => setStep(step - 1)}>← Back</button> : <span />}
              <button type="button" className={g.go} disabled={!can || thinking} onClick={next}>
                {thinking ? "Reading that…" : step === 6 ? "See my hire →" : "Next →"}
              </button>
            </div>
          </div>
        ) : (
          b && (
            <div className={g.result}>
              <p className={g.mockNote}>In the live version this arrives by email, with a link back to this page.</p>
              {b.kind === "none" ? (
                <div className={s.brief}>
                  <h2>You might not need to hire</h2>
                  <p>{b.reason}</p>
                  <button type="button" className={s.back} onClick={() => { setDone(false); setStep(0); }}>Start again</button>
                </div>
              ) : (
                <>
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
                    <p className={s.disclaimer}>
                      This is where first principles lead, based only on what you&apos;ve told us. You know your studio, your team and your budget
                      better than any tool can, so treat it as a starting point and use your own judgement before you hire.
                    </p>
                  </div>

                  <div className={g.offer}>
                    <div>
                      <h3>Turn this into a job ad</h3>
                      <p>We&apos;ll write a draft from your brief, with gaps marked for you to fill, then grade it so it scores well first time.</p>
                    </div>
                    <button type="button" className={g.goLight} onClick={toAd}>Draft my job ad →</button>
                  </div>

                  <div className={g.bridge}>
                    <p>Or skip the ad: see how every way to hire this role compares on cost, speed and your team&apos;s hours.</p>
                    <Link href="/compare" className={g.go}>Compare hiring routes →</Link>
                  </div>
                </>
              )}
            </div>
          )
        )}
      </div>
    </section>
  );
}
