"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Sparkles, Trash2 } from "lucide-react";
import {
  sendMessage,
  loadHistory,
  saveHistory,
  clearChat,
  type ChatMessage,
} from "@/lib/aiChat";

const QUICK_QUESTIONS = [
  "Defne kaç yaşında?",
  "Hangi hastalık?",
  "Bağış nasıl yapılır?",
  "Şu ana kadar kaç toplandı?",
];

export default function AiChatWidget() {
  const [open, setOpen] = useState(false);
  // Lazy init: localStorage'dan oku. SSR'da loadHistory() zaten [] döner,
  // client hydrate olduktan sonra gerçek geçmişi alır. Görünür DOM ilk render'da
  // boş (sadece floating buton) olduğu için hydration mismatch oluşmaz.
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadHistory());
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mesaj geldiğinde aşağı kaydır
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Widget açılınca input'a odak (DOM yan etkisi)
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 200);
    return () => clearTimeout(t);
  }, [open]);

  function handleOpen() {
    setOpen(true);
    setHasUnread(false);
  }

  async function handleSend(textOverride?: string) {
    const text = (textOverride ?? input).trim();
    if (!text || loading) return;

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
      const reply = await sendMessage(text, newMessages);
      const aiMsg: ChatMessage = {
        role: "assistant",
        content: reply,
        timestamp: new Date().toISOString(),
      };
      const finalMessages = [...newMessages, aiMsg];
      setMessages(finalMessages);
      saveHistory(finalMessages);
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
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleClear() {
    if (
      typeof window !== "undefined" &&
      window.confirm("Sohbet geçmişini silmek istediğine emin misin?")
    ) {
      clearChat();
      setMessages([]);
    }
  }

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
          className="fixed bottom-6 right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 h-[600px] max-h-[calc(100vh-3rem)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 print:hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="bg-white/20 backdrop-blur p-2 rounded-full shrink-0">
                <Sparkles size={18} />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold leading-tight">Yapay Zeka Asistanı</h3>
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
                onClick={() => setOpen(false)}
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
                <h4 className="font-semibold text-slate-800 mb-2">Merhaba! 👋</h4>
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
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-slate-200">
            <div className="flex gap-2 items-end">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
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
