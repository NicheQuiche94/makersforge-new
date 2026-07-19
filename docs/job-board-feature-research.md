# Job board feature scan — what's worth copying

Research pass across peer boards, read through our specific model: **the board is
a funnel** (candidates to the bench/representation, companies to hiring), it's
**curated + static** (no accounts, no live ATS), and it's **niche** (UA / growth /
marketing-art in games & apps). So the test for every feature isn't "do big boards
have it" — it's "does it grow traffic, deepen the two-sided value, or convert into
our funnel."

Boards looked at: **Hitmarker** (games/esports, 11k+ jobs, built-in ATS),
**Work With Indies** (curated games board, closest to us), **Welcome to the Jungle /
Otta** (vibe + company transparency), **Wellfound** (salary/equity upfront), plus
general niche-board conversion patterns.

---

## TL;DR — the shortlist

1. **Weekly digest email** (our biggest missing growth loop). We already capture the
   segmented alert list; sending it is the flywheel.
2. **Seniority filter + "New" badges** — cheap, and both are table stakes candidates expect.
3. **Salary as a badge + filter** — we have the data on many roles; make it a first-class signal.
4. **Richer company pages** (the WTTJ move, our way) — powered by the Folk enrichment round-trip.
5. **Salary/benchmark content** — a genuinely unique asset we can build because we aggregate.

---

## Already have (peers validate these)

Good news — the fundamentals are in and match what the best niche boards do:
category/sector/location/region/**size/stage** filters, email **alerts with category
segmentation**, **salary shown** where available, **company pages** with all roles,
**JobPosting SEO/schema**, posted-date freshness + **stat bar**, employer post flow,
and both funnel CTAs. Our **size + funding-stage** filters are actually *ahead* of most
boards (that came from the VC-board enrichment).

---

## Quick wins (low effort, clear value)

| Feature | Seen on | Why it fits us |
|---|---|---|
| **Weekly digest newsletter** | Work With Indies ("every Wednesday"), most niche boards | We already segment the alert list by category. A scheduled per-category digest of new roles is the #1 retention + funnel loop we're missing. The daily ingest already knows what's new. |
| **Seniority filter** | Hitmarker (experience level) | Derive junior / mid / senior / lead / head from the title at ingest. One more dropdown; candidates filter by it constantly. |
| **"New this week" badge** on cards | most boards | We have posted/ingest dates; a small badge on fresh roles adds scannable freshness. |
| **Salary badge + "salary shown" filter** | Wellfound (mandatory), ~60% of niche boards | We already parse salary (Ashby/Getro). Surface a "£/$ shown" chip and let candidates filter to roles with pay — high-intent signal. |
| **Sort control** (newest / salary / relevance) | most boards | We only sort newest. A sort toggle is cheap and expected. |
| **RSS / JSON feed** | Work With Indies | Nearly free from our data; aids distribution + SEO + lets others syndicate us. |
| **"Verified / hand-checked" trust mark** | Work With Indies (scam warning), WTTJ (vetting) | Curation *is* our moat — say it. A small "hand-checked, links to the real posting" mark builds trust vs scrapers. |

## Bigger bets (align with the strategy)

- **Richer company pages** — Welcome to the Jungle's whole edge is company transparency
  (video, photos, culture, "vibe check"). Our version, powered by the **Folk enrichment
  round-trip**: funding stage, size, last raise, what they're known for, why work there,
  their whole live line-up. Turns company pages into a real reason to browse (and a
  hiring-side sales asset).
- **Salary & market benchmarks** — because we *aggregate* in-remit roles, we can publish
  "UA Manager pay in EMEA: £X–Y", "Marketing artists by region", etc. No single-company
  board can do this. It's an SEO magnet, a candidate draw, and content for the newsletter.
  Directly serves the "know your worth → get represented" funnel.
- **Lightweight "saved / shortlist"** — no accounts needed; localStorage star on cards +
  a "saved" view. Low effort, boosts return visits. (Full accounts stay out of scope.)
- **"Roles like this" on job pages** — a few related in-remit roles at the bottom of each
  job page. Keeps people on-site, more funnel exposure, better SEO interlinking.
- **Follow a company / studio** — "alert me when {Studio} posts" ties the alert list to
  specific companies; strong for candidates targeting dream studios, and it feeds Folk
  signal on who's watching whom.
- **Candidate-side matching = the bench** — Wellfound/WTTJ "matching" is exactly our
  representation pitch ("the best roles never get posted; join the bench and companies come
  to you"). Consider a soft "N MakersForge specialists match roles like this" teaser on
  job pages to pull candidates toward representation.

## Deliberately skip (don't fit our model)

- **Built-in ATS / apply-tracking** (Hitmarker) — we intentionally link out; an ATS is a
  different (heavier, backend) business and dilutes the funnel.
- **User accounts / logins** — v1 is static/no-accounts on purpose; localStorage covers the
  light cases without the overhead.
- **Paid featured listings** — that's v3 in the brief; fine to defer.
- **Open community/Discord** (Work With Indies) — possible later as a bench feeder, but the
  representation model is our community for now.
- **Reviews/ratings of employers** (Glassdoor-style) — moderation burden, off-strategy.

---

## Board-by-board notes

- **Hitmarker** — games/esports, 11.5k jobs, free to browse (account to apply). Advanced
  filters, job-type/location/experience, company profiles, resume upload, salary ranges,
  and a built-in ATS for employers. Volume play; not our model, but the filter depth and
  salary norms are the bar.
- **Work With Indies** — closest peer: curated games board, **9 job categories**, weekly
  Wednesday newsletter, Discord community, studio pages, prominent **scam warning**, RSS,
  flat "$49+ to post". Confirms the curated + newsletter + trust combo works; notably they
  *don't* show salary — an easy place for us to be better.
- **Welcome to the Jungle (ex-Otta)** — 7k+ vetted companies, tailored matching that learns,
  and deep **company transparency** (CEO videos, office photos, culture). Their moat is the
  company page, not the listing.
- **Wellfound (ex-AngelList)** — startup focus, **mandatory salary + equity upfront**. Their
  moat is financial transparency. Pairs perfectly with our stage/size enrichment.
- **Niche-board patterns** — salary transparency, alerts, saved jobs, and matching are the
  recurring conversion levers; newsletters are the recurring growth loop; specialised boards
  cut time-to-hire ~60 days vs general boards (the pitch to the hiring side).

---

*Next session: if you like the shortlist, the natural order is (1) weekly digest, (2) the
cheap card/filter wins — seniority, New badge, salary badge/filter, sort — then (3) the Folk
enrichment round-trip which unlocks the richer company pages + benchmarks.*
