/**
 * Text from an uploaded job ad (Andre 2026-11-08: "people aren't going to
 * copy and paste when they could just drop a PDF"). PDFs via unpdf (no
 * native deps, runs on Vercel); .txt and .md as-is. Word files aren't read
 * yet: we ask for a PDF or the text instead.
 */
import { extractText, getDocumentProxy } from "unpdf";

export const MAX_FILE = 10 * 1024 * 1024;
export const MAX_TEXT = 40_000;

export async function readUpload(file: File): Promise<{ text: string } | { error: string }> {
  if (file.size > MAX_FILE) return { error: "That file is over 10MB." };
  const name = file.name.toLowerCase();
  const buf = new Uint8Array(await file.arrayBuffer());
  if (name.endsWith(".pdf") || file.type === "application/pdf") {
    try {
      const pdf = await getDocumentProxy(buf);
      const { text } = await extractText(pdf, { mergePages: true });
      const t = String(text).replace(/[ \t]+\n/g, "\n").trim();
      if (t.split(/\s+/).length < 40) return { error: "We couldn't read text in that PDF (it may be a scan). Paste the text instead." };
      return { text: t.slice(0, MAX_TEXT) };
    } catch {
      return { error: "We couldn't open that PDF. Paste the text instead." };
    }
  }
  if (/\.(txt|md)$/.test(name)) return { text: new TextDecoder().decode(buf).slice(0, MAX_TEXT) };
  if (/\.docx?$/.test(name)) return { error: "Save it as a PDF and drop that in, or paste the text." };
  return { error: "Drop in a PDF, or paste the text." };
}
