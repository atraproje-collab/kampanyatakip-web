/**
 * lib/banka-hesaplari.ts
 * Banka hesapları için CRUD helper'ları. Tüm istekler same-origin proxy
 * (/api/kampanya/[slug]/...) üzerinden gider — CORS bypass + cache kontrol.
 */

import type { CurrencyCode } from "./mock-campaign-data";

const DEFAULT_SLUG = "demo-defne";

// ── Types ────────────────────────────────────────────────────────────────────

export type BankAccount = {
  id: string;
  banka_adi: string;
  hesap_sahibi: string;
  para_birimi: CurrencyCode;
  iban: string;
  swift_bic: string;
  siralama: number;
};

/** Yeni kayıt için (id'siz) ya da düzenleme için (id'li) input. */
export type BankAccountInput = Omit<BankAccount, "id"> & { id?: string };

// ── Helpers ──────────────────────────────────────────────────────────────────

function parseCurrency(raw: unknown): CurrencyCode {
  const s = String(raw ?? "").toUpperCase().trim();
  if (s === "USD" || s === "EUR" || s === "TRY") return s;
  if (s === "TL") return "TRY";
  return "TRY";
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

function parseRow(raw: Record<string, unknown>): BankAccount | null {
  const idRaw = raw.id ?? raw.banka_id ?? raw.bankaId;
  if (idRaw === undefined || idRaw === null || idRaw === "") return null;
  return {
    id: String(idRaw),
    banka_adi: String(raw.banka_adi ?? raw.bankaAdi ?? raw.bank ?? "").trim(),
    hesap_sahibi: String(
      raw.hesap_sahibi ?? raw.hesapSahibi ?? raw.account_name ?? "",
    ).trim(),
    para_birimi: parseCurrency(raw.para_birimi ?? raw.paraBirimi ?? raw.currency),
    iban: String(raw.iban ?? "").trim(),
    swift_bic: String(raw.swift_bic ?? raw.swiftBic ?? raw.swift ?? "").trim(),
    siralama: Number(raw.siralama ?? raw.sira ?? raw.order ?? 0) || 0,
  };
}

function toPayload(input: BankAccountInput) {
  const base: Record<string, unknown> = {
    banka_adi: input.banka_adi.trim(),
    hesap_sahibi: input.hesap_sahibi.trim(),
    para_birimi: input.para_birimi,
    iban: input.iban.trim(),
    swift_bic: input.swift_bic.trim(),
    siralama: Number.isFinite(input.siralama) ? input.siralama : 0,
  };
  if (input.id) base.id = input.id;
  return base;
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

export async function fetchBankAccounts(
  slug: string = DEFAULT_SLUG,
): Promise<{ ok: boolean; items: BankAccount[]; error?: string }> {
  try {
    const res = await fetch(
      `/api/kampanya/${slug}/banka-hesaplari?t=${Date.now()}`,
      { cache: "no-store", headers: NO_CACHE_HEADERS },
    );
    if (!res.ok) {
      return { ok: false, items: [], error: `HTTP ${res.status}` };
    }
    const data: unknown = await res.json();
    const items = unwrapList(data)
      .map(parseRow)
      .filter((r): r is BankAccount => r !== null)
      .sort((a, b) => a.siralama - b.siralama || a.id.localeCompare(b.id));
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
): Promise<{ ok: boolean; data?: unknown; error?: string }> {
  try {
    const res = await fetch(`/api/kampanya/${slug}/${endpoint}?t=${Date.now()}`, {
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
    const data: unknown = await res.json().catch(() => null);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "network error" };
  }
}

export async function createBankAccount(
  input: BankAccountInput,
  slug: string = DEFAULT_SLUG,
): Promise<{ ok: boolean; error?: string }> {
  const { id: _omitId, ...rest } = input;
  void _omitId;
  return postJson("banka-hesaplari-kaydet", toPayload(rest), slug);
}

export async function updateBankAccount(
  input: BankAccountInput & { id: string },
  slug: string = DEFAULT_SLUG,
): Promise<{ ok: boolean; error?: string }> {
  return postJson("banka-hesaplari-guncelle", toPayload(input), slug);
}

export async function deleteBankAccount(
  id: string,
  slug: string = DEFAULT_SLUG,
): Promise<{ ok: boolean; error?: string }> {
  return postJson("banka-hesaplari-sil", { id }, slug);
}
