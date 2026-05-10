"use client";

// ── Types ────────────────────────────────────────────────────────────────────

export type IcerikContent = {
  heroBaslik: string;
  heroAltBaslik: string;
  hikayeMetni: string;
  doktorAlintisi: string;
  doktorAdi: string;
  doktorUnvan: string;
  coverUrl: string;
  guncellenmeTarihi: string; // ISO string, "" if missing
};

export const defaultIcerikContent: IcerikContent = {
  heroBaslik: "",
  heroAltBaslik: "",
  hikayeMetni: "",
  doktorAlintisi: "",
  doktorAdi: "",
  doktorUnvan: "",
  coverUrl: "",
  guncellenmeTarihi: "",
};

const DEFAULT_SLUG = "demo-defne";

// ── Limits (UI-side) ─────────────────────────────────────────────────────────

export const ICERIK_LIMITS = {
  heroBaslik: 100,
  heroAltBaslik: 150,
  hikayeMetni: 3000,
  doktorAlintisi: 600,
  doktorAdi: 80,
  doktorUnvan: 80,
} as const;

// ── Parsing ─────────────────────────────────────────────────────────────────

type Row = Record<string, unknown>;

function unwrapRow(data: unknown): Row | null {
  if (!data) return null;
  if (Array.isArray(data)) return (data[0] as Row) ?? null;
  if (typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.data)) return (obj.data[0] as Row) ?? null;
    if (Array.isArray(obj.items)) return (obj.items[0] as Row) ?? null;
    if (Array.isArray(obj.result)) return (obj.result[0] as Row) ?? null;
    if (obj.data && typeof obj.data === "object") return obj.data as Row;
    return obj as Row;
  }
  return null;
}

function pickString(row: Row, ...keys: string[]): string {
  for (const k of keys) {
    const v = row[k];
    if (typeof v === "string" && v.trim()) return v;
  }
  return "";
}

export function apiToIcerik(raw: unknown): IcerikContent {
  const row = unwrapRow(raw);
  if (!row) return defaultIcerikContent;
  return {
    heroBaslik: pickString(row, "hero_baslik", "heroBaslik", "title", "hero_title"),
    heroAltBaslik: pickString(
      row,
      "hero_alt_baslik",
      "heroAltBaslik",
      "subtitle",
      "hero_subtitle",
    ),
    hikayeMetni: pickString(row, "hikaye_metni", "hikayeMetni", "story", "story_text"),
    doktorAlintisi: pickString(
      row,
      "doktor_alintisi",
      "doktorAlintisi",
      "doctor_quote",
      "alinti",
    ),
    doktorAdi: pickString(row, "doktor_adi", "doktorAdi", "doctor_name"),
    doktorUnvan: pickString(row, "doktor_unvan", "doktorUnvan", "doctor_title"),
    coverUrl: pickString(row, "cover_url", "coverUrl", "kapak_url", "cover"),
    guncellenmeTarihi: pickString(
      row,
      "guncellenme_tarihi",
      "guncellenmeTarihi",
      "updated_at",
      "updatedAt",
    ),
  };
}

export function icerikToApiPayload(c: IcerikContent) {
  return {
    hero_baslik: c.heroBaslik,
    hero_alt_baslik: c.heroAltBaslik,
    hikaye_metni: c.hikayeMetni,
    doktor_alintisi: c.doktorAlintisi,
    doktor_adi: c.doktorAdi,
    doktor_unvan: c.doktorUnvan,
    cover_url: c.coverUrl,
  };
}

// ── API ──────────────────────────────────────────────────────────────────────

export async function fetchIcerik(
  slug: string = DEFAULT_SLUG,
): Promise<{ ok: boolean; content: IcerikContent; error?: string }> {
  try {
    const res = await fetch(`/api/kampanya/${slug}/icerik?t=${Date.now()}`, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });
    if (!res.ok) {
      return {
        ok: false,
        content: defaultIcerikContent,
        error: `HTTP ${res.status}`,
      };
    }
    const data: unknown = await res.json();
    return { ok: true, content: apiToIcerik(data) };
  } catch (e) {
    return {
      ok: false,
      content: defaultIcerikContent,
      error: e instanceof Error ? e.message : "network error",
    };
  }
}

export async function saveIcerik(
  content: IcerikContent,
  slug: string = DEFAULT_SLUG,
): Promise<{ ok: boolean; content: IcerikContent; error?: string }> {
  try {
    const res = await fetch(`/api/kampanya/${slug}/icerik?t=${Date.now()}`, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
      body: JSON.stringify(icerikToApiPayload(content)),
    });
    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      return {
        ok: false,
        content,
        error: `HTTP ${res.status}${errBody ? ` — ${errBody.slice(0, 200)}` : ""}`,
      };
    }

    const data: unknown = await res.json().catch(() => null);

    // success: true / { data: {...} } / direkt row dönüşü destekli.
    let returned = content;
    if (data && typeof data === "object") {
      const obj = data as Record<string, unknown>;
      const payloadOut = (obj.data ?? obj.row ?? obj) as unknown;
      const looksLikeRow =
        payloadOut &&
        typeof payloadOut === "object" &&
        ("hero_baslik" in (payloadOut as object) ||
          "hikaye_metni" in (payloadOut as object) ||
          "cover_url" in (payloadOut as object));
      if (looksLikeRow) returned = apiToIcerik(payloadOut);
    }
    return { ok: true, content: returned };
  } catch (e) {
    return {
      ok: false,
      content,
      error: e instanceof Error ? e.message : "network error",
    };
  }
}

// ── Cloudinary upload ───────────────────────────────────────────────────────

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dqyr5h96s/image/upload";
const CLOUDINARY_PRESET = "kampanyatakip";

export async function uploadCoverToCloudinary(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", CLOUDINARY_PRESET);
  fd.append("folder", "kampanyatakip/kapak");
  const res = await fetch(CLOUDINARY_URL, { method: "POST", body: fd });
  if (!res.ok) {
    throw new Error(`Cloudinary yükleme başarısız (${res.status})`);
  }
  const data = (await res.json()) as { secure_url?: string };
  if (!data.secure_url) {
    throw new Error("Cloudinary yanıtı geçersiz (secure_url yok)");
  }
  return data.secure_url;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

export function formatRelativeTr(iso: string): string {
  if (!iso) return "—";
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t) || t === 0) return "—";
  const diffSec = Math.max(0, Math.floor((Date.now() - t) / 1000));
  if (diffSec < 60) return "az önce";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} dakika önce`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} saat önce`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay} gün önce`;
  const d = new Date(t);
  return d.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function contentEquals(a: IcerikContent, b: IcerikContent): boolean {
  return (
    a.heroBaslik === b.heroBaslik &&
    a.heroAltBaslik === b.heroAltBaslik &&
    a.hikayeMetni === b.hikayeMetni &&
    a.doktorAlintisi === b.doktorAlintisi &&
    a.doktorAdi === b.doktorAdi &&
    a.doktorUnvan === b.doktorUnvan &&
    a.coverUrl === b.coverUrl
  );
}
