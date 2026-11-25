"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  Compass,
  MessageCircle,
  Send,
  Sparkles,
  X,
  MapPinned,
  HelpCircle,
  Route,
} from "lucide-react";

type Chip = { label: string; text: string };

const STARTER_CHIPS: Chip[] = [
  { label: "Plan Hunza trip", text: "Plan a 7-day Hunza trip from Islamabad" },
  { label: "Visa FAQ", text: "Do I need a visa to visit Pakistan?" },
  { label: "Best time to visit", text: "What is the best time to visit Pakistan?" },
  { label: "About Skardu", text: "Tell me about Skardu" },
  { label: "Emergency numbers", text: "What are the emergency numbers?" },
  { label: "Browse destinations", text: "Show popular destinations" },
];

function messageText(parts: { type: string; text?: string }[] | undefined) {
  if (!parts?.length) return "";
  return parts
    .filter((p) => p.type === "text" && p.text)
    .map((p) => p.text as string)
    .join("");
}

/** Match http(s) URLs and in-app paths like /map/3d-map */
const LINK_RE =
  /(https?:\/\/[^\s<>"')\]]+|\/(?:where-to-go|what-to-do|map|planning|booking|bookings|publications|trip|explore-pakistan|about|user|cabs|login|event)[^\s<>"'.,;:!?]*)/gi;

function isInternalPath(href: string) {
  return href.startsWith("/") && !href.startsWith("//");
}

function trimTrailingPunctuation(raw: string) {
  return raw.replace(/[.,;:!?)]+$/g, "");
}

function renderInline(
  text: string,
  keyPrefix: string,
  onNavigate?: () => void
): ReactNode[] {
  const nodes: ReactNode[] = [];
  // Split on bold / code first, then linkify plain segments.
  const tokenRe = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  const chunks = text.split(tokenRe);

  chunks.forEach((chunk, ci) => {
    if (!chunk) return;
    const key = `${keyPrefix}-${ci}`;

    if (chunk.startsWith("**") && chunk.endsWith("**")) {
      nodes.push(
        <strong key={key} className="font-semibold text-ink">
          {chunk.slice(2, -2)}
        </strong>
      );
      return;
    }

    if (chunk.startsWith("`") && chunk.endsWith("`")) {
      const code = chunk.slice(1, -1);
      if (isInternalPath(code) || /^https?:\/\//i.test(code)) {
        nodes.push(
          <ChatLink key={key} href={code} onNavigate={onNavigate}>
            {code}
          </ChatLink>
        );
      } else {
        nodes.push(
          <code
            key={key}
            className="rounded bg-cloud px-1 py-0.5 text-[12px]"
          >
            {code}
          </code>
        );
      }
      return;
    }

    let last = 0;
    const re = new RegExp(LINK_RE.source, LINK_RE.flags);
    let match: RegExpExecArray | null;
    while ((match = re.exec(chunk)) !== null) {
      const raw = match[0];
      const href = trimTrailingPunctuation(raw);
      const start = match.index;
      if (start > last) {
        nodes.push(chunk.slice(last, start));
      }
      nodes.push(
        <ChatLink key={`${key}-l${start}`} href={href} onNavigate={onNavigate}>
          {href}
        </ChatLink>
      );
      last = start + raw.length;
      // If we trimmed punctuation, keep it as plain text after the link.
      if (raw.length > href.length) {
        nodes.push(raw.slice(href.length));
        last = start + raw.length;
      }
    }
    if (last < chunk.length) nodes.push(chunk.slice(last));
  });

  return nodes;
}

function ChatLink({
  href,
  children,
  onNavigate,
}: {
  href: string;
  children: ReactNode;
  onNavigate?: () => void;
}) {
  const className =
    "font-medium text-brand underline decoration-brand/35 underline-offset-2 break-all hover:text-brand-dark";

  if (isInternalPath(href)) {
    return (
      <Link
        href={href}
        className={className}
        onClick={() => onNavigate?.()}
      >
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => onNavigate?.()}
    >
      {children}
    </a>
  );
}

function renderRichText(text: string, onNavigate?: () => void) {
  const blocks = text.split(/\n{2,}/);
  return blocks.map((block, bi) => {
    const lines = block.split("\n");
    return (
      <div key={bi} className="space-y-1.5">
        {lines.map((line, li) => (
          <p
            key={li}
            className="text-[13.5px] leading-relaxed text-ink/90 whitespace-pre-wrap"
          >
            {renderInline(line, `${bi}-${li}`, onNavigate)}
          </p>
        ))}
      </div>
    );
  });
}

const NUDGE_LINES = [
  "Need a trip plan?",
  "Ask me about Hunza…",
  "Visa or safety FAQs?",
  "I’m Rehbar — your AI guide",
];

export default function RehbarChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [noticed, setNoticed] = useState(false);
  const [nudgeIdx, setNudgeIdx] = useState(0);
  const [showNudge, setShowNudge] = useState(true);
  const scroller = useRef<HTMLDivElement>(null);
  const { messages, sendMessage, status, error, setMessages } = useChat();

  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, busy, open]);

  useEffect(() => {
    try {
      setNoticed(sessionStorage.getItem("rehbar-noticed") === "1");
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (open || noticed) {
      setShowNudge(false);
      return;
    }
    setShowNudge(true);
    const rotate = window.setInterval(() => {
      setNudgeIdx((i) => (i + 1) % NUDGE_LINES.length);
    }, 4200);
    return () => window.clearInterval(rotate);
  }, [open, noticed]);

  useEffect(() => {
    const openBot = () => {
      setOpen(true);
      markNoticed();
    };
    window.addEventListener("rehbar:open", openBot);
    window.addEventListener("karwan:open", openBot);
    if (window.location.hash === "#rehbar") openBot();
    const onHash = () => {
      if (window.location.hash === "#rehbar") openBot();
    };
    window.addEventListener("hashchange", onHash);
    return () => {
      window.removeEventListener("rehbar:open", openBot);
      window.removeEventListener("karwan:open", openBot);
      window.removeEventListener("hashchange", onHash);
    };
  }, []);

  function markNoticed() {
    setNoticed(true);
    setShowNudge(false);
    try {
      sessionStorage.setItem("rehbar-noticed", "1");
    } catch {
      /* ignore */
    }
  }

  function submit(text?: string) {
    const value = (text ?? input).trim();
    if (!value || busy) return;
    setInput("");
    void sendMessage({ text: value });
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[70] flex justify-end p-4 sm:p-5">
      <div className="pointer-events-auto flex flex-col items-end gap-3">
        {open && (
          <section
            className="flex h-[min(640px,78vh)] w-[min(420px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_24px_60px_-20px_rgba(6,19,42,0.45)]"
            aria-label="Rehbar AI trip planner"
          >
            <header className="relative overflow-hidden bg-gradient-to-br from-brand via-brand to-brand-dark px-4 py-3.5 text-white">
              <div
                className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/10"
                aria-hidden
              />
              <div className="relative flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/15 ring-1 ring-white/25">
                    <Compass className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-display text-[15px] font-semibold tracking-tight">
                      Rehbar
                    </p>
                    <p className="text-[11.5px] text-white/80">
                      AI trip planner · FAQs · 360 destinations
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-1.5 text-white/80 transition hover:bg-white/10 hover:text-white"
                  aria-label="Close Rehbar"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </header>

            <div
              ref={scroller}
              className="flex-1 space-y-3 overflow-y-auto bg-[linear-gradient(180deg,#f7faf9_0%,#ffffff_40%)] px-3.5 py-3.5"
            >
              {messages.length === 0 && (
                <div className="space-y-3 rounded-xl border border-brand/10 bg-white p-3.5 shadow-sm">
                  <p className="font-display text-sm font-semibold text-ink">
                    Assalamu-alaikum — where should we start?
                  </p>
                  <p className="text-[13px] leading-relaxed text-ink-soft">
                    I can build day-by-day itineraries and answer traveller
                    FAQs using Salam Pakistan&apos;s full destination catalogue.
                  </p>
                  <div className="grid grid-cols-3 gap-2 pt-1 text-center text-[11px] text-ink-soft">
                    <div className="rounded-lg bg-cloud px-2 py-2">
                      <Route className="mx-auto mb-1 h-3.5 w-3.5 text-brand" />
                      Itineraries
                    </div>
                    <div className="rounded-lg bg-cloud px-2 py-2">
                      <HelpCircle className="mx-auto mb-1 h-3.5 w-3.5 text-brand" />
                      FAQs
                    </div>
                    <div className="rounded-lg bg-cloud px-2 py-2">
                      <MapPinned className="mx-auto mb-1 h-3.5 w-3.5 text-brand" />
                      All regions
                    </div>
                  </div>
                </div>
              )}

              {messages.map((message) => {
                const text = messageText(message.parts);
                const isUser = message.role === "user";
                return (
                  <div
                    key={message.id}
                    className={[
                      "max-w-[92%] rounded-2xl px-3.5 py-2.5",
                      isUser
                        ? "ml-auto bg-brand text-white"
                        : "mr-auto border border-line bg-white text-ink shadow-sm",
                    ].join(" ")}
                  >
                    {isUser ? (
                      <p className="text-[13.5px] leading-relaxed whitespace-pre-wrap">
                        {text}
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {renderRichText(text, () => setOpen(false))}
                      </div>
                    )}
                  </div>
                );
              })}

              {busy && (
                <div className="mr-auto inline-flex items-center gap-2 rounded-2xl border border-line bg-white px-3.5 py-2.5 text-[12.5px] text-ink-soft shadow-sm">
                  <Sparkles className="h-3.5 w-3.5 animate-pulse text-brand" />
                  Rehbar is thinking…
                </div>
              )}

              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-[12.5px] text-red-700">
                  Connection hiccup — tap a suggestion or try again.
                </p>
              )}
            </div>

            <div className="border-t border-line bg-white px-3 py-2.5">
              <div className="no-scrollbar mb-2 flex gap-1.5 overflow-x-auto pb-0.5">
                {STARTER_CHIPS.map((chip) => (
                  <button
                    key={chip.label}
                    type="button"
                    disabled={busy}
                    onClick={() => submit(chip.text)}
                    className="shrink-0 rounded-full border border-brand/20 bg-brand/5 px-2.5 py-1 text-[11.5px] font-medium text-brand transition hover:bg-brand/10 disabled:opacity-50"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              <form
                className="flex items-end gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  submit();
                }}
              >
                <textarea
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      submit();
                    }
                  }}
                  placeholder="Ask about a trip, visa, or destination…"
                  className="max-h-28 min-h-[42px] flex-1 resize-none rounded-xl border border-line bg-cloud px-3 py-2.5 text-[13.5px] text-ink outline-none ring-brand/30 placeholder:text-ink-soft/70 focus:ring-2"
                />
                <button
                  type="submit"
                  disabled={busy || !input.trim()}
                  className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-xl bg-brand text-white transition hover:bg-brand-dark disabled:opacity-40"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>

              <div className="mt-2 flex items-center justify-between gap-2 text-[10.5px] text-ink-soft">
                <button
                  type="button"
                  className="hover:text-brand"
                  onClick={() => setMessages([])}
                >
                  Clear chat
                </button>
                <Link
                  href="/map/3d-map"
                  className="hover:text-brand"
                  onClick={() => setOpen(false)}
                >
                  Open 3D map
                </Link>
              </div>
            </div>
          </section>
        )}

        <div className="relative flex flex-col items-end gap-2">
          {!open && showNudge && (
            <div
              key={nudgeIdx}
              className="rehbar-nudge pointer-events-none mr-1 max-w-[220px] rounded-2xl rounded-br-md border border-brand/15 bg-white px-3 py-2 text-[12.5px] font-medium text-ink shadow-[0_12px_30px_-14px_rgba(6,19,42,0.45)]"
              role="status"
            >
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 shrink-0 text-brand" />
                {NUDGE_LINES[nudgeIdx]}
              </span>
            </div>
          )}

          {!open && !noticed && (
            <span
              className="rehbar-pulse pointer-events-none absolute -inset-1.5 rounded-full bg-brand/35"
              aria-hidden
            />
          )}

          <button
            type="button"
            onClick={() => {
              setOpen((v) => {
                const next = !v;
                if (next) markNoticed();
                return next;
              });
            }}
            className={[
              "rehbar-fab group relative inline-flex items-center gap-2 rounded-full px-4 py-3 font-display text-sm font-semibold text-white shadow-[0_14px_40px_-12px_rgba(15,122,107,0.75)] transition",
              open
                ? "bg-ink hover:bg-ink/90"
                : "bg-brand hover:bg-brand-dark",
              !open && !noticed ? "rehbar-fab--attention" : "",
            ].join(" ")}
            aria-expanded={open}
            aria-label={open ? "Close Rehbar" : "Open Rehbar AI assistant"}
          >
            {open ? (
              <X className="h-4.5 w-4.5" />
            ) : (
              <span className="relative grid place-items-center">
                <MessageCircle className="h-4.5 w-4.5" />
                <span className="rehbar-dot absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-amber-300 ring-2 ring-brand" />
              </span>
            )}
            <span>{open ? "Close" : "Ask Rehbar"}</span>
            {!open && (
              <span className="hidden rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium tracking-wide text-white/90 sm:inline">
                AI
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
