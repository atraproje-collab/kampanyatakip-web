"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Calendar,
  Camera,
  FileText,
  Image as ImageIcon,
  Loader2,
  Pencil,
  Plus,
  Receipt,
  Tag,
  Trash2,
  TrendingDown,
  Wallet,
  X,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/Button";
import {
  FormField,
  Modal,
  formatCurrency,
  inputClass,
} from "@/components/admin/AdminUI";

// ── Types ───────────────────────────────────────────────────────────────────

type Currency = "TRY" | "USD" | "EUR";

const KATEGORI_OPTIONS = [
  "Sağlık (İlaç, Tedavi, Hastane)",
  "Ulaşım",
  "Konaklama",
  "Yemek",
  "Hukuki Danışmanlık",
  "Tanıtım/Reklam",
  "Diğer",
] as const;

type Kategori = (typeof KATEGORI_OPTIONS)[number];

type Gider = {
  id: string;
  date: string;          // ISO yyyy-mm-dd
  kategori: string;      // dışarıdan başka değer de gelebilir
  vendor: string;
  description: string;
  amount: number;
  currency: Currency;
  belge?: string;        // Cloudinary URL
};

type DateFilter = "bugun" | "hafta" | "ay" | "tum";

// ── API & Cloudinary ────────────────────────────────────────────────────────

const PROXY_BASE = "/api/kampanya/demo-defne";
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dqyr5h96s/image/upload";
const CLOUDINARY_PRESET = "kampanyatakip";

async function uploadToCloudinary(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", CLOUDINARY_PRESET);
  const res = await fetch(CLOUDINARY_URL, { method: "POST", body: fd });
  if (!res.ok) throw new Error(`Cloudinary yükleme başarısız (${res.status})`);
  const data = (await res.json()) as { secure_url?: string };
  if (!data.secure_url) throw new Error("Cloudinary yanıtı geçersiz");
  return data.secure_url;
}

// ── Date helpers ────────────────────────────────────────────────────────────

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Türkçe tarih: "04.05.2026" — UTC kayma olmadan. */
function formatTrDate(input: string | null | undefined): string {
  if (!input) return "—";
  const trimmed = input.trim();
  if (!trimmed || trimmed === "—") return "—";
  const match = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const [, y, m, d] = match;
    return `${d}.${m}.${y}`;
  }
  if (/^\d{2}\.\d{2}\.\d{4}$/.test(trimmed)) return trimmed;
  const dt = new Date(trimmed);
  if (!Number.isNaN(dt.getTime())) {
    const dd = String(dt.getDate()).padStart(2, "0");
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const yy = dt.getFullYear();
    return `${dd}.${mm}.${yy}`;
  }
  return trimmed;
}

function inRange(dateStr: string, range: DateFilter): boolean {
  if (range === "tum") return true;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return false;
  const now = new Date();
  let start: Date;
  if (range === "bugun") {
    start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  } else if (range === "hafta") {
    start = new Date(now);
    start.setDate(start.getDate() - 7);
  } else {
    // "ay"
    start = new Date(now);
    start.setMonth(start.getMonth() - 1);
  }
  return d >= start;
}

function isThisMonth(dateStr: string): boolean {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return false;
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
}

// ── Parsing ─────────────────────────────────────────────────────────────────

type RawRow = Record<string, unknown>;

function parseCurrency(raw: unknown): Currency {
  if (typeof raw === "string") {
    const s = raw.trim().toUpperCase();
    if (s === "USD" || s === "EUR" || s === "TRY") return s;
    if (s === "TL") return "TRY";
  }
  return "TRY";
}

