"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  Loader2,
  MessageCircle,
  Send,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import {
  clearChat,
  loadHistory,
  loadRegisteredUser,
  registerUser,
  saveHistory,
  saveRegisteredUser,
  sendMessage,
  type ChatMessage,
  type RegisteredUser,
} from "@/lib/aiChat";

const QUICK_QUESTIONS = [
  "Defne kaç yaşında?",
  "Hangi hastalık?",
  "Bağış nasıl yapılır?",
  "Şu ana kadar kaç toplandı?",
];

const IDLE_TIMEOUT_MS = 60_000;

type PendingForm = { konu?: string } | null;

export default function AiChatWidget() {
  const [open, setOpen] = useState(false);
  // Lazy init: localStorage'dan oku. SSR'da loadHistory() zaten [] döner,
  // client hydrate olduktan sonra gerçek geçmişi alır.
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadHistory());
  const [user, setUser] = useState<RegisteredUser | null>(() =>
    loadRegisteredUser(),
  );
  const [pendingForm, setPendingForm] = useState<PendingForm>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Idle timeout: 60sn dokunulmazsa pencereyi kapat ───────────────────────

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => setOpen(false), IDLE_TIMEOUT_MS);
  }, []);

  useEffect(() => {
    if (!open) {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
      }
      return;
    }
    resetIdleTimer();
    return () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
      }
    };
  }, [open, resetIdleTimer]);

  // ── Mesaj geldiğinde aşağı kaydır ─────────────────────────────────────────

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, pendingForm]);

  // ── Widget açılınca input'a odak ──────────────────────────────────────────

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 200);
    return () => clearTimeout(t);
  }, [open]);

  // ── Açma/kapama ───────────────────────────────────────────────────────────

  function handleOpen() {
    setOpen(true);
    setHasUnread(false);
  }

  function handleClose() {
    setOpen(false);
  }

  // ── Mesaj gönderme ────────────────────────────────────────────────────────

  async function handleSend(textOverride?: string) {
    const text = (textOverride ?? input).trim();
    if (!text || loading) return;

    resetIdleTimer();

    const userMsg: ChatMessage = {
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await sendMessage(text, newMessages);
      const aiMsg: ChatMessage = {
        role: "assistant",
        content: res.message,
        timestamp: new Date().toISOString(),
      };
      const finalMessages = [...newMessages, aiMsg];
      setMessages(finalMessages);
      saveHistory(finalMessages);

      // Eğer backend form istiyorsa ve kullanıcı henüz kayıtlı değilse
      // inline formu aç.
      if (res.showRegisterForm && !user) {
        setPendingForm({ konu: res.registerKonu });
      }

      if (!open) setHasUnread(true);
    } catch {
      const errMsg: ChatMessage = {
        role: "assistant",
        content:
          "Üzgünüm, şu an cevap veremiyorum. Lütfen birazdan tekrar deneyin. 🙏",
        timestamp: new Date().toISOString(),
      };
      const finalMessages = [...newMessages, errMsg];
      setMessages(finalMessages);
      saveHistory(finalMessages);
    } finally {
      setLoading(false);
      resetIdleTimer();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  // ── Form kaydı ────────────────────────────────────────────────────────────

  async function handleRegister(payload: {
    ad: string;
    email: string;
    telefon: string;
  }) {
    resetIdleTimer();
    const result = await registerUser({
      ad: payload.ad,
      email: payload.email,
      telefon: payload.telefon,
      konu: pendingForm?.konu,
    });

    if (!result.ok) {
      const errMsg: ChatMessage = {
        role: "assistant",
        content:
          "Kayıt sırasında bir hata oluştu, lütfen birazdan tekrar deneyin.",
        timestamp: new Date().toISOString(),
      };
      const finalMessages = [...messages, errMsg];
      setMessages(finalMessages);
      saveHistory(finalMessages);
      return;
    }

    const newUser: RegisteredUser = {
      ad: payload.ad.trim(),
      email: payload.email.trim() || undefined,
      telefon: payload.telefon.trim() || undefined,
      registeredAt: new Date().toISOString(),
    };
    saveRegisteredUser(newUser);
    setUser(newUser);
    setPendingForm(null);

    const thanksMsg: ChatMessage = {
      role: "assistant",
      content: `Teşekkürler ${newUser.ad}! ✅ Bilgilerin kaydedildi, ekibimiz en kısa sürede dönüş yapacak.`,
      timestamp: new Date().toISOString(),
    };
    const finalMessages = [...messages, thanksMsg];
    setMessages(finalMessages);
    saveHistory(finalMessages);
    resetIdleTimer();
  }

  function handleDismissForm() {
    setPendingForm(null);
    resetIdleTimer();
  }

  // ── Sohbet temizleme ──────────────────────────────────────────────────────

  function handleClear() {
    if (
      typeof window !== "undefined" &&
      window.confirm("Sohbet geçmişini silmek istediğine emin misin?")
    ) {
      clearChat();
      setMessages([]);
      setPendingForm(null);
    }
  }

  // ── Etkileşim olduğunda idle timer reset ──────────────────────────────────

  function handlePanelInteraction() {
    if (open) resetIdleTimer();
  }

  // ── Render ────────────────────────────────────────────────────────────────

  const greetingName = user?.ad?.split(" ")[0] ?? null;

  return (
    <>
      {/* Floating buton */}
      {!open && (
        <button
          type="button"
          onClick={handleOpen}
          className="fixed bottom-6 right-6 z-50 group print:hidden"
          aria-label="AI Asistan'ı aç"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-4 rounded-full shadow-2xl transition-all transform hover:scale-110 flex items-center gap-2">
              <MessageCircle size={24} />
              <span className="hidden md:inline font-medium pr-1">Asistan</span>
            </div>
            {hasUnread && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            )}
          </div>
        </button>
      )}

      {/* Chat penceresi */}
      {open && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label="Yapay Zeka Asistanı"
          onMouseDown={handlePanelInteraction}
          onKeyDown={handlePanelInteraction}
          onTouchStart={handlePanelInteraction}
          className="fixed bottom-6 right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 h-[600px] max-h-[calc(100vh-3rem)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 print:hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="bg-white/20 backdrop-blur p-2 rounded-full shrink-0">
                <Sparkles size={18} />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold leading-tight truncate">
                  {greetingName
                    ? `Merhaba, ${greetingName} 👋`
                    : "Yapay Zeka Asistanı"}
                </h3>
                <p className="text-xs text-blue-100 truncate">
                  Defne hakkında sorularına cevap veriyor
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Sohbeti temizle"
                  title="Sohbeti temizle"
                >
                  <Trash2 size={16} />
                </button>
              )}
              <button
                type="button"
                onClick={handleClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Kapat"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Mesajlar */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50"
          >
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="text-white" size={28} />
                </div>
                <h4 className="font-semibold text-slate-800 mb-2">
                  {greetingName
                    ? `Tekrar hoş geldiniz, ${greetingName}! 👋`
                    : "Merhaba! 👋"}
                </h4>
                <p className="text-sm text-slate-600 mb-6">
                  Defne hakkında bilgi vermek için buradayım.
                  <br />
                  Bağış, tedavi süreci, kampanya durumu — sorabilirsiniz.
                </p>
                <div className="space-y-2">
                  <p className="text-xs text-slate-500 mb-2">Hızlı sorular:</p>
                  {QUICK_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => handleSend(q)}
                      className="block w-full text-left text-sm bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-700 px-3 py-2 rounded-lg transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap break-words ${
                    m.role === "user"
                      ? "bg-blue-600 text-white rounded-br-md"
                      : "bg-white text-slate-800 border border-slate-200 rounded-bl-md"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1">
                    <span
                      className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Inline kayıt formu */}
            {pendingForm && !user && (
              <InlineRegisterForm
                konu={pendingForm.konu}
                onSubmit={handleRegister}
                onDismiss={handleDismissForm}
                onInteract={resetIdleTimer}
              />
            )}
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-slate-200">
            <div className="flex gap-2 items-end">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  resetIdleTimer();
                }}
                onKeyDown={handleKeyDown}
                placeholder="Mesajınızı yazın…"
                disabled={loading}
                className="flex-1 px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100"
              />
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white p-2.5 rounded-xl transition-colors"
                aria-label="Gönder"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 text-center">
              Yapay zeka destekli asistan • Kişisel bilgi paylaşmayın
            </p>
          </div>
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Inline kayıt formu
// ─────────────────────────────────────────────────────────────────────────────

