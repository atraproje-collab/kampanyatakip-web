"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Plus,
  Radio,
  Save,
  Trash2,
  Wallet,
  X,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/Button";
import {
  FormField,
  Modal,
  PanelCard,
  StatCard,
  formatCurrency,
  inputClass,
} from "@/components/admin/AdminUI";
import {
  createTikTokIncome,
  deleteTikTokIncome,
  fetchTikTokIncome,
  summarize,
  type TikTokIncome,
  type TikTokIncomeInput,
} from "@/lib/canli-yayin";
import { cn } from "@/lib/utils";

const todayIso = () => new Date().toISOString().slice(0, 10);

const emptyForm = (): TikTokIncomeInput => ({
  tarih: todayIso(),
  yayin_suresi_dk: 0,
  elmas_coin: 0,
  tl_karsiligi: 0,
  ekran_goruntusu_url: "",
  notlar: "",
});

type Toast = { kind: "ok" | "err"; text: string };

function validate(form: TikTokIncomeInput): string | null {
  if (!form.tarih) return "Tarih gerekli.";
  if (!Number.isFinite(form.yayin_suresi_dk) || form.yayin_suresi_dk <= 0) {
    return "Yayın süresi 0'dan büyük olmalı.";
  }
  if (!Number.isFinite(form.elmas_coin) || form.elmas_coin <= 0) {
    return "Elmas/Coin miktarı 0'dan büyük olmalı.";
  }
  if (!Number.isFinite(form.tl_karsiligi) || form.tl_karsiligi <= 0) {
    return "TL karşılığı 0'dan büyük olmalı.";
  }
  return null;
}

