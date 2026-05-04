"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  Camera,
  Image as ImageIcon,
  Loader2,
  Lock,
  MapPin,
  Pencil,
  PiggyBank,
  Plus,
  User,
  X,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/Button";
import {
  FormField,
  Modal,
  StatusPill,
  formatCurrency,
  inputClass,
} from "@/components/admin/AdminUI";
import { adminVolunteers } from "@/lib/admin-mock-data";
import { demoCampaign, type Kumbara } from "@/lib/mock-campaign-data";

// ── Types ───────────────────────────────────────────────────────────────────

type KumbaraStatus = "aktif" | "kapatildi";

type KumbaraDraft = Kumbara & {
  status: KumbaraStatus;
  tutanakFoto?: string;
};

type Tab = "aktif" | "kapatildi";

// ── API & Cloudinary constants ──────────────────────────────────────────────

// Same-origin proxy route — all kumbara API calls go through here.
// The Next.js route handlers forward to the n8n webhook server-side,
// so the browser never hits n8n directly (avoids CORS issues).
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

// ── Kumbara API helpers ─────────────────────────────────────────────────────

type RawKumbara = Record<string, unknown>;

function normalizeStatus(raw: unknown): KumbaraStatus {
  if (typeof raw === "string") {
    const s = raw.toLocaleLowerCase("tr").trim();
    if (s === "kapatildi" || s === "kapatıldı" || s === "closed") return "kapatildi";
  }
  return "aktif";
}

function parseKumbara(raw: RawKumbara): KumbaraDraft | null {
  const id = String(raw.kumbara_no ?? raw.id ?? raw.no ?? "").trim();
  if (!id) return null;
  const location = String(raw.konum ?? raw.location ?? raw.lokasyon ?? "");
  const responsible = String(raw.sorumlu ?? raw.responsible ?? "");
  const total = Number(raw.toplam ?? raw.total ?? 0) || 0;
  const lastOpened = String(
    raw.son_acilis ?? raw.lastOpened ?? raw.son_acilis_tarihi ?? "—",
  );
  const status = normalizeStatus(raw.durum ?? raw.status);

  let tutanakFoto: string | undefined;
  const fotoRaw =
    raw.tutanak_foto ?? raw.tutanakFoto ?? raw.foto_url ?? raw.photo_url ?? null;
  if (typeof fotoRaw === "string" && fotoRaw.trim()) {
    tutanakFoto = fotoRaw.trim();
  }

  return { id, location, responsible, total, lastOpened, status, tutanakFoto };
}

type FetchResult = { items: KumbaraDraft[]; ok: boolean; reason?: string };

