/**
 * HTML → A4 PDF in headless Chrome, the same way the talent spec PDF is made
 * (see app/line-up/[id]/spec/pdf/route.ts): @sparticuz/chromium-min on
 * Vercel, the installed Chrome locally (override with CHROME_PATH).
 */
import chromium from "@sparticuz/chromium-min";
import puppeteer from "puppeteer-core";

const CHROMIUM_PACK = "https://github.com/Sparticuz/chromium/releases/download/v153.0.0/chromium-v153.0.0-pack.x64.tar";
const LOCAL_CHROME =
  process.env.CHROME_PATH ??
  (process.platform === "win32"
    ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
    : process.platform === "darwin"
      ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
      : "/usr/bin/google-chrome");

export async function htmlToPdf(html: string): Promise<Buffer> {
  const onVercel = !!process.env.VERCEL;
  const browser = await puppeteer.launch({
    args: onVercel ? chromium.args : ["--no-sandbox"],
    executablePath: onVercel ? await chromium.executablePath(CHROMIUM_PACK) : LOCAL_CHROME,
    headless: true,
  });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load" });
    const pdf = await page.pdf({ format: "A4", printBackground: true, margin: { top: "18mm", bottom: "18mm", left: "16mm", right: "16mm" } });
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}
