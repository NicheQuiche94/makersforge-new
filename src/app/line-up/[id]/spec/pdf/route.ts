import chromium from "@sparticuz/chromium-min";
import puppeteer from "puppeteer-core";
import { ROSTER } from "@/data/roster";
import { isCurrency } from "@/lib/currency";

/**
 * /line-up/[id]/spec/pdf?currency=GBP
 *
 * One-click PDF download of the talent spec for studios (2026-10-29).
 * Renders the spec page in headless Chrome with print CSS and streams
 * back a real A4 PDF (selectable text, not a screenshot). On Vercel it
 * uses @sparticuz/chromium-min, which downloads the Chromium pack below
 * on a cold start and caches it in /tmp (bundling the full package kept
 * losing its binaries). Locally it uses the installed Chrome (override
 * with CHROME_PATH). Keep CHROMIUM_PACK in step with the package version.
 */
export const runtime = "nodejs";
export const maxDuration = 60;

const CHROMIUM_PACK =
  "https://github.com/Sparticuz/chromium/releases/download/v153.0.0/chromium-v153.0.0-pack.x64.tar";

const LOCAL_CHROME =
  process.env.CHROME_PATH ??
  (process.platform === "win32"
    ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
    : process.platform === "darwin"
      ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
      : "/usr/bin/google-chrome");

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const profile = ROSTER.find((p) => p.id === id);
  if (!profile) return new Response("Profile not found", { status: 404 });

  const url = new URL(req.url);
  const asked = url.searchParams.get("currency");
  const currency = isCurrency(asked) ? asked : "GBP";
  const target = `${url.origin}/line-up/${id}/spec?currency=${currency}`;

  const onVercel = !!process.env.VERCEL;
  let browser;
  try {
    browser = await puppeteer.launch({
      args: onVercel ? chromium.args : ["--no-sandbox"],
      executablePath: onVercel ? await chromium.executablePath(CHROMIUM_PACK) : LOCAL_CHROME,
      headless: true,
    });
  } catch (err) {
    console.error("spec pdf: browser launch failed", err);
    // ?debug=1 shows the reason (no secrets in it); otherwise stay generic.
    const why = url.searchParams.has("debug") ? `: ${String(err)}` : "";
    return new Response(`PDF unavailable${why}`, { status: 500 });
  }

  try {
    const page = await browser.newPage();
    await page.emulateMediaType("print");
    await page.goto(target, { waitUntil: "networkidle0", timeout: 45_000 });
    await page.evaluate(() => document.fonts.ready);
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    });
    return new Response(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="MakersForge-${profile.codename.replace("·", "-")}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } finally {
    await browser.close();
  }
}
