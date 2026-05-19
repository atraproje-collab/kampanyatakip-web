"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  ClipboardList,
  Loader2,
  Pencil,
  Phone,
  Plus,
  Sparkles,
  Trash2,
  User,
  Users,
} from "lucide-react";
import { ModuleActiveGate } from "@/components/master-admin/ModuleActiveGate";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/Button";
import {
  FormField,
  Modal,
  inputClass,
} from "@/components/admin/AdminUI";
import { adminVolunteers } from "@/lib/admin-mock-data";

// ── Types ───────────────────────────────────────────────────────────────────

type GonulluTip = "genel" | "gorevli";

type Gorev =
  | "Kumbara Sorumlusu"
  | "Stant Sorumlusu"
  | "Sosyal Medya"
  | "Lojistik"
  | "Diğer";

const GOREV_OPTIONS: Gorev[] = [
  "Kumbara Sorumlusu",
  "Stant Sorumlusu",
  "Sosyal Medya",
  "Lojistik",
  "Diğer",
];

type Gonullu = {
  id: string;
  name: string;
  phone?: string;
  type: GonulluTip;
  gorev?: Gorev;
  notes?: string;
};

type Tab = "tum" | "gorevliler" | "performans";

// ── API constants ───────────────────────────────────────────────────────────

const PROXY_BASE = "/api/kampanya/demo-defne";

// ── Parsing ─────────────────────────────────────────────────────────────────

type RawRow = Record<string, unknown>;

function parseTip(raw: unknown): GonulluTip {
  if (typeof raw === "string") {
    const s = raw.toLocaleLowerCase("tr").trim();
    if (s === "gorevli" || s === "görevli") return "gorevli";
  }
  return "genel";
}

function parseGorev(raw: unknown): Gorev | undefined {
  if (typeof raw !== "string") return undefined;
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  const found = GOREV_OPTIONS.find(
    (g) => g.toLocaleLowerCase("tr") === trimmed.toLocaleLowerCase("tr"),
  );
  if (found) return found;
  // Tanımlı değilse "Diğer" olarak ele al, orijinal metin notes'da kalmasın
  return "Diğer";
}

function parseGonullu(raw: RawRow): Gonullu | null {
  const id = String(raw.id ?? raw.gonullu_id ?? raw.no ?? "").trim();
  const name = String(raw.ad_soyad ?? raw.name ?? raw.isim ?? "").trim();
  if (!id || !name) return null;
  const phoneRaw = raw.telefon ?? raw.phone ?? "";
  const phone =
    typeof phoneRaw === "string" && phoneRaw.trim() ? phoneRaw.trim() : undefined;
  const type = parseTip(raw.tip ?? raw.type ?? raw.kategori);
  const gorev =
    type === "gorevli" ? parseGorev(raw.gorev ?? raw.role ?? raw.task) : undefined;
  const notesRaw = raw.notlar ?? raw.notes ?? raw.aciklama ?? "";
  const notes =
    typeof notesRaw === "string" && notesRaw.trim() ? notesRaw.trim() : undefined;
  return { id, name, phone, type, gorev, notes };
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
    else if (Array.isArray(obj.gonulluler)) arr = obj.gonulluler;
  }
  if (!Array.isArray(arr)) arr = [arr];
  return arr as unknown[];
}

// ── API helpers ─────────────────────────────────────────────────────────────

type FetchResult = { items: Gonullu[]; ok: boolean; reason?: string };

