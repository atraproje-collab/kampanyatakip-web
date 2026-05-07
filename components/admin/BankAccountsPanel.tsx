"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Landmark,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  FormField,
  Modal,
  PanelCard,
  inputClass,
} from "@/components/admin/AdminUI";
import {
  createBankAccount,
  deleteBankAccount,
  fetchBankAccounts,
  updateBankAccount,
  type BankAccount,
  type BankAccountInput,
} from "@/lib/banka-hesaplari";
import type { CurrencyCode } from "@/lib/mock-campaign-data";
import { cn } from "@/lib/utils";

const CURRENCIES: CurrencyCode[] = ["TRY", "USD", "EUR"];

const emptyForm = (siralama: number): BankAccountInput => ({
  banka_adi: "",
  hesap_sahibi: "",
  para_birimi: "TRY",
  iban: "",
  swift_bic: "",
  siralama,
});

type Toast = { kind: "ok" | "err"; text: string };

function validate(form: BankAccountInput): string | null {
  if (!form.banka_adi.trim()) return "Banka adı boş olamaz.";
  if (!form.hesap_sahibi.trim()) return "Hesap sahibi boş olamaz.";
  if (!form.iban.trim()) return "IBAN boş olamaz.";
  if (form.iban.replace(/\s/g, "").length < 16) {
    return "IBAN en az 16 karakter olmalı.";
  }
  if (!form.swift_bic.trim()) return "SWIFT/BIC boş olamaz.";
  if (!Number.isFinite(form.siralama)) return "Sıralama geçerli bir sayı olmalı.";
  return null;
}

