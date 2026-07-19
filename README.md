# MakersForge

Next.js 16 (App Router) + TypeScript + Tailwind. Deployed on Vercel — pushing
to `main` triggers a production build + deploy automatically.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (also what Vercel runs)
npm run lint
```

---

## Managing the job board (`/jobs`)

The board is **fully static**. Every page — the index, each job, each company,
each category — is generated at build time from a single file. There is no
database and no live backend for the listings: **updating the board = editing
`src/data/jobs.json` and pushing.**

### The one file: `src/data/jobs.json`

It's an array of job objects. To add a role, add one object:

```jsonc
{
  "slug": "acme-ua-manager",                 // unique, URL-safe → /jobs/acme-ua-manager
  "title": "User Acquisition Manager",
  "company": {
    "slug": "acme",                          // groups all Acme roles → /jobs/companies/acme
    "name": "Acme Games",
    "url": "https://acme.games",
    "logo": "/jobs/logos/acme.png",          // OPTIONAL — omit for an auto monogram
    "blurb": "One or two sentences about the company.",
    "size": "50-200",                        // OPTIONAL
    "sector": "games"                        // "games" | "apps"
  },
  "category": "ua",                          // ua | growth | marketing-art | creative-strategy | aso
  "location": "Berlin, Germany",             // "City, Country" or "Remote — EMEA"
  "region": "emea",                          // OPTIONAL: emea | americas | apac | global (powers the region filter)
  "remote": "hybrid",                        // remote | hybrid | onsite
  "employment_type": "FULL_TIME",            // FULL_TIME | PART_TIME | CONTRACTOR
  "salary": "€70,000–95,000",                // OPTIONAL — display only, omit or null to hide
  "description_md": "Our summary…",          // SEE RULES BELOW
  "apply_url": "https://acme.games/jobs/123",// always the company's own posting / ATS
  "source": "curated",                       // curated | employer | greenhouse | lever | ashby | partner
  "posted_at": "2026-07-14",                 // YYYY-MM-DD
  "expires_at": "2026-08-14"                 // YYYY-MM-DD
}
```

Then commit and push:

```bash
git add src/data/jobs.json
git commit -m "jobs: add Acme UA Manager"
git push
```

Vercel rebuilds and the role is live in a couple of minutes. That's the whole
workflow.

### Rules that matter

- **`description_md` is written by us**, not pasted from the original ad: 2–4
  sentences summarising the role, then a short `- ` bullet list of key
  requirements. We always link out to `apply_url`; we never replicate someone
  else's listing. Supported formatting: paragraphs, `**bold**`, and `- ` bullets.
- **Expiry:** once `expires_at` is in the past, the role drops off the index and
  company live-role lists automatically — but its page stays live with an
  "expired" state and both funnel CTAs, so the SEO equity survives the role.
  "Today" is the build date, so a rebuild is what refreshes expiry.
- **Company pages are derived** from the jobs file by grouping on
  `company.slug`. There is no separate companies file to keep in sync — just
  keep a company's details consistent across its roles.
- **Logos** (optional) live in `public/jobs/logos/`. Without one, the card shows
  a heat-gradient monogram of the company initials.

### Pulling roles in automatically (ingestion script)

Instead of hand-typing every role, you can pull open roles straight from
companies' public ATS boards, keep only the ones in our remit, and merge them
into `src/data/jobs.json`.

1. List the companies to watch in `src/data/sources.json`. Each needs its ATS and
   the board slug from the ATS URL:
   - Greenhouse → `boards.greenhouse.io/**thisPart**` → `"ats": "greenhouse"`
   - Lever → `jobs.lever.co/**thisPart**` → `"ats": "lever"`
   - Ashby → `jobs.ashbyhq.com/**thisPart**` → `"ats": "ashby"`
2. Run it:
   ```bash
   node scripts/ingest.mjs --dry-run   # fetch + report only, writes nothing
   node scripts/ingest.mjs             # fetch, merge into jobs.json, write Folk CSV
   ```
3. Review the diff to `src/data/jobs.json`, **rewrite the auto-generated
   `description_md`** for anything you're keeping (the script flags each one),
   then commit + push.

The script preserves your hand-curated / employer / partner entries and only
refreshes ATS-sourced ones. Off-remit titles are rejected and logged so you can
tune the filter. It also writes `src/data/folk-import.csv` — one row per company,
pre-tagged Status "Lead" / Channel "Job board signal" — ready to import into
Folk as leads. (That CSV is git-ignored; it's a throwaway import artifact.)

> Scheduled ingestion and automatic Folk API sync are **v2** — deliberately not
> built here. This is the manual, review-then-push version.

### Job alert signups

The alert form (board, job pages, empty states, category pages) posts to
`/api/alerts`, which does two things independently:

1. **Stores** `{ email, categories, source }` in a Supabase table called
   `job_alerts` — the durable, exportable, category-segmented list.
2. **Emails** Andre each signup, so no lead is lost even before the table
   exists.

A signup succeeds if *either* lands, so a missing table never blocks capture.

**One-time Supabase setup** (run in the Supabase SQL editor):

```sql
create table if not exists public.job_alerts (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  categories  text[] not null default '{}',
  source      text,
  created_at  timestamptz not null default now()
);

-- Allow inserts from the site. If you set SUPABASE_SERVICE_ROLE_KEY in the
-- environment, the route uses that (bypasses RLS) and you can skip the anon
-- policy. Otherwise enable RLS + an insert-only policy for the anon key:
alter table public.job_alerts enable row level security;
create policy "anon can subscribe" on public.job_alerts
  for insert to anon with check (true);
```

To segment later, query by category, e.g.:

```sql
select email from public.job_alerts where 'ua' = any(categories);
```

**Provider choice recorded:** alerts use **Supabase** (storage) + **Resend**
(notification), both already in the stack — no new service. Env vars in
`.env.example`: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
optional `SUPABASE_SERVICE_ROLE_KEY`, and `RESEND_API_KEY`.

### SEO

- Every job page emits `JobPosting` JSON-LD in its static HTML — validate any
  job URL with Google's [Rich Results test](https://search.google.com/test/rich-results).
- `sitemap.xml` and `robots.txt` are generated at build (`src/app/sitemap.ts`,
  `src/app/robots.ts`) and include every job, company and category URL.
- Category landing pages (`/jobs/categories/ua`, …) carry static intro copy so
  the filtered views rank for the head terms; edit that copy in
  `src/lib/categoryCopy.ts`.

### Where things live

| Path | What |
| --- | --- |
| `src/data/jobs.json` | the board content — the file you edit |
| `src/data/sources.json` | ATS companies for the ingestion script |
| `src/lib/jobs.ts` | data loader + types + labels |
| `src/app/jobs/` | board, job, company, category, post pages |
| `src/components/jobs/` | cards, filters, CTAs, forms |
| `src/app/api/alerts/` · `src/app/api/jobs-post/` | form handlers (Resend + Supabase) |
| `scripts/ingest.mjs` | ATS pull → jobs.json + Folk CSV |
