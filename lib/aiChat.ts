/**
 * lib/aiChat.ts
 * AI Asistan istemci yardımcıları.
 * Tüm istekler same-origin proxy üzerinden gider:
 *   /api/kampanya/[slug]/ai-chat           → n8n /webhook/.../ai-chat
 *   /api/kampanya/[slug]/ai-chat-register  → n8n /webhook/.../ai-chat-register
 *
 * Backend: OpenAI GPT-4o mini + kampanya bağlamı (canlı veri).
 */

const PROXY_BASE = "/api/kampanya/demo-defne";
const API_URL = `${PROXY_BASE}/ai-chat`;
const REGISTER_URL = `${PROXY_BASE}/ai-chat-register`;

// ── Tipler ───────────────────────────────────────────────────────────────────

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
};

export type RegisteredUser = {
  ad: string;
  email?: string;
  telefon?: string;
  registeredAt: string;
};

export type ChatResponse = {
  /** AI'nın metin yanıtı. */
  message: string;
  /** Backend kayıt formu açılmasını istiyorsa true. */
  showRegisterForm?: boolean;
  /**
   * Form hangi konu için açıldı (örn. "bagis-dogrulama").
   * Form gönderilirken backend'e geri yollanır.
   */
  registerKonu?: string;
};

export type RegisterPayload = {
  ad: string;
  email?: string;
  telefon?: string;
  konu?: string;
};

// ── localStorage keys ────────────────────────────────────────────────────────

const SESSION_KEY = "ai_chat_session_demo";
const HISTORY_KEY = "ai_chat_history_demo";
const USER_KEY = "ai_chat_user_demo";

// ── Session ──────────────────────────────────────────────────────────────────

export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = "s_" + Math.random().toString(36).slice(2, 14);
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

// ── History ──────────────────────────────────────────────────────────────────

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

// ── Kayıtlı kullanıcı ────────────────────────────────────────────────────────

export function loadRegisteredUser(): RegisteredUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    const u = parsed as Record<string, unknown>;
    if (typeof u.ad !== "string" || !u.ad.trim()) return null;
    return {
      ad: u.ad,
      email: typeof u.email === "string" ? u.email : undefined,
      telefon: typeof u.telefon === "string" ? u.telefon : undefined,
      registeredAt:
        typeof u.registeredAt === "string"
          ? u.registeredAt
          : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function saveRegisteredUser(u: RegisteredUser): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(u));
  } catch {
    // sessizce göz ardı et
  }
}

// ── Reset ────────────────────────────────────────────────────────────────────

export function clearChat(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(HISTORY_KEY);
  // Not: kullanıcı kaydı saklanır — bir kez kayıt olduktan sonra tekrar
  // sorulmaz. Tamamen sıfırlamak için clearRegisteredUser() çağrılmalı.
}

export function clearRegisteredUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_KEY);
}

// ── API: chat ────────────────────────────────────────────────────────────────

export async function sendMessage(
  message: string,
  history: ChatMessage[],
): Promise<ChatResponse> {
  const sessionId = getSessionId();
  const user = loadRegisteredUser();

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
      isRegistered: Boolean(user),
      userAd: user?.ad ?? null,
    }),
  });

  if (!res.ok) {
    throw new Error("AI servisi şu an cevap veremiyor.");
  }

  const data = (await res.json().catch(() => null)) as
    | {
        message?: string;
        reply?: string;
        output?: string;
        showRegisterForm?: boolean;
        registerKonu?: string;
      }
    | null;

  return {
    message:
      data?.message ||
      data?.reply ||
      data?.output ||
      "Üzgünüm, cevap alınamadı.",
    showRegisterForm: Boolean(data?.showRegisterForm),
    registerKonu:
      typeof data?.registerKonu === "string" ? data.registerKonu : undefined,
  };
}

// ── API: register ────────────────────────────────────────────────────────────

export async function registerUser(payload: RegisterPayload): Promise<{
  ok: boolean;
  message?: string;
  error?: string;
}> {
  const sessionId = getSessionId();
  try {
    const res = await fetch(REGISTER_URL, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sessionId,
        ad: payload.ad.trim(),
        email: payload.email?.trim() || null,
        telefon: payload.telefon?.trim() || null,
        konu: payload.konu ?? null,
      }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return {
        ok: false,
        error: `HTTP ${res.status}${text ? ` — ${text.slice(0, 200)}` : ""}`,
      };
    }
    const data = (await res.json().catch(() => null)) as
      | { message?: string; ok?: boolean; success?: boolean }
      | null;
    if (data && data.success === false) {
      return { ok: false, error: data.message ?? "Kayıt başarısız oldu." };
    }
    return { ok: true, message: data?.message };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Bağlantı hatası.",
    };
  }
}