async function fetchKumbaralar(): Promise<FetchResult> {
  try {
    // Use same-origin proxy to bypass CORS issues with the n8n webhook.
    const res = await fetch(`${PROXY_BASE}/kumbaralar`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      // eslint-disable-next-line no-console
      console.warn(`[kumbaralar] API ${res.status} ${res.statusText}`);
      return { items: [], ok: false, reason: `HTTP ${res.status}` };
    }
    const data: unknown = await res.json();

    // Unwrap common response envelopes (n8n sometimes wraps in { data: [...] } etc.)
    let arr: unknown = data;
    if (data && typeof data === "object" && !Array.isArray(data)) {
      const obj = data as Record<string, unknown>;
      if (Array.isArray(obj.data)) arr = obj.data;
      else if (Array.isArray(obj.items)) arr = obj.items;
      else if (Array.isArray(obj.result)) arr = obj.result;
      else if (Array.isArray(obj.kumbaralar)) arr = obj.kumbaralar;
      else if (Array.isArray(obj.rows)) arr = obj.rows;
    }
    if (!Array.isArray(arr)) arr = [arr];

    const items = (arr as RawKumbara[])
      .map(parseKumbara)
      .filter((k): k is KumbaraDraft => k !== null);
    return { items, ok: true };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("[kumbaralar] fetch failed:", e);
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

/** Extract a human-readable error from common API response shapes. */
function extractErrorMessage(raw: unknown, fallback: string): string {
  if (typeof raw === "string" && raw.trim()) return raw.trim();
  if (raw && typeof raw === "object") {
    const obj = raw as Record<string, unknown>;
    for (const key of ["message", "error", "reason", "detail", "hint"] as const) {
      const v = obj[key];
      if (typeof v === "string" && v.trim()) return v.trim();
    }
    // n8n sometimes nests: { error: { message: "..." } }
    const nested = obj.error;
    if (nested && typeof nested === "object") {
      const nestedMsg = (nested as Record<string, unknown>).message;
      if (typeof nestedMsg === "string" && nestedMsg.trim()) return nestedMsg.trim();
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

    // Read body once — JSON if possible, otherwise text
    const contentType = res.headers.get("content-type") ?? "";
    let raw: unknown = null;
    try {
      if (contentType.includes("application/json")) {
        raw = await res.json();
      } else {
        const text = await res.text();
        raw = text || null;
      }
    } catch {
      // body unreadable — leave raw as null
    }

    if (!res.ok) {
      const fallback = `HTTP ${res.status} ${res.statusText || "Hata"}`.trim();
      const message = extractErrorMessage(raw, fallback);
      // eslint-disable-next-line no-console
      console.error(`[postJson] ${path} failed:`, {
        status: res.status,
        statusText: res.statusText,
        body: raw,
        sentBody: body,
      });
      return { ok: false, status: res.status, message, raw };
    }

    return { ok: true, data: raw };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(`[postJson] ${path} network error:`, e, { sentBody: body });
    return {
      ok: false,
      status: 0,
      message: e instanceof Error ? e.message : "Ağ hatası",
    };
  }
}

// ── Page component ──────────────────────────────────────────────────────────

export default function KumbaralarPage() {
  // Start empty — populated by API. Mock only used as fallback if API fails.
  const [items, setItems] = useState<KumbaraDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingEntry, setSavingEntry] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("aktif");
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEntry, setOpenEntry] = useState<KumbaraDraft | null>(null);
  const [openEdit, setOpenEdit] = useState<KumbaraDraft | null>(null);

  const [newLocation, setNewLocation] = useState("");
  const [newResp, setNewResp] = useState(adminVolunteers[0]?.name ?? "");
  const [newKumbaraNo, setNewKumbaraNo] = useState("");
  const [computingId, setComputingId] = useState(false);
  const [savingAdd, setSavingAdd] = useState(false);

  const [entryDate, setEntryDate] = useState(new Date().toISOString().slice(0, 10));
  const [entryAmount, setEntryAmount] = useState("");
  const [entryResp, setEntryResp] = useState("");
  const [entryFile, setEntryFile] = useState<File | null>(null);

  const [editLocation, setEditLocation] = useState("");
  const [editResp, setEditResp] = useState("");

  // ── Initial fetch from API ────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;
    (async () => {
      const result = await fetchKumbaralar();
      if (!mounted) return;
      if (result.ok) {
        // API succeeded — use whatever DB returned (even an empty list)
        setItems(result.items);
        setApiError(null);
      } else {
        // API failed — fall back to mock data and surface the error
        setItems(
          demoCampaign.transparency.kumbaralar.map((k) => ({
            ...k,
            status: "aktif" as KumbaraStatus,
          })),
        );
        setApiError(result.reason ?? "API'ye ulaşılamadı");
      }
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // ── Derived ───────────────────────────────────────────────────────────────
  const aktifItems = useMemo(
    () => items.filter((k) => k.status === "aktif"),
    [items],
  );
  const kapatildiItems = useMemo(
    () => items.filter((k) => k.status === "kapatildi"),
    [items],
  );
  const visibleItems = tab === "aktif" ? aktifItems : kapatildiItems;
  const totalRaised = items.reduce((s, k) => s + k.total, 0);

  /**
   * Computes the next K-XX id strictly from the DB list.
   * Strategy:
   *   1) For each kumbara, take its kumbara_no, strip the "K-" (or "K") prefix.
   *   2) parseInt the remainder. Skip anything unparseable.
   *   3) max + 1, zero-padded to 2 digits → "K-01", "K-02", "K-09", "K-10", ...
   *   4) Empty list → "K-01".
   * Logs the inputs, the max, and the produced id for debugging.
   */
  const computeNextKumbaraNo = (list: KumbaraDraft[]): string => {
    const allNos = list.map((k) => k.id);
    const numbers = allNos
      .map((no) => {
        // "K-" / "K" prefix (case-insensitive) kaldır, kalanı int'e çevir
        const stripped = no.replace(/^[Kk]-?/, "").trim();
        const n = parseInt(stripped, 10);
        return Number.isNaN(n) ? null : n;
      })
      .filter((n): n is number => n !== null);
    const max = numbers.length > 0 ? Math.max(...numbers) : 0;
    const next = max + 1;
    const newNo = `K-${String(next).padStart(2, "0")}`;

    // eslint-disable-next-line no-console
    console.log("[kumbara-ekle] DB'den gelen tüm kumbara no'ları:", allNos);
    // eslint-disable-next-line no-console
    console.log("[kumbara-ekle] parse edilen sayılar:", numbers);
    // eslint-disable-next-line no-console
    console.log("[kumbara-ekle] max bulunan:", max);
    // eslint-disable-next-line no-console
    console.log("[kumbara-ekle] üretilen yeni numara:", newNo);

    return newNo;
  };

  /**
   * Open Add modal. Always fetches fresh DB list and computes the next id
   * strictly from that DB response — never from local state. If the fetch
   * fails, the id is left empty and an error is shown so the user can retry.
   */
  const handleOpenAdd = async () => {
    setErrorMsg(null);
    setOpenAdd(true);
    setNewLocation("");
    setNewResp(adminVolunteers[0]?.name ?? "");
    setNewKumbaraNo("");
    setComputingId(true);

    const result = await fetchKumbaralar();
    if (result.ok) {
      // Source of truth for id calculation is the DB list (result.items),
      // never the local items state.
      setItems(result.items);
      setApiError(null);
      setNewKumbaraNo(computeNextKumbaraNo(result.items));
    } else {
      // DB read failed — block the form, show error, no local fallback.
      // eslint-disable-next-line no-console
      console.warn("[kumbara-ekle] modal açılışında fetch fail:", result.reason);
      setErrorMsg(
        `Kumbara no DB'den hesaplanamadı (${result.reason ?? "API'ye ulaşılamadı"}). Modalı kapatıp tekrar açın.`,
      );
      setNewKumbaraNo("");
    }
    setComputingId(false);
  };

  const handleAdd = async () => {
    if (!newLocation.trim() || !newKumbaraNo) return;

    setSavingAdd(true);
    setErrorMsg(null);
    try {
      const result = await postJson("/kumbara-ekle", {
        kumbara_no: newKumbaraNo,
        konum: newLocation.trim(),
        sorumlu: newResp,
      });

      if (result.ok) {
        // eslint-disable-next-line no-console
        console.log(`[kumbara-ekle] başarılı:`, {
          kumbara_no: newKumbaraNo,
          response: result.data,
        });
      } else {
        // Endpoint yok / hata — şimdilik mock başarı uygula, console'a logla
        // eslint-disable-next-line no-console
        console.warn(
          `[kumbara-ekle] endpoint hatası, mock başarı kullanılıyor: ${result.message}`,
          {
            status: result.status,
            payload: {
              kumbara_no: newKumbaraNo,
              konum: newLocation.trim(),
              sorumlu: newResp,
            },
            response: result.raw,
          },
        );
      }

      // Local state'e elle ekleme YAPMA — DB'den taze listeyi yeniden çek.
      // Endpoint gerçekten kayıt ettiyse yeni satır listede görünür; mock
      // başarı durumunda DB değişmedi → yeni satır görünmez (doğru davranış).
      const fresh = await fetchKumbaralar();
      if (fresh.ok) {
        setItems(fresh.items);
        setApiError(null);
      } else {
        // eslint-disable-next-line no-console
        console.warn(
          "[kumbara-ekle] post-add fetch fail:",
          fresh.reason,
        );
        setApiError(fresh.reason ?? "API'ye ulaşılamadı");
      }

      setNewLocation("");
      setNewKumbaraNo("");
      setOpenAdd(false);
      setTab("aktif");
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("[kumbara-ekle] beklenmeyen hata:", e);
      setErrorMsg(e instanceof Error ? e.message : "Ekleme başarısız.");
    } finally {
      setSavingAdd(false);
    }
  };

  const handleSaveEntry = async () => {
    if (!openEntry || !entryAmount) return;
    const amount = parseFloat(entryAmount.replace(",", "."));
    if (Number.isNaN(amount) || amount <= 0) {
      setErrorMsg("Geçerli bir tutar girin.");
      return;
    }
    if (!entryFile) {
      setErrorMsg("Tutanak fotoğrafı zorunludur.");
      return;
    }

    setSavingEntry(true);
    setErrorMsg(null);
    try {
      // 1) Upload photo to Cloudinary
      const photoUrl = await uploadToCloudinary(entryFile);

      // 2) POST entry to n8n webhook
      const entryResult = await postJson("/kumbara-acilis", {
        kumbara_no: openEntry.id,
        tutar: amount,
        tarih: entryDate,
        sorumlu: entryResp || openEntry.responsible,
        tutanak_foto: photoUrl,
      });
      if (!entryResult.ok) {
        throw new Error(
          `Açılış kaydı reddedildi: ${entryResult.message}`,
        );
      }

      // 3) Close the kumbara on backend (best-effort)
      const closeResult = await postJson("/kumbara-guncelle", {
        kumbara_no: openEntry.id,
        durum: "kapatildi",
      });
      if (!closeResult.ok) {
        // Açılış was already recorded; backend close failed.
        // Still close locally so user UX is consistent — next page load will sync.
        // eslint-disable-next-line no-console
        console.warn(
          `Kumbara ${openEntry.id} açılışı kaydedildi ama backend kapama başarısız: ${closeResult.message}`,
        );
      }

      // 4) Reflect in local state — close + add total + photo
      setItems((prev) =>
        prev.map((k) =>
          k.id === openEntry.id
            ? {
                ...k,
                total: k.total + amount,
                lastOpened: entryDate,
                responsible: entryResp || k.responsible,
                status: "kapatildi" as KumbaraStatus,
                tutanakFoto: photoUrl,
              }
            : k,
        ),
      );
      setOpenEntry(null);
      setEntryAmount("");
      setEntryFile(null);
      // Switch to closed tab so user sees the moved item
      setTab("kapatildi");
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Kayıt başarısız.");
    } finally {
      setSavingEntry(false);
    }
  };

  const openEntryModal = (k: KumbaraDraft) => {
    setErrorMsg(null);
    setOpenEntry(k);
    setEntryResp(k.responsible);
    setEntryAmount("");
    setEntryDate(new Date().toISOString().slice(0, 10));
    setEntryFile(null);
  };

  const openEditModal = (k: KumbaraDraft) => {
    setErrorMsg(null);
    setOpenEdit(k);
    setEditLocation(k.location);
    setEditResp(k.responsible);
  };

  const handleSaveEdit = async () => {
    if (!openEdit || !editLocation.trim()) return;
    setSavingEdit(true);
    setErrorMsg(null);
    try {
      const result = await postJson("/kumbara-guncelle", {
        kumbara_no: openEdit.id,
        konum: editLocation.trim(),
        sorumlu: editResp,
        durum: "aktif",
      });
      if (!result.ok) {
        throw new Error(`Güncelleme reddedildi: ${result.message}`);
      }

      setItems((prev) =>
        prev.map((k) =>
          k.id === openEdit.id
            ? {
                ...k,
                location: editLocation.trim(),
                responsible: editResp,
              }
            : k,
        ),
      );
      setOpenEdit(null);
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Güncelleme başarısız.");
    } finally {
      setSavingEdit(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <AdminLayout
      title="Kumbaralar"
      subtitle={
        loading
          ? "Yükleniyor…"
          : `${items.length} kumbara — toplam ₺${totalRaised.toLocaleString("tr-TR")}`
      }
      actions={
        <Button variant="primary" size="sm" onClick={handleOpenAdd}>
          <Plus className="w-4 h-4" />
          Kumbara Ekle
        </Button>
      }
    >
      {/* API error banner — shown when fetch failed and mock fallback is in use */}
      {apiError && !loading && (
        <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-body-sm text-amber-900 flex items-start gap-2">
          <span className="font-bold shrink-0">⚠</span>
          <div className="min-w-0">
            <p className="font-semibold">API'ye ulaşılamadı — mock veri gösteriliyor.</p>
            <p className="text-label-sm text-amber-800 mt-0.5 break-all">
              {apiError}. n8n endpoint'ini ve CORS başlıklarını kontrol edin.
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Kumbara sekmeleri"
        className="flex gap-1 mb-4 border-b border-outline-variant overflow-x-auto -mx-1 px-1"
      >
        <button
          role="tab"
          aria-selected={tab === "aktif"}
          onClick={() => setTab("aktif")}
          className={`px-4 py-2.5 text-label-md font-semibold whitespace-nowrap transition border-b-2 -mb-px min-h-[44px] ${
            tab === "aktif"
              ? "border-secondary text-secondary"
              : "border-transparent text-on-surface-variant hover:text-on-surface"
          }`}
        >
          Aktif Kumbaralar
          <span
            className={`ml-2 inline-flex items-center justify-center min-w-[22px] h-5 px-1.5 rounded-full text-[11px] font-bold ${
              tab === "aktif"
                ? "bg-secondary-container text-secondary"
                : "bg-surface-container text-on-surface-variant"
            }`}
          >
            {aktifItems.length}
          </span>
        </button>
        <button
          role="tab"
          aria-selected={tab === "kapatildi"}
          onClick={() => setTab("kapatildi")}
          className={`px-4 py-2.5 text-label-md font-semibold whitespace-nowrap transition border-b-2 -mb-px min-h-[44px] ${
            tab === "kapatildi"
              ? "border-secondary text-secondary"
              : "border-transparent text-on-surface-variant hover:text-on-surface"
          }`}
        >
          Kapatıldı
          <span
            className={`ml-2 inline-flex items-center justify-center min-w-[22px] h-5 px-1.5 rounded-full text-[11px] font-bold ${
              tab === "kapatildi"
                ? "bg-red-100 text-red-700"
                : "bg-surface-container text-on-surface-variant"
            }`}
          >
            {kapatildiItems.length}
          </span>
        </button>
      </div>

      {/* Cards */}
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
      ) : visibleItems.length === 0 ? (
        <div className="rounded-xl border border-dashed border-outline-variant bg-surface-container-low p-10 text-center">
          <PiggyBank className="w-10 h-10 mx-auto mb-3 text-on-surface-variant/60" />
          <p className="text-body-md text-on-surface-variant">
            {tab === "aktif"
              ? "Aktif kumbara yok. Yeni bir kumbara ekleyebilirsiniz."
              : "Henüz kapatılmış kumbara yok."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleItems.map((k) => (
            <article
              key={k.id}
              className={`rounded-xl border overflow-hidden transition ${
                k.status === "aktif"
                  ? "bg-surface-container-lowest border-outline-variant hover:border-secondary hover:shadow-[0_4px_12px_rgba(0,24,53,0.08)]"
                  : "bg-surface-container-low border-outline-variant"
              }`}
            >
              <div className="px-5 pt-4 pb-3 border-b border-outline-variant flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      k.status === "aktif"
                        ? "bg-secondary-container/40 text-secondary"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {k.status === "aktif" ? (
                      <PiggyBank className="w-4 h-4" />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-label-sm text-on-surface-variant">Kumbara No</p>
                    <p className="text-body-lg font-semibold text-on-surface truncate">
                      #{k.id}
                    </p>
                  </div>
                </div>
                {k.status === "aktif" ? (
                  <StatusPill status="Aktif" />
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-red-200 bg-red-50 text-red-700 text-label-sm font-medium shrink-0">
                    <Lock className="w-3 h-3" />
                    Kapatıldı
                  </span>
                )}
              </div>

              <div className="px-5 py-4 space-y-2.5 text-body-sm">
                <div className="flex items-start gap-2 text-on-surface-variant">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                  <span className="text-on-surface break-words">{k.location}</span>
                </div>
                <div className="flex items-start gap-2 text-on-surface-variant">
                  <User className="w-4 h-4 mt-0.5 shrink-0" />
                  <span className="text-on-surface break-words">{k.responsible}</span>
                </div>
                <div className="pt-2 mt-2 border-t border-outline-variant flex items-center justify-between gap-2">
                  <span className="text-label-sm text-on-surface-variant">Toplanan</span>
                  <span className="font-bold text-on-surface tabular-nums">
                    {formatCurrency(k.total, "TRY")}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-label-sm text-on-surface-variant inline-flex items-center gap-1">
                    {k.status === "kapatildi" ? (
                      <>
                        <Calendar className="w-3.5 h-3.5" />
                        Kapanış
                      </>
                    ) : (
                      "Son açılış"
                    )}
                  </span>
                  <span className="text-label-md text-on-surface tabular-nums">
                    {k.lastOpened}
                  </span>
                </div>

                {/* Photo thumbnail (closed tab only when present) */}
                {k.status === "kapatildi" && k.tutanakFoto && (
                  <button
                    type="button"
                    onClick={() => setPreviewPhoto(k.tutanakFoto ?? null)}
                    className="mt-2 w-full h-28 rounded-lg overflow-hidden bg-surface-container-high border border-outline-variant hover:opacity-90 hover:border-secondary transition cursor-zoom-in flex items-center justify-center"
                    aria-label="Tutanak fotoğrafını büyüt"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={k.tutanakFoto}
                      alt={`Kumbara #${k.id} tutanak fotoğrafı`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                )}
                {k.status === "kapatildi" && !k.tutanakFoto && (
                  <div className="mt-2 w-full h-20 rounded-lg bg-surface-container-high/40 border border-dashed border-outline-variant flex items-center justify-center text-on-surface-variant/70 text-label-sm gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5" />
                    Tutanak yok
                  </div>
                )}
              </div>

              {/* Action buttons — only on aktif tab */}
              {k.status === "aktif" && (
                <div className="px-5 pb-4 pt-1 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => openEditModal(k)}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-outline-variant text-label-md text-on-surface hover:bg-surface-container-low transition min-h-[40px]"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Düzenle
                  </button>
                  <button
                    onClick={() => openEntryModal(k)}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-secondary text-on-secondary font-semibold text-label-md hover:bg-on-secondary-container transition min-h-[40px]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Açılış Kaydet
                  </button>
                </div>
              )}
            </article>
          ))}
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

      {/* Add modal */}
      <Modal
        open={openAdd}
        onClose={() => !savingAdd && setOpenAdd(false)}
        title="Yeni Kumbara"
        description="Yeni bir kumbara konumu ekleyin"
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
                !newKumbaraNo ||
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
          <FormField label="Kumbara No" hint="Otomatik üretildi, değiştirilemez">
            <input
              className={inputClass}
              value={computingId ? "Hesaplanıyor…" : newKumbaraNo}
              readOnly
              disabled
            />
          </FormField>
          <FormField label="Konum" required>
            <input
              className={inputClass}
              placeholder="Örn: Kadıköy Meydan"
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

      {/* Entry modal */}
      <Modal
        open={openEntry !== null}
        onClose={() => !savingEntry && setOpenEntry(null)}
        title={openEntry ? `Açılış Kaydı — Kumbara #${openEntry.id}` : ""}
        description={openEntry?.location}
        footer={
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpenEntry(null)}
              disabled={savingEntry}
            >
              İptal
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSaveEntry}
              disabled={savingEntry}
            >
              {savingEntry ? (
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
          {errorMsg && openEntry && (
            <div className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-body-sm text-red-700">
              {errorMsg}
            </div>
          )}
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-label-sm text-amber-800">
            Bu açılış kaydedildikten sonra kumbara <strong>kapatılacak</strong> ve
            artık düzenlenemeyecek.
          </div>
          <FormField label="Tarih" required>
            <input
              type="date"
              className={inputClass}
              value={entryDate}
              onChange={(e) => setEntryDate(e.target.value)}
              disabled={savingEntry}
            />
          </FormField>
          <FormField label="Sayılan Tutar (₺)" required>
            <input
              type="number"
              inputMode="decimal"
              step="0.01"
              className={inputClass}
              placeholder="0,00"
              value={entryAmount}
              onChange={(e) => setEntryAmount(e.target.value)}
              disabled={savingEntry}
            />
          </FormField>
          <FormField label="Sorumlu Kişi" required>
            <select
              className={inputClass}
              value={entryResp}
              onChange={(e) => setEntryResp(e.target.value)}
              disabled={savingEntry}
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
            hint="Açılış tutanağı veya nakit fotoğrafı (zorunlu)"
          >
            <label
              className={`flex items-center justify-center gap-2 px-4 py-6 rounded-lg border-2 border-dashed border-outline-variant bg-surface-container-low hover:border-secondary hover:bg-secondary-container/20 cursor-pointer transition text-on-surface-variant ${
                savingEntry ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <Camera className="w-5 h-5" />
              <span className="text-body-sm break-all">
                {entryFile ? entryFile.name : "Fotoğraf seç"}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setEntryFile(e.target.files?.[0] ?? null)}
                disabled={savingEntry}
              />
            </label>
          </FormField>
        </div>
      </Modal>

      {/* Edit modal */}
      <Modal
        open={openEdit !== null}
        onClose={() => !savingEdit && setOpenEdit(null)}
        title={openEdit ? `Düzenle — Kumbara #${openEdit.id}` : ""}
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
              disabled={savingEdit}
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
    </AdminLayout>
  );
}
