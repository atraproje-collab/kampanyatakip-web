"use client";

import { useEffect, useState } from "react";
import { Camera, Loader2, MapPin, Pencil, PiggyBank, Plus, User } from "lucide-react";
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

type KumbaraDraft = Kumbara & { active: boolean };

// ── API & Cloudinary constants ──────────────────────────────────────────────

const API_BASE = "https://n8n.srv1587680.hstgr.cloud/webhook/kampanya/demo-defne";
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dqyr5h96s/image/upload";
const CLOUDINARY_PRESET = "kampanyatakip";

// ── Cloudinary helper ───────────────────────────────────────────────────────

/** Uploads a single file to Cloudinary using the unsigned preset. Returns secure_url. */
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

function parseKumbara(raw: RawKumbara): KumbaraDraft | null {
  const id = String(raw.kumbara_no ?? raw.id ?? raw.no ?? "").trim();
  if (!id) return null;
  const location = String(raw.konum ?? raw.location ?? raw.lokasyon ?? "");
  const responsible = String(raw.sorumlu ?? raw.responsible ?? "");
  const total = Number(raw.toplam ?? raw.total ?? 0) || 0;
  const lastOpened = String(
    raw.son_acilis ?? raw.lastOpened ?? raw.son_acilis_tarihi ?? "—",
  );
  const statusRaw = raw.durum ?? raw.status ?? raw.active;
  let active = true;
  if (typeof statusRaw === "boolean") {
    active = statusRaw;
  } else if (typeof statusRaw === "string") {
    const s = statusRaw.toLocaleLowerCase("tr");
    active = !["pasif", "passive", "inactive", "false", "0"].includes(s);
  }
  return { id, location, responsible, total, lastOpened, active };
}

