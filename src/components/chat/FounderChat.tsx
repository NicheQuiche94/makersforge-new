"use client";

/**
 * "Message Andre" founder chat (2026-11-04). Not a bot: messages go to
 * Andre's Telegram and his replies appear here (and by email if they've
 * gone). A random id in localStorage ties a visitor to their conversation.
 * Hidden on Andre's admin pages. Copy awaits Andre's sign-off.
 */
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import styles from "./FounderChat.module.css";

type Msg = { id: number; sender: "visitor" | "andre"; body: string; at: string };
const KEY = "mf-chat-id";
const HIDDEN = /^\/(admin|emails-preview|terms-preview)/;
/** Andre's photo for the button and the chat header (a public/ path), once he sends one. */
const PHOTO: string | null = "/images/andre-chat.jpg";

/** Andre answers 8am–8pm UK time. */
function online() {
  const h = Number(new Intl.DateTimeFormat("en-GB", { hour: "numeric", hourCycle: "h23", timeZone: "Europe/London" }).format(new Date()));
  return h >= 8 && h < 20;
}

// Re-checks the clock every minute; the server render assumes online.
const subscribe = (cb: () => void) => {
  const t = setInterval(cb, 60_000);
  return () => clearInterval(t);
};
const useOnline = () => useSyncExternalStore(subscribe, online, () => true);

function visitorId() {
  try {
    let id = localStorage.getItem(KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

export function FounderChat() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [hasEmail, setHasEmail] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  // Andre's replies the visitor has already seen (kept for this browser session).
  const [seen, setSeen] = useState(0);
  const isOnline = useOnline();
  const id = useRef<string>("");
  const list = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    if (!id.current) return;
    const d = await fetch(`/api/chat/thread?visitorId=${id.current}`)
      .then((r) => r.json())
      .catch(() => null);
    if (!d) return;
    setMsgs(d.messages);
    setHasEmail(!!d.hasEmail);
  }, []);

  useEffect(() => {
    const returning = (() => {
      try {
        return !!localStorage.getItem(KEY);
      } catch {
        return false;
      }
    })();
    id.current = visitorId();
    if (returning)
      load().then(() => {
        try {
          setSeen(Number(sessionStorage.getItem("mf-chat-seen") || 0));
        } catch {}
      });
  }, [load]);

  // Poll for Andre's replies: every 4s while open, every 30s while closed (if they've written).
  useEffect(() => {
    if (!msgs.length && !open) return;
    const t = setInterval(load, open ? 4000 : 30000);
    return () => clearInterval(t);
  }, [open, msgs.length, load]);

  const replies = msgs.filter((m) => m.sender === "andre").length;
  const unread = open ? 0 : Math.max(0, replies - seen);
  useEffect(() => {
    if (open) list.current?.scrollTo({ top: list.current.scrollHeight });
  }, [open, msgs]);
  const toggle = () => {
    if (!open) {
      setSeen(replies);
      try {
        sessionStorage.setItem("mf-chat-seen", String(replies));
      } catch {}
    }
    setOpen(!open);
  };

  if (HIDDEN.test(pathname || "")) return null;

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setBusy(true);
    setError("");
    const r = await fetch("/api/chat/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorId: id.current, text, name, email, page: window.location.pathname }),
    });
    const d = await r.json().catch(() => ({}));
    setBusy(false);
    if (!r.ok) return setError(d.error || "That didn't send. Please try again.");
    setText("");
    load();
  };

  const firstTime = msgs.length === 0;

  return (
    <div className={styles.root}>
      {open && (
        <section className={`card-shadow ${styles.panel}`} aria-label="Message Andre">
          <header className={styles.head}>
            <span className={styles.avatar} aria-hidden="true">
              {PHOTO ? <Image src={PHOTO} alt="" width={40} height={40} className={styles.photo} /> : "A"}
              <i className={isOnline ? styles.on : styles.off} />
            </span>
            <div>
              <strong>Message Andre</strong>
              <span>Founder of MakersForge. A real person, not a bot.</span>
            </div>
            <button type="button" className={styles.close} aria-label="Close" onClick={() => setOpen(false)}>
              ×
            </button>
          </header>

          <div className={styles.list} ref={list}>
            <p className={styles.andre}>
              {isOnline
                ? "Hi, Andre here (Founder) happy to help or answer Qs :)"
                : "Hi, Andre here (Founder). I'm offline right now, but leave a message and your email and I'll get back to you first thing :)"}
            </p>
            {msgs.map((m) => (
              <p key={m.id} className={m.sender === "andre" ? styles.andre : styles.me}>
                {m.body}
              </p>
            ))}
          </div>

          <form className={styles.form} onSubmit={send}>
            {firstTime && (
              <div className={styles.who}>
                <input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
                <input type="email" placeholder={isOnline ? "Email, in case you leave" : "Your email"} value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            )}
            {!firstTime && !hasEmail && (
              <input className={styles.full} type="email" placeholder="Add your email so I can reply if you leave" value={email} onChange={(e) => setEmail(e.target.value)} />
            )}
            <div className={styles.row}>
              <textarea
                rows={2}
                placeholder="Type your message…"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    e.currentTarget.form?.requestSubmit();
                  }
                }}
              />
              <button type="submit" disabled={busy || !text.trim() || (!isOnline && firstTime && !email)}>
                Send
              </button>
            </div>
            {error && <p className={styles.error}>{error}</p>}
          </form>
        </section>
      )}

      <button type="button" className={styles.bubble} onClick={toggle} aria-expanded={open}>
        <span className={styles.face} aria-hidden="true">
          {PHOTO ? <Image src={PHOTO} alt="" width={36} height={36} /> : "A"}
          <i className={styles.dot} data-on={isOnline} />
        </span>
        {open ? "Close" : "Message Andre"}
        {unread > 0 && !open && <span className={styles.badge}>{unread}</span>}
      </button>
    </div>
  );
}
