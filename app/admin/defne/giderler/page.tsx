"use client";

import { useState } from "react";
import { AlertTriangle, FileText, Paperclip, Plus } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/Button";
import {
  FormField,
  Modal,
  PanelCard,
  formatCurrency,
  inputClass,
} from "@/components/admin/AdminUI";
import { demoCampaign, type ExpenseRow } from "@/lib/mock-campaign-data";

const CATEGORIES = [
  "Tedavi",
  "Hastane",
  "Ulaşım",
  "Konaklama",
  "Tıbbi Malzeme",
  "Banka Ücreti",
  "Reklam",
  "Diğer",
];

type ExpenseDraft = ExpenseRow & {
  id: string;
  currency: "TRY" | "USD" | "EUR";
  fileName: string;
};

export default function ExpensesPage() {
  const [list, setList] = useState<ExpenseDraft[]>(
    demoCampaign.transparency.expenses.map((e, i) => ({
      ...e,
      id: `E-${1000 + i}`,
      currency: "TRY",
      fileName: "fatura-belge.pdf",
    })),
  );
  const [openAdd, setOpenAdd] = useState(false);

  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [vendor, setVendor] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<"TRY" | "USD" | "EUR">("TRY");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setDate(new Date().toISOString().slice(0, 10));
    setCategory(CATEGORIES[0]);
    setVendor("");
    setAmount("");
    setCurrency("TRY");
    setDescription("");
    setFile(null);
    setError(null);
  };

  const handleAdd = () => {
    if (!vendor.trim() || !amount.trim() || !description.trim()) {
      setError("Tüm zorunlu alanları doldurun.");
      return;
    }
    if (!file) {
      setError("Belge yüklemek zorunludur. Belgesiz gider eklenemez.");
      return;
    }
    const num = parseFloat(amount.replace(",", "."));
    if (Number.isNaN(num)) {
      setError("Geçerli bir tutar girin.");
      return;
    }
    const e: ExpenseDraft = {
      id: `E-${1000 + list.length}`,
      date,
      category,
      vendor: vendor.trim(),
      amount: num,
      currency,
      description: description.trim(),
      document: "#",
      fileName: file.name,
    };
    setList([e, ...list]);
    reset();
    setOpenAdd(false);
  };

  return (
    <AdminLayout
      title="Giderler"
      subtitle={`${list.length} kayıtlı harcama — tümü belgeli`}
      actions={
        <Button variant="primary" size="sm" onClick={() => setOpenAdd(true)}>
          <Plus className="w-4 h-4" />
          Gider Ekle
        </Button>
      }
    >
      <div className="mb-4 rounded-xl border border-warning/40 bg-amber-50 px-4 py-3 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
        <p className="text-body-sm text-amber-900">
          <span className="font-semibold">Belgesiz harcama eklenemez.</span> Her gider için fatura veya
          makbuz zorunludur. Yüklenen belge değiştirilemez kayıt sistemine işlenir.
        </p>
      </div>

      <PanelCard>
        <div className="overflow-x-auto">
          <table className="w-full text-body-sm">
            <thead>
              <tr className="bg-surface-container-low text-label-sm text-on-surface-variant uppercase tracking-wide">
                <th className="text-left px-5 py-3 font-semibold">Tarih</th>
                <th className="text-left px-5 py-3 font-semibold">Kategori</th>
                <th className="text-left px-5 py-3 font-semibold">Satıcı / Kurum</th>
                <th className="text-right px-5 py-3 font-semibold">Tutar</th>
                <th className="text-left px-5 py-3 font-semibold">Belge</th>
                <th className="text-left px-5 py-3 font-semibold">Durum</th>
                <th className="text-right px-5 py-3 font-semibold">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {list.map((e, i) => (
                <tr
                  key={e.id}
                  className={`border-t border-outline-variant hover:bg-surface-container-low transition ${i % 2 === 1 ? "bg-surface-container-low/40" : ""}`}
                >
                  <td className="px-5 py-3 text-on-surface tabular-nums whitespace-nowrap">{e.date}</td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary-fixed text-primary text-label-sm font-medium">
                      {e.category}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <p className="text-on-surface font-medium">{e.vendor}</p>
                    <p className="text-label-sm text-on-surface-variant">{e.description}</p>
                  </td>
                  <td className="px-5 py-3 text-right font-semibold text-on-surface tabular-nums whitespace-nowrap">
                    {formatCurrency(e.amount, e.currency)}
                  </td>
                  <td className="px-5 py-3">
                    <a
                      href="#"
                      onClick={(ev) => {
                        ev.preventDefault();
                        alert("Belge görüntüleme yakında.");
                      }}
                      className="inline-flex items-center gap-1 text-secondary hover:text-on-secondary-container text-label-md"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      {e.fileName}
                    </a>
                  </td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-emerald-200 bg-emerald-50 text-emerald-700 text-label-sm font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Belgeli
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => alert("Detay görüntüleme yakında.")}
                      className="text-secondary hover:text-on-secondary-container text-label-md font-medium"
                    >
                      Detay
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PanelCard>

      {/* Add modal */}
      <Modal
        open={openAdd}
        onClose={() => {
          setOpenAdd(false);
          reset();
        }}
        title="Yeni Gider"
        description="Belgesiz harcama eklenemez"
        size="lg"
        footer={
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setOpenAdd(false);
                reset();
              }}
            >
              İptal
            </Button>
            <Button variant="primary" size="sm" onClick={handleAdd}>
              Kaydet
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Tarih" required>
              <input
                type="date"
                className={inputClass}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </FormField>
            <FormField label="Kategori" required>
              <select
                className={inputClass}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </FormField>
          </div>
          <FormField label="Satıcı / Kurum" required>
            <input
              className={inputClass}
              placeholder="Örn: Amerikan Hastanesi"
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
            />
          </FormField>
          <div className="grid grid-cols-3 gap-4">
            <FormField label="Tutar" required>
              <input
                type="number"
                inputMode="decimal"
                step="0.01"
                className={inputClass}
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </FormField>
            <FormField label="Para Birimi" required>
              <select
                className={inputClass}
                value={currency}
                onChange={(e) => setCurrency(e.target.value as "TRY" | "USD" | "EUR")}
              >
                <option value="TRY">TL</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </FormField>
          </div>
          <FormField label="Açıklama" required>
            <textarea
              rows={3}
              className={inputClass}
              placeholder="Bu giderin neden yapıldığını kısaca açıklayın"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormField>
          <FormField label="Belge (Fatura/Makbuz)" required hint="PDF, JPG, PNG kabul edilir. Belge zorunludur.">
            <label className="flex items-center justify-center gap-2 px-4 py-6 rounded-lg border-2 border-dashed border-outline-variant bg-surface-container-low hover:border-secondary hover:bg-secondary-container/20 cursor-pointer transition text-on-surface-variant">
              <Paperclip className="w-5 h-5" />
              <span className="text-body-sm">
                {file ? file.name : "Belge yükle (placeholder)"}
              </span>
              <input
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={(e) => {
                  setFile(e.target.files?.[0] ?? null);
                  setError(null);
                }}
              />
            </label>
          </FormField>
          {error && (
            <div className="rounded-lg bg-error-container px-3 py-2.5 text-body-sm text-on-error-container border border-error/20">
              {error}
            </div>
          )}
        </div>
      </Modal>
    </AdminLayout>
  );
}