function parseGider(raw: RawRow): Gider | null {
  const id = String(
    raw.id ?? raw.gider_id ?? raw.no ?? "",
  ).trim();
  const dateRaw = String(raw.tarih ?? raw.date ?? "").trim();
  if (!id || !dateRaw) return null;
  // ISO kısa biçimini koru — başka her şeyi normalize et
  const dateMatch = dateRaw.match(/^(\d{4}-\d{2}-\d{2})/);
  const date = dateMatch ? dateMatch[1] : dateRaw;
  const kategori = String(raw.kategori ?? raw.category ?? "Diğer").trim();
  const vendor = String(raw.satici ?? raw.vendor ?? raw.firma ?? "").trim();
  const description = String(raw.aciklama ?? raw.description ?? "").trim();
  const amount = Number(raw.tutar ?? raw.amount ?? 0) || 0;
  const currency = parseCurrency(raw.para_birimi ?? raw.currency);
  let belge: string | undefined;
  const belgeRaw =
    raw.belge_url ?? raw.belge ?? raw.fatura_foto ?? raw.foto_url ?? null;
  if (typeof belgeRaw === "string" && belgeRaw.trim()) {
    belge = belgeRaw.trim();
  }
  return { id, date, kategori, vendor, description, amount, currency, belge };
}

function unwrapArray(data: unknown, key?: string): unknown[] {
  let arr: unknown = data;
  if (data && typeof data === "object" && !Array.isArray(data)) {
    const obj = data as Record<string, unknown>;
    if (key && Array.isArray(obj[key])) arr = obj[key];
    else if (Array.isArray(obj.data)) arr = obj.data;
    else if (Array.isArray(obj.items)) arr = obj.items;
    else if (Array.isArray(obj.result)) arr = obj.result;
    else if (Array.isArray(obj.rows)) arr = obj.rows;
    else if (Array.isArray(obj.giderler)) arr = obj.giderler;
  }
  if (!Array.isArray(arr)) arr = [arr];
  return arr as unknown[];
}

// ── Fetchers ────────────────────────────────────────────────────────────────

type FetchResult = { items: Gider[]; ok: boolean; reason?: string };

async function fetchGiderler(): Promise<FetchResult> {
  try {
    const res = await fetch(`${PROXY_BASE}/giderler-listesi`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      // eslint-disable-next-line no-console
      console.warn(`[giderler] API ${res.status}`);
      return { items: [], ok: false, reason: `HTTP ${res.status}` };
    }
    const data: unknown = await res.json();
    const arr = unwrapArray(data, "giderler");
    const items = (arr as RawRow[])
      .map(parseGider)
      .filter((g): g is Gider => g !== null);
    return { items, ok: true };
  } catch (e) {
    return {
      items: [],
      ok: false,
      reason: e instanceof Error ? e.message : "network error",
    };
  }
}

type PostResult =
  | { ok: true; data?: unknown }
  | { ok: false; status: number; message: string; raw?: unknown };

function extractErrorMessage(raw: unknown, fallback: string): string {
  if (typeof raw === "string" && raw.trim()) return raw.trim();
  if (raw && typeof raw === "object") {
    const obj = raw as Record<string, unknown>;
    for (const key of ["message", "error", "reason", "detail", "hint"] as const) {
      const v = obj[key];
      if (typeof v === "string" && v.trim()) return v.trim();
    }
    const nested = obj.error;
    if (nested && typeof nested === "object") {
      const nestedMsg = (nested as Record<string, unknown>).message;
      if (typeof nestedMsg === "string" && nestedMsg.trim())
        return nestedMsg.trim();
    }
  }
  return fallback;
}

