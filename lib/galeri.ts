"use client";

// ── Types ────────────────────────────────────────────────────────────────────

export type GaleriTip = "galeri" | "hikaye" | string;

// ── Kategoriler ──────────────────────────────────────────────────────────────

export const GALERI_KATEGORILER = [
  { value: "aile", label: "Aile", emoji: "👨‍👩‍👧" },
  { value: "hastane", label: "Hastane / Tedavi", emoji: "🏥" },
  { value: "kampanya", label: "Kampanya", emoji: "💼" },
  { value: "basin", label: "Basın", emoji: "📰" },
  { value: "diger", label: "Diğer", emoji: "🌿" },
] as const;

export type GaleriKategoriValue = (typeof GALERI_KATEGORILER)[number]["value"];

/**
 * Backend her zaman bilinen bir kategori değeri dönmeyebilir; bilinmeyen
 * değerleri "Diğer"e düşür. Hiçbir kategori eşleşmezse son öğe (Diğer) döner.
 */
export function getKategoriLabel(value: string) {
  return (
    GALERI_KATEGORILER.find((k) => k.value === value) ??
    GALERI_KATEGORILER[GALERI_KATEGORILER.length - 1]
  );
}

export type GaleriItem = {
  id: number;
  fotoUrl: string;
  baslik: string;
  aciklama: string;
  tip: GaleriTip;
  /** "aile" | "hastane" | "kampanya" | "basin" | "diger". Boşsa "diger". */
  kategori: string;
  siralama: number;
  yuklenmeTarihi: string; // ISO, "" if missing
};

const DEFAULT_SLUG = "demo-defne";

// ── Parsing ─────────────────────────────────────────────────────────────────

type Row = Record<string, unknown>;

function unwrapList(data: unknown): Row[] {
  if (!data) return [];
  if (Array.isArray(data)) return data as Row[];
  if (typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.data)) return obj.data as Row[];
    if (Array.isArray(obj.items)) return obj.items as Row[];
    if (Array.isArray(obj.result)) return obj.result as Row[];
    if (Array.isArray(obj.galeri)) return obj.galeri as Row[];
    if (Array.isArray(obj.rows)) return obj.rows as Row[];
  }
  return [];
}

function pickString(row: Row, ...keys: string[]): string {
  for (const k of keys) {
    const v = row[k];
    if (typeof v === "string" && v.trim()) return v;
  }
  return "";
}

function pickNumber(row: Row, ...keys: string[]): number {
  for (const k of keys) {
    const v = row[k];
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string" && v.trim()) {
      const n = Number(v);
      if (Number.isFinite(n)) return n;
    }
  }
  return 0;
}

export function parseGaleriItem(raw: unknown): GaleriItem | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Row;
  const id = pickNumber(row, "id", "galeri_id");
  const fotoUrl = pickString(row, "foto_url", "fotoUrl", "url", "secure_url");
  if (!fotoUrl) return null;
  return {
    id,
    fotoUrl,
    baslik: pickString(row, "baslik", "title"),
    aciklama: pickString(row, "aciklama", "description"),
    tip: pickString(row, "tip", "type") || "galeri",
    kategori: pickString(row, "kategori", "category") || "diger",
    siralama: pickNumber(row, "siralama", "order", "sira"),
    yuklenmeTarihi: pickString(
      row,
      "yuklenme_tarihi",
      "yuklenmeTarihi",
      "created_at",
      "createdAt",
    ),
  };
}

// ── API ──────────────────────────────────────────────────────────────────────

export async function fetchGaleri(
  slug: string = DEFAULT_SLUG,
): Promise<{ ok: boolean; items: GaleriItem[]; error?: string }> {
  try {
    const res = await fetch(`/api/kampanya/${slug}/galeri?t=${Date.now()}`, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });
    if (!res.ok) {
      return { ok: false, items: [], error: `HTTP ${res.status}` };
    }
    const data: unknown = await res.json();
    const rows = unwrapList(data);
    const items = rows
      .map(parseGaleriItem)
      .filter((it): it is GaleriItem => it !== null)
      // siralama ASC, sonra id ASC
      .sort((a, b) => {
        if (a.siralama !== b.siralama) return a.siralama - b.siralama;
        return a.id - b.id;
      });
    return { ok: true, items };
  } catch (e) {
    return {
      ok: false,
      items: [],
      error: e instanceof Error ? e.message : "network error",
    };
  }
}