interface InlineRegisterFormProps {
  konu?: string;
  onSubmit: (payload: {
    ad: string;
    email: string;
    telefon: string;
  }) => Promise<void>;
  onDismiss: () => void;
  onInteract: () => void;
}

function InlineRegisterForm({
  konu,
  onSubmit,
  onDismiss,
  onInteract,
}: InlineRegisterFormProps) {
  const [ad, setAd] = useState("");
  const [email, setEmail] = useState("");
  const [telefon, setTelefon] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting || done) return;
    if (!ad.trim()) return;
    if (!email.trim() && !telefon.trim()) return; // en az biri

    setSubmitting(true);
    try {
      await onSubmit({ ad, email, telefon });
      setDone(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return null; // Teşekkür mesajı zaten messages listesine eklendi
  }

  const canSubmit =
    ad.trim().length > 0 && (email.trim().length > 0 || telefon.trim().length > 0);

  return (
    <form
      onSubmit={handleSubmit}
      onChange={onInteract}
      className="bg-white border border-blue-200 rounded-xl p-4 space-y-2.5 shadow-sm"
    >
      <div className="flex items-start gap-2">
        <div className="bg-blue-100 text-blue-700 rounded-full p-1.5 shrink-0">
          <CheckCircle2 size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-slate-800 leading-tight">
            Hızlı kayıt
          </p>
          <p className="text-[11.5px] text-slate-500 mt-0.5">
            {konu
              ? `Konu: ${konu}. Bilgilerinizi alalım, ekibimiz dönüş yapsın.`
              : "Bilgilerinizi alalım, ekibimiz dönüş yapsın."}
          </p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Kapat"
          className="text-slate-400 hover:text-slate-700 p-1 rounded"
        >
          <X size={14} />
        </button>
      </div>

      <input
        type="text"
        value={ad}
        onChange={(e) => setAd(e.target.value)}
        placeholder="Ad Soyad *"
        autoComplete="name"
        disabled={submitting}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="E-posta"
        autoComplete="email"
        disabled={submitting}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100"
      />
      <input
        type="tel"
        value={telefon}
        onChange={(e) => setTelefon(e.target.value)}
        placeholder="Telefon"
        autoComplete="tel"
        disabled={submitting}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100"
      />
      <p className="text-[10.5px] text-slate-400">
        E-posta veya telefondan en az biri gerekli.
      </p>

      <button
        type="submit"
        disabled={!canSubmit || submitting}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white py-2 rounded-lg text-[13px] font-semibold transition-colors flex items-center justify-center gap-2"
      >
        {submitting ? (
          <>
            <Loader2 size={14} className="animate-spin" /> Gönderiliyor…
          </>
        ) : (
          "Bilgilerimi Gönder"
        )}
      </button>
    </form>
  );
}
