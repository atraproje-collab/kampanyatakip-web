"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  BadgeCheck,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  Coins,
  Copy,
  ExternalLink,
  FileText,
  Loader2,
  Lock,
  Music2,
  PiggyBank,
  Printer,
  RefreshCw,
  ShieldCheck,
  Store,
  Users,
  Video,
  Wallet,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { FollowSocialButtons } from "@/components/campaign/FollowSocialButtons";
import {
  fetchDonations,
  fetchExpenses,
  fetchKumbaralar,
  fetchStantlar,
  type Donation,
  type KumbaraRow,
  type StantRow,
} from "@/lib/api";
import {
  fetchCampaignSettings,
  formatRemaining,
  formatTrDate,
  type CampaignSettings,
} from "@/lib/campaign-settings";
import { fetchBankAccounts, type BankAccount } from "@/lib/banka-hesaplari";
import { fetchTikTokIncome, summarize, type TikTokIncome } from "@/lib/canli-yayin";
import {
  formatTRY,
  formatUSD,
  mockExchangeRate,
  toTRY,
} from "@/lib/exchange-rate";
import { formatRelativeTime } from "@/lib/donation-format";
import { maskName } from "@/lib/mask-name";
import type { CurrencyCode, ExpenseRow } from "@/lib/mock-campaign-data";
import { cn } from "@/lib/utils";

const POLL_INTERVAL_MS = 30_000;
const PAGE_SIZE = 50;

const CURRENCY_SYMBOL: Record<CurrencyCode, string> = {
  TRY: "₺",
  USD: "$",
  EUR: "€",
};

const CURRENCY_CHIP: Record<CurrencyCode, string> = {
  TRY: "bg-secondary/10 text-secondary border-secondary/30",
  USD: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
  EUR: "bg-blue-500/10 text-blue-700 border-blue-500/30",
};

// ── Types ────────────────────────────────────────────────────────────────────

type FilterRange = "today" | "week" | "month" | "all";
type TimelineTab = "all" | "donations" | "expenses" | "field" | "tiktok";

type TimelineItem =
  | {
      kind: "donation";
      ts: number;
      dateLabel: string;
      timeLabel: string;
      amountTry: number;
      amountNative: number;
      currency: CurrencyCode;
      donor: string;
      source: string;
      isField: boolean;
    }
  | {
      kind: "expense";
      ts: number;
      dateLabel: string;
      timeLabel: string;
      amountTry: number;
      vendor: string;
      category: string;
      description: string;
      document: string;
    }
  | {
      kind: "tiktok";
      ts: number;
      dateLabel: string;
      timeLabel: string;
      amountTry: number;
      durationMin: number;
      coins: number;
      screenshotUrl: string;
    };

// ── Page ─────────────────────────────────────────────────────────────────────

interface TransparencyClientProps {
  slug: string;
}

export function TransparencyClient({ slug }: TransparencyClientProps) {
  const [settings, setSettings] = useState<CampaignSettings | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [expenses, setExpenses] = useState<ExpenseRow[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [kumbaralar, setKumbaralar] = useState<KumbaraRow[]>([]);
  const [stantlar, setStantlar] = useState<StantRow[]>([]);
  const [tikTok, setTikTok] = useState<TikTokIncome[]>([]);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [now, setNow] = useState<Date>(new Date());
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Tick "X dakika önce" labelı için her 30sn'de re-render
  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(tick);
  }, []);

  // Veri çekme + 30sn polling
  useEffect(() => {
    let mounted = true;

    const sync = async () => {
      try {
        const [s, d, e, b, k, st, t] = await Promise.all([
          fetchCampaignSettings(slug),
          fetchDonations(),
          fetchExpenses(),
          fetchBankAccounts(slug),
          fetchKumbaralar(),
          fetchStantlar(),
          fetchTikTokIncome(slug),
        ]);
        if (!mounted) return;

        if (s.settings) setSettings(s.settings);
        if (d) setDonations(d);
        if (e) setExpenses(e);
        if (b.ok) setBankAccounts(b.items);
        if (k) setKumbaralar(k);
        if (st) setStantlar(st);
        if (t.ok) setTikTok(t.items);

        // Hata durumunda banner: tüm endpoint'ler null/!ok ise
        const allFailed =
          d === null && e === null && !b.ok && k === null && st === null && !t.ok;
        setLoadError(allFailed ? "Veri yüklenemedi, lütfen yenileyin." : null);
        setLastSync(new Date());
      } catch (err) {
        if (mounted) {
          setLoadError("Veri yüklenemedi, lütfen yenileyin.");
          console.error("[seffaflik] sync failed:", err);
        }
      } finally {
        if (mounted) setInitialLoading(false);
      }
    };

    sync();
    const interval = setInterval(sync, POLL_INTERVAL_MS);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [slug]);

  const handlePrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      {/* HERO */}
      <Hero
        settings={settings}
        lastSync={lastSync}
        now={now}
        onPrint={handlePrint}
      />

      {loadError && (
        <div className="border-y border-amber-300 bg-amber-50 text-amber-900 print:hidden">
          <div className="mx-auto max-w-6xl px-4 md:px-6 py-3 text-[13.5px] font-medium flex items-center gap-2">
            <RefreshCw size={14} />
            {loadError}
          </div>
        </div>
      )}

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 md:px-6 py-10 md:py-14 space-y-12">
          <Metrics
            settings={settings}
            donations={donations}
            expenses={expenses}
            loading={initialLoading}
          />

          <ApprovalCard settings={settings} />

          <BankAccountsSection accounts={bankAccounts} loading={initialLoading} />

          <Timeline
            donations={donations}
            expenses={expenses}
            tikTok={tikTok}
            loading={initialLoading}
          />

          <FieldSummary kumbaralar={kumbaralar} stantlar={stantlar} />

          <TikTokSection items={tikTok} />
        </div>
      </main>

      <Footer />
    </div>
  );
}

