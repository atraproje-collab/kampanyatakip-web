"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, MessageCircle, Send, X } from "lucide-react";

// ── Tipler ──────────────────────────────────────────────────────────────────

type ChatMessage = {
  role: "user" | "bot";
  text: string;
  ts: number;
};

const WELCOME: ChatMessage = {
  role: "bot",
  text: "Merhaba! KAMPANYATAKİP hakkında sorularınızı yanıtlıyorum. Nasıl yardımcı olabilirim?",
  ts: 0,
};

// Renkler (sitenin paletinden)
const BRAND_BLUE = "#1E3A8A";
const BRAND_GREEN = "#10b981";

// ── Component ───────────────────────────────────────────────────────────────

export default function AnaSayfaChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // Session ID — ilk gönderimde lazy oluşturulur, sayfa süresince sabit kalır.
  // Ref kullanıyoruz ki SSR/hydration mismatch'i olmasın ve effect tetiklemesin.
  const sessionIdRef = useRef<string>("");

  function getSessionId(): string {
    if (!sessionIdRef.current) {
      sessionIdRef.current = `s_${Math.random().toString(36).slice(2, 10)}${Math.random()
        .toString(36)
        .slice(2, 8)}`;
    }
    return sessionIdRef.current;
  }

  // Auto-scroll mesaj listesinin sonuna
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Widget açılınca input'a odak
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 200);
    return () => window.clearTimeout(t);
  }, [open]);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = { role: "user", text, ts: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/anasayfa-chat", {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ message: text, sessionId: getSessionId() }),
      });

      const data = (await res.json().catch(() => null)) as
        | { reply?: string; message?: string; success?: boolean }
        | null;

      const reply =
        data?.reply ||
        data?.message ||
        "Üzgünüm, şu an cevap veremiyorum. Lütfen birazdan tekrar deneyin.";

      setMessages((prev) => [
        ...prev,
        { role: "bot", text: reply, ts: Date.now() },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Bağlantı hatası. Lütfen birazdan tekrar deneyin. 🙏",
          ts: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <>
      {/* Floating buton (kapalı) */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="KAMPANYATAKİP Asistanı'nı aç"
          className="fixed bottom-4 right-4 z-50 w-14 h-14 rounded-full text-white shadow-2xl hover:scale-110 active:scale-100 transition-transform flex items-center justify-center print:hidden"
          style={{ backgroundColor: BRAND_BLUE }}
        >
          <MessageCircle className="w-6 h-6" />
          {/* online noktası */}
          <span
            className="absolute top-1 right-1 w-3 h-3 rounded-full border-2 border-white"
            style={{ backgroundColor: BRAND_GREEN }}
            aria-hidden
          />
        </button>
      )}

      {/* Açık panel */}
      {open && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label="KAMPANYATAKİP Asistanı"
          className="fixed bottom-4 right-4 z-50 w-[calc(100vw-2rem)] sm:w-[380px] h-[500px] max-h-[calc(100vh-2rem)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 print:hidden"
        >
          {/* Header */}
          <div
            className="px-4 py-3 text-white flex items-center justify-between"
            style={{ backgroundColor: BRAND_BLUE }}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-[15px] leading-tight truncate">
                  KAMPANYATAKİP Asistanı
                </h3>
                <p className="text-[11.5px] text-white/85 flex items-center gap-1.5">
                  <span
                    className="inline-block w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: BRAND_GREEN }}
                  />
                  Çevrimiçi
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Kapat"
              className="p-1.5 rounded-lg hover:bg-white/15 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mesaj listesi */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-slate-50"
          >
            {messages.map((m, i) => (
              <Bubble key={i} message={m} />
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 px-3.5 py-2.5 rounded-2xl rounded-bl-sm shadow-sm">
                  <div className="flex gap-1">
                    <span
                      className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-2.5 bg-white border-t border-slate-200">
            <div className="flex gap-2 items-center">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                placeholder="Mesajınızı yazın…"
                className="flex-1 px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent disabled:bg-slate-100"
                style={
                  {
                    "--tw-ring-color": BRAND_BLUE,
                  } as React.CSSProperties
                }
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={!input.trim() || loading}
                aria-label="Gönder"
                className="w-10 h-10 rounded-xl text-white flex items-center justify-center disabled:bg-slate-300 disabled:cursor-not-allowed hover:opacity-90 transition-opacity shrink-0"
                style={{
                  backgroundColor:
                    !input.trim() || loading ? undefined : BRAND_BLUE,
                }}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5 text-center">
              Yapay zeka destekli • Kişisel bilgi paylaşmayın
            </p>
          </div>
        </div>
      )}
    </>
  );
}

// ── Mesaj baloncuğu ─────────────────────────────────────────────────────────

function Bubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] px-3.5 py-2 text-sm whitespace-pre-wrap break-words shadow-sm ${
          isUser
            ? "text-white rounded-2xl rounded-br-sm"
            : "bg-white text-slate-800 border border-slate-200 rounded-2xl rounded-bl-sm"
        }`}
        style={isUser ? { backgroundColor: BRAND_BLUE } : undefined}
      >
        {message.text}
      </div>
    </div>
  );
}