async function fetchKumbaralar(): Promise<KumbaraDraft[] | null> {
  try {
    const res = await fetch(`${API_BASE}/kumbaralar`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const data: unknown = await res.json();
    const arr = Array.isArray(data) ? data : [data];
    return (arr as RawKumbara[])
      .map(parseKumbara)
      .filter((k): k is KumbaraDraft => k !== null);
  } catch {
    return null;
  }
}

async function postJson(path: string, body: unknown): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ── Page component ──────────────────────────────────────────────────────────

export default function KumbaralarPage() {
  const [items, setItems] = useState<KumbaraDraft[]>(
    demoCampaign.transparency.kumbaralar.map((k) => ({ ...k, active: true })),
  );
  const [loading, setLoading] = useState(true);
  const [savingEntry, setSavingEntry] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEntry, setOpenEntry] = useState<KumbaraDraft | null>(null);
  const [openEdit, setOpenEdit] = useState<KumbaraDraft | null>(null);

  const [newLocation, setNewLocation] = useState("");
  const [newResp, setNewResp] = useState(adminVolunteers[0]?.name ?? "");

  const [entryDate, setEntryDate] = useState(new Date().toISOString().slice(0, 10));
  const [entryAmount, setEntryAmount] = useState("");
  const [entryResp, setEntryResp] = useState("");
  const [entryFile, setEntryFile] = useState<File | null>(null);

  const [editLocation, setEditLocation] = useState("");
  const [editResp, setEditResp] = useState("");
  const [editActive, setEditActive] = useState(true);

  // ── Initial fetch from API ────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;
    (async () => {
      const data = await fetchKumbaralar();
      if (!mounted) return;
      if (data && data.length > 0) {
        setItems(data);
      }
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const nextId = () => {
    const max = items.reduce(
      (m, k) => Math.max(m, parseInt(k.id, 10) || 0),
      0,
    );
    return String(max + 1);
  };

  const handleAdd = () => {
    if (!newLocation.trim()) return;
    const k: KumbaraDraft = {
      id: nextId(),
      location: newLocation.trim(),
      responsible: newResp,
      total: 0,
      lastOpened: "—",
      active: true,
    };
    setItems([k, ...items]);
    setNewLocation("");
    setOpenAdd(false);
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
      const ok = await postJson("/kumbara-acilis", {
        kumbara_no: openEntry.id,
        tutar: amount,
        tarih: entryDate,
        sorumlu: entryResp || openEntry.responsible,
        tutanak_foto: photoUrl,
      });
      if (!ok) {
        throw new Error("Sunucu kaydı reddetti, daha sonra tekrar deneyin.");
      }

      // 3) Reflect in local state
      setItems((prev) =>
        prev.map((k) =>
          k.id === openEntry.id
            ? {
                ...k,
                total: k.total + amount,
                lastOpened: entryDate,
                responsible: entryResp || k.responsible,
              }
            : k,
        ),
      );
      setOpenEntry(null);
      setEntryAmount("");
      setEntryFile(null);
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
    setEditActive(k.active);
  };

  const handleSaveEdit = async () => {
    if (!openEdit || !editLocation.trim()) return;
    setSavingEdit(true);
    setErrorMsg(null);
    try {
      const ok = await postJson("/kumbara-guncelle", {
        kumbara_no: openEdit.id,
        konum: editLocation.trim(),
        sorumlu: editResp,
        durum: editActive ? "aktif" : "pasif",
      });
      if (!ok) {
        throw new Error("Sunucu kaydı reddetti, daha sonra tekrar deneyin.");
      }

      setItems((prev) =>
        prev.map((k) =>
          k.id === openEdit.id
            ? {
                ...k,
                location: editLocation.trim(),
                responsible: editResp,
                active: editActive,
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

  return (
    <AdminLayout
      title="Kumbaralar"
      subtitle={
        loading
          ? "Yükleniyor…"
          : `${items.length} kumbara — toplam ₺${items
              .reduce((s, k) => s + k.total, 0)
              .toLocaleString("tr-TR")}`
      }
      actions={
        <Button variant="primary" size="sm" onClick={() => setOpenAdd(true)}>
          <Plus className="w-4 h-4" />
          Kumbara Ekle
        </Button>
      }
    >
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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((k) => (
            <article
              key={k.id}
              className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden hover:border-secondary hover:shadow-[0_4px_12px_rgba(0,24,53,0.08)] transition"
            >
              <div className="px-5 pt-4 pb-3 border-b border-outline-variant flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-secondary-container/40 text-secondary flex items-center justify-center">
                    <PiggyBank className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-label-sm text-on-surface-variant">Kumbara No</p>
                    <p className="text-body-lg font-semibold text-on-surface">#{k.id}</p>
                  </div>
                </div>
                <StatusPill status={k.active ? "Aktif" : "Pasif"} />
              </div>

              <div className="px-5 py-4 space-y-2.5 text-body-sm">
                <div className="flex items-start gap-2 text-on-surface-variant">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                  <span className="text-on-surface">{k.location}</span>
                </div>
                <div className="flex items-start gap-2 text-on-surface-variant">
                  <User className="w-4 h-4 mt-0.5 shrink-0" />
                  <span className="text-on-surface">{k.responsible}</span>
                </div>
                <div className="pt-2 mt-2 border-t border-outline-variant flex items-center justify-between">
                  <span className="text-label-sm text-on-surface-variant">Toplanan</span>
                  <span className="font-bold text-on-surface tabular-nums">
                    {formatCurrency(k.total, "TRY")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-label-sm text-on-surface-variant">Son açılış</span>
                  <span className="text-label-md text-on-surface tabular-nums">
                    {k.lastOpened}
                  </span>
                </div>
              </div>

              <div className="px-5 pb-4 pt-1 grid grid-cols-2 gap-2">
                <button
                  onClick={() => openEditModal(k)}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-outline-variant text-label-md text-on-surface hover:bg-surface-container-low transition"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Düzenle
                </button>
                <button
                  onClick={() => openEntryModal(k)}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-secondary text-on-secondary font-semibold text-label-md hover:bg-on-secondary-container transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Açılış Kaydet
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Add modal */}
      <Modal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        title="Yeni Kumbara"
        description="Yeni bir kumbara konumu ekleyin"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setOpenAdd(false)}>
              İptal
            </Button>
            <Button variant="primary" size="sm" onClick={handleAdd}>
              Ekle
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormField label="Kumbara No">
            <input className={inputClass} value={`#${nextId()}`} readOnly disabled />
          </FormField>
          <FormField label="Konum" required>
            <input
              className={inputClass}
              placeholder="Örn: Kadıköy Meydan"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
            />
          </FormField>
          <FormField label="Sorumlu Gönüllü" required>
            <select
              className={inputClass}
              value={newResp}
              onChange={(e) => setNewResp(e.target.value)}
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
              <span className="text-body-sm">
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
        description="Konum, sorumlu ve durum bilgisini güncelleyin"
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
          <FormField label="Durum">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setEditActive(true)}
                disabled={savingEdit}
                className={`px-3 py-2.5 rounded-lg border text-label-md font-medium transition disabled:opacity-50 ${
                  editActive
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-outline-variant text-on-surface-variant hover:bg-surface-container-low"
                }`}
              >
                ● Aktif
              </button>
              <button
                type="button"
                onClick={() => setEditActive(false)}
                disabled={savingEdit}
                className={`px-3 py-2.5 rounded-lg border text-label-md font-medium transition disabled:opacity-50 ${
                  !editActive
                    ? "border-on-surface-variant bg-surface-container text-on-surface"
                    : "border-outline-variant text-on-surface-variant hover:bg-surface-container-low"
                }`}
              >
                ○ Pasif
              </button>
            </div>
          </FormField>
        </div>
      </Modal>
    </AdminLayout>
  );
}