// ── Hero ─────────────────────────────────────────────────────────────────────

function Hero({
  settings,
  lastSync,
  now,
  onPrint,
}: {
  settings: CampaignSettings | null;
  lastSync: Date | null;
  now: Date;
  onPrint: () => void;
}) {
  const lastSyncLabel = useMemo(() => {
    if (!lastSync) return "—";
    const diffSec = Math.max(0, Math.floor((now.getTime() - lastSync.getTime()) / 1000));
    if (diffSec < 60) return "az önce";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} dakika önce`;
    const diffHour = Math.floor(diffMin / 60);
    return `${diffHour} saat önce`;
  }, [lastSync, now]);

  return (
    <section className="relative overflow-hidden text-white print:bg-white print:text-black">
      <div
        aria-hidden
        className="absolute inset-0 print:hidden"
        style={{
          background:
            "linear-gradient(135deg, #001835 0%, #012d59 55%, #00677f 120%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07] pointer-events-none print:hidden"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
          backgroundSize: "26px 26px",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 md:px-6 py-12 md:py-16">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div className="flex-1 min-w-[260px]">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] print:bg-emerald-50 print:text-emerald-800 print:border-emerald-200">
              <Lock size={12} /> Şeffaflık Merkezi
            </span>
            <h1 className="mt-4 text-[32px] md:text-[44px] font-bold leading-[1.05] tracking-[-0.02em]">
              🔒 Şeffaflık Merkezi
            </h1>
            <p className="mt-3 text-[16px] md:text-[18px] font-semibold text-white/90 print:text-black">
              {settings?.title ?? "Kampanya yükleniyor…"}
            </p>
            <p className="mt-4 max-w-2xl text-[13.5px] md:text-[14.5px] leading-[22px] text-white/80 print:text-black">
              Bu kampanyanın tüm gelir-gider kayıtları, KVK Madde 10 ve 5072
              Sayılı Yardım Toplama Kanunu uyarınca açık ve denetlenebilir
              şekilde tutulmaktadır.
            </p>

            <div className="mt-5 flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-3 py-1.5 text-[12px] font-semibold print:bg-white print:text-black print:border-neutral-300">
                <RefreshCw size={12} className="opacity-80" />
                Son güncelleme:{" "}
                <span className="tabular-nums">{lastSyncLabel}</span>
              </span>
              <button
                type="button"
                onClick={onPrint}
                className="inline-flex items-center gap-1.5 rounded-full bg-white text-primary-container border border-white/30 px-3.5 py-1.5 text-[12px] font-semibold hover:bg-white/90 transition-colors print:hidden"
              >
                <Printer size={13} />
                Yazdır / PDF olarak kaydet
              </button>
              <Link
                href="/kampanya/demo"
                className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-3.5 py-1.5 text-[12px] font-semibold hover:bg-white/15 transition-colors print:hidden"
              >
                <ChevronDown size={13} className="rotate-90" />
                Kampanya sayfasına dön
              </Link>
            </div>
          </div>

          <div className="shrink-0">
            <div className="inline-flex items-start gap-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 px-5 py-4 print:bg-emerald-50 print:border-emerald-200 print:text-emerald-900">
              <div className="w-10 h-10 rounded-lg bg-emerald-400/30 text-emerald-200 flex items-center justify-center shrink-0 print:bg-emerald-100 print:text-emerald-700">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-emerald-200 print:text-emerald-700">
                  ✓ Değiştirilemez Kayıt
                </p>
                <p className="text-[12.5px] mt-0.5 text-white/85 print:text-emerald-900">
                  Tüm hareketler kriptografik zaman damgalı.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Metrics ──────────────────────────────────────────────────────────────────

function Metrics({
  settings,
  donations,
  expenses,
  loading,
}: {
  settings: CampaignSettings | null;
  donations: Donation[];
  expenses: ExpenseRow[];
  loading: boolean;
}) {
  const rate = mockExchangeRate;

  const totalDonationTry = donations.reduce(
    (s, d) => s + toTRY(d.amount, d.currency, rate),
    0,
  );
  const donorCount = donations.length;
  const totalExpenseTry = expenses.reduce((s, e) => s + e.amount, 0);
  const expenseCount = expenses.length;
  const balance = totalDonationTry - totalExpenseTry;

  const goalNative = settings?.goalAmount ?? 0;
  const goalCurrency = settings?.goalCurrency ?? "USD";
  const goalTry =
    goalCurrency === "TRY" ? goalNative : toTRY(goalNative, goalCurrency, rate);
  const usagePct =
    goalTry > 0 ? Math.min(100, (totalDonationTry / goalTry) * 100) : 0;

  const cards = [
    {
      label: "Toplam Bağış",
      value: `₺${formatTRY(totalDonationTry)}`,
      sub: `${donorCount.toLocaleString("tr-TR")} bağışçı`,
      Icon: ArrowUpCircle,
      tone: "secondary" as const,
    },
    {
      label: "Toplam Gider",
      value: `₺${formatTRY(totalExpenseTry)}`,
      sub: `${expenseCount.toLocaleString("tr-TR")} işlem`,
      Icon: ArrowDownCircle,
      tone: "neutral" as const,
    },
    {
      label: "Mevcut Bakiye",
      value: `₺${formatTRY(balance)}`,
      sub: `Gelir − Gider`,
      Icon: Wallet,
      tone: "primary" as const,
    },
    {
      label: "Hedef Tutar",
      value:
        goalCurrency === "TRY"
          ? `₺${formatTRY(goalNative)}`
          : `${CURRENCY_SYMBOL[goalCurrency]}${formatUSD(goalNative)}`,
      sub: `Toplama oranı: %${usagePct.toFixed(1)}`,
      Icon: Coins,
      tone: "secondary" as const,
    },
  ];

  return (
    <section aria-labelledby="metrics-heading">
      <h2 id="metrics-heading" className="sr-only">
        Özet metrikler
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {cards.map(({ label, value, sub, Icon, tone }) => {
          const toneCls =
            tone === "secondary"
              ? "bg-secondary/10 text-secondary"
              : tone === "primary"
                ? "bg-primary-container/10 text-primary-container"
                : "bg-surface-container-high text-on-surface-variant";
          return (
            <div
              key={label}
              className="rounded-2xl bg-white border border-outline-variant p-4 md:p-5"
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center mb-3",
                  toneCls,
                )}
              >
                <Icon size={18} />
              </div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-on-surface-variant">
                {label}
              </p>
              <p className="mt-1 text-[18px] md:text-[22px] font-bold text-primary-container tabular-nums tracking-tight leading-none">
                {loading ? "—" : value}
              </p>
              <p className="mt-1 text-[11.5px] text-on-surface-variant/85 tabular-nums">
                {sub}
              </p>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="mt-4 rounded-2xl bg-white border border-outline-variant p-4 md:p-5">
        <div className="flex items-center justify-between mb-2 text-[12.5px]">
          <span className="font-semibold text-primary-container">
            Hedefin %{usagePct.toFixed(1)} kadarı toplandı
          </span>
          <span className="tabular-nums text-on-surface-variant">
            ₺{formatTRY(totalDonationTry)} / ₺{formatTRY(goalTry)}
          </span>
        </div>
        <div className="h-2.5 rounded-full bg-surface-container-high overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-secondary to-primary-container transition-[width] duration-700"
            style={{ width: `${usagePct}%` }}
          />
        </div>
      </div>
    </section>
  );
}

// ── Approval Card ────────────────────────────────────────────────────────────

function ApprovalCard({ settings }: { settings: CampaignSettings | null }) {
  if (!settings) {
    return (
      <section className="rounded-2xl border border-outline-variant bg-white p-6 md:p-7 animate-pulse min-h-[200px]" />
    );
  }
  const remaining = formatRemaining(settings.endDate);
  return (
    <section
      aria-labelledby="approval-heading"
      className="rounded-2xl border border-outline-variant bg-white p-6 md:p-7"
    >
      <div className="flex items-start gap-4 flex-wrap">
        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
          <BadgeCheck size={22} />
        </div>
        <div className="flex-1 min-w-[240px]">
          <h2
            id="approval-heading"
            className="text-[18px] md:text-[20px] font-semibold text-primary-container tracking-[-0.01em]"
          >
            Valilik Onayı
          </h2>
          <p className="mt-1 text-[12.5px] text-on-surface-variant">
            Yasal çerçeve:{" "}
            <strong className="text-primary-container">
              5072 Sayılı Yardım Toplama Kanunu
            </strong>
          </p>
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Onay No" value={settings.decisionNumber || "—"} />
        <Field label="Onay Tarihi" value={formatTrDate(settings.approvalDate)} />
        <Field label="Onay Veren Kurum" value={settings.authority || "—"} />
        <Field
          label="Süre"
          value={`${formatTrDate(settings.startDate)} — ${formatTrDate(settings.endDate)}`}
        />
        <Field
          label="Kalan Süre"
          value={remaining}
          accent
          className="sm:col-span-2"
        />
      </dl>
    </section>
  );
}

function Field({
  label,
  value,
  accent = false,
  className,
}: {
  label: string;
  value: string;
  accent?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-on-surface-variant">
        {label}
      </dt>
      <dd
        className={cn(
          "mt-1 text-[14px] font-semibold break-words",
          accent ? "text-secondary" : "text-primary-container",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

// ── Bank Accounts ────────────────────────────────────────────────────────────

function BankAccountsSection({
  accounts,
  loading,
}: {
  accounts: BankAccount[];
  loading: boolean;
}) {
  return (
    <section aria-labelledby="bank-heading">
      <div className="flex items-end justify-between gap-3 mb-4 flex-wrap">
        <div>
          <h2
            id="bank-heading"
            className="text-[18px] md:text-[22px] font-semibold text-primary-container tracking-[-0.01em] flex items-center gap-2"
          >
            <Building2 size={18} className="text-secondary" />
            Resmi Banka Hesapları
          </h2>
          <p className="mt-1 text-[12.5px] text-on-surface-variant">
            Sadece bu hesaplara yatırılan bağışlar şeffaflık merkezinde takip
            edilir.
          </p>
        </div>
      </div>

      <div className="rounded-xl bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 text-[12.5px] mb-4 flex items-start gap-2">
        <span className="mt-0.5">💡</span>
        <span>
          <strong>Bağış yaparken sadece bu hesapları kullanın.</strong> Başka
          hesaplara yatırılan bağışlar takip edilemez.
        </span>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-outline-variant bg-white p-8 text-center text-[13px] text-on-surface-variant">
          <Loader2 size={18} className="animate-spin inline-block mr-2 align-middle" />
          Hesaplar yükleniyor…
        </div>
      ) : accounts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-outline-variant bg-white p-8 text-center text-[13px] text-on-surface-variant">
          Henüz banka hesabı tanımlanmamış.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accounts.map((acc) => (
            <BankAccountCard key={acc.id} account={acc} />
          ))}
        </div>
      )}
    </section>
  );
}

function BankAccountCard({ account }: { account: BankAccount }) {
  const [copiedField, setCopiedField] = useState<"iban" | "swift" | null>(null);

  const copy = async (text: string, field: "iban" | "swift") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1800);
    } catch {
      // sessizce göz ardı et
    }
  };

  return (
    <article className="rounded-2xl bg-white border border-outline-variant p-5 hover:shadow-[0_4px_12px_rgba(0,24,53,0.06)] transition print:break-inside-avoid">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p className="text-[15px] font-bold text-primary-container">
            {account.banka_adi || "—"}
          </p>
          <p className="text-[12.5px] text-on-surface-variant truncate">
            {account.hesap_sahibi || "Hesap sahibi belirtilmemiş"}
          </p>
        </div>
        <span
          className={cn(
            "shrink-0 inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-bold tracking-wider",
            CURRENCY_CHIP[account.para_birimi],
          )}
        >
          {account.para_birimi}
        </span>
      </div>

      <CopyRow
        label="IBAN"
        value={account.iban || "—"}
        canCopy={Boolean(account.iban)}
        copied={copiedField === "iban"}
        onCopy={() => copy(account.iban, "iban")}
      />
      {account.swift_bic && (
        <CopyRow
          label="SWIFT / BIC"
          value={account.swift_bic}
          canCopy
          copied={copiedField === "swift"}
          onCopy={() => copy(account.swift_bic, "swift")}
        />
      )}
    </article>
  );
}

function CopyRow({
  label,
  value,
  canCopy,
  copied,
  onCopy,
}: {
  label: string;
  value: string;
  canCopy: boolean;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="mt-3">
      <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-on-surface-variant">
        {label}
      </p>
      <div className="mt-1 flex items-center gap-2">
        <code className="flex-1 min-w-0 break-all rounded-lg bg-surface-container-low border border-outline-variant px-3 py-2 text-[12.5px] font-mono text-primary-container">
          {value}
        </code>
        {canCopy && (
          <button
            type="button"
            onClick={onCopy}
            className={cn(
              "inline-flex items-center justify-center h-9 w-9 rounded-lg border transition print:hidden",
              copied
                ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                : "border-outline-variant text-on-surface-variant hover:border-secondary hover:text-secondary",
            )}
            aria-label={`${label} kopyala`}
            title={copied ? "Kopyalandı" : `${label} kopyala`}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Timeline ─────────────────────────────────────────────────────────────────

function Timeline({
  donations,
  expenses,
  tikTok,
  loading,
}: {
  donations: Donation[];
  expenses: ExpenseRow[];
  tikTok: TikTokIncome[];
  loading: boolean;
}) {
  const [tab, setTab] = useState<TimelineTab>("all");
  const [range, setRange] = useState<FilterRange>("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const items = useMemo<TimelineItem[]>(() => {
    const list: TimelineItem[] = [];

    for (const d of donations) {
      const ts = parseTs(d.date);
      const isField = /^Kumbara|^Stant/i.test(d.source);
      const amountTry = toTRY(d.amount, d.currency, mockExchangeRate);
      list.push({
        kind: "donation",
        ts,
        dateLabel: formatShortDate(ts),
        timeLabel: formatTime(ts),
        amountTry,
        amountNative: d.amount,
        currency: d.currency,
        donor: d.donorName, // already masked or anonim source
        source: d.source,
        isField,
      });
    }

    for (const e of expenses) {
      const ts = parseTs(e.date);
      list.push({
        kind: "expense",
        ts,
        dateLabel: formatShortDate(ts),
        timeLabel: "",
        amountTry: e.amount,
        vendor: e.vendor || "—",
        category: e.category || "Diğer",
        description: e.description || "",
        document: e.document || "",
      });
    }

    for (const t of tikTok) {
      const ts = parseTs(t.tarih);
      list.push({
        kind: "tiktok",
        ts,
        dateLabel: formatShortDate(ts),
        timeLabel: "",
        amountTry: t.tl_karsiligi,
        durationMin: t.yayin_suresi_dk,
        coins: t.elmas_coin,
        screenshotUrl: t.ekran_goruntusu_url,
      });
    }

    return list.sort((a, b) => b.ts - a.ts);
  }, [donations, expenses, tikTok]);

  const filtered = useMemo(() => {
    const cutoff = rangeCutoffMs(range);
    return items.filter((it) => {
      if (cutoff !== null && it.ts < cutoff) return false;
      if (tab === "donations" && it.kind !== "donation") return false;
      if (tab === "expenses" && it.kind !== "expense") return false;
      if (tab === "field" && !(it.kind === "donation" && it.isField)) return false;
      if (tab === "tiktok" && it.kind !== "tiktok") return false;
      return true;
    });
  }, [items, tab, range]);

  const handleTab = (next: TimelineTab) => {
    setTab(next);
    setVisibleCount(PAGE_SIZE);
  };
  const handleRange = (next: FilterRange) => {
    setRange(next);
    setVisibleCount(PAGE_SIZE);
  };

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visible.length < filtered.length;

  return (
    <section aria-labelledby="timeline-heading">
      <div className="flex items-end justify-between gap-3 mb-4 flex-wrap">
        <div>
          <h2
            id="timeline-heading"
            className="text-[18px] md:text-[22px] font-semibold text-primary-container tracking-[-0.01em] flex items-center gap-2"
          >
            <CalendarDays size={18} className="text-secondary" />
            Tüm Hareketler
          </h2>
          <p className="mt-1 text-[12.5px] text-on-surface-variant">
            En yeni hareket en üstte. {filtered.length.toLocaleString("tr-TR")}{" "}
            kayıt görüntüleniyor.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div
        role="tablist"
        className="inline-flex p-1 rounded-xl bg-surface-container-low border border-outline-variant mb-3 flex-wrap"
      >
        {(
          [
            ["all", "Tümü"],
            ["donations", "Bağışlar"],
            ["expenses", "Giderler"],
            ["field", "Kumbara/Stant"],
            ["tiktok", "TikTok"],
          ] as [TimelineTab, string][]
        ).map(([t, label]) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => handleTab(t)}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-[12.5px] font-semibold transition-all",
              tab === t
                ? "bg-white text-primary-container shadow-[0_1px_2px_rgba(0,24,53,0.06)]"
                : "text-on-surface-variant hover:text-primary-container",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Range chips */}
      <div className="flex flex-wrap gap-2 mb-5">
        {(
          [
            ["today", "Bugün"],
            ["week", "Hafta"],
            ["month", "Ay"],
            ["all", "Tümü"],
          ] as [FilterRange, string][]
        ).map(([r, label]) => (
          <button
            key={r}
            type="button"
            onClick={() => handleRange(r)}
            className={cn(
              "px-3 py-1 rounded-full border text-[11.5px] font-semibold transition",
              range === r
                ? "border-primary-container bg-primary-container text-white"
                : "border-outline-variant text-on-surface-variant hover:border-primary-container hover:text-primary-container",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="rounded-2xl border border-outline-variant bg-white p-8 text-center text-[13px] text-on-surface-variant">
          <Loader2 size={18} className="animate-spin inline-block mr-2 align-middle" />
          Hareketler yükleniyor…
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-outline-variant bg-white p-8 text-center text-[13px] text-on-surface-variant">
          Bu filtreyle eşleşen hareket bulunamadı.
        </div>
      ) : (
        <ul className="rounded-2xl border border-outline-variant bg-white divide-y divide-outline-variant overflow-hidden">
          {visible.map((it, idx) => (
            <TimelineRow key={idx} item={it} />
          ))}
        </ul>
      )}

      {hasMore && (
        <div className="mt-4 text-center print:hidden">
          <button
            type="button"
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            className="inline-flex items-center gap-2 rounded-lg border border-outline-variant bg-white px-4 py-2 text-[12.5px] font-semibold text-primary-container hover:border-primary-container transition"
          >
            <ChevronDown size={14} />
            Daha fazla göster ({(filtered.length - visible.length).toLocaleString("tr-TR")} kayıt)
          </button>
        </div>
      )}
    </section>
  );
}

function TimelineRow({ item }: { item: TimelineItem }) {
  if (item.kind === "donation") {
    return (
      <li className="px-4 md:px-5 py-3.5 grid grid-cols-12 gap-3 items-center hover:bg-surface-container-low/40 transition-colors">
        <div className="col-span-3 md:col-span-2 text-[12px] text-on-surface-variant tabular-nums">
          <p className="font-semibold text-primary-container">{item.dateLabel}</p>
          <p className="text-[11px]">{item.timeLabel}</p>
        </div>
        <div className="col-span-9 md:col-span-7 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[14px] font-bold text-secondary tabular-nums">
              💰 +{CURRENCY_SYMBOL[item.currency]}
              {formatTRY(Math.round(item.amountNative))}
            </span>
            <span className="text-[12.5px] text-on-surface-variant truncate">
              {item.donor}
            </span>
          </div>
          <p className="mt-0.5 text-[11.5px] text-on-surface-variant/85">
            <SourceBadge source={item.source} />
          </p>
        </div>
        <div className="col-span-12 md:col-span-3 text-right text-[11.5px] text-on-surface-variant tabular-nums">
          {item.currency !== "TRY" && (
            <>≈ ₺{formatTRY(Math.round(item.amountTry))}</>
          )}
        </div>
      </li>
    );
  }

  if (item.kind === "expense") {
    return (
      <li className="px-4 md:px-5 py-3.5 grid grid-cols-12 gap-3 items-center hover:bg-surface-container-low/40 transition-colors">
        <div className="col-span-3 md:col-span-2 text-[12px] text-on-surface-variant tabular-nums">
          <p className="font-semibold text-primary-container">{item.dateLabel}</p>
        </div>
        <div className="col-span-9 md:col-span-7 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[14px] font-bold text-error tabular-nums">
              💸 −₺{formatTRY(Math.round(item.amountTry))}
            </span>
            <span className="text-[12.5px] text-on-surface-variant truncate">
              {item.vendor}
            </span>
          </div>
          <p className="mt-0.5 text-[11.5px]">
            <span className="inline-flex items-center rounded-full bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 text-[10.5px] font-bold tracking-wider">
              {item.category}
            </span>
            {item.description && (
              <span className="ml-2 text-on-surface-variant/85">
                {item.description}
              </span>
            )}
          </p>
        </div>
        <div className="col-span-12 md:col-span-3 text-right text-[11.5px]">
          {item.document && item.document !== "#" ? (
            <a
              href={item.document}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-secondary font-semibold hover:underline"
            >
              📎 Belge
              <ExternalLink size={11} />
            </a>
          ) : (
            <span className="text-on-surface-variant/60">Belge —</span>
          )}
        </div>
      </li>
    );
  }

  // tiktok
  return (
    <li className="px-4 md:px-5 py-3.5 grid grid-cols-12 gap-3 items-center hover:bg-surface-container-low/40 transition-colors">
      <div className="col-span-3 md:col-span-2 text-[12px] text-on-surface-variant tabular-nums">
        <p className="font-semibold text-primary-container">{item.dateLabel}</p>
      </div>
      <div className="col-span-9 md:col-span-7 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[14px] font-bold text-secondary tabular-nums">
            🎵 +₺{formatTRY(Math.round(item.amountTry))}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-neutral-900 text-white px-2 py-0.5 text-[10.5px] font-semibold">
            <Music2 size={10} /> TikTok Yayın
          </span>
        </div>
        <p className="mt-0.5 text-[11.5px] text-on-surface-variant/85 tabular-nums">
          {item.durationMin} dk · {item.coins.toLocaleString("tr-TR")} elmas
        </p>
      </div>
      <div className="col-span-12 md:col-span-3 text-right text-[11.5px]">
        {item.screenshotUrl ? (
          <a
            href={item.screenshotUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-secondary font-semibold hover:underline"
          >
            📸 Ekran
            <ExternalLink size={11} />
          </a>
        ) : (
          <span className="text-on-surface-variant/60">—</span>
        )}
      </div>
    </li>
  );
}

function SourceBadge({ source }: { source: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-surface-container-high text-on-surface-variant px-2 py-0.5 text-[10.5px] font-semibold tracking-wide">
      {source}
    </span>
  );
}

// ── Field Summary (Kumbara & Stant) ──────────────────────────────────────────

function FieldSummary({
  kumbaralar,
  stantlar,
}: {
  kumbaralar: KumbaraRow[];
  stantlar: StantRow[];
}) {
  const activeK = kumbaralar.filter((k) => k.status === "aktif");
  const activeS = stantlar.filter((s) => s.status === "aktif");
  const totalK = activeK.reduce((s, k) => s + k.total, 0);
  const totalS = activeS.reduce((s, k) => s + k.total, 0);

  return (
    <section aria-labelledby="field-heading" className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      <FieldList
        title="Aktif Kumbaralar"
        Icon={PiggyBank}
        items={activeK.map((k) => ({
          id: k.id,
          location: k.location,
          responsible: k.responsible,
          total: k.total,
          extra: `Son açılış: ${k.lastOpened}`,
        }))}
        totalLabel="Toplam"
        totalValue={totalK}
      />
      <FieldList
        title="Aktif Stantlar"
        Icon={Store}
        items={activeS.map((s) => ({
          id: s.id,
          location: s.location,
          responsible: s.responsible,
          total: s.total,
          extra: `Son kapanış: ${s.lastClose}`,
        }))}
        totalLabel="Toplam"
        totalValue={totalS}
      />
    </section>
  );
}

function FieldList({
  title,
  Icon,
  items,
  totalLabel,
  totalValue,
}: {
  title: string;
  Icon: typeof PiggyBank;
  items: {
    id: string;
    location: string;
    responsible: string;
    total: number;
    extra: string;
  }[];
  totalLabel: string;
  totalValue: number;
}) {
  return (
    <details
      className="group rounded-2xl border border-outline-variant bg-white open:shadow-[0_2px_10px_rgba(0,24,53,0.04)] transition"
      open
    >
      <summary className="cursor-pointer list-none px-5 py-4 flex items-center justify-between gap-3">
        <span className="flex items-center gap-2.5 text-[15px] font-semibold text-primary-container">
          <span className="w-9 h-9 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
            <Icon size={16} />
          </span>
          {title}{" "}
          <span className="ml-1 text-[11.5px] font-medium text-on-surface-variant">
            ({items.length})
          </span>
        </span>
        <span className="flex items-center gap-3">
          <span className="text-[13px] font-bold text-secondary tabular-nums">
            {totalLabel}: ₺{formatTRY(totalValue)}
          </span>
          <ChevronDown
            size={16}
            className="text-on-surface-variant group-open:rotate-180 transition-transform"
          />
        </span>
      </summary>
      <div className="border-t border-outline-variant divide-y divide-outline-variant">
        {items.length === 0 ? (
          <p className="px-5 py-5 text-[12.5px] text-on-surface-variant text-center">
            Aktif kayıt bulunmuyor.
          </p>
        ) : (
          items.map((it) => (
            <div key={it.id} className="px-5 py-3.5 text-[12.5px]">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="min-w-0">
                  <p className="font-semibold text-primary-container">
                    {it.id}{" "}
                    <span className="text-on-surface-variant font-normal">
                      · {it.location || "Konum belirtilmedi"}
                    </span>
                  </p>
                  <p className="text-[11.5px] text-on-surface-variant/85">
                    Sorumlu:{" "}
                    <span className="font-medium text-on-surface">
                      {maskName(it.responsible, "—")}
                    </span>{" "}
                    · {it.extra}
                  </p>
                </div>
                <span className="font-bold text-secondary tabular-nums whitespace-nowrap">
                  ₺{formatTRY(it.total)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </details>
  );
}

// ── TikTok Income ────────────────────────────────────────────────────────────

function TikTokSection({ items }: { items: TikTokIncome[] }) {
  const stats = summarize(items);
  return (
    <section aria-labelledby="tiktok-heading">
      <div className="flex items-end justify-between gap-3 mb-3 flex-wrap">
        <div>
          <h2
            id="tiktok-heading"
            className="text-[18px] md:text-[22px] font-semibold text-primary-container tracking-[-0.01em] flex items-center gap-2"
          >
            <Video size={18} className="text-secondary" />
            TikTok Yayın Gelirleri
          </h2>
          <p className="mt-1 text-[12.5px] text-on-surface-variant">
            Bu gelirler düzenli olarak kampanya hesabına aktarılır.
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] uppercase tracking-[0.12em] font-bold text-on-surface-variant">
            Toplam Yayın Geliri
          </p>
          <p className="text-[20px] font-bold text-secondary tabular-nums">
            ₺{formatTRY(stats.total)}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-outline-variant bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead className="bg-surface-container-low text-[11px] font-bold uppercase tracking-[0.12em] text-on-surface-variant">
              <tr>
                <th className="px-4 py-3 text-left">Tarih</th>
                <th className="px-4 py-3 text-right">Süre (dk)</th>
                <th className="px-4 py-3 text-right">Elmas / Coin</th>
                <th className="px-4 py-3 text-right">TL Karşılığı</th>
                <th className="px-4 py-3 text-center">Belge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-on-surface-variant text-[12.5px]">
                    Yayın geliri kaydı bulunmuyor.
                  </td>
                </tr>
              ) : (
                items.slice(0, 20).map((t) => (
                  <tr key={t.id} className="hover:bg-surface-container-low/40">
                    <td className="px-4 py-3 text-on-surface-variant whitespace-nowrap">
                      {t.tarih}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {t.yayin_suresi_dk}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {t.elmas_coin.toLocaleString("tr-TR")}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-secondary tabular-nums">
                      ₺{formatTRY(t.tl_karsiligi)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {t.ekran_goruntusu_url ? (
                        <a
                          href={t.ekran_goruntusu_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-secondary text-[12px] font-semibold hover:underline"
                        >
                          📸 Görüntüle
                        </a>
                      ) : (
                        <span className="text-on-surface-variant/60 text-[12px]">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

// ── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-outline-variant bg-surface-container-low mt-10 print:hidden">
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-10 md:py-12 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <div className="space-y-3">
          <Logo variant="horizontal" />
          <p className="text-[12.5px] text-on-surface-variant max-w-sm leading-[20px]">
            Şeffaf bağış takibi · Değiştirilemez kayıt · Denetlenebilir sistem
          </p>
        </div>

        <div className="space-y-2 text-[13px] text-on-surface-variant">
          <p className="flex items-center gap-2">
            <Lock size={14} className="text-secondary" /> Bu kayıtlar
            değiştirilemez ve şeffaftır.
          </p>
          <p className="flex items-center gap-2">
            <FileText size={14} className="text-secondary" /> Kampanya KVK
            Madde 10 kapsamındadır.
          </p>
          <p className="flex items-center gap-2">
            <Users size={14} className="text-secondary" /> Bağışçı isimleri
            gizlilik uyarınca maskelenir.
          </p>
        </div>

        <div className="md:justify-self-end w-full md:w-auto">
          <FollowSocialButtons />
        </div>
      </div>
      <div className="border-t border-outline-variant py-3 text-center">
        <p className="text-[11.5px] text-on-surface-variant/85">
          © {new Date().getFullYear()} KAMPANYATAKİP — Şeffaflık Merkezi
        </p>
      </div>
    </footer>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function parseTs(date: string): number {
  if (!date) return 0;
  const iso = date.includes("T") ? date : date.replace(" ", "T");
  const t = new Date(iso).getTime();
  return Number.isNaN(t) ? 0 : t;
}

function rangeCutoffMs(range: FilterRange): number | null {
  if (range === "all") return null;
  const now = new Date();
  if (range === "today") {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }
  if (range === "week") return now.getTime() - 7 * 24 * 60 * 60 * 1000;
  if (range === "month") return now.getTime() - 30 * 24 * 60 * 60 * 1000;
  return null;
}

function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

function formatShortDate(ts: number): string {
  if (!ts) return "—";
  const d = new Date(ts);
  return `${pad2(d.getDate())}.${pad2(d.getMonth() + 1)}`;
}

function formatTime(ts: number): string {
  if (!ts) return "";
  const d = new Date(ts);
  // Date-only entries (00:00) → boş bırak
  if (d.getHours() === 0 && d.getMinutes() === 0) return "";
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

// Re-exports for tree-shaking sanity (silence unused-import linter)
void formatRelativeTime;