export function BankAccountsPanel() {
  const [items, setItems] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<BankAccountInput | null>(null);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState<BankAccountInput | null>(null);
  const [savingId, setSavingId] = useState<string | "new" | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<BankAccount | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (t: Toast) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast(t);
    toastTimerRef.current = setTimeout(() => setToast(null), 4000);
  };

  useEffect(
    () => () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    },
    [],
  );

  const refresh = async () => {
    const result = await fetchBankAccounts();
    setItems(result.items);
    setLoadError(result.ok ? null : result.error ?? "API'ye bağlanılamadı");
    return result;
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      const r = await fetchBankAccounts();
      if (!mounted) return;
      setItems(r.items);
      setLoadError(r.ok ? null : r.error ?? "API'ye bağlanılamadı");
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const startEdit = (acc: BankAccount) => {
    setCreating(false);
    setCreateForm(null);
    setEditingId(acc.id);
    setEditForm({
      id: acc.id,
      banka_adi: acc.banka_adi,
      hesap_sahibi: acc.hesap_sahibi,
      para_birimi: acc.para_birimi,
      iban: acc.iban,
      swift_bic: acc.swift_bic,
      siralama: acc.siralama,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const startCreate = () => {
    cancelEdit();
    const nextSiralama =
      items.length > 0 ? Math.max(...items.map((i) => i.siralama)) + 1 : 1;
    setCreating(true);
    setCreateForm(emptyForm(nextSiralama));
  };

  const cancelCreate = () => {
    setCreating(false);
    setCreateForm(null);
  };

  const submitCreate = async () => {
    if (!createForm) return;
    const err = validate(createForm);
    if (err) {
      showToast({ kind: "err", text: err });
      return;
    }
    setSavingId("new");
    const r = await createBankAccount(createForm);
    if (!r.ok) {
      setSavingId(null);
      showToast({
        kind: "err",
        text: r.error ?? "Bir hata oluştu, tekrar deneyin",
      });
      return;
    }
    await new Promise((res) => setTimeout(res, 800));
    await refresh();
    setSavingId(null);
    setCreating(false);
    setCreateForm(null);
    showToast({ kind: "ok", text: "Banka hesabı kaydedildi" });
  };

  const submitEdit = async () => {
    if (!editForm || !editingId) return;
    const err = validate(editForm);
    if (err) {
      showToast({ kind: "err", text: err });
      return;
    }
    setSavingId(editingId);
    const r = await updateBankAccount({ ...editForm, id: editingId });
    if (!r.ok) {
      setSavingId(null);
      showToast({
        kind: "err",
        text: r.error ?? "Bir hata oluştu, tekrar deneyin",
      });
      return;
    }
    await new Promise((res) => setTimeout(res, 800));
    await refresh();
    setSavingId(null);
    setEditingId(null);
    setEditForm(null);
    showToast({ kind: "ok", text: "Banka hesabı kaydedildi" });
  };

  const submitDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    const r = await deleteBankAccount(confirmDelete.id);
    if (!r.ok) {
      setDeleting(false);
      showToast({
        kind: "err",
        text: r.error ?? "Bir hata oluştu, tekrar deneyin",
      });
      return;
    }
    await new Promise((res) => setTimeout(res, 800));
    await refresh();
    setDeleting(false);
    setConfirmDelete(null);
    showToast({ kind: "ok", text: "Banka hesabı silindi" });
  };

  return (
    <PanelCard
      title="Banka Hesapları"
      description="Kampanya bağış hesaplarını ekleyin, düzenleyin veya silin"
    >
      {/* Toast / banners */}
      {toast && (
        <div
          className={cn(
            "mx-5 mt-4 rounded-lg border px-3 py-2 text-body-sm flex items-center gap-2",
            toast.kind === "ok"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200",
          )}
        >
          {toast.kind === "ok" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0" />
          )}
          <span>{toast.text}</span>
        </div>
      )}
      {loadError && !loading && (
        <div className="mx-5 mt-4 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-body-sm text-amber-900 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>Banka hesapları yüklenemedi — {loadError}</span>
        </div>
      )}

      {loading ? (
        <BankAccountsSkeleton />
      ) : (
        <div className="divide-y divide-outline-variant">
          {items.length === 0 && !creating && (
            <div className="px-5 py-10 text-center text-body-sm text-on-surface-variant">
              Kayıtlı banka hesabı yok.
            </div>
          )}
          {items.map((acc) => {
            const isEditing = editingId === acc.id;
            const isSaving = savingId === acc.id;
            return (
              <div key={acc.id} className="px-5 py-4">
                {isEditing && editForm ? (
                  <BankAccountForm
                    form={editForm}
                    onChange={setEditForm}
                    onSubmit={submitEdit}
                    onCancel={cancelEdit}
                    saving={isSaving}
                  />
                ) : (
                  <BankAccountRow
                    acc={acc}
                    onEdit={() => startEdit(acc)}
                    onDelete={() => setConfirmDelete(acc)}
                  />
                )}
              </div>
            );
          })}

          {creating && createForm && (
            <div className="px-5 py-4 bg-secondary-container/10">
              <BankAccountForm
                form={createForm}
                onChange={setCreateForm}
                onSubmit={submitCreate}
                onCancel={cancelCreate}
                saving={savingId === "new"}
                isNew
              />
            </div>
          )}
        </div>
      )}

      {/* + Yeni Banka Hesabı Ekle */}
      {!loading && !creating && (
        <div className="px-5 py-4 border-t border-outline-variant">
          <Button
            variant="secondary"
            size="sm"
            onClick={startCreate}
            disabled={editingId !== null}
          >
            <Plus className="w-4 h-4" />
            Yeni Banka Hesabı Ekle
          </Button>
        </div>
      )}

      {/* Sil onay modal */}
      <Modal
        open={confirmDelete !== null}
        onClose={() => !deleting && setConfirmDelete(null)}
        title="Banka Hesabını Sil"
        description="Bu işlem geri alınamaz."
        size="sm"
        footer={
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setConfirmDelete(null)}
              disabled={deleting}
            >
              Vazgeç
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={submitDelete}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Siliniyor…
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Evet, Sil
                </>
              )}
            </Button>
          </>
        }
      >
        {confirmDelete && (
          <div className="text-body-sm text-on-surface space-y-2">
            <p>
              <strong>{confirmDelete.banka_adi}</strong> ({confirmDelete.para_birimi})
              hesabını silmek istediğinizden emin misiniz?
            </p>
            <p className="font-mono text-label-sm text-on-surface-variant break-all">
              {confirmDelete.iban}
            </p>
          </div>
        )}
      </Modal>
    </PanelCard>
  );
}

// ── Sub-components ───────────────────────────────────────────────────────────

