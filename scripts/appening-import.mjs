#!/usr/bin/env node
/**
 * What's Appening: feed launches the App Store radar found into the queue.
 *
 *   node --env-file=.env.local scripts/appening-import.mjs <radar-batch.json> [--indie] [--dry]
 *
 * Reads a launch-radar batch (mf-radar/scripts/.cache/launch-radar-<date>*.json:
 * an array of publishers, each with apps[] and track "studio" | "indie").
 * Studio launches always go in; indies only with --indie (Andre's 70/30
 * studio mix). Each app is looked up on the App Store for its icon, genre,
 * description and screenshots, then upserted (an application from the studio
 * is never overwritten). Gambling titles are skipped.
 */
import fs from "node:fs";
import { createClient } from "@supabase/supabase-js";

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith("--"));
const indie = args.includes("--indie");
const dry = args.includes("--dry");
if (!file) {
  console.error("Usage: appening-import.mjs <radar-batch.json> [--indie] [--dry]");
  process.exit(1);
}
const OFF_REMIT = /\b(casino|slots?|betting|sportsbook|poker|roulette|blackjack|bingo|lottery|jackpot)\b/i;
const db = createClient(process.env.NEXT_PUBLIC_PORTAL_SUPABASE_URL, process.env.PORTAL_SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

const batch = JSON.parse(fs.readFileSync(file, "utf8"));
const pubs = (Array.isArray(batch) ? batch : Object.values(batch).find(Array.isArray) || []).filter((p) => p.track === "studio" || indie);

async function lookup(id) {
  for (const country of ["gb", "us"]) {
    const d = await fetch(`https://itunes.apple.com/lookup?id=${id}&country=${country}`).then((r) => r.json()).catch(() => null);
    const a = d?.results?.[0];
    if (a) return { a, country };
  }
  return null;
}

let added = 0, skipped = 0;
for (const p of pubs) {
  for (const app of p.apps || []) {
    const hit = await lookup(app.id);
    if (!hit) { skipped++; continue; }
    const { a, country } = hit;
    const genres = a.genres || [];
    if (OFF_REMIT.test(`${a.trackName} ${genres.join(" ")}`)) { skipped++; continue; }
    const isGame = a.primaryGenreName === "Games" || genres.includes("Games");
    const row = {
      origin: "found",
      edition: isGame ? "games" : "apps",
      store: "ios",
      store_id: String(app.id),
      store_url: `https://apps.apple.com/${country}/app/id${app.id}`,
      name: a.trackName,
      publisher: a.sellerName || a.artistName || p.seller || null,
      icon_url: a.artworkUrl512 || a.artworkUrl100 || null,
      genre: isGame ? genres.find((g) => g !== "Games") || "Games" : a.primaryGenreName || null,
      release_date: (a.releaseDate || app.released || "").slice(0, 10) || null,
      store_text: (a.description || "").slice(0, 4000) || null,
      screenshots: (a.screenshotUrls || []).slice(0, 6).map((s) => s.replace(/\/\d+x\d+bb\./, "/600x1300bb.")),
      website: a.sellerUrl || p.url || null,
      signal: p.track === "studio" ? `Studio launch${p.portfolio?.best ? ` (also made ${p.portfolio.best})` : ""}` : "Indie launch",
    };
    if (dry) { console.log(`[dry] ${row.edition} · ${row.name} · ${row.publisher} · ${row.signal}`); added++; continue; }
    const { data: existing } = await db.from("appening_entries").select("id").eq("store", "ios").eq("store_id", row.store_id).maybeSingle();
    if (existing) { skipped++; continue; }
    const { error } = await db.from("appening_entries").insert(row);
    if (error) { console.error(row.name, error.message); skipped++; } else { added++; console.log(`+ ${row.edition} · ${row.name} · ${row.publisher}`); }
  }
}
console.log(`\n${dry ? "Would add" : "Added"} ${added}, skipped ${skipped} (already in, not found, or off remit).`);
