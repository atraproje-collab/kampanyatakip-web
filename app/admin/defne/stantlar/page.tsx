"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Calendar,
  Camera,
  Clock,
  History,
  Image as ImageIcon,
  List,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Store,
  TrendingUp,
  User,
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
import { adminVolunteers } from "@/lib/admin-mock-data";

// ── Types ───────────────────────────────────────────────────────────────────

type StantRow = {
  id: string;            // "S-01"
  location: string;
  responsible: string;
  total: number;
  lastClose: string;     // "2026-04-23" or "—"
};

type Kapanis = {
  id?: string;
  date: string;          // "2026-04-23"
  amount: number;
  responsible: string;
  tutanakFoto?: string;
};

type RaporRow = {
  id: string;
  location: string;
  responsible: string;
  total: number;
  closeCount: number;
  lastClose: string;
};

type Tab = "liste" | "rapor";
type GecmisFilter = "bugun" | "hafta" | "ay" | "tum";

// ── API & Cloudinary constants ──────────────────────────────────────────────

const PROXY_BASE = "/api/kampanya/demo-defne";
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dqyr5h96s/image/upload";
const CLOUDINARY_PRESET = "kampanyatakip";

// ── Cloudinary helper ───────────────────────────────────────────────────────

async function uploadToCloudinary(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", CLOUDINARY_PRESET);
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

// ── Parsing helpers ─────────────────────────────────────────────────────────

type RawRow = Record<string, unknown>;

function parseStant(raw: RawRow): StantRow | null {
  const id = String(raw.stant_no ?? raw.id ?? raw.no ?? "").trim();
  if (!id) return null;
  const location = String(raw.konum ?? raw.location ?? raw.lokasyon ?? "");
  const responsible = String(raw.sorumlu ?? raw.responsible ?? "");
  const total = Number(raw.toplam ?? raw.total ?? 0) || 0;
  const lastClose = String(
    raw.son_kapanis ?? raw.lastClose ?? raw.son_kapanis_tarihi ?? "—",
  );
  return { id, location, responsible, total, lastClose };
}

function parseKapanis(raw: RawRow): Kapanis | null {
  const date = String(raw.tarih ?? raw.date ?? "").trim();
  if (!date) return null;
  const amount = Number(raw.tutar ?? raw.amount ?? 0) || 0;
  const responsible = String(raw.sorumlu ?? raw.responsible ?? "");
  let tutanakFoto: string | undefined;
  const fotoRaw =
    raw.tutanak_foto ?? raw.tutanakFoto ?? raw.foto_url ?? raw.photo_url ?? null;
  if (typeof fotoRaw === "string" && fotoRaw.trim()) {
    tutanakFoto = fotoRaw.trim();
  }
  const id =
    typeof raw.id === "string" || typeof raw.id === "number"
      ? String(raw.id)
      : undefined;
  return { id, date, amount, responsible, tutanakFoto };
}

function parseRaporRow(raw: RawRow): RaporRow | null {
  const id = String(raw.stant_no ?? raw.id ?? "").trim();
  if (!id) return null;
  const location = String(raw.konum ?? raw.location ?? "");
  const responsible = String(raw.sorumlu ?? raw.responsible ?? "");
  const total = Number(raw.toplam ?? raw.total ?? 0) || 0;
  const closeCount =
    Number(raw.kapanis_sayisi ?? raw.closeCount ?? raw.count ?? 0) || 0;
  const lastClose = String(raw.son_kapanis ?? raw.lastClose ?? "—");
  return { id, location, responsible, total, closeCount, lastClose };
}

/** Common envelope unwrap: {data:[]} | {items:[]} | {result:[]} | array. */
function unwrapArray(data: unknown, key?: string): unknown[] {
  let arr: unknown = data;
  if (data && typeof data === "object" && !Array.isArray(data)) {
    const obj = data as Record<string, unknown>;
    if (key && Array.isArray(obj[key])) arr = obj[key];
    else if (Array.isArray(obj.data)) arr = obj.data;
    else if (Array.isArray(obj.items)) arr = obj.items;
    else if (Array.isArray(obj.result)) arr = obj.result;
    else if (Array.isArray(obj.rows)) arr = obj.rows;
  }
  if (!Array.isArray(arr)) arr = [arr];
  return arr as unknown[];
}

// ── API helpers ─────────────────────────────────────────────────────────────

type FetchListResult<T> = { items: T[]; ok: boolean; reason?: string };

async function fetchStantlar(): Promise<FetchListResult<StantRow>> {
  try {
    const res = await fetch(`${PROXY_BASE}/stantlar`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      // eslint-disable-next-line no-console
      console.warn(`[stantlar] API ${res.status} ${res.statusText}`);
      return { items: [], ok: false, reason: `HTTP ${res.status}` };
    }
    const data: unknown = await res.json();
    const arr = unwrapArray(data, "stantlar");
    const items = (arr as RawRow[])
      .map(parseStant)
      .filter((s): s is StantRow => s !== null);
    return { items, ok: true };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("[stantlar] fetch failed:", e);
    return {
      items: [],
      ok: false,
      reason: e instanceof Error ? e.message : "network error",
    };
  }
}

async function fetchRapor(): Promise<FetchListResult<RaporRow>> {
  try {
    const res = await fetch(`${PROXY_BASE}/stant-rapor`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      return { items: [], ok: false, reason: `HTTP ${res.status}` };
    }
    const data: unknown = await res.json();
    const arr = unwrapArray(data, "rapor");
    const items = (arr as RawRow[])
      .map(parseRaporRow)
      .filter((r): r is RaporRow => r !== null);
    return { items, ok: true };
  } catch (e) {
    return {
      items: [],
      ok: false,
      reason: e instanceof Error ? e.message : "network error",
    };
  }
}

async function fetchGecmis(stantNo: string): Promise<FetchListResult<Kapanis>> {
  try {
    const res = await fetch(
      `${PROXY_BASE}/stant-gecmis?stant_no=${encodeURIComponent(stantNo)}`,
      { cache: "no-store", headers: { Accept: "application/json" } },
    );
    if (!res.ok) {
      return { items: [], ok: false, reason: `HTTP ${res.status}` };
    }
    const data: unknown = await res.json();
    const arr = unwrapArray(data, "gecmis");
    const items = (arr as RawRow[])
      .map(parseKapanis)
      .filter((k): k is Kapanis => k !== null);
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

// ── Date helpers ────────────────────────────────────────────────────────────

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Filters kapanis rows by selected date range. */
function filterByRange(rows: Kapanis[], range: GecmisFilter): Kapanis[] {
  if (range === "tum") return rows;
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
  return rows.filter((r) => {
    const d = new Date(r.date);
    if (Number.isNaN(d.getTime())) return false;
    return d >= start;
  });
}

// ── Page component ──────────────────────────────────────────────────────────

export default function StantlarPage() {
  const [items, setItems] = useState<StantRow[]>([]);
  const [rapor, setRapor] = useState<RaporRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingRapor, setLoadingRapor] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("liste");

  // Add modal
  const [openAdd, setOpenAdd] = useState(false);
  const [newLocation, setNewLocation] = useState("");
  const [newResp, setNewResp] = useState(adminVolunteers[0]?.name ?? "");
  const [newStantNo, setNewStantNo] = useState("");
  const [computingId, setComputingId] = useState(false);
  const [savingAdd, setSavingAdd] = useState(false);

  // Edit modal
  const [openEdit, setOpenEdit] = useState<StantRow | null>(null);
  const [editLocation, setEditLocation] = useState("");
  const [editResp, setEditResp] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  // Kapanis modal
  const [openKapanis, setOpenKapanis] = useState<StantRow | null>(null);
  const [kapanisDate, setKapanisDate] = useState(todayIso());
  const [kapanisAmount, setKapanisAmount] = useState("");
  const [kapanisResp, setKapanisResp] = useState("");
  const [kapanisFile, setKapanisFile] = useState<File | null>(null);
  const [savingKapanis, setSavingKapanis] = useState(false);

  // Gecmis modal
  const [openGecmis, setOpenGecmis] = useState<StantRow | null>(null);
  const [gecmisRows, setGecmisRows] = useState<Kapanis[]>([]);
  const [gecmisLoading, setGecmisLoading] = useState(false);
  const [gecmisFilter, setGecmisFilter] = useState<GecmisFilter>("ay");
  const [gecmisError, setGecmisError] = useState<string | null>(null);

  // ── Initial fetch ────────────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;
    (async () => {
      const result = await fetchStantlar();
      if (!mounted) return;
      if (result.ok) {
        setItems(result.items);
        setApiError(null);
      } else {
        setItems([]);
        setApiError(result.reason ?? "API'ye ulaşılamadı");
      }
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Fetch rapor when tab switches to rapor
  useEffect(() => {
    if (tab !== "rapor") return;
    let mounted = true;
    setLoadingRapor(true);
    (async () => {
      const result = await fetchRapor();
      if (!mounted) return;
      if (result.ok) {
        setRapor([...result.items].sort((a, b) => b.total - a.total));
      } else {
        setRapor([]);
      }
      setLoadingRapor(false);
    })();
    return () => {
      mounted = false;
    };
  }, [tab]);

  // ── Derived ───────────────────────────────────────────────────────────────
  const totalRaised = items.reduce((s, k) => s + k.total, 0);

  /**
   * Computes next S-XX id strictly from DB list:
   * "S-" prefix sıyır, parseInt, max+1, 2 hane sıfır dolgulu.
   */
  const computeNextStantNo = (list: StantRow[]): string => {
    const allNos = list.map((s) => s.id);
    const numbers = allNos
      .map((no) => {
        const stripped = no.replace(/^[Ss]-?/, "").trim();
        const n = parseInt(stripped, 10);
        return Number.isNaN(n) ? null : n;
      })
      .filter((n): n is number => n !== null);
    const max = numbers.length > 0 ? Math.max(...numbers) : 0;
    const next = max + 1;
    const newNo = `S-${String(next).padStart(2, "0")}`;
    // eslint-disable-next-line no-console
    console.log("[stant-ekle] DB'den gelen tüm stant no'ları:", allNos);
    // eslint-disable-next-line no-console
    console.log("[stant-ekle] parse edilen sayılar:", numbers);
    // eslint-disable-next-line no-console
    console.log("[stant-ekle] max bulunan:", max);
    // eslint-disable-next-line no-console
    console.log("[stant-ekle] üretilen yeni numara:", newNo);
    return newNo;
  };

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleOpenAdd = async () => {
    setErrorMsg(null);
    setOpenAdd(true);
    setNewLocation("");
    setNewResp(adminVolunteers[0]?.name ?? "");
    setNewStantNo("");
    setComputingId(true);

    const result = await fetchStantlar();
    if (result.ok) {
      setItems(result.items);
      setApiError(null);
      setNewStantNo(computeNextStantNo(result.items));
    } else {
      setErrorMsg(
        `Stant no DB'den hesaplanamadı (${result.reason ?? "API'ye ulaşılamadı"}). Modalı kapatıp tekrar açın.`,
      );
      setNewStantNo("");
    }
    setComputingId(false);
  };

  const handleAdd = async () => {
    if (!newLocation.trim() || !newStantNo) return;
    setSavingAdd(true);
    setErrorMsg(null);
    try {
      const result = await postJson("/stant-ekle", {
        stant_no: newStantNo,
        konum: newLocation.trim(),
        sorumlu: newResp,
      });
      if (!result.ok) {
        // eslint-disable-next-line no-console
        console.warn(
          `[stant-ekle] endpoint hatası: ${result.message}`,
          {
            sent: {
              stant_no: newStantNo,
              konum: newLocation,
              sorumlu: newResp,
            },
          },
        );
        setErrorMsg(result.message);
        return;
      }

      const fresh = await fetchStantlar();
      if (fresh.ok) {
        setItems(fresh.items);
        setApiError(null);
      } else {
        setApiError(fresh.reason ?? "API'ye ulaşılamadı");
      }
      setNewLocation("");
      setNewStantNo("");
      setOpenAdd(false);
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Ekleme başarısız.");
    } finally {
      setSavingAdd(false);
    }
  };

  const openEditModal = (s: StantRow) => {
    setErrorMsg(null);
    setOpenEdit(s);
    setEditLocation(s.location);
    setEditResp(s.responsible);
  };

  const handleSaveEdit = async () => {
    if (!openEdit || !editLocation.trim()) return;
    setSavingEdit(true);
    setErrorMsg(null);
    try {
      const result = await postJson("/stant-guncelle", {
        stant_no: openEdit.id,
        konum: editLocation.trim(),
        sorumlu: editResp,
      });
      if (!result.ok) {
        throw new Error(`Güncelleme reddedildi: ${result.message}`);
      }
      setItems((prev) =>
        prev.map((s) =>
          s.id === openEdit.id
            ? { ...s, location: editLocation.trim(), responsible: editResp }
            : s,
        ),
      );
      setOpenEdit(null);
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Güncelleme başarısız.");
    } finally {
      setSavingEdit(false);
    }
  };

  const openKapanisModal = (s: StantRow) => {
    setErrorMsg(null);
    setOpenKapanis(s);
    setKapanisDate(todayIso());
    setKapanisAmount("");
    setKapanisResp(s.responsible);
    setKapanisFile(null);
  };

  const handleSaveKapanis = async () => {
    if (!openKapanis || !kapanisAmount) return;
    const amount = parseFloat(kapanisAmount.replace(",", "."));
    if (Number.isNaN(amount) || amount <= 0) {
      setErrorMsg("Geçerli bir tutar girin.");
      return;
    }
    if (!kapanisFile) {
      setErrorMsg("Tutanak fotoğrafı zorunludur.");
      return;
    }

    setSavingKapanis(true);
    setErrorMsg(null);
    try {
      const photoUrl = await uploadToCloudinary(kapanisFile);

      const result = await postJson("/stant-kapanis", {
        stant_no: openKapanis.id,
        tarih: kapanisDate,
        tutar: amount,
        sorumlu: kapanisResp || openKapanis.responsible,
        tutanak_foto: photoUrl,
      });

      if (!result.ok) {
        // n8n'den gelen mesajı doğrudan göster (örn. aynı gün ikinci kapanış reddi)
        throw new Error(result.message);
      }

      // Refresh list (totals + lastClose change)
      const fresh = await fetchStantlar();
      if (fresh.ok) setItems(fresh.items);

      setOpenKapanis(null);
      setKapanisAmount("");
      setKapanisFile(null);
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Kapanış kaydedilemedi.");
    } finally {
      setSavingKapanis(false);
    }
  };

  const openGecmisModal = async (s: StantRow) => {
    setOpenGecmis(s);
    setGecmisRows([]);
    setGecmisFilter("ay");
    setGecmisError(null);
    setGecmisLoading(true);
    const result = await fetchGecmis(s.id);
    if (result.ok) {
      setGecmisRows(
        [...result.items].sort((a, b) => (a.date < b.date ? 1 : -1)),
      );
    } else {
      setGecmisError(result.reason ?? "Geçmiş alınamadı");
    }
    setGecmisLoading(false);
  };

  const filteredGecmis = useMemo(
    () => filterByRange(gecmisRows, gecmisFilter),
    [gecmisRows, gecmisFilter],
  );
  const gecmisSummary = useMemo(() => {
    const total = filteredGecmis.reduce((s, r) => s + r.amount, 0);
    const count = filteredGecmis.length;
    const avg = count > 0 ? total / count : 0;
    return { total, count, avg };
  }, [filteredGecmis]);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <AdminLayout
      title="Stantlar"
      subtitle={
        loading
          ? "Yükleniyor…"
          : `${items.length} stant — toplam ₺${totalRaised.toLocaleString("tr-TR")}`
      }
      actions={
        tab === "liste" ? (
          <Button variant="primary" size="sm" onClick={handleOpenAdd}>
            <Plus className="w-4 h-4" />
            Stant Ekle
          </Button>
        ) : null
      }
    >
      {/* API error banner */}
      {apiError && !loading && (
        <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-body-sm text-amber-900 flex items-start gap-2">
          <span className="font-bold shrink-0">⚠</span>
          <div className="min-w-0">
            <p className="font-semibold">API'ye ulaşılamadı.</p>
            <p className="text-label-sm text-amber-800 mt-0.5 break-all">
              {apiError}. n8n endpoint'ini ve CORS başlıklarını kontrol edin.
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Stant sekmeleri"
        className="flex gap-1 mb-4 border-b border-outline-variant overflow-x-auto -mx-1 px-1"
      >
        <button
          role="tab"
          aria-selected={tab === "liste"}
          onClick={() => setTab("liste")}
          className={`px-4 py-2.5 text-label-md font-semibold whitespace-nowrap transition border-b-2 -mb-px min-h-[44px] inline-flex items-center gap-1.5 ${
            tab === "liste"
              ? "border-secondary text-secondary"
              : "border-transparent text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <List className="w-4 h-4" />
          Stant Listesi
          <span
            className={`ml-1 inline-flex items-center justify-center min-w-[22px] h-5 px-1.5 rounded-full text-[11px] font-bold ${
              tab === "liste"
                ? "bg-secondary-container text-secondary"
                : "bg-surface-container text-on-surface-variant"
            }`}
          >
            {items.length}
          </span>
        </button>
        <button
          role="tab"
          aria-selected={tab === "rapor"}
          onClick={() => setTab("rapor")}
          className={`px-4 py-2.5 text-label-md font-semibold whitespace-nowrap transition border-b-2 -mb-px min-h-[44px] inline-flex items-center gap-1.5 ${
            tab === "rapor"
              ? "border-secondary text-secondary"
              : "border-transparent text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Genel Rapor
        </button>
      </div>

      {/* ── LISTE TAB ────────────────────────────────────────────────────── */}
      {tab === "liste" && (
        <>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden"
                >
                  <div className="h-[224px] animate-pulse bg-surface-container-high/40" />
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-xl border border-dashed border-outline-variant bg-surface-container-low p-10 text-center">
              <Store className="w-10 h-10 mx-auto mb-3 text-on-surface-variant/60" />
              <p className="text-body-md text-on-surface-variant">
                Henüz stant yok. Yeni bir stant ekleyebilirsiniz.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((s) => (
                <article
                  key={s.id}
                  className="rounded-xl border bg-surface-container-lowest border-outline-variant hover:border-secondary hover:shadow-[0_4px_12px_rgba(0,24,53,0.08)] overflow-hidden transition"
                >
                  <div className="px-5 pt-4 pb-3 border-b border-outline-variant flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-secondary-container/40 text-secondary">
                        <Store className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-label-sm text-on-surface-variant">
                          Stant No
                        </p>
                        <p className="text-body-lg font-semibold text-on-surface truncate">
                          #{s.id}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="px-5 py-4 space-y-2.5 text-body-sm">
                    <div className="flex items-start gap-2 text-on-surface-variant">
                      <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                      <span className="text-on-surface break-words">
                        {s.location}
                      </span>
                    </div>
                    <div className="flex items-start gap-2 text-on-surface-variant">
                      <User className="w-4 h-4 mt-0.5 shrink-0" />
                      <span className="text-on-surface break-words">
                        {s.responsible}
                      </span>
                    </div>
                    <div className="pt-2 mt-2 border-t border-outline-variant flex items-center justify-between gap-2">
                      <span className="text-label-sm text-on-surface-variant">
                        Toplanan
                      </span>
                      <span className="font-bold text-on-surface tabular-nums">
                        {formatCurrency(s.total, "TRY")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-label-sm text-on-surface-variant inline-flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Son kapanış
                      </span>
                      <span className="text-label-md text-on-surface tabular-nums">
                        {s.lastClose}
                      </span>
                    </div>
                  </div>

                  <div className="px-5 pb-4 pt-1 grid grid-cols-3 gap-2">
                    <button
                      onClick={() => openEditModal(s)}
                      className="inline-flex items-center justify-center gap-1 px-2 py-2 rounded-lg border border-outline-variant text-label-sm text-on-surface hover:bg-surface-container-low transition min-h-[40px]"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Düzenle
                    </button>
                    <button
                      onClick={() => openKapanisModal(s)}
                      className="inline-flex items-center justify-center gap-1 px-2 py-2 rounded-lg bg-secondary text-on-secondary font-semibold text-label-sm hover:bg-on-secondary-container transition min-h-[40px]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Kapanış
                    </button>
                    <button
                      onClick={() => openGecmisModal(s)}
                      className="inline-flex items-center justify-center gap-1 px-2 py-2 rounded-lg border border-outline-variant text-label-sm text-on-surface hover:bg-surface-container-low transition min-h-[40px]"
                    >
                      <History className="w-3.5 h-3.5" />
                      Geçmiş
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── RAPOR TAB ────────────────────────────────────────────────────── */}
      {tab === "rapor" && (
        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest overflow-hidden">
          {loadingRapor ? (
            <div className="p-10 flex items-center justify-center text-on-surface-variant">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Rapor yükleniyor…
            </div>
          ) : rapor.length === 0 ? (
            <div className="p-10 text-center">
              <BarChart3 className="w-10 h-10 mx-auto mb-3 text-on-surface-variant/60" />
              <p className="text-body-md text-on-surface-variant">
                Rapor verisi yok.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-body-sm">
                <thead className="bg-surface-container-low border-b border-outline-variant">
                  <tr className="text-left text-label-sm text-on-surface-variant">
                    <th className="px-4 py-3 font-semibold">Stant No</th>
                    <th className="px-4 py-3 font-semibold">Konum</th>
                    <th className="px-4 py-3 font-semibold">Sorumlu</th>
                    <th className="px-4 py-3 font-semibold text-right">
                      Toplam
                    </th>
                    <th className="px-4 py-3 font-semibold text-right">
                      Kapanış
                    </th>
                    <th className="px-4 py-3 font-semibold">Son Kapanış</th>
                  </tr>
                </thead>
                <tbody>
                  {rapor.map((r) => (
                    <tr
                      key={r.id}
                      className="border-b border-outline-variant last:border-0 hover:bg-surface-container-low/40"
                    >
                      <td className="px-4 py-3 font-semibold text-on-surface whitespace-nowrap">
                        #{r.id}
                      </td>
                      <td className="px-4 py-3 text-on-surface">
                        {r.location}
                      </td>
                      <td className="px-4 py-3 text-on-surface-variant">
                        {r.responsible}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-on-surface tabular-nums whitespace-nowrap">
                        {formatCurrency(r.total, "TRY")}
                      </td>
                      <td className="px-4 py-3 text-right text-on-surface tabular-nums">
                        {r.closeCount}
                      </td>
                      <td className="px-4 py-3 text-on-surface-variant tabular-nums whitespace-nowrap">
                        {r.lastClose}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Photo lightbox */}
      {previewPhoto && (
        <div
          className="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-150"
          onClick={() => setPreviewPhoto(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Tutanak fotoğrafı önizleme"
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
            alt="Tutanak fotoğrafı büyük görünüm"
            className="max-w-full max-h-full rounded-lg shadow-2xl object-contain cursor-default"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* ── ADD MODAL ────────────────────────────────────────────────────── */}
      <Modal
        open={openAdd}
        onClose={() => !savingAdd && setOpenAdd(false)}
        title="Yeni Stant"
        description="Yeni bir stant konumu ekleyin"
        footer={
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpenAdd(false)}
              disabled={savingAdd}
            >
              İptal
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleAdd}
              disabled={
                savingAdd ||
                computingId ||
                !newStantNo ||
                !newLocation.trim()
              }
            >
              {savingAdd ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Ekleniyor…
                </>
              ) : (
                "Ekle"
              )}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {errorMsg && openAdd && (
            <div className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-body-sm text-red-700">
              {errorMsg}
            </div>
          )}
          <FormField label="Stant No" hint="Otomatik üretildi, değiştirilemez">
            <input
              className={inputClass}
              value={computingId ? "Hesaplanıyor…" : newStantNo}
              readOnly
              disabled
            />
          </FormField>
          <FormField label="Konum" required>
            <input
              className={inputClass}
              placeholder="Örn: İstinye Park"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              disabled={savingAdd}
            />
          </FormField>
          <FormField label="Sorumlu Gönüllü" required>
            <select
              className={inputClass}
              value={newResp}
              onChange={(e) => setNewResp(e.target.value)}
              disabled={savingAdd}
            >
              {adminVolunteers.map((v) => (
                <option key={v.id} value={v.name}>
                  {v.name} ({v.role})
                </option>
              ))}
            </select>
          </FormField>
        </div>
      </Modal>

      {/* ── EDIT MODAL ───────────────────────────────────────────────────── */}
      <Modal
        open={openEdit !== null}
        onClose={() => !savingEdit && setOpenEdit(null)}
        title={openEdit ? `Düzenle — Stant #${openEdit.id}` : ""}
        description="Konum ve sorumlu bilgisini güncelleyin"
        footer={
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpenEdit(null)}
              disabled={savingEdit}
            >
              İptal
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSaveEdit}
              disabled={savingEdit || !editLocation.trim()}
            >
              {savingEdit ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Kaydediliyor…
                </>
              ) : (
                "Kaydet"
              )}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {errorMsg && openEdit && (
            <div className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-body-sm text-red-700">
              {errorMsg}
            </div>
          )}
          <FormField label="Konum" required>
            <input
              className={inputClass}
              value={editLocation}
              onChange={(e) => setEditLocation(e.target.value)}
              disabled={savingEdit}
            />
          </FormField>
          <FormField label="Sorumlu Kişi" required>
            <select
              className={inputClass}
              value={editResp}
              onChange={(e) => setEditResp(e.target.value)}
              disabled={savingEdit}
            >
              {adminVolunteers.map((v) => (
                <option key={v.id} value={v.name}>
                  {v.name} ({v.role})
                </option>
              ))}
            </select>
          </FormField>
        </div>
      </Modal>

      {/* ── KAPANIS MODAL ────────────────────────────────────────────────── */}
      <Modal
        open={openKapanis !== null}
        onClose={() => !savingKapanis && setOpenKapanis(null)}
        title={openKapanis ? `Kapanış — Stant #${openKapanis.id}` : ""}
        description={openKapanis?.location}
        footer={
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpenKapanis(null)}
              disabled={savingKapanis}
            >
              İptal
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSaveKapanis}
              disabled={savingKapanis}
            >
              {savingKapanis ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Kaydediliyor…
                </>
              ) : (
                "Kaydet"
              )}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {errorMsg && openKapanis && (
            <div className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-body-sm text-red-700">
              {errorMsg}
            </div>
          )}
          <FormField label="Tarih" required>
            <input
              type="date"
              className={inputClass}
              value={kapanisDate}
              onChange={(e) => setKapanisDate(e.target.value)}
              disabled={savingKapanis}
            />
          </FormField>
          <FormField label="Sayılan Tutar (₺)" required>
            <input
              type="number"
              inputMode="decimal"
              step="0.01"
              className={inputClass}
              placeholder="0,00"
              value={kapanisAmount}
              onChange={(e) => setKapanisAmount(e.target.value)}
              disabled={savingKapanis}
            />
          </FormField>
          <FormField label="Sorumlu Kişi" required>
            <select
              className={inputClass}
              value={kapanisResp}
              onChange={(e) => setKapanisResp(e.target.value)}
              disabled={savingKapanis}
            >
              {adminVolunteers.map((v) => (
                <option key={v.id} value={v.name}>
                  {v.name}
                </option>
              ))}
            </select>
          </FormField>
          <FormField
            label="Tutanak Fotoğrafı"
            required
            hint="Kapanış tutanağı veya nakit fotoğrafı (zorunlu)"
          >
            <label
              className={`flex items-center justify-center gap-2 px-4 py-6 rounded-lg border-2 border-dashed border-outline-variant bg-surface-container-low hover:border-secondary hover:bg-secondary-container/20 cursor-pointer transition text-on-surface-variant ${
                savingKapanis ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <Camera className="w-5 h-5" />
              <span className="text-body-sm break-all">
                {kapanisFile ? kapanisFile.name : "Fotoğraf seç"}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setKapanisFile(e.target.files?.[0] ?? null)}
                disabled={savingKapanis}
              />
            </label>
          </FormField>
        </div>
      </Modal>

      {/* ── GECMIS MODAL ─────────────────────────────────────────────────── */}
      <Modal
        open={openGecmis !== null}
        onClose={() => setOpenGecmis(null)}
        title={openGecmis ? `Geçmiş — Stant #${openGecmis.id}` : ""}
        description={openGecmis?.location}
        footer={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpenGecmis(null)}
          >
            Kapat
          </Button>
        }
      >
        <div className="space-y-4">
          {/* Filter chips */}
          <div className="flex flex-wrap gap-2">
            {(
              [
                { k: "bugun", l: "Bugün" },
                { k: "hafta", l: "Bu Hafta" },
                { k: "ay", l: "Bu Ay" },
                { k: "tum", l: "Tüm Zamanlar" },
              ] as { k: GecmisFilter; l: string }[]
            ).map(({ k, l }) => (
              <button
                key={k}
                onClick={() => setGecmisFilter(k)}
                className={`px-3 py-1.5 rounded-full text-label-sm font-medium transition ${
                  gecmisFilter === k
                    ? "bg-secondary text-on-secondary"
                    : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Summary */}
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg border border-outline-variant bg-surface-container-low p-3">
              <p className="text-label-sm text-on-surface-variant flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                Toplam
              </p>
              <p className="text-body-md font-bold text-on-surface tabular-nums mt-0.5">
                {formatCurrency(gecmisSummary.total, "TRY")}
              </p>
            </div>
            <div className="rounded-lg border border-outline-variant bg-surface-container-low p-3">
              <p className="text-label-sm text-on-surface-variant flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Kapanış
              </p>
              <p className="text-body-md font-bold text-on-surface tabular-nums mt-0.5">
                {gecmisSummary.count}
              </p>
            </div>
            <div className="rounded-lg border border-outline-variant bg-surface-container-low p-3">
              <p className="text-label-sm text-on-surface-variant">Ortalama</p>
              <p className="text-body-md font-bold text-on-surface tabular-nums mt-0.5">
                {formatCurrency(gecmisSummary.avg, "TRY")}
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-lg border border-outline-variant overflow-hidden">
            {gecmisLoading ? (
              <div className="p-6 flex items-center justify-center text-on-surface-variant">
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Yükleniyor…
              </div>
            ) : gecmisError ? (
              <div className="p-4 text-center text-body-sm text-red-700 bg-red-50">
                {gecmisError}
              </div>
            ) : filteredGecmis.length === 0 ? (
              <div className="p-6 text-center text-body-sm text-on-surface-variant">
                Bu aralıkta kayıt yok.
              </div>
            ) : (
              <div className="overflow-x-auto max-h-[300px]">
                <table className="w-full text-body-sm">
                  <thead className="bg-surface-container-low border-b border-outline-variant sticky top-0">
                    <tr className="text-left text-label-sm text-on-surface-variant">
                      <th className="px-3 py-2 font-semibold">Tarih</th>
                      <th className="px-3 py-2 font-semibold text-right">
                        Tutar
                      </th>
                      <th className="px-3 py-2 font-semibold">Sorumlu</th>
                      <th className="px-3 py-2 font-semibold">Tutanak</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGecmis.map((r, i) => (
                      <tr
                        key={r.id ?? `${r.date}-${i}`}
                        className="border-b border-outline-variant last:border-0"
                      >
                        <td className="px-3 py-2 text-on-surface tabular-nums whitespace-nowrap">
                          {r.date}
                        </td>
                        <td className="px-3 py-2 text-right font-semibold text-on-surface tabular-nums whitespace-nowrap">
                          {formatCurrency(r.amount, "TRY")}
                        </td>
                        <td className="px-3 py-2 text-on-surface-variant">
                          {r.responsible || "—"}
                        </td>
                        <td className="px-3 py-2">
                          {r.tutanakFoto ? (
                            <button
                              type="button"
                              onClick={() =>
                                setPreviewPhoto(r.tutanakFoto ?? null)
                              }
                              className="w-12 h-12 rounded-md overflow-hidden border border-outline-variant hover:border-secondary transition cursor-zoom-in"
                              aria-label="Tutanak fotoğrafını büyüt"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={r.tutanakFoto}
                                alt="Tutanak"
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
}
