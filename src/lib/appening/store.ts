/**
 * What's Appening: turn a store link into an entry (name, studio, icon,
 * genre, game or app, release date, screenshots). App Store uses Apple's
 * public lookup API; Google Play has no API, so we read the store page.
 */
export type Edition = "games" | "apps";
export type StoreApp = {
  store: "ios" | "android";
  storeId: string;
  storeUrl: string;
  name: string;
  publisher: string | null;
  iconUrl: string | null;
  genre: string | null;
  edition: Edition;
  releaseDate: string | null; // yyyy-mm-dd
  storeText: string | null;
  screenshots: string[];
  website: string | null;
};

/** Gambling, betting and casino titles are out of remit. */
export const OFF_REMIT = /\b(casino|slots?|betting|sportsbook|poker|roulette|blackjack|bingo|lottery|jackpot)\b/i;

export function parseStoreUrl(raw: string): { store: "ios" | "android"; id: string } | null {
  let u: URL;
  try {
    u = new URL(raw.trim());
  } catch {
    return null;
  }
  if (/(^|\.)apps\.apple\.com$|(^|\.)itunes\.apple\.com$/.test(u.hostname)) {
    const m = u.pathname.match(/id(\d{6,})/);
    return m ? { store: "ios", id: m[1] } : null;
  }
  if (u.hostname === "play.google.com") {
    const id = u.searchParams.get("id");
    return id && /^[\w.]+$/.test(id) ? { store: "android", id } : null;
  }
  return null;
}

export async function lookupStore(raw: string): Promise<StoreApp | null> {
  const p = parseStoreUrl(raw);
  if (!p) return null;
  try {
    return p.store === "ios" ? await lookupIos(p.id) : await lookupPlay(p.id);
  } catch (e) {
    console.error("appening lookup", raw, e);
    return null;
  }
}

async function lookupIos(id: string): Promise<StoreApp | null> {
  for (const country of ["gb", "us"]) {
    const r = await fetch(`https://itunes.apple.com/lookup?id=${id}&country=${country}`, { cache: "no-store" });
    const d = await r.json().catch(() => null);
    const a = d?.results?.[0];
    if (!a) continue;
    const genres: string[] = a.genres ?? [];
    return {
      store: "ios",
      storeId: id,
      storeUrl: `https://apps.apple.com/${country}/app/id${id}`,
      name: a.trackName,
      publisher: a.sellerName || a.artistName || null,
      iconUrl: a.artworkUrl512 || a.artworkUrl100 || null,
      genre: a.primaryGenreName === "Games" ? genres.find((g) => g !== "Games") || "Games" : a.primaryGenreName || null,
      edition: a.primaryGenreName === "Games" || genres.includes("Games") ? "games" : "apps",
      releaseDate: a.releaseDate ? String(a.releaseDate).slice(0, 10) : null,
      storeText: a.description ? String(a.description).slice(0, 4000) : null,
      screenshots: (a.screenshotUrls ?? []).slice(0, 6).map((s: string) => s.replace(/\/\d+x\d+bb\./, "/600x1300bb.")),
      website: a.sellerUrl || null,
    };
  }
  return null;
}

const unhtml = (s: string) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

async function lookupPlay(id: string): Promise<StoreApp | null> {
  const url = `https://play.google.com/store/apps/details?id=${encodeURIComponent(id)}&hl=en_GB&gl=GB`;
  const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible; MakersForge/1.0)" }, cache: "no-store" });
  if (!r.ok) return null;
  const html = await r.text();
  const meta = (p: string) => html.match(new RegExp(`<meta (?:property|name)="${p}" content="([^"]*)"`))?.[1];
  const title = meta("og:title")?.replace(/\s*[–-]\s*Apps on Google Play$/, "");
  if (!title) return null;
  const cats = [...html.matchAll(/href="\/store\/apps\/category\/([A-Z_]+)"/g)].map((m) => m[1]);
  const gameCat = cats.find((c) => c.startsWith("GAME"));
  const cat = gameCat || cats.find((c) => c !== "FAMILY") || null;
  const pretty = (c: string) => c.replace(/^GAME_/, "").toLowerCase().replace(/_/g, " ").replace(/^\w/, (x) => x.toUpperCase());
  const dev = html.match(/href="\/store\/apps\/dev(?:eloper)?\?id=[^"]*"><span>([^<]+)/)?.[1];
  const desc = meta("description") || meta("og:description");
  // Use the exact 2x size Play itself serves: Google's image server is unreliable with other size suffixes.
  const shots = [...html.matchAll(/<img[^>]+src="(https:\/\/play-lh\.googleusercontent\.com\/[^"=]+)=w(\d+)-h(\d+)[^"]*"[^>]*alt="Screenshot image"/g)].map((m) => `${m[1]}=w${+m[2] * 2}-h${+m[3] * 2}`);
  return {
    store: "android",
    storeId: id,
    storeUrl: `https://play.google.com/store/apps/details?id=${id}`,
    name: unhtml(title),
    publisher: dev ? unhtml(dev) : null,
    iconUrl: meta("og:image") || null,
    genre: cat ? pretty(cat) : null,
    edition: gameCat ? "games" : "apps",
    releaseDate: null,
    storeText: desc ? unhtml(desc).slice(0, 4000) : null,
    screenshots: [...new Set(shots)].slice(0, 6),
    website: null,
  };
}

/** Store art through Next's image optimiser (resized, cached, served from our domain). w must be one of Next's sizes. */
export const art = (url: string | null | undefined, w: 64 | 128 | 256 | 640 | 828 | 1080 = 640) =>
  url ? `/_next/image?url=${encodeURIComponent(url)}&w=${w}&q=75` : "";