async function postJson(path: string, body: unknown): Promise<PostResult> {
  try {
    const res = await fetch(`${PROXY_BASE}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });
    const contentType = res.headers.get("content-type") ?? "";
    let raw: unknown = null;
    try {
      if (contentType.includes("application/json")) raw = await res.json();
      else {
        const text = await res.text();
        raw = text || null;
      }
    } catch {
      // ignore
    }
    if (!res.ok) {
      const fallback = `HTTP ${res.status} ${res.statusText || "Hata"}`.trim();
      const message = extractErrorMessage(raw, fallback);
      // eslint-disable-next-line no-console
      console.error(`[postJson] ${path} failed:`, {
        status: res.status,
        body: raw,
        sentBody: body,
      });
      return { ok: false, status: res.status, message, raw };
    }
    return { ok: true, data: raw };
  } catch (e) {
    return {
      ok: false,
      status: 0,
      message: e instanceof Error ? e.message : "Ağ hatası",
    };
  }
}

// ── Mock fallback ───────────────────────────────────────────────────────────

function mockFallback(): Gider[] {
  return [
    {
      id: "G-1001",
      date: "2026-04-22",
      kategori: "Sağlık (İlaç, Tedavi, Hastane)",
      vendor: "Acıbadem Hastanesi",
      description: "Tedavi ön kontrol ücreti",
      amount: 12500,
      currency: "TRY",
    },
    {
      id: "G-1002",
      date: "2026-04-18",
      kategori: "Ulaşım",
      vendor: "Türk Hava Yolları",
      description: "Hasta nakli uçak biletleri",
      amount: 8400,
      currency: "TRY",
    },
    {
      id: "G-1003",
      date: "2026-04-15",
      kategori: "Konaklama",
      vendor: "Wyndham Otel",
      description: "Refakatçi konaklama 3 gece",
      amount: 4200,
      currency: "TRY",
    },
  ];
}

// ── Page component ──────────────────────────────────────────────────────────

export default function GiderlerPage() {
  const [items, setItems] = useState<Gider[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  // Filters
  const [dateFilter, setDateFilter] = useState<DateFilter>("tum");
  const [categoryFilter, setCategoryFilter] = useState<string>("__all__");

  // Add/Edit modal
  const [editTarget, setEditTarget] = useState<Gider | "new" | null>(null);
  const [formDate, setFormDate] = useState(todayIso());
  const [formKategori, setFormKategori] = useState<string>(KATEGORI_OPTIONS[0]);
  const [formVendor, setFormVendor] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const [formCurrency, setFormCurrency] = useState<Currency>("TRY");
  const [formDescription, setFormDescription] = useState("");
  const [formFile, setFormFile] = useState<File | null>(null);
  const [keepExistingBelge, setKeepExistingBelge] = useState<string | undefined>();
  const [savingForm, setSavingForm] = useState(false);

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState<Gider | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ── Initial fetch ─────────────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;
    (async () => {
      const result = await fetchGiderler();
      if (!mounted) return;
      if (result.ok) {
        setItems(result.items);
        setApiError(null);
      } else {
        setItems(mockFallback());
        setApiError(result.reason ?? "API'ye ulaşılamadı");
      }
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const refresh = async () => {
    const fresh = await fetchGiderler();
    if (fresh.ok) {
      setItems(fresh.items);
      setApiError(null);
    } else {
      setApiError(fresh.reason ?? "API'ye ulaşılamadı");
    }
  };

  // ── Derived ───────────────────────────────────────────────────────────────

  // Tüm tutar TRY varsayımıyla toplanıyor — MVP: tek para birimi göstergesi.
  // (USD/EUR ile karışık veri varsa, kart bunu ayrı satır olarak gösterebilir
  // — ileride iyileştirilecek.)
  const totalAll = items
    .filter((g) => g.currency === "TRY")
    .reduce((s, g) => s + g.amount, 0);
  const totalThisMonth = items
    .filter((g) => g.currency === "TRY" && isThisMonth(g.date))
    .reduce((s, g) => s + g.amount, 0);
  const count = items.length;

  // Kategoriler: kayıtlardan üretilen unique liste (filtre dropdown'u için)
  const usedCategories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((g) => {
      if (g.kategori) set.add(g.kategori);
    });
    return Array.from(set).sort();
  }, [items]);

  const visible = useMemo(() => {
    return items
      .filter((g) => inRange(g.date, dateFilter))
      .filter((g) =>
        categoryFilter === "__all__" ? true : g.kategori === categoryFilter,
      )
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [items, dateFilter, categoryFilter]);

  // Belge kuralı:
  //  • Yeni kayıtta belge zorunlu.
  //  • Düzenlemede mevcut belge varsa zorunlu değil — yeni dosya seçilmezse
  //    eski URL korunur. Mevcut belge yoksa düzenlemede de zorunlu.
  const belgeRequired = editTarget === "new" || !keepExistingBelge;
  const belgeMissing = belgeRequired && !formFile;

  // ── Handlers ──────────────────────────────────────────────────────────────

  const openAddModal = () => {
    setErrorMsg(null);
    setEditTarget("new");
    setFormDate(todayIso());
    setFormKategori(KATEGORI_OPTIONS[0]);
    setFormVendor("");
    setFormAmount("");
    setFormCurrency("TRY");
    setFormDescription("");
    setFormFile(null);
    setKeepExistingBelge(undefined);
  };

  const openEditModal = (g: Gider) => {
    setErrorMsg(null);
    setEditTarget(g);
    setFormDate(g.date);
    setFormKategori(g.kategori);
    setFormVendor(g.vendor);
    setFormAmount(String(g.amount));
    setFormCurrency(g.currency);
    setFormDescription(g.description);
    setFormFile(null);
    setKeepExistingBelge(g.belge);
  };

  const closeFormModal = () => {
    if (savingForm) return;
    setEditTarget(null);
  };

  const handleSaveForm = async () => {
    if (!formVendor.trim()) {
      setErrorMsg("Satıcı zorunludur.");
      return;
    }
    const amount = parseFloat(formAmount.replace(",", "."));
    if (Number.isNaN(amount) || amount <= 0) {
      setErrorMsg("Geçerli bir tutar girin.");
      return;
    }
    if (belgeMissing) {
      setErrorMsg("Belge yüklenmesi zorunludur.");
      return;
    }

    setSavingForm(true);
    setErrorMsg(null);
    try {
      // Belge: yeni dosya varsa upload; yoksa mevcut URL'i koru
      let belgeUrl: string | undefined = keepExistingBelge;
      if (formFile) {
        belgeUrl = await uploadToCloudinary(formFile);
      }

      const isNew = editTarget === "new";
      const payload: Record<string, unknown> = {
        tarih: formDate,
        kategori: formKategori,
        satici: formVendor.trim(),
        tutar: amount,
        para_birimi: formCurrency,
        aciklama: formDescription.trim() || null,
        belge_url: belgeUrl ?? null,
      };
      if (!isNew && editTarget) payload.id = editTarget.id;

      const result = await postJson(
        isNew ? "/gider-ekle" : "/gider-guncelle",
        payload,
      );
      if (!result.ok) {
        setErrorMsg(result.message);
        return;
      }

      await refresh();
      setEditTarget(null);
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Kaydetme başarısız.");
    } finally {
      setSavingForm(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setErrorMsg(null);
    try {
      const result = await postJson("/gider-sil", { id: deleteTarget.id });
      if (!result.ok) {
        setErrorMsg(result.message);
        return;
      }
      await refresh();
      setDeleteTarget(null);
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Silme başarısız.");
    } finally {
      setDeleting(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <AdminLayout
      title="Giderler"
      subtitle={loading ? "Yükleniyor…" : `${count} gider kaydı`}
      actions={
        <Button variant="primary" size="sm" onClick={openAddModal}>
          <Plus className="w-4 h-4" />
          Yeni Gider
        </Button>
      }
    >
      {/* API error banner */}
      {apiError && !loading && (
        <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-body-sm text-amber-900 flex items-start gap-2">
          <span className="font-bold shrink-0">⚠</span>
          <div className="min-w-0">
            <p className="font-semibold">
              API'ye ulaşılamadı — mock veri gösteriliyor.
            </p>
            <p className="text-label-sm text-amber-800 mt-0.5 break-all">
              {apiError}. n8n endpoint'ini ve CORS başlıklarını kontrol edin.
            </p>
          </div>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4">
          <div className="flex items-center gap-2 text-on-surface-variant text-label-sm">
            <Wallet className="w-4 h-4" />
            Toplam Gider
          </div>
          <p className="text-headline-sm font-bold text-on-surface tabular-nums mt-1">
            {formatCurrency(totalAll, "TRY")}
          </p>
        </div>
        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4">
          <div className="flex items-center gap-2 text-on-surface-variant text-label-sm">
            <TrendingDown className="w-4 h-4" />
            Bu Ay
          </div>
          <p className="text-headline-sm font-bold text-on-surface tabular-nums mt-1">
            {formatCurrency(totalThisMonth, "TRY")}
          </p>
        </div>
        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4">
          <div className="flex items-center gap-2 text-on-surface-variant text-label-sm">
            <Receipt className="w-4 h-4" />
            Kayıt Sayısı
          </div>
          <p className="text-headline-sm font-bold text-on-surface tabular-nums mt-1">
            {count}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col sm:flex-row gap-2 sm:items-center">
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              { k: "bugun", l: "Bugün" },
              { k: "hafta", l: "Bu Hafta" },
              { k: "ay", l: "Bu Ay" },
              { k: "tum", l: "Tümü" },
            ] as { k: DateFilter; l: string }[]
          ).map(({ k, l }) => (
            <button
              key={k}
              onClick={() => setDateFilter(k)}
              className={`px-3 py-1.5 rounded-full text-label-sm font-medium transition ${
                dateFilter === k
                  ? "bg-secondary text-on-secondary"
                  : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
        <div className="sm:ml-auto inline-flex items-center gap-2 min-w-[200px]">
          <Tag className="w-4 h-4 text-on-surface-variant shrink-0" />
          <select
            className={`${inputClass} min-h-[38px] py-1.5`}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="__all__">Tüm kategoriler</option>
            {usedCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Empty / loading */}
      {loading ? (
        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest h-[280px] animate-pulse" />
      ) : visible.length === 0 ? (
        <div className="rounded-xl border border-dashed border-outline-variant bg-surface-container-low p-10 text-center">
          <Receipt className="w-10 h-10 mx-auto mb-3 text-on-surface-variant/60" />
          <p className="text-body-md text-on-surface-variant">
            {items.length === 0
              ? "Henüz gider kaydı yok. Yeni bir gider ekleyebilirsiniz."
              : "Bu filtrelerle eşleşen gider yok."}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block rounded-xl border border-outline-variant bg-surface-container-lowest overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-body-sm">
                <thead className="bg-surface-container-low border-b border-outline-variant">
                  <tr className="text-left text-label-sm text-on-surface-variant">
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">
                      Tarih
                    </th>
                    <th className="px-4 py-3 font-semibold">Kategori</th>
                    <th className="px-4 py-3 font-semibold">Satıcı</th>
                    <th className="px-4 py-3 font-semibold">Açıklama</th>
                    <th className="px-4 py-3 font-semibold text-right whitespace-nowrap">
                      Tutar
                    </th>
                    <th className="px-4 py-3 font-semibold">Belge</th>
                    <th className="px-4 py-3 font-semibold text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((g) => (
                    <tr
                      key={g.id}
                      className="border-b border-outline-variant last:border-0 hover:bg-surface-container-low/40"
                    >
                      <td className="px-4 py-3 text-on-surface tabular-nums whitespace-nowrap">
                        {formatTrDate(g.date)}
                      </td>
                      <td className="px-4 py-3 text-on-surface">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-surface-container border border-outline-variant text-label-sm">
                          {g.kategori}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-on-surface">{g.vendor}</td>
                      <td className="px-4 py-3 text-on-surface-variant max-w-[280px] truncate">
                        {g.description || "—"}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-on-surface tabular-nums whitespace-nowrap">
                        {formatCurrency(g.amount, g.currency)}
                      </td>
                      <td className="px-4 py-3">
                        {g.belge ? (
                          <button
                            type="button"
                            onClick={() => setPreviewPhoto(g.belge ?? null)}
                            className="w-10 h-10 rounded-md overflow-hidden border border-outline-variant hover:border-secondary transition cursor-zoom-in"
                            aria-label="Belge fotoğrafını büyüt"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={g.belge}
                              alt="Belge"
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </button>
                        ) : (
                          <span className="text-on-surface-variant/60 text-label-sm inline-flex items-center gap-1">
                            <ImageIcon className="w-3 h-3" />
                            Yok
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEditModal(g)}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-outline-variant text-on-surface hover:bg-surface-container-low transition"
                            aria-label="Düzenle"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(g)}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition"
                            aria-label="Sil"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {visible.map((g) => (
              <article
                key={g.id}
                className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <p className="text-body-md font-semibold text-on-surface">
                      {g.vendor}
                    </p>
                    <p className="text-label-sm text-on-surface-variant inline-flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      {formatTrDate(g.date)}
                    </p>
                  </div>
                  <p className="text-body-lg font-bold text-on-surface tabular-nums whitespace-nowrap">
                    {formatCurrency(g.amount, g.currency)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-surface-container border border-outline-variant text-label-sm">
                    {g.kategori}
                  </span>
                </div>
                {g.description && (
                  <p className="text-body-sm text-on-surface-variant break-words mb-2">
                    {g.description}
                  </p>
                )}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-outline-variant">
                  {g.belge ? (
                    <button
                      type="button"
                      onClick={() => setPreviewPhoto(g.belge ?? null)}
                      className="w-12 h-12 rounded-md overflow-hidden border border-outline-variant"
                      aria-label="Belge"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={g.belge}
                        alt="Belge"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ) : (
                    <span className="text-label-sm text-on-surface-variant/60 inline-flex items-center gap-1">
                      <ImageIcon className="w-3 h-3" />
                      Belge yok
                    </span>
                  )}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(g)}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-outline-variant text-on-surface hover:bg-surface-container-low transition"
                      aria-label="Düzenle"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(g)}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition"
                      aria-label="Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      {/* Photo lightbox */}
      {previewPhoto && (
        <div
          className="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-150"
          onClick={() => setPreviewPhoto(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Belge önizleme"
        >
          <button
            type="button"
            onClick={() => setPreviewPhoto(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white flex items-center justify-center transition"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewPhoto}
            alt="Belge büyük görünüm"
            className="max-w-full max-h-full rounded-lg shadow-2xl object-contain cursor-default"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* ── ADD/EDIT MODAL ───────────────────────────────────────────────── */}
      <Modal
        open={editTarget !== null}
        onClose={closeFormModal}
        title={editTarget === "new" ? "Yeni Gider" : "Gider Düzenle"}
        description={
          editTarget === "new"
            ? "Kampanya gideri ekleyin"
            : "Mevcut gider kaydını güncelleyin"
        }
        footer={
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeFormModal}
              disabled={savingForm}
            >
              İptal
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSaveForm}
              disabled={
                savingForm ||
                !formVendor.trim() ||
                !formAmount ||
                belgeMissing
              }
            >
              {savingForm ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Kaydediliyor…
                </>
              ) : editTarget === "new" ? (
                "Ekle"
              ) : (
                "Kaydet"
              )}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {errorMsg && editTarget !== null && !deleteTarget && (
            <div className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-body-sm text-red-700">
              {errorMsg}
            </div>
          )}

          <FormField label="Tarih" required>
            <input
              type="date"
              className={inputClass}
              value={formDate}
              onChange={(e) => setFormDate(e.target.value)}
              disabled={savingForm}
            />
          </FormField>

          <FormField label="Kategori" required>
            <select
              className={inputClass}
              value={formKategori}
              onChange={(e) => setFormKategori(e.target.value)}
              disabled={savingForm}
            >
              {KATEGORI_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Satıcı" required>
            <input
              className={inputClass}
              placeholder="Örn: Acıbadem Hastanesi"
              value={formVendor}
              onChange={(e) => setFormVendor(e.target.value)}
              disabled={savingForm}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Tutar" required>
              <input
                type="number"
                inputMode="decimal"
                step="0.01"
                className={inputClass}
                placeholder="0,00"
                value={formAmount}
                onChange={(e) => setFormAmount(e.target.value)}
                disabled={savingForm}
              />
            </FormField>
            <FormField label="Para Birimi" required>
              <select
                className={inputClass}
                value={formCurrency}
                onChange={(e) => setFormCurrency(e.target.value as Currency)}
                disabled={savingForm}
              >
                <option value="TRY">TRY (₺)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </FormField>
          </div>

          <FormField label="Açıklama" hint="Opsiyonel">
            <textarea
              className={`${inputClass} min-h-[70px] resize-y`}
              placeholder="Gider hakkında not..."
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              disabled={savingForm}
              rows={3}
            />
          </FormField>

          <FormField
            label="Belge / Fatura"
            required={belgeRequired}
            hint={
              keepExistingBelge && !formFile
                ? "Mevcut belge korunuyor — yeni dosya seçerseniz değiştirilir"
                : belgeRequired
                  ? "Fatura veya makbuz fotoğrafı (zorunlu)"
                  : "Opsiyonel: fatura veya makbuz fotoğrafı"
            }
          >
            {keepExistingBelge && !formFile && (
              <div className="mb-2 flex items-center gap-2 text-label-sm text-on-surface-variant">
                <FileText className="w-3.5 h-3.5" />
                Mevcut belge yüklü
              </div>
            )}
            <label
              className={`flex items-center justify-center gap-2 px-4 py-5 rounded-lg border-2 border-dashed cursor-pointer transition ${
                belgeMissing
                  ? "border-red-300 bg-red-50/50 text-red-600 hover:border-red-400 hover:bg-red-50"
                  : "border-outline-variant bg-surface-container-low text-on-surface-variant hover:border-secondary hover:bg-secondary-container/20"
              } ${savingForm ? "opacity-50 pointer-events-none" : ""}`}
            >
              <Camera className="w-5 h-5" />
              <span className="text-body-sm break-all">
                {formFile
                  ? formFile.name
                  : keepExistingBelge
                    ? "Belge değiştir"
                    : "Belge seç"}
              </span>
              <input
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={(e) => setFormFile(e.target.files?.[0] ?? null)}
                disabled={savingForm}
              />
            </label>
            {belgeMissing && (
              <p className="mt-1.5 text-label-sm text-red-600 font-medium">
                Belge yüklenmesi zorunludur.
              </p>
            )}
          </FormField>
        </div>
      </Modal>

      {/* ── DELETE CONFIRM MODAL ─────────────────────────────────────────── */}
      <Modal
        open={deleteTarget !== null}
        onClose={() => !deleting && setDeleteTarget(null)}
        title="Gideri Sil"
        description="Bu işlem geri alınamaz"
        footer={
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeleteTarget(null)}
              disabled={deleting}
            >
              İptal
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleConfirmDelete}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Siliniyor…
                </>
              ) : (
                "Sil"
              )}
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          {errorMsg && deleteTarget && (
            <div className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-body-sm text-red-700">
              {errorMsg}
            </div>
          )}
          <div className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <p className="text-body-sm text-amber-900">
              <strong>{deleteTarget?.description || deleteTarget?.vendor || deleteTarget?.id}</strong>{" "}
              giderini silmek istediğinize emin misiniz?
            </p>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
}