async function fetchGonulluler(): Promise<FetchResult> {
  try {
    const res = await fetch(`${PROXY_BASE}/gonulluler`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      // eslint-disable-next-line no-console
      console.warn(`[gonulluler] API ${res.status} ${res.statusText}`);
      return { items: [], ok: false, reason: `HTTP ${res.status}` };
    }
    const data: unknown = await res.json();
    const arr = unwrapArray(data, "gonulluler");
    const items = (arr as RawRow[])
      .map(parseGonullu)
      .filter((g): g is Gonullu => g !== null);
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
// API hata verirse mock data göster (ama API hata banner'ı da görünür).
function mockFallback(): Gonullu[] {
  return adminVolunteers.map((v): Gonullu => {
    const role = v.role.toLocaleLowerCase("tr");
    let type: GonulluTip = "genel";
    let gorev: Gorev | undefined;
    if (role.includes("kumbara")) {
      type = "gorevli";
      gorev = "Kumbara Sorumlusu";
    } else if (role.includes("stant")) {
      type = "gorevli";
      gorev = "Stant Sorumlusu";
    } else if (role.includes("sosyal")) {
      type = "gorevli";
      gorev = "Sosyal Medya";
    } else if (role.includes("lojistik")) {
      type = "gorevli";
      gorev = "Lojistik";
    }
    return {
      id: v.id,
      name: v.name,
      phone: v.phone,
      type,
      gorev,
      notes: v.assignedTo && v.assignedTo !== "Genel" ? v.assignedTo : undefined,
    };
  });
}

// ── Telefon biçimi: 05XX XXX XX XX ───────────────────────────────────────────
function formatPhoneLive(input: string): string {
  // Sadece rakamları al
  const digits = input.replace(/\D/g, "").slice(0, 11);
  if (digits.length === 0) return "";
  // 05XX XXX XX XX gruplaması
  const parts: string[] = [];
  if (digits.length >= 4) parts.push(digits.slice(0, 4));
  else parts.push(digits);
  if (digits.length > 4) parts.push(digits.slice(4, 7));
  if (digits.length > 7) parts.push(digits.slice(7, 9));
  if (digits.length > 9) parts.push(digits.slice(9, 11));
  return parts.join(" ");
}

// ── Page component ──────────────────────────────────────────────────────────

export default function GonullulerPage() {
  return (
    <ModuleActiveGate slug="demo-defne" moduleKey="gonullu">
      <GonullulerPageInner />
    </ModuleActiveGate>
  );
}

function GonullulerPageInner() {
  const [items, setItems] = useState<Gonullu[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("tum");

  // Add/Edit modal — null = kapalı, "new" = ekleme, Gonullu = düzenleme
  const [editTarget, setEditTarget] = useState<Gonullu | "new" | null>(null);
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formType, setFormType] = useState<GonulluTip>("genel");
  const [formGorev, setFormGorev] = useState<Gorev>("Kumbara Sorumlusu");
  const [formNotes, setFormNotes] = useState("");
  const [savingForm, setSavingForm] = useState(false);

  // Delete confirm modal
  const [deleteTarget, setDeleteTarget] = useState<Gonullu | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ── Initial fetch ─────────────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;
    (async () => {
      const result = await fetchGonulluler();
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
    const fresh = await fetchGonulluler();
    if (fresh.ok) {
      setItems(fresh.items);
      setApiError(null);
    } else {
      setApiError(fresh.reason ?? "API'ye ulaşılamadı");
    }
  };

  // ── Derived ───────────────────────────────────────────────────────────────
  const gorevliler = useMemo(
    () => items.filter((g) => g.type === "gorevli"),
    [items],
  );
  const visibleItems = tab === "gorevliler" ? gorevliler : items;

  // ── Handlers ──────────────────────────────────────────────────────────────

  const openAddModal = () => {
    setErrorMsg(null);
    setEditTarget("new");
    setFormName("");
    setFormPhone("");
    setFormType("genel");
    setFormGorev("Kumbara Sorumlusu");
    setFormNotes("");
  };

  const openEditModal = (g: Gonullu) => {
    setErrorMsg(null);
    setEditTarget(g);
    setFormName(g.name);
    setFormPhone(g.phone ?? "");
    setFormType(g.type);
    setFormGorev(g.gorev ?? "Kumbara Sorumlusu");
    setFormNotes(g.notes ?? "");
  };

  const closeFormModal = () => {
    if (savingForm) return;
    setEditTarget(null);
  };

  const handleSaveForm = async () => {
    if (!formName.trim()) {
      setErrorMsg("Ad-soyad zorunludur.");
      return;
    }
    setSavingForm(true);
    setErrorMsg(null);
    try {
      const isNew = editTarget === "new";
      const payload: Record<string, unknown> = {
        ad_soyad: formName.trim(),
        telefon: formPhone.trim() || null,
        tip: formType,
        gorev: formType === "gorevli" ? formGorev : null,
        notlar: formNotes.trim() || null,
      };
      if (!isNew && editTarget) payload.id = editTarget.id;

      const result = await postJson(
        isNew ? "/gonullu-ekle" : "/gonullu-guncelle",
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
      const result = await postJson("/gonullu-sil", { id: deleteTarget.id });
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
      title="Gönüllüler"
      subtitle={
        loading
          ? "Yükleniyor…"
          : `${items.length} gönüllü — ${gorevliler.length} görevli`
      }
      actions={
        tab !== "performans" ? (
          <Button variant="primary" size="sm" onClick={openAddModal}>
            <Plus className="w-4 h-4" />
            Yeni Gönüllü
          </Button>
        ) : null
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

      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Gönüllü sekmeleri"
        className="flex gap-1 mb-4 border-b border-outline-variant overflow-x-auto -mx-1 px-1"
      >
        <button
          role="tab"
          aria-selected={tab === "tum"}
          onClick={() => setTab("tum")}
          className={`px-4 py-2.5 text-label-md font-semibold whitespace-nowrap transition border-b-2 -mb-px min-h-[44px] inline-flex items-center gap-1.5 ${
            tab === "tum"
              ? "border-secondary text-secondary"
              : "border-transparent text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <Users className="w-4 h-4" />
          Tüm Gönüllüler
          <span
            className={`ml-1 inline-flex items-center justify-center min-w-[22px] h-5 px-1.5 rounded-full text-[11px] font-bold ${
              tab === "tum"
                ? "bg-secondary-container text-secondary"
                : "bg-surface-container text-on-surface-variant"
            }`}
          >
            {items.length}
          </span>
        </button>
        <button
          role="tab"
          aria-selected={tab === "gorevliler"}
          onClick={() => setTab("gorevliler")}
          className={`px-4 py-2.5 text-label-md font-semibold whitespace-nowrap transition border-b-2 -mb-px min-h-[44px] inline-flex items-center gap-1.5 ${
            tab === "gorevliler"
              ? "border-secondary text-secondary"
              : "border-transparent text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <BadgeCheck className="w-4 h-4" />
          Görevliler
          <span
            className={`ml-1 inline-flex items-center justify-center min-w-[22px] h-5 px-1.5 rounded-full text-[11px] font-bold ${
              tab === "gorevliler"
                ? "bg-secondary-container text-secondary"
                : "bg-surface-container text-on-surface-variant"
            }`}
          >
            {gorevliler.length}
          </span>
        </button>
        <button
          role="tab"
          aria-selected={tab === "performans"}
          onClick={() => setTab("performans")}
          className={`px-4 py-2.5 text-label-md font-semibold whitespace-nowrap transition border-b-2 -mb-px min-h-[44px] inline-flex items-center gap-1.5 ${
            tab === "performans"
              ? "border-secondary text-secondary"
              : "border-transparent text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Performans
        </button>
      </div>

      {/* ── PERFORMANS TAB ───────────────────────────────────────────────── */}
      {tab === "performans" && (
        <div className="rounded-xl border border-dashed border-outline-variant bg-surface-container-low p-12 text-center">
          <Sparkles className="w-12 h-12 mx-auto mb-3 text-on-surface-variant/50" />
          <p className="text-headline-sm font-semibold text-on-surface mb-1">
            Yakında
          </p>
          <p className="text-body-md text-on-surface-variant max-w-md mx-auto">
            Gönüllü performans göstergeleri (toplanan tutar, açılış sayısı,
            stant kapanışı vb.) yakında bu sekmede görünecek.
          </p>
        </div>
      )}

      {/* ── LIST/GOREVLILER TAB ──────────────────────────────────────────── */}
      {tab !== "performans" && (
        <>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden"
                >
                  <div className="h-[180px] animate-pulse bg-surface-container-high/40" />
                </div>
              ))}
            </div>
          ) : visibleItems.length === 0 ? (
            <div className="rounded-xl border border-dashed border-outline-variant bg-surface-container-low p-10 text-center">
              <Users className="w-10 h-10 mx-auto mb-3 text-on-surface-variant/60" />
              <p className="text-body-md text-on-surface-variant">
                {tab === "gorevliler"
                  ? "Görevli gönüllü yok. Bir gönüllü ekleyip 'Görevli' işaretleyebilirsiniz."
                  : "Gönüllü kaydı yok. Yeni bir gönüllü ekleyebilirsiniz."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleItems.map((g) => (
                <article
                  key={g.id}
                  className="rounded-xl border bg-surface-container-lowest border-outline-variant hover:border-secondary hover:shadow-[0_4px_12px_rgba(0,24,53,0.08)] overflow-hidden transition flex flex-col"
                >
                  <div className="px-5 pt-4 pb-3 border-b border-outline-variant flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          g.type === "gorevli"
                            ? "bg-secondary-container/40 text-secondary"
                            : "bg-surface-container-high text-on-surface-variant"
                        }`}
                      >
                        <User className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-body-md font-semibold text-on-surface break-words">
                          {g.name}
                        </p>
                        <p className="text-label-sm text-on-surface-variant">
                          #{g.id}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-label-sm font-medium border ${
                        g.type === "gorevli"
                          ? "border-secondary/30 bg-secondary-container/30 text-secondary"
                          : "border-outline-variant bg-surface-container-low text-on-surface-variant"
                      }`}
                    >
                      {g.type === "gorevli" ? (
                        <>
                          <BadgeCheck className="w-3 h-3" />
                          Görevli
                        </>
                      ) : (
                        "Genel"
                      )}
                    </span>
                  </div>

                  <div className="px-5 py-4 space-y-2 text-body-sm flex-1">
                    {g.phone && (
                      <div className="flex items-start gap-2 text-on-surface-variant">
                        <Phone className="w-4 h-4 mt-0.5 shrink-0" />
                        <a
                          href={`tel:${g.phone.replace(/\s+/g, "")}`}
                          className="text-on-surface hover:text-secondary tabular-nums break-all"
                        >
                          {g.phone}
                        </a>
                      </div>
                    )}
                    {g.gorev && (
                      <div className="flex items-start gap-2 text-on-surface-variant">
                        <ClipboardList className="w-4 h-4 mt-0.5 shrink-0" />
                        <span className="text-on-surface">{g.gorev}</span>
                      </div>
                    )}
                    {g.notes && (
                      <div className="pt-2 mt-2 border-t border-outline-variant">
                        <p className="text-label-sm text-on-surface-variant mb-0.5">
                          Notlar
                        </p>
                        <p className="text-body-sm text-on-surface break-words whitespace-pre-line">
                          {g.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="px-5 pb-4 pt-1 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => openEditModal(g)}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-outline-variant text-label-md text-on-surface hover:bg-surface-container-low transition min-h-[40px]"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Düzenle
                    </button>
                    <button
                      onClick={() => setDeleteTarget(g)}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 font-medium text-label-md transition min-h-[40px]"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Sil
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── ADD/EDIT MODAL ───────────────────────────────────────────────── */}
      <Modal
        open={editTarget !== null}
        onClose={closeFormModal}
        title={editTarget === "new" ? "Yeni Gönüllü" : "Gönüllü Düzenle"}
        description={
          editTarget === "new"
            ? "Yeni bir gönüllü kaydı ekleyin"
            : "Mevcut gönüllü bilgilerini güncelleyin"
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
              disabled={savingForm || !formName.trim()}
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

          <FormField label="Ad-soyad" required>
            <input
              className={inputClass}
              placeholder="Örn: Ahmet Yıldız"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              disabled={savingForm}
              autoFocus
            />
          </FormField>

          <FormField label="Telefon" hint="Opsiyonel — 05XX XXX XX XX">
            <input
              type="tel"
              inputMode="tel"
              className={inputClass}
              placeholder="05XX XXX XX XX"
              value={formPhone}
              onChange={(e) => setFormPhone(formatPhoneLive(e.target.value))}
              disabled={savingForm}
            />
          </FormField>

          <FormField label="Tip" required>
            <div className="grid grid-cols-2 gap-2">
              <label
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border cursor-pointer transition text-body-sm ${
                  formType === "genel"
                    ? "border-secondary bg-secondary-container/30 text-secondary font-semibold"
                    : "border-outline-variant bg-surface-container-low text-on-surface-variant hover:border-secondary/40"
                } ${savingForm ? "opacity-50 pointer-events-none" : ""}`}
              >
                <input
                  type="radio"
                  name="gonullu-tip"
                  value="genel"
                  checked={formType === "genel"}
                  onChange={() => setFormType("genel")}
                  className="shrink-0"
                />
                <span>Genel Gönüllü</span>
              </label>
              <label
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border cursor-pointer transition text-body-sm ${
                  formType === "gorevli"
                    ? "border-secondary bg-secondary-container/30 text-secondary font-semibold"
                    : "border-outline-variant bg-surface-container-low text-on-surface-variant hover:border-secondary/40"
                } ${savingForm ? "opacity-50 pointer-events-none" : ""}`}
              >
                <input
                  type="radio"
                  name="gonullu-tip"
                  value="gorevli"
                  checked={formType === "gorevli"}
                  onChange={() => setFormType("gorevli")}
                  className="shrink-0"
                />
                <span>Görevli Gönüllü</span>
              </label>
            </div>
          </FormField>

          {formType === "gorevli" && (
            <FormField label="Görev" required>
              <select
                className={inputClass}
                value={formGorev}
                onChange={(e) => setFormGorev(e.target.value as Gorev)}
                disabled={savingForm}
              >
                {GOREV_OPTIONS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </FormField>
          )}

          <FormField label="Notlar" hint="Opsiyonel">
            <textarea
              className={`${inputClass} min-h-[80px] resize-y`}
              placeholder="Ek notlar..."
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              disabled={savingForm}
              rows={3}
            />
          </FormField>
        </div>
      </Modal>

      {/* ── DELETE CONFIRM MODAL ─────────────────────────────────────────── */}
      <Modal
        open={deleteTarget !== null}
        onClose={() => !deleting && setDeleteTarget(null)}
        title="Gönüllüyü Sil"
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
              <strong>{deleteTarget?.name}</strong> gönüllüsünü silmek
              istediğinize emin misiniz?
            </p>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
}
