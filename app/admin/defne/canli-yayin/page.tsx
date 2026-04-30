"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRightLeft,
  Banknote,
  Camera,
  CheckCircle2,
  Clock,
  Coins,
  Link2,
  Plus,
  Radio,
  Send,
  Wallet,
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
  COIN_TO_TRY,
  getLiveStreamSummary,
  liveStreamRecords as initial,
  unmatchedTransfers as initialTransfers,
  type LiveStreamPlatform,
  type LiveStreamRecord,
  type UnmatchedTransfer,
} from "@/lib/admin-mock-data";
import { cn } from "@/lib/utils";

const PLATFORMS: LiveStreamPlatform[] = ["TikTok", "Instagram", "YouTube"];

export default function LiveStreamPage() {
  const [records, setRecords] = useState<LiveStreamRecord[]>(initial);
  const [transfers, setTransfers] = useState<UnmatchedTransfer[]>(initialTransfers);
  const [openAdd, setOpenAdd] = useState(false);
  const [openMatch, setOpenMatch] = useState<UnmatchedTransfer | null>(null);

  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [platform, setPlatform] = useState<LiveStreamPlatform>("TikTok");
  const [duration, setDuration] = useState("");
  const [coins, setCoins] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const computedAmount = useMemo(() => {
    const c = parseFloat(coins.replace(",", "."));
    return Number.isFinite(c) ? c * COIN_TO_TRY : 0;
  }, [coins]);

  const summary = useMemo(() => getLiveStreamSummary(records), [records]);
  const alerts = records.filter((r) => r.status === "Uyarı");

  const reset = () => {
    setDate(new Date().toISOString().slice(0, 10));
    setPlatform("TikTok");
    setDuration("");
    setCoins("");
    setFile(null);
    setError(null);
  };

  const handleAdd = () => {
    setError(null);
    const dur = parseInt(duration, 10);
    const c = parseFloat(coins.replace(",", "."));
    if (Number.isNaN(dur) || dur <= 0) {
      setError("Geçerli bir yayın süresi girin (dakika).");
      return;
    }
    if (Number.isNaN(c) || c <= 0) {
      setError("Geçerli bir elmas/coin miktarı girin.");
      return;
    }
    if (!file) {
      setError("Yayın sonu ekran görüntüsü zorunludur.");
      return;
    }
    const rec: LiveStreamRecord = {
      id: `LS-${1000 + records.length + 1}`,
      date,
      platform,
      durationMinutes: dur,
      coins: c,
      amountTry: Math.round(c * COIN_TO_TRY),
      bankRef: null,
      status: "Bekleniyor",
    };
    setRecords([rec, ...records]);
    setOpenAdd(false);
    reset();
  };

  // Bir transferi bekleyen yayına eşle (en yakın tutar)
  const handleMatchTransfer = (transfer: UnmatchedTransfer, recordId: string) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === recordId
          ? { ...r, status: "Eşleşti", bankRef: transfer.reference }
          : r,
      ),
    );
    setTransfers((prev) => prev.filter((t) => t.id !== transfer.id));
    setOpenMatch(null);
  };

  const sendAlert = (id: string) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, alertSent: true } : r)),
    );
  };

  const resolveAlert = (id: string) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "Eşleşti", bankRef: r.bankRef ?? "MANUEL-EŞ" } : r,
      ),
    );
  };

  const candidatesForTransfer = (t: UnmatchedTransfer) =>
    records.filter(
      (r) =>
        r.status === "Bekleniyor" &&
        Math.abs(r.amountTry - t.amountTry) / Math.max(t.amountTry, 1) < 0.05,
    );

  return (
    <AdminLayout
      title="Canlı Yayın Geliri"
      subtitle="Sosyal medya canlı yayın gelirleri ve banka mutabakatı"
      actions={
        <Button variant="primary" size="sm" onClick={() => setOpenAdd(true)}>
          <Plus className="w-4 h-4" />
          Yayın Geliri Ekle
        </Button>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard
          label="Toplam Yayın Geliri"
          value={`₺${summary.total.toLocaleString("tr-TR")}`}
          hint={`${records.length} yayın kaydı`}
          icon={<Wallet className="w-5 h-5" />}
          accent="primary"
        />
        <StatCard
          label="Bu Ay"
          value={`₺${summary.thisMonth.toLocaleString("tr-TR")}`}
          hint="Nisan 2026"
          icon={<Radio className="w-5 h-5" />}
          accent="success"
        />
        <StatCard
          label="Bekleyen Transfer"
          value={`₺${summary.pending.toLocaleString("tr-TR")}`}
          hint="1-3 iş günü içinde gelecek"
          icon={<Clock className="w-5 h-5" />}
          accent="warning"
        />
        <StatCard
          label="Uyarı (Eşleşmeyen)"
          value={summary.unmatched}
          hint={summary.unmatched > 0 ? "Müdahale bekliyor" : "Tüm yayınlar eşleşti"}
          icon={<AlertTriangle className="w-5 h-5" />}
          accent={summary.unmatched > 0 ? "warning" : "success"}
        />
      </div>

      {/* Records table */}
      <PanelCard
        title="Yayın Listesi"
        description="Tüm canlı yayın gelirleri ve banka eşleştirme durumu"
        className="mt-6"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-body-sm">
            <thead>
              <tr className="bg-surface-container-low text-label-sm text-on-surface-variant uppercase tracking-wide">
                <th className="text-left px-5 py-3 font-semibold">Tarih</th>
                <th className="text-left px-5 py-3 font-semibold">Platform</th>
                <th className="text-right px-5 py-3 font-semibold">Süre</th>
                <th className="text-right px-5 py-3 font-semibold">Elmas / Coin</th>
                <th className="text-right px-5 py-3 font-semibold">TL Karşılığı</th>
                <th className="text-left px-5 py-3 font-semibold">Banka Ref.</th>
                <th className="text-left px-5 py-3 font-semibold">Durum</th>
                <th className="text-right px-5 py-3 font-semibold">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => (
                <tr
                  key={r.id}
                  className={`border-t border-outline-variant hover:bg-surface-container-low transition ${i % 2 === 1 ? "bg-surface-container-low/40" : ""}`}
                >
                  <td className="px-5 py-3 text-on-surface tabular-nums whitespace-nowrap">{r.date}</td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary-fixed text-primary text-label-sm font-medium">
                      {r.platform}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-on-surface-variant whitespace-nowrap">
                    {r.durationMinutes} dk
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-on-surface-variant">
                    {r.coins.toLocaleString("tr-TR")}
                  </td>
                  <td className="px-5 py-3 text-right font-semibold text-on-surface tabular-nums whitespace-nowrap">
                    {formatCurrency(r.amountTry, "TRY")}
                  </td>
                  <td className="px-5 py-3 text-on-surface-variant tabular-nums">
                    {r.bankRef ?? <span className="text-on-surface-variant/60">—</span>}
                  </td>
                  <td className="px-5 py-3">
                    <LiveStatusPill status={r.status} />
                  </td>
                  <td className="px-5 py-3 text-right">
                    {r.status === "Uyarı" ? (
                      <div className="inline-flex flex-wrap items-center justify-end gap-1.5">
                        {!r.alertSent && (
                          <button
                            onClick={() => sendAlert(r.id)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-label-sm text-amber-700 hover:bg-amber-50 transition"
                          >
                            <Send className="w-3 h-3" /> Uyar
                          </button>
                        )}
                        <button
                          onClick={() => resolveAlert(r.id)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-label-sm text-emerald-700 hover:bg-emerald-50 transition"
                        >
                          <CheckCircle2 className="w-3 h-3" /> Çöz
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => alert(`Yayın detayı:\n${r.id} • ${r.platform}\nSüre: ${r.durationMinutes} dk\nKayıt değiştirilemez.`)}
                        className="text-secondary hover:text-on-secondary-container text-label-md font-medium"
                      >
                        Detay
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PanelCard>

      {/* Bank matching */}
      <div className="grid lg:grid-cols-2 gap-4 mt-6">
        <PanelCard
          title="Banka Eşleştirme"
          description={`${transfers.length} eşleşmemiş transfer`}
        >
          {transfers.length === 0 ? (
            <div className="px-5 py-10 text-center text-on-surface-variant text-body-sm">
              Tüm transferler bir yayın geliriyle eşleşti.
            </div>
          ) : (
            <ul className="divide-y divide-outline-variant">
              {transfers.map((t) => {
                const candidates = candidatesForTransfer(t);
                return (
                  <li key={t.id} className="px-5 py-3 flex items-center justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-primary-fixed text-primary flex items-center justify-center shrink-0">
                        <Banknote className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-label-md font-semibold text-on-surface tabular-nums">
                          {formatCurrency(t.amountTry, "TRY")}
                        </p>
                        <p className="text-label-sm text-on-surface-variant">
                          {t.bank} • {t.date} • {t.reference}
                        </p>
                        {candidates.length > 0 && (
                          <p className="text-label-sm text-emerald-700 mt-0.5">
                            {candidates.length} olası eşleşme bulundu
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setOpenMatch(t)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-secondary text-on-secondary text-label-md font-semibold hover:bg-on-secondary-container transition shrink-0"
                    >
                      <Link2 className="w-3.5 h-3.5" />
                      Eşleştir
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </PanelCard>

        <PanelCard
          title="Uyarı Geçmişi"
          description="3 iş günü geçtiği halde transfer gelmeyen yayınlar"
        >
          {alerts.length === 0 ? (
            <div className="px-5 py-10 text-center text-on-surface-variant text-body-sm">
              Aktif bir uyarı yok.
            </div>
          ) : (
            <ul className="divide-y divide-outline-variant">
              {alerts.map((a) => (
                <li key={a.id} className="px-5 py-3 flex items-start gap-3 bg-rose-50/40">
                  <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <p className="text-label-md font-semibold text-on-surface">
                        {a.platform} • {a.date} ({a.id})
                      </p>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-md text-label-sm font-medium border",
                          a.alertSent
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-rose-50 text-rose-700 border-rose-200",
                        )}
                      >
                        {a.alertSent ? "Uyarı Gönderildi" : "Uyarı Bekliyor"}
                      </span>
                    </div>
                    <p className="text-label-sm text-on-surface-variant mt-0.5">
                      Beklenen tutar: <span className="tabular-nums font-medium text-on-surface">{formatCurrency(a.amountTry, "TRY")}</span> • {a.durationMinutes} dk yayın
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      {!a.alertSent && (
                        <button
                          onClick={() => sendAlert(a.id)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-amber-500 text-white text-label-sm font-medium hover:bg-amber-600 transition"
                        >
                          <Send className="w-3 h-3" /> Uyarı Gönder
                        </button>
                      )}
                      <button
                        onClick={() => resolveAlert(a.id)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-emerald-300 text-emerald-700 text-label-sm font-medium hover:bg-emerald-50 transition"
                      >
                        <CheckCircle2 className="w-3 h-3" /> Çözüldü Olarak İşaretle
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </PanelCard>
      </div>

      {/* Add modal */}
      <Modal
        open={openAdd}
        onClose={() => {
          setOpenAdd(false);
          reset();
        }}
        title="Yeni Yayın Geliri"
        description={`Otomatik TL hesaplama: 1 elmas/coin = ₺${COIN_TO_TRY}`}
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
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Tarih" required>
              <input
                type="date"
                className={inputClass}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </FormField>
            <FormField label="Platform" required>
              <select
                className={inputClass}
                value={platform}
                onChange={(e) => setPlatform(e.target.value as LiveStreamPlatform)}
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Yayın Süresi (dakika)" required>
              <input
                type="number"
                inputMode="numeric"
                min={1}
                className={inputClass}
                placeholder="Örn: 90"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </FormField>
            <FormField label="Elmas / Coin" required>
              <input
                type="number"
                inputMode="decimal"
                min={0}
                step="1"
                className={inputClass}
                placeholder="Örn: 248000"
                value={coins}
                onChange={(e) => setCoins(e.target.value)}
              />
            </FormField>
          </div>
          <div className="rounded-lg border border-outline-variant bg-surface-container-low p-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-on-surface-variant text-label-md">
              <Coins className="w-4 h-4" />
              Hesaplanan TL Karşılığı
            </div>
            <span className="font-bold text-on-surface text-body-md tabular-nums">
              {formatCurrency(Math.round(computedAmount), "TRY")}
            </span>
          </div>
          <FormField label="Yayın Sonu Ekran Görüntüsü" required hint="Platformdaki kazanç ekranının fotoğrafı (zorunlu)">
            <label className="flex items-center justify-center gap-2 px-4 py-6 rounded-lg border-2 border-dashed border-outline-variant bg-surface-container-low hover:border-secondary hover:bg-secondary-container/20 cursor-pointer transition text-on-surface-variant">
              <Camera className="w-5 h-5" />
              <span className="text-body-sm">
                {file ? file.name : "Ekran görüntüsü yükle (placeholder)"}
              </span>
              <input
                type="file"
                accept="image/*"
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

      {/* Match modal */}
      <Modal
        open={openMatch !== null}
        onClose={() => setOpenMatch(null)}
        title={openMatch ? `Eşleştir — ${formatCurrency(openMatch.amountTry, "TRY")}` : ""}
        description={openMatch ? `${openMatch.bank} • ${openMatch.reference} • ${openMatch.date}` : ""}
        size="lg"
      >
        {openMatch && (
          <div className="space-y-3">
            {records.filter((r) => r.status === "Bekleniyor" || r.status === "Uyarı").length === 0 ? (
              <p className="text-center text-on-surface-variant text-body-sm py-8">
                Eşleşmeyi bekleyen yayın bulunamadı.
              </p>
            ) : (
              records
                .filter((r) => r.status === "Bekleniyor" || r.status === "Uyarı")
                .sort(
                  (a, b) =>
                    Math.abs(a.amountTry - openMatch.amountTry) -
                    Math.abs(b.amountTry - openMatch.amountTry),
                )
                .map((r) => {
                  const diff = r.amountTry - openMatch.amountTry;
                  const diffPct = Math.abs(diff) / Math.max(openMatch.amountTry, 1);
                  const isMatch = diffPct < 0.05;
                  return (
                    <button
                      key={r.id}
                      onClick={() => handleMatchTransfer(openMatch, r.id)}
                      className={cn(
                        "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg border text-left transition",
                        isMatch
                          ? "border-emerald-300 bg-emerald-50/60 hover:bg-emerald-50"
                          : "border-outline-variant hover:bg-surface-container-low",
                      )}
                    >
                      <div className="min-w-0">
                        <p className="text-label-md font-semibold text-on-surface">
                          {r.platform} • {r.date} ({r.id})
                        </p>
                        <p className="text-label-sm text-on-surface-variant">
                          {r.durationMinutes} dk yayın • {r.coins.toLocaleString("tr-TR")} coin
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-semibold text-on-surface tabular-nums">
                          {formatCurrency(r.amountTry, "TRY")}
                        </p>
                        <p className={cn(
                          "text-label-sm tabular-nums",
                          isMatch ? "text-emerald-700" : "text-on-surface-variant",
                        )}>
                          {diff === 0 ? "Tam eşleşme" : `Fark: ₺${Math.abs(diff).toLocaleString("tr-TR")}`}
                        </p>
                      </div>
                      <ArrowRightLeft className="w-4 h-4 text-on-surface-variant shrink-0" />
                    </button>
                  );
                })
            )}
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}

function LiveStatusPill({ status }: { status: LiveStreamRecord["status"] }) {
  const map = {
    Eşleşti: { label: "Eşleşti ✓", cls: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
    Bekleniyor: {
      label: "Bekleniyor (1-3 iş günü)",
      cls: "bg-amber-50 text-amber-700 border-amber-200",
      dot: "bg-amber-500",
    },
    Uyarı: {
      label: "Uyarı: Transfer Gelmedi",
      cls: "bg-rose-50 text-rose-700 border-rose-200",
      dot: "bg-rose-500",
    },
  } as const;
  const m = map[status];
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-label-sm font-medium", m.cls)}>
      <span className={cn("w-1.5 h-1.5 rounded-full", m.dot, status === "Uyarı" && "animate-pulse")} />
      {m.label}
    </span>
  );
}
