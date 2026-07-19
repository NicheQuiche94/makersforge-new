# Job sources — working API paths & how the board pulls jobs

This is the reference for **where the board scrapes jobs from** and the exact
public endpoints that work. It backs `scripts/ingest.mjs`, the daily
`.github/workflows/ingest.yml` automation, and any manual refresh check.

- **Company/board config lives in data, not here:**
  - `src/data/sources.json` — per-company ATS sources (`{ ats, slug, name, url, sector, size, blurb }`)
  - `src/data/vc-boards.json` — Getro VC portfolio boards (`{ platform, collectionId, vc }`)
- This doc explains the **endpoint patterns** behind each `ats`/`platform`, so
  the pulls can be verified, debugged, or extended.

> All requests should send a browser `User-Agent` header. Some hosts (Getro,
> the Cloudflare-fronted board domains) return `403`/`406` without one.

---

## Supported platforms (confirmed working, keyless)

### Greenhouse — `ats: "greenhouse"`
- **List (with full descriptions):** `GET https://boards-api.greenhouse.io/v1/boards/{slug}/jobs?content=true`
- **Single job:** `GET https://boards-api.greenhouse.io/v1/boards/{slug}/jobs/{id}`
- Slug = the part in `boards.greenhouse.io/{slug}` or `job-boards.greenhouse.io/{slug}`.
- Job date: use `first_published` (true posted date) over `updated_at`.

### Lever — `ats: "lever"`
- **List (with content):** `GET https://api.lever.co/v0/postings/{slug}?mode=json`
- **Single:** `GET https://api.lever.co/v0/postings/{slug}/{id}?mode=json`
- Slug = the part in `jobs.lever.co/{slug}` (EU boards `jobs.eu.lever.co/{slug}` use the same API host).
- Rich content: `description` (HTML intro) + `lists[]` (`{text, content}` requirement sections). `categories.location`, `workplaceType`, `createdAt`.
- ⚠️ `createdAt` is the requisition-created date — often old for long-open-but-still-live roles.

### Ashby — `ats: "ashby"`
- **List:** `GET https://api.ashbyhq.com/posting-api/job-board/{slug}?includeCompensation=true`
- Slug = the part in `jobs.ashbyhq.com/{slug}`.
- Fields: `descriptionHtml`, `descriptionPlain`, `isRemote`, `location`, `employmentType`, `publishedAt`, `compensation.compensationTierSummary` (salary).

### Workable — `ats: "workable"`
- **List (with descriptions):** `GET https://apply.workable.com/api/v1/widget/accounts/{slug}?details=true`
- Returns `{ name, description, jobs[] }`. Job: `title`, `url`/`shortlink`/`application_url`, `city`, `country`, `telecommuting` (bool → remote), `employment_type`, `published_on`/`created_at`, `description`/`requirements`/`benefits` (HTML).
- ⚠️ The **widget account slug can differ** from the `apply.workable.com/{slug}` careers-URL slug — some accounts return `404` on the API even though the careers page exists. Confirm the exact account id.

### TeamTailor — `ats: "teamtailor"`
- **JSON Feed:** `GET https://{slug}.teamtailor.com/jobs.json`
- Returns `{ items[] }`. Item: `title`, `url` (apply), `content_html` (full description), `date_published`, `_jobposting` (schema.org JobPosting with `employmentType`, `jobLocation.address`, `jobLocationType: "TELECOMMUTE"`).
- Slug = the subdomain in `{slug}.teamtailor.com`.

### Getro (VC portfolio boards) — `platform: "getro"` in vc-boards.json
- **Search jobs:** `POST https://api.getro.com/api/v2/collections/{networkId}/search/jobs`
  - Body: `{"hitsPerPage":20,"page":0}` (hitsPerPage is capped at 20; paginate `page`).
  - Headers: `accept: application/json`, `content-type: application/json`, **`user-agent` required**.
  - ⚠️ Do **not** send `origin`/`referer` headers → returns `406`.
- Each job carries `organization` with `industry_tags[]`, `stage`, `head_count` (bucket code 1=1-10 … 5=500+), plus `compensation_amount_{min,max}_cents`, `work_mode`, `locations[]`, `created_at`, `url`, `source`.
- **Confirmed network IDs:** Play Ventures = `1624`, BITKRAFT = `3095`.
- **Find a board's networkId:** fetch the board page (e.g. `careers.{vc}.vc/jobs`) with a browser UA and read `__NEXT_DATA__ → props.pageProps.network.id`.

---

## Deferred / not-yet-supported platforms

- **Consider** — powers `portfoliojobs.a16z.com`, `jobs.makersfund.com`, `portfoliojobs.goodwatercap.com`, Griffin, Konvoy (the bigger **consumer/apps** boards). Data loads via a `/mendel/{token}/boards` JS bundle — **no clean JSON API found**; needs a headless browser. High value for apps coverage.
- **Jobvite** — e.g. Kwalee (`jobs.jobvite.com/kwalee`). Not yet integrated.
- **Welcome to the Jungle**, **SmartRecruiters**, **Recruitee** — common for EU studios (Homa, others). Not yet integrated.
- Some publishers (Rollic, Miniclip) run **their own career sites** — need per-site handling or a headless pass.

---

## Quick refresh check

Verify a single board resolves and how many in-remit roles it has:

```bash
# Greenhouse / Lever / Ashby / Workable examples
curl -s -A "Mozilla/5.0" "https://boards-api.greenhouse.io/v1/boards/scopely/jobs" | node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>console.log(JSON.parse(d).jobs.length,"jobs"))'
curl -s -A "Mozilla/5.0" "https://api.lever.co/v0/postings/peakgames?mode=json" | node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>console.log(JSON.parse(d).length,"jobs"))'

# Getro board (networkId 1624 = Play Ventures)
curl -s -A "Mozilla/5.0" -H "content-type: application/json" -X POST -d '{"hitsPerPage":20,"page":0}' \
  "https://api.getro.com/api/v2/collections/1624/search/jobs" | node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>console.log(JSON.parse(d).results.count,"jobs"))'
```

Full refresh of the whole board:

```bash
node scripts/ingest.mjs          # pull all sources + boards → src/data/jobs.json + folk-import.csv
node scripts/ingest.mjs --dry-run   # report only, write nothing
```
