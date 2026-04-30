"use client";

import { useState } from "react";
import { CalendarClock, Camera, MapPin, Pencil, Plus, Store, User } from "lucide-react";
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
import { demoCampaign, type Stant } from "@/lib/mock-campaign-data";

type StantDraft = Stant & { active: boolean; lastClose: string };

export default function StantlarPage() {
  const [items, setItems] = useState<StantDraft[]>(
    demoCampaign.transparency.stantlar.map((s) => ({ ...s, active: true, lastClose: "2026-04-23" })),
  );
  const [openAdd, setOpenAdd] = useState(false);
  const [openClose, setOpenClose] = useState<StantDraft | null>(null);
  const [openEdit, setOpenEdit] = useState<StantDraft | null>(null);

  const [newLocation, setNewLocation] = useState("");
  const [newResp, setNewResp] = useState(adminVolunteers[0]?.name ?? "");

  const [closeDate, setCloseDate] = useState(new Date().toISOString().slice(0, 10));
  const [closeAmount, setCloseAmount] = useState("");
  const [closeNote, setCloseNote] = useState("");
  const [closeFile, setCloseFile] = useState<File | null>(null);

  const [editLocation, setEditLocation] = useState("");
  const [editResp, setEditResp] = useState("");
  const [editActive, setEditActive] = useState(true);

  const nextId = () => {
    const max = items.reduce((m, s) => Math.max(m, parseInt(s.id, 10) || 0), 0);
    return String(max + 1);
  };

  const handleAdd = () => {
    if (!newLocation.trim()) return;
    const s: StantDraft = {
      id: nextId(),
      location: newLocation.trim(),
      responsible: newResp,
      total: 0,
      activeDays: 0,
      active: true,
      lastClose: "—",
    };
    setItems([s, ...items]);
    setNewLocation("");
    setOpenAdd(false);
  };

  const openEditModal = (s: StantDraft) => {
    setOpenEdit(s);
    setEditLocation(s.location);
    setEditResp(s.responsible);
    setEditActive(s.active);
  };

  const handleSaveEdit = () => {
    if (!openEdit || !editLocation.trim()) return;
    setItems((prev) =>
      prev.map((s) =>
        s.id === openEdit.id
          ? { ...s, location: editLocation.trim(), responsible: editResp, active: editActive }
          : s,
      ),
    );
    setOpenEdit(null);
  };

  const handleSaveClose = () => {
    if (!openClose || !closeAmount) return;
    const amount = parseFloat(closeAmount.replace(",", "."));
    if (Number.isNaN(amount)) return;
    setItems((prev) =>
      prev.map((s) =>
        s.id === openClose.id
          ? {
              ...s,
              total: s.total + amount,
              activeDays: s.activeDays + 1,
              lastClose: closeDate,
            }
          : s,
      ),
    );
    setOpenClose(null);
    setCloseAmount("");
    setCloseNote("");
    setCloseFile(null);
  };

  return (
    <AdminLayout
      title="Stantlar"
      subtitle={`${items.length} stant — toplam ₺${items.reduce((s, x) => s + x.total, 0).toLocaleString("tr-TR")}`}
      actions={
        <Button variant="primary" size="sm" onClick={() => setOpenAdd(true)}>
          <Plus className="w-4 h-4" />
          Stant Ekle
        </Button>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((s) => (
          <article
            key={s.id}
            className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden hover:border-secondary hover:shadow-[0_4px_12px_rgba(0,24,53,0.08)] transition"
          >
            <div className="px-5 pt-4 pb-3 border-b border-outline-variant flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-secondary-container/40 text-secondary flex items-center justify-center">
                  <Store className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-label-sm text-on-surface-variant">Stant No</p>
                  <p className="text-body-lg font-semibold text-on-surface">#{s.id}</p>
                </div>
              </div>
              <StatusPill status={s.active ? "Aktif" : "Pasif"} />
            </div>

            <div className="px-5 py-4 space-y-2.5 text-body-sm">
              <div className="flex items-start gap-2 text-on-surface-variant">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span className="text-on-surface">{s.location}</span>
              </div>
              <div className="flex items-start gap-2 text-on-surface-variant">
                <User className="w-4 h-4 mt-0.5 shrink-0" />
                <span className="text-on-surface">{s.responsible}</span>
              </div>
              <div className="pt-2 mt-2 border-t border-outline-variant flex items-center justify-between">
                <span className="text-label-sm text-on-surface-variant">Toplanan</span>
                <span className="font-bold text-on-surface tabular-nums">
                  {formatCurrency(s.total, "TRY")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-label-sm text-on-surface-variant">Aktif gün</span>
                <span className="text-label-md text-on-surface tabular-nums">
                  {s.activeDays} gün
                </span>
              </div>
              <div className="flex items-center justify-between text-label-sm">
                <span className="text-on-surface-variant inline-flex items-center gap-1">
                  <CalendarClock className="w-3.5 h-3.5" /> Son kapanış
                </span>
                <span className="text-on-surface tabular-nums">{s.lastClose}</span>
              </div>
            </div>

            <div className="px-5 pb-4 pt-1 grid grid-cols-2 gap-2">
              <button
                onClick={() => openEditModal(s)}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-outline-variant text-label-md text-on-surface hover:bg-surface-container-low transition"
              >
                <Pencil className="w-3.5 h-3.5" />
                Düzenle
              </button>
              <button
                onClick={() => {
                  setOpenClose(s);
                  setCloseAmount("");
                  setCloseNote("");
                  setCloseFile(null);
                  setCloseDate(new Date().toISOString().slice(0, 10));
                }}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-secondary text-on-secondary font-semibold text-label-md hover:bg-on-secondary-container transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Günlük Kapanış
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Add modal */}
      <Modal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        title="Yeni Stant"
        description="Yeni bir stant lokasyonu ekleyin"
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
          <FormField label="Stant No">
            <input className={inputClass} value={`#${nextId()}`} readOnly disabled />
          </FormField>
          <FormField label="Konum" required>
            <input
              className={inputClass}
              placeholder="Örn: İstinye Park AVM"
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

      {/* Close modal */}
      <Modal
        open={openClose !== null}
        onClose={() => setOpenClose(null)}
        title={openClose ? `Günlük Kapanış — Stant #${openClose.id}` : ""}
        description={openClose?.location}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setOpenClose(null)}>
              İptal
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveClose}>
              Kaydet
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormField label="Tarih" required>
            <input
              type="date"
              className={inputClass}
              value={closeDate}
              onChange={(e) => setCloseDate(e.target.value)}
            />
          </FormField>
          <FormField label="Günlük Tutar (₺)" required>
            <input
              type="number"
              inputMode="decimal"
              step="0.01"
              className={inputClass}
              placeholder="0,00"
              value={closeAmount}
              onChange={(e) => setCloseAmount(e.target.value)}
            />
          </FormField>
          <FormField label="Not">
            <textarea
              rows={3}
              className={inputClass}
              placeholder="Gün içi gözlemler, not (opsiyonel)"
              value={closeNote}
              onChange={(e) => setCloseNote(e.target.value)}
            />
          </FormField>
          <FormField label="Kapanış Fotoğrafı" required hint="Sayım veya kapanış belgesi fotoğrafı">
            <label className="flex items-center justify-center gap-2 px-4 py-6 rounded-lg border-2 border-dashed border-outline-variant bg-surface-container-low hover:border-secondary hover:bg-secondary-container/20 cursor-pointer transition text-on-surface-variant">
              <Camera className="w-5 h-5" />
              <span className="text-body-sm">
                {closeFile ? closeFile.name : "Fotoğraf seç (placeholder)"}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setCloseFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </FormField>
        </div>
      </Modal>

      {/* Edit modal */}
      <Modal
        open={openEdit !== null}
        onClose={() => setOpenEdit(null)}
        title={openEdit ? `Düzenle — Stant #${openEdit.id}` : ""}
        description="Konum, sorumlu ve durum bilgisini güncelleyin"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setOpenEdit(null)}>
              İptal
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveEdit}>
              Kaydet
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormField label="Konum" required>
            <input
              className={inputClass}
              value={editLocation}
              onChange={(e) => setEditLocation(e.target.value)}
            />
          </FormField>
          <FormField label="Sorumlu Kişi" required>
            <select
              className={inputClass}
              value={editResp}
              onChange={(e) => setEditResp(e.target.value)}
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
                className={`px-3 py-2.5 rounded-lg border text-label-md font-medium transition ${
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
                className={`px-3 py-2.5 rounded-lg border text-label-md font-medium transition ${
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
