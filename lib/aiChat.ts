/**
 * lib/aiChat.ts
 * AI Asistan istemci yardımcıları.
 * Tüm istekler same-origin proxy üzerinden gider:
 *   /api/kampanya/[slug]/ai-chat → n8n /webhook/kampanya/[slug]/ai-chat
 *
 * Backend: OpenAI GPT-4o mini + kampanya bağlamı (canlı veri).
 */

const PROXY_BASE = "/api/kampanya/demo-defne";
const API_URL = `${PROXY_BASE}/ai-chat`;

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
};

const SESSION_KEY = "ai_chat_session_demo";
const HISTORY_KEY = "ai_chat_history_demo";

export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = "s_" + Math.random().toString(36).slice(2, 14);
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function loadHistory(): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (m): m is ChatMessage =>
        typeof m === "object" &&
        m !== null &&
        "role" in m &&
        ((m as { role: unknown }).role === "user" ||
          (m as { role: unknown }).role === "assistant") &&
        "content" in m &&
        typeof (m as { content: unknown }).content === "string",
    );
  } catch {
    return [];
  }
}

export function saveHistory(history: ChatMessage[]): void {
  if (typeof window === "undefined") return;
  // Son 20 mesajı sakla
  const limited = history.slice(-20);
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(limited));
  } catch {
    // quota exceeded vs. — sessizce göz ardı et
  }
}

export function clearChat(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(HISTORY_KEY);
}

export async function sendMessage(
  message: string,
  history: ChatMessage[],
): Promise<string> {
  const sessionId = getSessionId();

  // Backend'e sadece son 10 mesajı yolla
  const apiHistory = history.slice(-10).map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const res = await fetch(API_URL, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      message,
      sessionId,
      history: apiHistory,
    }),
  });

  if (!res.ok) {
    throw new Error("AI servisi şu an cevap veremiyor.");
  }

  const data = (await res.json().catch(() => null)) as
    | { message?: string; reply?: string; output?: string }
    | null;
  return (
    data?.message ||
    data?.reply ||
    data?.output ||
    "Üzgünüm, cevap alınamadı."
  );
}