export type CreateGaleriPayload = {
  foto_url: string;
  baslik?: string;
  aciklama?: string;
  tip?: GaleriTip;
  kategori?: string;
  siralama?: number;
};

export async function createGaleriItem(
  payload: CreateGaleriPayload,
  slug: string = DEFAULT_SLUG,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(
      `/api/kampanya/${slug}/galeri-ekle?t=${Date.now()}`,
      {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      },
    );
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      return {
        ok: false,
        error: `HTTP ${res.status}${errText ? ` — ${errText.slice(0, 160)}` : ""}`,
      };
    }
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "network error",
    };
  }
}

export async function deleteGaleriItem(
  id: number,
  slug: string = DEFAULT_SLUG,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`/api/kampanya/${slug}/galeri-sil?t=${Date.now()}`, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      return {
        ok: false,
        error: `HTTP ${res.status}${errText ? ` — ${errText.slice(0, 160)}` : ""}`,
      };
    }
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "network error",
    };
  }
}

// ── Cloudinary upload widget loader ─────────────────────────────────────────

const CLOUDINARY_WIDGET_SRC = "https://upload-widget.cloudinary.com/global/all.js";

export type CloudinaryWidgetEvent =
  | "success"
  | "queues-end"
  | "close"
  | "abort"
  | "show"
  | "display-changed"
  | "source-changed"
  | "upload-added"
  | "publicid";

export type CloudinaryWidgetResult = {
  event?: CloudinaryWidgetEvent;
  info?: {
    secure_url?: string;
    public_id?: string;
    format?: string;
    bytes?: number;
    [k: string]: unknown;
  };
};

export type CloudinaryWidgetError = { message?: string } | null;

export type CloudinaryWidgetInstance = {
  open: () => void;
  close: () => void;
  destroy?: () => void;
};

declare global {
  interface Window {
    cloudinary?: {
      createUploadWidget: (
        config: Record<string, unknown>,
        callback: (
          error: CloudinaryWidgetError,
          result: CloudinaryWidgetResult | null,
        ) => void,
      ) => CloudinaryWidgetInstance;
    };
  }
}

let scriptLoadingPromise: Promise<void> | null = null;

export function loadCloudinaryWidget(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("ssr"));
  }
  if (window.cloudinary?.createUploadWidget) return Promise.resolve();
  if (scriptLoadingPromise) return scriptLoadingPromise;

  scriptLoadingPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-cld-widget="true"]',
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Cloudinary widget yüklenemedi")),
        { once: true },
      );
      return;
    }
    const s = document.createElement("script");
    s.src = CLOUDINARY_WIDGET_SRC;
    s.async = true;
    s.dataset.cldWidget = "true";
    s.onload = () => resolve();
    s.onerror = () => {
      scriptLoadingPromise = null;
      reject(new Error("Cloudinary widget yüklenemedi"));
    };
    document.head.appendChild(s);
  });

  return scriptLoadingPromise;
}

export const CLOUDINARY_GALERI_CONFIG = {
  cloudName: "dqyr5h96s",
  uploadPreset: "kampanyatakip",
  folder: "kampanyatakip/galeri",
  sources: ["local", "camera", "url"] as const,
  multiple: true,
  maxFiles: 10,
  language: "tr",
  text: {
    tr: {
      or: "veya",
      menu: { files: "Dosyalar", web: "URL", camera: "Kamera" },
      local: { browse: "Gözat", dd_title_single: "Buraya bırakın" },
      crop: { title: "Kırp", crop_btn: "Kırp", skip_btn: "Atla", reset_btn: "Sıfırla" },
    },
  },
  styles: {
    palette: {
      window: "#FFFFFF",
      sourceBg: "#F4F6F8",
      windowBorder: "#90A4AE",
      tabIcon: "#0F1B2A",
      inactiveTabIcon: "#586D7A",
      menuIcons: "#0F1B2A",
      link: "#00677F",
      action: "#00677F",
      inProgress: "#00677F",
      complete: "#10B981",
      error: "#EF4444",
      textDark: "#0F1B2A",
      textLight: "#FFFFFF",
    },
  },
};

// ── Helpers ─────────────────────────────────────────────────────────────────

export function nextSiralama(items: GaleriItem[]): number {
  if (items.length === 0) return 1;
  const max = items.reduce((m, it) => (it.siralama > m ? it.siralama : m), 0);
  return max + 1;
}
