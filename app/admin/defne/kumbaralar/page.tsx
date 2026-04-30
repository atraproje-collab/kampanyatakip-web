"use client";

import { useState } from "react";
import { Camera, MapPin, Pencil, PiggyBank, Plus, User } from "lucide-react";
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

export default function KumbaralarPage() {
  const [items, setItems] = useState<KumbaraDraft[]>(
    demoCampaign.transparency.kumbaralar.map((k) => ({ ...k, active: true })),
  );
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

  const nextId = () => {
    const max = items.reduce((m, k) => Math.max(m, parseInt(k.id, 10) || 0), 0);
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

  const handleSaveEntry = () => {
    if (!openEntry || !entryAmount) return;
    const amount = parseFloat(entryAmount.replace(",", "."));
    if (Number.isNaN(amount)) return;
    setItems((prev) =>
      prev.map((k) =>
        k.id === openEntry.id
          ? { ...k, total: k.total + amount, lastOpened: entryDate, responsible: entryResp || k.responsible }
          : k,
      ),
    );
    setOpenEntry(null);
    setEntryAmount("");
    setEntryFile(null);
  };

  const openEntryModal = (k: KumbaraDraft) => {
    setOpenEntry(k);
    setEntryResp(k.responsible);
    setEntryAmount("");
    setEntryDate(new Date().toISOString().slice(0, 10));
    setEntryFile(null);
  };

  const openEditModal = (k: KumbaraDraft) => {
    setOpenEdit(k);
    setEditLocation(k.location);
    setEditResp(k.responsible);
    setEditActive(k.active);
  };

  const handleSaveEdit = () => {
    if (!openEdit || !editLocation.trim()) return;
    setItems((prev) =>
      prev.map((k) =>
        k.id === openEdit.id
          ? { ...k, location: editLocation.trim(), responsible: editResp, active: editActive }
          : k,
      ),
    );
    setOpenEdit(null);
  };

  return (
    <AdminLayout
      title="Kumbaralar"
      subtitle={`${items.length} kumbara — toplam ₺${items.reduce((s, k) => s + k.total, 0).toLocaleString("tr-TR")}`}
      actions={
        <Button variant="primary" size="sm" onClick={() => setOpenAdd(true)}>
          <Plus className="w-4 h-4" />
          Kumbara Ekle
        </Button>
      }
    >
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
            <select className={inputClass} value={newResp} onChange={(e) => setNewResp(e.target.value)}>
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
        onClose={() => setOpenEntry(null)}
        title={openEntry ? `Açılış Kaydı — Kumbara #${openEntry.id}` : ""}
        description={openEntry?.location}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setOpenEntry(null)}>
              İptal
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveEntry}>
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
              value={entryDate}
              onChange={(e) => setEntryDate(e.target.value)}
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
            />
          </FormField>
          <FormField label="Sorumlu Kişi" required>
            <select
              className={inputClass}
              value={entryResp}
              onChange={(e) => setEntryResp(e.target.value)}
            >
              {adminVolunteers.map((v) => (
                <option key={v.id} value={v.name}>
                  {v.name}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Tutanak Fotoğrafı" required hint="Açılış tutanağı veya nakit fotoğrafı (zorunlu)">
            <label className="flex items-center justify-center gap-2 px-4 py-6 rounded-lg border-2 border-dashed border-outline-variant bg-surface-container-low hover:border-secondary hover:bg-secondary-container/20 cursor-pointer transition text-on-surface-variant">
              <Camera className="w-5 h-5" />
              <span className="text-body-sm">
                {entryFile ? entryFile.name : "Fotoğraf seç (placeholder)"}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setEntryFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </FormField>
        </div>
      </Modal>

      {/* Edit modal */}
      <Modal
        open={openEdit !== null}
        onClose={() => setOpenEdit(null)}
        title={openEdit ? `Düzenle — Kumbara #${openEdit.id}` : ""}
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
