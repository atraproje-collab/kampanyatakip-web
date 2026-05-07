/**
 * lib/canli-yayin.ts
 * TikTok yayın geliri için CRUD helper'ları.
 * Doğrudan n8n endpoint'ine gider (proxy yok). CORS sorunu çıkarsa
 * proxy'ye geri dönmek gerekebilir.
 */

const N8N_BASE = "https://n8n.srv1587680.hstgr.cloud/webhook/kampanya";
const DEFAULT_SLUG = "demo-defne";

// ── Types ────────────────────────────────────────────────────────────────────

export type TikTokIncome = {
  id: string;
  /** YYYY-MM-DD */
  tarih: string;
  yayin_suresi_dk: number;
  elmas_coin: number;
  tl_karsiligi: number;
  ekran_goruntusu_url: string;
  notlar: string;
};

export type TikTokIncomeInput = Omit<TikTokIncome, "id">;

// ── Helpers ──────────────────────────────────────────────────────────────────

function trimDate(raw: unknown): string {
  if (!raw) return "";
  const s = String(raw).trim();
  const match = s.match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : "";
}

function unwrapList(data: unknown): Record<string, unknown>[] {
  if (!data) return [];
  if (Array.isArray(data)) return data as Record<string, unknown>[];
  if (typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.data)) return obj.data as Record<string, unknown>[];
    if (Array.isArray(obj.items)) return obj.items as Record<string, unknown>[];
    if (Array.isArray(obj.result)) return obj.result as Record<string, unknown>[];
    if (Array.isArray(obj.rows)) return obj.rows as Record<string, unknown>[];
  }
  return [];
}

function parseRow(raw: Record<string, unknown>): TikTokIncome | null {
  const idRaw = raw.id ?? raw.kayit_id;
  if (idRaw === undefined || idRaw === null || idRaw === "") return null;
  return {
    id: String(idRaw),
    tarih: trimDate(raw.tarih ?? raw.date ?? raw.created_at),
    yayin_suresi_dk:
      Number(raw.yayin_suresi_dk ?? raw.yayinSuresiDk ?? raw.duration ?? 0) || 0,
    elmas_coin: Number(raw.elmas_coin ?? raw.elmasCoin ?? raw.coins ?? 0) || 0,
    tl_karsiligi:
      Number(raw.tl_karsiligi ?? raw.tlKarsiligi ?? raw.amount_try ?? 0) || 0,
    ekran_goruntusu_url: String(
      raw.ekran_goruntusu_url ?? raw.ekranGoruntusuUrl ?? raw.screenshot_url ?? "",
    ).trim(),
    notlar: String(raw.notlar ?? raw.notes ?? "").trim(),
  };
}

function toPayload(input: TikTokIncomeInput) {
  return {
    tarih: input.tarih,
    yayin_suresi_dk: Number(input.yayin_suresi_dk) || 0,
    elmas_coin: Number(input.elmas_coin) || 0,
    tl_karsiligi: Number(input.tl_karsiligi) || 0,
    ekran_goruntusu_url: input.ekran_goruntusu_url.trim(),
    notlar: input.notlar.trim(),
  };
}

// ── API ──────────────────────────────────────────────────────────────────────

const NO_CACHE_HEADERS = {
  Accept: "application/json",
  "Cache-Control": "no-cache",
  Pragma: "no-cache",
} as const;

const POST_HEADERS = {
  ...NO_CACHE_HEADERS,
  "Content-Type": "application/json",
} as const;

export async function fetchTikTokIncome(
  slug: string = DEFAULT_SLUG,
): Promise<{ ok: boolean; items: TikTokIncome[]; error?: string }> {
  try {
    const res = await fetch(
      `${N8N_BASE}/${slug}/canli-yayin-gelirleri?t=${Date.now()}`,
      { cache: "no-store", headers: NO_CACHE_HEADERS },
    );
    if (!res.ok) {
      return { ok: false, items: [], error: `HTTP ${res.status}` };
    }
    const data: unknown = await res.json();
    const items = unwrapList(data)
      .map(parseRow)
      .filter((r): r is TikTokIncome => r !== null)
      .sort((a, b) => (a.tarih < b.tarih ? 1 : -1)); // newest first
    return { ok: true, items };
  } catch (e) {
    return {
      ok: false,
      items: [],
      error: e instanceof Error ? e.message : "network error",
    };
  }
}

async function postJson(
  endpoint: string,
  body: unknown,
  slug: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${N8N_BASE}/${slug}/${endpoint}`, {
      method: "POST",
      cache: "no-store",
      headers: POST_HEADERS,
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      return {
        ok: false,
        error: `HTTP ${res.status}${errBody ? ` — ${errBody.slice(0, 200)}` : ""}`,
      };
    }
    // n8n yanıt formatı: { success: true, data: {...} } — body'i kontrol et.
    const data: unknown = await res.json().catch(() => null);
    if (data && typeof data === "object") {
      const obj = data as Record<string, unknown>;
      if (obj.success === false) {
        return {
          ok: false,
          error: String(obj.message ?? obj.error ?? "Sunucu hatası"),
        };
      }
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "network error" };
  }
}

export async function createTikTokIncome(
  input: TikTokIncomeInput,
  slug: string = DEFAULT_SLUG,
): Promise<{ ok: boolean; error?: string }> {
  return postJson("canli-yayin-ekle", toPayload(input), slug);
}

export async function deleteTikTokIncome(
  id: string,
  slug: string = DEFAULT_SLUG,
): Promise<{ ok: boolean; error?: string }> {
  return postJson("canli-yayin-sil", { id }, slug);
}

// ── İstatistik ───────────────────────────────────────────────────────────────

export function summarize(items: TikTokIncome[]) {
  const total = items.reduce((s, i) => s + (i.tl_karsiligi || 0), 0);
  const now = new Date();
  const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const thisMonth = items
    .filter((i) => i.tarih.startsWith(ym))
    .reduce((s, i) => s + (i.tl_karsiligi || 0), 0);
  return { total, thisMonth, count: items.length };
}