function BankAccountRow({
  acc,
  onEdit,
  onDelete,
}: {
  acc: BankAccount;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-lg bg-primary-fixed text-primary flex items-center justify-center shrink-0">
        <Landmark className="w-4 h-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <p className="text-label-md font-semibold text-on-surface">
            {acc.banka_adi || "—"} • {acc.para_birimi}
          </p>
          <span className="text-label-sm text-on-surface-variant">
            {acc.swift_bic || "—"}
          </span>
        </div>
        <p className="text-label-sm text-on-surface-variant">
          {acc.hesap_sahibi || "—"}
        </p>
        <p className="text-body-sm font-mono text-on-surface mt-0.5 break-all">
          {acc.iban || "—"}
        </p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={onEdit}
          aria-label="Düzenle"
          className="p-2 rounded-lg text-on-surface-variant hover:text-secondary hover:bg-surface-container-low transition"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label="Sil"
          className="p-2 rounded-lg text-on-surface-variant hover:text-rose-700 hover:bg-rose-50 transition"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function BankAccountForm({
  form,
  onChange,
  onSubmit,
  onCancel,
  saving,
  isNew = false,
}: {
  form: BankAccountInput;
  onChange: (next: BankAccountInput) => void;
  onSubmit: () => void;
  onCancel: () => void;
  saving: boolean;
  isNew?: boolean;
}) {
  const set = <K extends keyof BankAccountInput>(
    key: K,
    value: BankAccountInput[K],
  ) => {
    onChange({ ...form, [key]: value });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-label-md font-semibold text-on-surface">
        <Landmark className="w-4 h-4 text-secondary" />
        {isNew ? "Yeni Banka Hesabı" : "Banka Hesabını Düzenle"}
      </div>
      <div className="space-y-3">
        <FormField label="Banka Adı" required>
          <input
            className={inputClass}
            value={form.banka_adi}
            onChange={(e) => set("banka_adi", e.target.value)}
            placeholder="Örn: Ziraat Bankası"
          />
        </FormField>
        <FormField label="Hesap Sahibi" required>
          <input
            className={inputClass}
            value={form.hesap_sahibi}
            onChange={(e) => set("hesap_sahibi", e.target.value)}
            placeholder="Örn: Defne Yardım Hesabı"
          />
        </FormField>
        <FormField label="Para Birimi" required>
          <select
            className={cn(inputClass, "appearance-none")}
            value={form.para_birimi}
            onChange={(e) =>
              set("para_birimi", e.target.value as CurrencyCode)
            }
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Sıralama" hint="Görüntü sırası (küçük → önce)">
          <input
            type="number"
            min={0}
            step={1}
            className={inputClass}
            value={Number.isFinite(form.siralama) ? form.siralama : ""}
            onChange={(e) => set("siralama", Number(e.target.value) || 0)}
          />
        </FormField>
        <FormField label="IBAN" required>
          <input
            className={cn(inputClass, "font-mono")}
            value={form.iban}
            onChange={(e) => set("iban", e.target.value)}
            placeholder="TR.. .... .... .... .... .... .."
          />
        </FormField>
        <FormField label="SWIFT / BIC" required>
          <input
            className={inputClass}
            value={form.swift_bic}
            onChange={(e) => set("swift_bic", e.target.value)}
            placeholder="Örn: TCZBTR2A"
          />
        </FormField>
      </div>
      <div className="flex items-center gap-2 pt-1">
        <Button
          variant="primary"
          size="sm"
          onClick={onSubmit}
          disabled={saving}
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Kaydediliyor…
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Kaydet
            </>
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          disabled={saving}
        >
          <X className="w-4 h-4" />
          İptal
        </Button>
      </div>
    </div>
  );
}

function BankAccountsSkeleton() {
  return (
    <div className="divide-y divide-outline-variant">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="px-5 py-4 flex items-start gap-3 animate-pulse">
          <div className="w-9 h-9 rounded-lg bg-surface-container shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-40 rounded bg-surface-container" />
            <div className="h-3 w-56 rounded bg-surface-container" />
            <div className="h-3 w-72 rounded bg-surface-container" />
          </div>
        </div>
      ))}
    </div>
  );
}