export default function TikTokIncomePage() {
  const [items, setItems] = useState<TikTokIncome[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [openAdd, setOpenAdd] = useState(false);
  const [form, setForm] = useState<TikTokIncomeInput>(emptyForm());
  const [saving, setSaving] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState<TikTokIncome | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [detail, setDetail] = useState<TikTokIncome | null>(null);

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
    const r = await fetchTikTokIncome();
    setItems(r.items);
    setLoadError(r.ok ? null : r.error ?? "API'ye bağlanılamadı");
    return r;
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      const r = await fetchTikTokIncome();
      if (!mounted) return;
      setItems(r.items);
      setLoadError(r.ok ? null : r.error ?? "API'ye bağlanılamadı");
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const summary = summarize(items);

  const setField = <K extends keyof TikTokIncomeInput>(
    key: K,
    value: TikTokIncomeInput[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const openNew = () => {
    setForm(emptyForm());
    setOpenAdd(true);
  };

  const submitAdd = async () => {
    const err = validate(form);
    if (err) {
      showToast({ kind: "err", text: err });
      return;
    }
    setSaving(true);
    const r = await createTikTokIncome(form);
    if (!r.ok) {
      setSaving(false);
      showToast({
        kind: "err",
        text: r.error ?? "Bir hata oluştu, tekrar deneyin",
      });
      return;
    }
    await new Promise((res) => setTimeout(res, 800));
    await refresh();
    setSaving(false);
    setOpenAdd(false);
    setForm(emptyForm());
    showToast({ kind: "ok", text: "Yayın kaydedildi" });
  };

  const submitDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    const r = await deleteTikTokIncome(confirmDelete.id);
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
    showToast({ kind: "ok", text: "Yayın silindi" });
  };

  return (
    <AdminLayout
      title="TikTok Yayın Geliri"
      subtitle="TikTok canlı yayın gelirleri ve tutanak kayıtları"
      actions={
        <Button variant="primary" size="sm" onClick={openNew}>
          <Plus className="w-4 h-4" />
          Yayın Geliri Ekle
        </Button>
      }
    >
      {/* Toast */}
      {toast && (
        <div
          className={cn(
            "mb-4 rounded-lg border px-3 py-2 text-body-sm flex items-center gap-2",
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

      {/* Load error banner */}
      {loadError && !loading && (
        <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-body-sm text-amber-900 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="font-semibold">Veriler yüklenemedi.</p>
            <p className="text-label-sm text-amber-800 mt-0.5 break-all">
              {loadError}
            </p>
          </div>
        </div>
      )}

      {/* Stats — 2 kart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <StatCard
          label="Toplam Yayın Geliri"
          value={`₺${summary.total.toLocaleString("tr-TR")}`}
          hint={`${summary.count} yayın kaydı`}
          icon={<Wallet className="w-5 h-5" />}
          accent="primary"
        />
        <StatCard
          label="Bu Ay"
          value={`₺${summary.thisMonth.toLocaleString("tr-TR")}`}
          hint={new Date().toLocaleDateString("tr-TR", {
            month: "long",
            year: "numeric",
          })}
          icon={<Radio className="w-5 h-5" />}
          accent="success"
        />
      </div>

      {/* Records table */}
      <PanelCard
        title="Yayın Listesi"
        description="TikTok yayın gelirleri (yeni → eski)"
        className="mt-6"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-body-sm">
            <thead>
              <tr className="bg-surface-container-low text-label-sm text-on-surface-variant uppercase tracking-wide">
                <th className="text-left px-5 py-3 font-semibold">Tarih</th>
                <th className="text-right px-5 py-3 font-semibold">Süre</th>
                <th className="text-right px-5 py-3 font-semibold">
                  Elmas / Coin
                </th>
                <th className="text-right px-5 py-3 font-semibold">
                  TL Karşılığı
                </th>
                <th className="text-right px-5 py-3 font-semibold">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-t border-outline-variant">
                    <td colSpan={5} className="px-5 py-4">
                      <div className="h-4 w-full rounded bg-surface-container animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : items.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-on-surface-variant"
                  >
                    Henüz yayın kaydı yok. Sağ üstten yeni kayıt ekleyin.
                  </td>
                </tr>
              ) : (
                items.map((r, i) => (
                  <tr
                    key={r.id}
                    className={cn(
                      "border-t border-outline-variant hover:bg-surface-container-low transition",
                      i % 2 === 1 && "bg-surface-container-low/40",
                    )}
                  >
                    <td className="px-5 py-3 text-on-surface tabular-nums whitespace-nowrap">
                      {r.tarih || "—"}
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums text-on-surface-variant whitespace-nowrap">
                      {r.yayin_suresi_dk} dk
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums text-on-surface-variant">
                      {r.elmas_coin.toLocaleString("tr-TR")}
                    </td>
                    <td className="px-5 py-3 text-right font-semibold text-on-surface tabular-nums whitespace-nowrap">
                      {formatCurrency(r.tl_karsiligi, "TRY")}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="inline-flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setDetail(r)}
                          className="px-2 py-1 text-secondary hover:text-on-secondary-container text-label-md font-medium"
                        >
                          Detay
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDelete(r)}
                          aria-label="Sil"
                          className="p-2 rounded-lg text-on-surface-variant hover:text-rose-700 hover:bg-rose-50 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </PanelCard>

      {/* Add modal */}
      <Modal
        open={openAdd}
        onClose={() => !saving && setOpenAdd(false)}
        title="Yeni TikTok Yayını"
        size="lg"
        footer={
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpenAdd(false)}
              disabled={saving}
            >
              İptal
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={submitAdd}
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
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Tarih" required>
              <input
                type="date"
                className={inputClass}
                value={form.tarih}
                onChange={(e) => setField("tarih", e.target.value)}
              />
            </FormField>
            <FormField label="Yayın Süresi (dakika)" required>
              <input
                type="number"
                inputMode="numeric"
                min={1}
                step={1}
                className={inputClass}
                placeholder="Örn: 90"
                value={
                  form.yayin_suresi_dk > 0 ? form.yayin_suresi_dk : ""
                }
                onChange={(e) =>
                  setField("yayin_suresi_dk", Number(e.target.value) || 0)
                }
              />
            </FormField>
            <FormField label="Elmas / Coin" required>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                step={1}
                className={inputClass}
                placeholder="Örn: 248000"
                value={form.elmas_coin > 0 ? form.elmas_coin : ""}
                onChange={(e) =>
                  setField("elmas_coin", Number(e.target.value) || 0)
                }
              />
            </FormField>
            <FormField label="TL Karşılığı" required hint="Müşteri elle girer">
              <div className="relative">
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-label-sm font-semibold text-on-surface-variant pointer-events-none">
                  ₺
                </span>
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="0.01"
                  className={cn(inputClass, "pr-8")}
                  placeholder="Örn: 12500"
                  value={form.tl_karsiligi > 0 ? form.tl_karsiligi : ""}
                  onChange={(e) =>
                    setField("tl_karsiligi", Number(e.target.value) || 0)
                  }
                />
              </div>
            </FormField>
          </div>
          <FormField
            label="Ekran Görüntüsü URL"
            hint="Opsiyonel — yayın kazanç ekranının URL'si"
          >
            <input
              type="url"
              className={inputClass}
              placeholder="https://..."
              value={form.ekran_goruntusu_url}
              onChange={(e) =>
                setField("ekran_goruntusu_url", e.target.value)
              }
            />
          </FormField>
          <FormField label="Notlar" hint="Opsiyonel">
            <textarea
              rows={3}
              className={cn(inputClass, "min-h-[80px] resize-y")}
              placeholder="Yayınla ilgili kısa not"
              value={form.notlar}
              onChange={(e) => setField("notlar", e.target.value)}
            />
          </FormField>
        </div>
      </Modal>

      {/* Delete confirmation */}
      <Modal
        open={confirmDelete !== null}
        onClose={() => !deleting && setConfirmDelete(null)}
        title="Yayın Kaydını Sil"
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
          <div className="space-y-3 text-body-sm text-on-surface">
            <p>
              <strong>{confirmDelete.tarih}</strong> tarihli{" "}
              <strong>{formatCurrency(confirmDelete.tl_karsiligi, "TRY")}</strong>{" "}
              tutarındaki yayın kaydını silmek istediğinizden emin misiniz?
            </p>
            <div className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-amber-900 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Bağışlar tablosundaki ilgili kayıt da silinecektir.</span>
            </div>
          </div>
        )}
      </Modal>

      {/* Detail modal */}
      <Modal
        open={detail !== null}
        onClose={() => setDetail(null)}
        title={detail ? `Yayın Detayı — ${detail.tarih}` : ""}
        size="md"
      >
        {detail && (
          <div className="space-y-3 text-body-sm">
            <DetailRow
              label="Süre"
              value={`${detail.yayin_suresi_dk} dakika`}
            />
            <DetailRow
              label="Elmas / Coin"
              value={detail.elmas_coin.toLocaleString("tr-TR")}
            />
            <DetailRow
              label="TL Karşılığı"
              value={formatCurrency(detail.tl_karsiligi, "TRY")}
            />
            <div className="pt-2 border-t border-outline-variant">
              <p className="text-label-sm text-on-surface-variant mb-1">
                Ekran Görüntüsü
              </p>
              {detail.ekran_goruntusu_url ? (
                <a
                  href={detail.ekran_goruntusu_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-secondary hover:text-on-secondary-container break-all"
                >
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  {detail.ekran_goruntusu_url}
                </a>
              ) : (
                <p className="text-on-surface-variant">—</p>
              )}
            </div>
            <div className="pt-2 border-t border-outline-variant">
              <p className="text-label-sm text-on-surface-variant mb-1">
                Notlar
              </p>
              <p className="text-on-surface whitespace-pre-wrap">
                {detail.notlar || "—"}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <span className="text-on-surface-variant">{label}</span>
      <span className="font-medium text-on-surface text-right">{value}</span>
    </div>
  );
}
