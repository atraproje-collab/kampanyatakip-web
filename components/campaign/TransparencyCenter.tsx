"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Info,
  Loader2,
  Search,
  Shield,
  TrendingDown,
  TrendingUp,
  Wallet,
  WifiOff,
} from "lucide-react";
import { useCampaign } from "@/components/campaign/CampaignContext";
import { DocumentsSection } from "@/components/campaign/DocumentsSection";
import { fetchExpenses, type Donation } from "@/lib/api";
import {
  formatTRY,
  formatUSD,
  mockExchangeRate,
  toTRY,
} from "@/lib/exchange-rate";
import type { CurrencyCode, ExpenseRow } from "@/lib/mock-campaign-data";
import { cn } from "@/lib/utils";

const POLL_INTERVAL_MS = 30_000;
const PAGE_SIZE = 10;

const CURRENCY_SYMBOL: Record<CurrencyCode, string> = {
  TRY: "₺",
  USD: "$",
  EUR: "€",
};

type DataStatus = "loading" | "live" | "mock";

type SubTab = "overview" | "bagislar" | "giderler";
type RangeKey = "today" | "week" | "month" | "all";
type SortKey = "newest" | "oldest" | "amount-desc" | "amount-asc";
type SourceFilter = "all" | "havale" | "kumbara" | "stant" | "tiktok";
type CategoryFilter =
  | "all"
  | "saglik"
  | "ulasim"
  | "konaklama"
  | "hukuki"
  | "diger";

// ── URL state helpers ──────────────────────────────────────────────────────

const URL_KEYS = {
  subtab: "subtab",
  range: "filter",
  sort: "sort",
  source: "source",
  cat: "cat",
  q: "q",
  page: "page",
} as const;

function readSearchParams(): URLSearchParams {
  if (typeof window === "undefined") return new URLSearchParams();
  return new URLSearchParams(window.location.search);
}

function writeSearchParams(updates: Record<string, string | null>) {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  for (const [key, value] of Object.entries(updates)) {
    if (value === null || value === "") params.delete(key);
    else params.set(key, value);
  }
  const qs = params.toString();
  const newUrl = `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`;
  window.history.replaceState(null, "", newUrl);
}

function parseSubTab(v: string | null): SubTab {
  if (v === "bagislar" || v === "giderler") return v;
  return "overview";
}
function parseRange(v: string | null): RangeKey {
  if (v === "today" || v === "week" || v === "month" || v === "all") return v;
  return "all";
}
function parseSort(v: string | null): SortKey {
  if (
    v === "newest" ||
    v === "oldest" ||
    v === "amount-desc" ||
    v === "amount-asc"
  )
    return v;
  return "newest";
}
function parseSource(v: string | null): SourceFilter {
  if (v === "havale" || v === "kumbara" || v === "stant" || v === "tiktok") return v;
  return "all";
}
function parseCategory(v: string | null): CategoryFilter {
  if (
    v === "saglik" ||
    v === "ulasim" ||
    v === "konaklama" ||
    v === "hukuki" ||
    v === "diger"
  )
    return v;
  return "all";
}
function parsePage(v: string | null): number {
  const n = Number(v ?? "1");
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1;
}

// ── Date helpers ───────────────────────────────────────────────────────────

function parseTs(date: string): number {
  if (!date) return 0;
  const iso = date.includes("T") ? date : date.replace(" ", "T");
  const t = new Date(iso).getTime();
  return Number.isNaN(t) ? 0 : t;
}

function rangeCutoffMs(range: RangeKey): number | null {
  if (range === "all") return null;
  const now = new Date();
  if (range === "today") {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }
  if (range === "week") {
    const d = new Date(now);
    const dow = d.getDay();
    const offset = (dow + 6) % 7; // pazartesi'ye geri
    d.setDate(d.getDate() - offset);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }
  if (range === "month") {
    return new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  }
  return null;
}

function pad2(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

function formatTrDateTime(input: string): string {
  if (!input) return "—";
  const m = input.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/);
  if (m) {
    const [, y, mo, d, h, mi] = m;
    if (h && mi) return `${d}.${mo}.${y} ${h}:${mi}`;
    return `${d}.${mo}.${y}`;
  }
  const ts = parseTs(input);
  if (!ts) return input;
  const d = new Date(ts);
  return `${pad2(d.getDate())}.${pad2(d.getMonth() + 1)}.${d.getFullYear()}`;
}

// ── Source/category matchers ───────────────────────────────────────────────

function donationSourceMatches(source: string, filter: SourceFilter): boolean {
  if (filter === "all") return true;
  const s = source.toLocaleLowerCase("tr-TR");
  if (filter === "havale") return /havale|eft|fast/.test(s);
  if (filter === "kumbara") return /^kumbara\b/.test(s);
  if (filter === "stant") return /^stant\b/.test(s);
  if (filter === "tiktok") return /tiktok|tik\s*tok/.test(s);
  return true;
}

function donationsHaveTikTok(donations: Donation[]): boolean {
  return donations.some((d) => /tiktok|tik\s*tok/i.test(d.source));
}

function expenseCategoryMatches(category: string, filter: CategoryFilter): boolean {
  if (filter === "all") return true;
  const c = category.toLocaleLowerCase("tr-TR");
  if (filter === "saglik") return /sağl|sagl/.test(c);
  if (filter === "ulasim") return /ulaş|ulas/.test(c);
  if (filter === "konaklama") return /konak/.test(c);
  if (filter === "hukuki") return /hukuk/.test(c);
  if (filter === "diger") {
    return !/sağl|sagl|ulaş|ulas|konak|hukuk/.test(c);
  }
  return true;
}

// ── Currency badge ─────────────────────────────────────────────────────────

function formatNative(amount: number, currency: CurrencyCode): string {
  const symbol = CURRENCY_SYMBOL[currency];
  if (currency === "USD") return `${symbol}${formatUSD(amount)}`;
  return `${symbol}${formatTRY(amount)}`;
}

// ── Main component ─────────────────────────────────────────────────────────

export function TransparencyCenter() {
  const { donations, raisedUsd, raisedTry, statsReady } = useCampaign();
  const rate = mockExchangeRate;

  const [expenses, setExpenses] = useState<ExpenseRow[]>([]);
  const [status, setStatus] = useState<DataStatus>("loading");

  // URL'den initialize
  const [subTab, setSubTabState] = useState<SubTab>("overview");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const params = readSearchParams();
    setSubTabState(parseSubTab(params.get(URL_KEYS.subtab)));
    setHydrated(true);
  }, []);

  const setSubTab = useCallback((next: SubTab) => {
    setSubTabState(next);
    // alt-tab değişiminde tüm filtreler "Genel Bakış" için temizlenir
    writeSearchParams({
      [URL_KEYS.subtab]: next === "overview" ? null : next,
      ...(next === "overview"
        ? {
            [URL_KEYS.range]: null,
            [URL_KEYS.sort]: null,
            [URL_KEYS.source]: null,
            [URL_KEYS.cat]: null,
            [URL_KEYS.q]: null,
            [URL_KEYS.page]: null,
          }
        : {}),
    });
  }, []);

  // ── Expenses polling ─────────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;
    const sync = async () => {
      const result = await fetchExpenses();
      if (!mounted) return;
      if (result) {
        setExpenses(result);
        setStatus("live");
      } else {
        setStatus("mock");
      }
    };
    sync();
    const interval = setInterval(sync, POLL_INTERVAL_MS);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // ── Stats ────────────────────────────────────────────────────────────────
  const totalExpensesTry = expenses.reduce((s, e) => s + e.amount, 0);
  const totalExpensesUsd = totalExpensesTry / rate.usd_try;
  const netRemainingUsd = raisedUsd - totalExpensesUsd;
  const netRemainingTry = raisedTry - totalExpensesTry;
  const expenseRatio = raisedUsd > 0 ? (totalExpensesUsd / raisedUsd) * 100 : 0;

  const stats = [
    {
      label: "Toplam Gelir",
      value: `₺${formatTRY(raisedTry)}`,
      sub: `≈ $${formatUSD(Math.round(raisedUsd))}`,
      icon: TrendingUp,
      tone: "secondary" as const,
    },
    {
      label: "Toplam Gider",
      value: `₺${formatTRY(totalExpensesTry)}`,
      sub: `≈ $${formatUSD(Math.round(totalExpensesUsd))}`,
      icon: TrendingDown,
      tone: "neutral" as const,
    },
    {
      label: "Net Kalan",
      value: `₺${formatTRY(netRemainingTry)}`,
      sub: `≈ $${formatUSD(Math.round(netRemainingUsd))}`,
      icon: Wallet,
      tone: "primary" as const,
    },
    {
      label: "Gider Oranı",
      value: `%${expenseRatio.toFixed(2)}`,
      sub: "Düşük oran = yüksek tasarruf",
      icon: Shield,
      tone: "secondary" as const,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Sub-tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div
          role="tablist"
          aria-label="Şeffaflık alt sekmeleri"
          className="inline-flex p-1 rounded-xl bg-surface-container-low border border-outline-variant"
        >
          {(
            [
              ["overview", "Genel Bakış"],
              ["bagislar", "Bağışlar"],
              ["giderler", "Giderler"],
            ] as [SubTab, string][]
          ).map(([t, label]) => (
            <button
              key={t}
              role="tab"
              aria-selected={subTab === t}
              onClick={() => setSubTab(t)}
              className={cn(
                "px-3.5 md:px-4 py-2 rounded-lg text-[12.5px] md:text-[13px] font-semibold transition-all whitespace-nowrap",
                subTab === t
                  ? "bg-white text-primary-container shadow-[0_1px_2px_rgba(0,24,53,0.06)]"
                  : "text-on-surface-variant hover:text-primary-container",
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <StatusBadge status={status} />
      </div>

      {!hydrated ? (
        <SectionPlaceholder />
      ) : subTab === "overview" ? (
        <OverviewSection stats={stats} />
      ) : subTab === "bagislar" ? (
        <DonationsSection donations={donations} loading={!statsReady} />
      ) : (
        <ExpensesSection expenses={expenses} loading={status === "loading"} />
      )}
    </div>
  );
}

// ── Status badge ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: DataStatus }) {
  if (status === "loading") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
        <Loader2 size={10} className="animate-spin" />
        Veri yükleniyor…
      </span>
    );
  }
  if (status === "live") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400/60" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        Canlı Veri
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
      <WifiOff size={10} />
      Demo Veri
    </span>
  );
}

function SectionPlaceholder() {
  return (
    <div className="rounded-2xl border border-outline-variant bg-white p-8 text-center text-[13px] text-on-surface-variant">
      <Loader2 size={18} className="animate-spin inline-block mr-2 align-middle" />
      Hazırlanıyor…
    </div>
  );
}

// ── Overview ───────────────────────────────────────────────────────────────

function OverviewSection({
  stats,
}: {
  stats: {
    label: string;
    value: string;
    sub: string;
    icon: typeof TrendingUp;
    tone: "secondary" | "neutral" | "primary";
  }[];
}) {
  return (
    <div className="space-y-8">
      {/* Resmi belgeler & valilik onay */}
      <DocumentsSection />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map(({ label, value, sub, icon: Icon, tone }) => {
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
                {value}
              </p>
              <p className="mt-1 text-[11px] text-on-surface-variant/85 tabular-nums">
                {sub}
              </p>
            </div>
          );
        })}
      </div>

      {/* Info / nav hint */}
      <div className="rounded-2xl border border-secondary/30 bg-secondary/[0.06] p-5 md:p-6 flex items-start gap-4">
        <div className="w-11 h-11 rounded-lg bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
          <Info size={20} />
        </div>
        <div className="text-[13.5px] leading-[22px] text-on-surface">
          <strong className="text-primary-container">
            Tüm kayıtlar KAMPANYATAKİP değişmez veritabanında tutulur.
          </strong>{" "}
          Silinme veya değiştirme yapılamaz; düzeltme yeni bir kayıt olarak
          eklenir.
          <p className="mt-2 text-[12.5px] text-on-surface-variant">
            📊 Detaylı bağış ve gider listeleri için <strong>Bağışlar</strong>{" "}
            ve <strong>Giderler</strong> sekmelerine geçin.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Donations section ──────────────────────────────────────────────────────

function DonationsSection({
  donations,
  loading,
}: {
  donations: Donation[];
  loading: boolean;
}) {
  // Initial state from URL
  const [range, setRange] = useState<RangeKey>("all");
  const [sortKey, setSortKey] = useState<SortKey>("newest");
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const p = readSearchParams();
    setRange(parseRange(p.get(URL_KEYS.range)));
    setSortKey(parseSort(p.get(URL_KEYS.sort)));
    setSourceFilter(parseSource(p.get(URL_KEYS.source)));
    setQuery(p.get(URL_KEYS.q) ?? "");
    setPage(parsePage(p.get(URL_KEYS.page)));
  }, []);

  const updateUrl = useCallback(
    (changes: Record<string, string | null>) => {
      writeSearchParams(changes);
    },
    [],
  );

  const showTikTokChip = useMemo(
    () => donationsHaveTikTok(donations),
    [donations],
  );

  // Filter + sort
  const filtered = useMemo(() => {
    const cutoff = rangeCutoffMs(range);
    const q = query.trim().toLocaleLowerCase("tr-TR");
    const list = donations.filter((d) => {
      if (cutoff !== null && parseTs(d.date) < cutoff) return false;
      if (!donationSourceMatches(d.source, sourceFilter)) return false;
      if (q) {
        const inName = d.donorName.toLocaleLowerCase("tr-TR").includes(q);
        const inSource = d.source.toLocaleLowerCase("tr-TR").includes(q);
        if (!inName && !inSource) return false;
      }
      return true;
    });
    const sorted = [...list];
    if (sortKey === "newest") {
      sorted.sort((a, b) => parseTs(b.date) - parseTs(a.date));
    } else if (sortKey === "oldest") {
      sorted.sort((a, b) => parseTs(a.date) - parseTs(b.date));
    } else if (sortKey === "amount-desc") {
      sorted.sort(
        (a, b) =>
          toTRY(b.amount, b.currency, mockExchangeRate) -
          toTRY(a.amount, a.currency, mockExchangeRate),
      );
    } else {
      sorted.sort(
        (a, b) =>
          toTRY(a.amount, a.currency, mockExchangeRate) -
          toTRY(b.amount, b.currency, mockExchangeRate),
      );
    }
    return sorted;
  }, [donations, range, sourceFilter, query, sortKey]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  // Filtre değişince page'i 1'e
  const handleRange = (next: RangeKey) => {
    setRange(next);
    setPage(1);
    updateUrl({
      [URL_KEYS.range]: next === "all" ? null : next,
      [URL_KEYS.page]: null,
    });
  };
  const handleSource = (next: SourceFilter) => {
    setSourceFilter(next);
    setPage(1);
    updateUrl({
      [URL_KEYS.source]: next === "all" ? null : next,
      [URL_KEYS.page]: null,
    });
  };
  const handleSort = (next: SortKey) => {
    setSortKey(next);
    setPage(1);
    updateUrl({
      [URL_KEYS.sort]: next === "newest" ? null : next,
      [URL_KEYS.page]: null,
    });
  };
  const handleQuery = (next: string) => {
    setQuery(next);
    setPage(1);
    updateUrl({
      [URL_KEYS.q]: next.trim() ? next.trim() : null,
      [URL_KEYS.page]: null,
    });
  };
  const handlePage = (next: number) => {
    setPage(next);
    updateUrl({ [URL_KEYS.page]: next === 1 ? null : String(next) });
  };

  return (
    <section className="space-y-4" aria-labelledby="bagislar-heading">
      <header className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h2
            id="bagislar-heading"
            className="text-[18px] md:text-[22px] font-semibold text-primary-container tracking-[-0.01em] flex items-center gap-2"
          >
            <ArrowUpCircle size={18} className="text-secondary" />
            Bağışlar
          </h2>
          <p className="mt-1 text-[12.5px] text-on-surface-variant">
            Toplam {filtered.length.toLocaleString("tr-TR")} bağış · Sayfa{" "}
            {currentPage}/{totalPages}
          </p>
        </div>
      </header>

      {/* Filters */}
      <Toolbar>
        <RangeChips value={range} onChange={handleRange} />
        <SourceChips
          value={sourceFilter}
          onChange={handleSource}
          showTikTok={showTikTokChip}
        />
        <div className="flex items-center gap-2 flex-wrap">
          <SortSelect
            value={sortKey}
            onChange={handleSort}
            kind="donation"
          />
          <SearchBox
            value={query}
            onChange={handleQuery}
            placeholder="bağışçı veya kaynak"
          />
        </div>
      </Toolbar>

      {/* Body */}
      {loading ? (
        <DonationsSkeleton />
      ) : filtered.length === 0 ? (
        <EmptyState message="Bu filtrelere uyan bağış bulunamadı." />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block rounded-2xl border border-outline-variant bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-[13.5px]">
                <thead className="bg-surface-container-low text-[11px] font-bold uppercase tracking-[0.12em] text-on-surface-variant">
                  <tr>
                    <th className="px-5 py-3 text-left">Tarih</th>
                    <th className="px-5 py-3 text-left">Bağışçı</th>
                    <th className="px-5 py-3 text-right">Tutar</th>
                    <th className="px-5 py-3 text-left">Kaynak</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {pageItems.map((d) => (
                    <tr
                      key={d.id}
                      className="hover:bg-surface-container-low/50 transition-colors"
                    >
                      <td className="px-5 py-3.5 text-on-surface-variant whitespace-nowrap tabular-nums">
                        {formatTrDateTime(d.date)}
                      </td>
                      <td className="px-5 py-3.5 text-primary-container font-medium">
                        {d.donorName}
                      </td>
                      <td className="px-5 py-3.5 text-right text-secondary font-bold tabular-nums whitespace-nowrap">
                        +{formatNative(d.amount, d.currency)}
                      </td>
                      <td className="px-5 py-3.5">
                        <SourceBadge source={d.source} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <ul className="md:hidden space-y-2">
            {pageItems.map((d) => (
              <li
                key={d.id}
                className="rounded-xl border border-outline-variant bg-white p-3.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-on-surface-variant tabular-nums">
                      {formatTrDateTime(d.date)}
                    </p>
                    <p className="mt-0.5 text-[13.5px] font-semibold text-primary-container truncate">
                      {d.donorName}
                    </p>
                  </div>
                  <p className="text-[15px] font-bold text-secondary tabular-nums whitespace-nowrap shrink-0">
                    +{formatNative(d.amount, d.currency)}
                  </p>
                </div>
                <div className="mt-2">
                  <SourceBadge source={d.source} />
                </div>
              </li>
            ))}
          </ul>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onChange={handlePage}
          />
        </>
      )}
    </section>
  );
}

// ── Expenses section ───────────────────────────────────────────────────────

function ExpensesSection({
  expenses,
  loading,
}: {
  expenses: ExpenseRow[];
  loading: boolean;
}) {
  const [range, setRange] = useState<RangeKey>("all");
  const [sortKey, setSortKey] = useState<SortKey>("newest");
  const [catFilter, setCatFilter] = useState<CategoryFilter>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const p = readSearchParams();
    setRange(parseRange(p.get(URL_KEYS.range)));
    setSortKey(parseSort(p.get(URL_KEYS.sort)));
    setCatFilter(parseCategory(p.get(URL_KEYS.cat)));
    setQuery(p.get(URL_KEYS.q) ?? "");
    setPage(parsePage(p.get(URL_KEYS.page)));
  }, []);

  const updateUrl = useCallback((changes: Record<string, string | null>) => {
    writeSearchParams(changes);
  }, []);

  const filtered = useMemo(() => {
    const cutoff = rangeCutoffMs(range);
    const q = query.trim().toLocaleLowerCase("tr-TR");
    const list = expenses.filter((e) => {
      if (cutoff !== null && parseTs(e.date) < cutoff) return false;
      if (!expenseCategoryMatches(e.category, catFilter)) return false;
      if (q) {
        const inVendor = (e.vendor ?? "").toLocaleLowerCase("tr-TR").includes(q);
        const inDesc = (e.description ?? "").toLocaleLowerCase("tr-TR").includes(q);
        const inCat = e.category.toLocaleLowerCase("tr-TR").includes(q);
        if (!inVendor && !inDesc && !inCat) return false;
      }
      return true;
    });
    const sorted = [...list];
    if (sortKey === "newest") {
      sorted.sort((a, b) => parseTs(b.date) - parseTs(a.date));
    } else if (sortKey === "oldest") {
      sorted.sort((a, b) => parseTs(a.date) - parseTs(b.date));
    } else if (sortKey === "amount-desc") {
      sorted.sort((a, b) => b.amount - a.amount);
    } else {
      sorted.sort((a, b) => a.amount - b.amount);
    }
    return sorted;
  }, [expenses, range, catFilter, query, sortKey]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const handleRange = (next: RangeKey) => {
    setRange(next);
    setPage(1);
    updateUrl({
      [URL_KEYS.range]: next === "all" ? null : next,
      [URL_KEYS.page]: null,
    });
  };
  const handleCat = (next: CategoryFilter) => {
    setCatFilter(next);
    setPage(1);
    updateUrl({
      [URL_KEYS.cat]: next === "all" ? null : next,
      [URL_KEYS.page]: null,
    });
  };
  const handleSort = (next: SortKey) => {
    setSortKey(next);
    setPage(1);
    updateUrl({
      [URL_KEYS.sort]: next === "newest" ? null : next,
      [URL_KEYS.page]: null,
    });
  };
  const handleQuery = (next: string) => {
    setQuery(next);
    setPage(1);
    updateUrl({
      [URL_KEYS.q]: next.trim() ? next.trim() : null,
      [URL_KEYS.page]: null,
    });
  };
  const handlePage = (next: number) => {
    setPage(next);
    updateUrl({ [URL_KEYS.page]: next === 1 ? null : String(next) });
  };

  return (
    <section className="space-y-4" aria-labelledby="giderler-heading">
      <header className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h2
            id="giderler-heading"
            className="text-[18px] md:text-[22px] font-semibold text-primary-container tracking-[-0.01em] flex items-center gap-2"
          >
            <ArrowDownCircle size={18} className="text-error" />
            Giderler
          </h2>
          <p className="mt-1 text-[12.5px] text-on-surface-variant">
            Toplam {filtered.length.toLocaleString("tr-TR")} gider · Sayfa{" "}
            {currentPage}/{totalPages}
          </p>
        </div>
      </header>

      <Toolbar>
        <RangeChips value={range} onChange={handleRange} />
        <CategoryChips value={catFilter} onChange={handleCat} />
        <div className="flex items-center gap-2 flex-wrap">
          <SortSelect value={sortKey} onChange={handleSort} kind="expense" />
          <SearchBox
            value={query}
            onChange={handleQuery}
            placeholder="satıcı, kategori veya açıklama"
          />
        </div>
      </Toolbar>

      {loading ? (
        <DonationsSkeleton />
      ) : filtered.length === 0 ? (
        <EmptyState message="Bu filtrelere uyan gider bulunamadı." />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block rounded-2xl border border-outline-variant bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-[13.5px]">
                <thead className="bg-surface-container-low text-[11px] font-bold uppercase tracking-[0.12em] text-on-surface-variant">
                  <tr>
                    <th className="px-5 py-3 text-left">Tarih</th>
                    <th className="px-5 py-3 text-left">Satıcı</th>
                    <th className="px-5 py-3 text-left">Kategori</th>
                    <th className="px-5 py-3 text-right">Tutar</th>
                    <th className="px-5 py-3 text-center">Belge</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {pageItems.map((e, i) => (
                    <tr
                      key={`${e.date}-${i}`}
                      className="hover:bg-surface-container-low/50 transition-colors"
                    >
                      <td className="px-5 py-3.5 text-on-surface-variant whitespace-nowrap tabular-nums">
                        {formatTrDateTime(e.date)}
                      </td>
                      <td className="px-5 py-3.5 text-primary-container font-medium">
                        {e.vendor || "—"}
                      </td>
                      <td className="px-5 py-3.5">
                        <CategoryBadge category={e.category} />
                      </td>
                      <td className="px-5 py-3.5 text-right text-error font-bold tabular-nums whitespace-nowrap">
                        −₺{formatTRY(e.amount)}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <DocumentLink doc={e.document} category={e.category} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <ul className="md:hidden space-y-2">
            {pageItems.map((e, i) => (
              <li
                key={`${e.date}-${i}`}
                className="rounded-xl border border-outline-variant bg-white p-3.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-on-surface-variant tabular-nums">
                      {formatTrDateTime(e.date)}
                    </p>
                    <p className="mt-0.5 text-[13.5px] font-semibold text-primary-container truncate">
                      {e.vendor || "—"}
                    </p>
                  </div>
                  <p className="text-[15px] font-bold text-error tabular-nums whitespace-nowrap shrink-0">
                    −₺{formatTRY(e.amount)}
                  </p>
                </div>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <CategoryBadge category={e.category} />
                  <DocumentLink doc={e.document} category={e.category} />
                </div>
                {e.description && (
                  <p className="mt-1.5 text-[12px] text-on-surface-variant/85">
                    {e.description}
                  </p>
                )}
              </li>
            ))}
          </ul>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onChange={handlePage}
          />
        </>
      )}
    </section>
  );
}

// ── UI sub-components ──────────────────────────────────────────────────────

function Toolbar({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-outline-variant bg-white p-3 md:p-4 space-y-3">
      {children}
    </div>
  );
}

function RangeChips({
  value,
  onChange,
}: {
  value: RangeKey;
  onChange: (k: RangeKey) => void;
}) {
  const items: [RangeKey, string][] = [
    ["today", "Bugün"],
    ["week", "Bu Hafta"],
    ["month", "Bu Ay"],
    ["all", "Tümü"],
  ];
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map(([k, label]) => (
        <button
          key={k}
          type="button"
          onClick={() => onChange(k)}
          className={cn(
            "px-3 py-1.5 rounded-full text-[11.5px] font-semibold transition border",
            value === k
              ? "bg-primary-container text-white border-primary-container"
              : "bg-white text-on-surface-variant border-outline-variant hover:border-primary-container hover:text-primary-container",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function SourceChips({
  value,
  onChange,
  showTikTok,
}: {
  value: SourceFilter;
  onChange: (s: SourceFilter) => void;
  showTikTok: boolean;
}) {
  const items: [SourceFilter, string][] = [
    ["all", "Tümü"],
    ["havale", "EFT/Havale/FAST"],
    ["kumbara", "Kumbara"],
    ["stant", "Stant"],
    ...(showTikTok ? ([["tiktok", "TikTok"]] as [SourceFilter, string][]) : []),
  ];
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map(([k, label]) => (
        <button
          key={k}
          type="button"
          onClick={() => onChange(k)}
          className={cn(
            "px-3 py-1.5 rounded-full text-[11.5px] font-semibold transition border",
            value === k
              ? "bg-secondary text-on-secondary border-secondary"
              : "bg-white text-on-surface-variant border-outline-variant hover:border-secondary hover:text-secondary",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function CategoryChips({
  value,
  onChange,
}: {
  value: CategoryFilter;
  onChange: (c: CategoryFilter) => void;
}) {
  const items: [CategoryFilter, string][] = [
    ["all", "Tümü"],
    ["saglik", "Sağlık"],
    ["ulasim", "Ulaşım"],
    ["konaklama", "Konaklama"],
    ["hukuki", "Hukuki"],
    ["diger", "Diğer"],
  ];
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map(([k, label]) => (
        <button
          key={k}
          type="button"
          onClick={() => onChange(k)}
          className={cn(
            "px-3 py-1.5 rounded-full text-[11.5px] font-semibold transition border",
            value === k
              ? "bg-secondary text-on-secondary border-secondary"
              : "bg-white text-on-surface-variant border-outline-variant hover:border-secondary hover:text-secondary",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function SortSelect({
  value,
  onChange,
  kind,
}: {
  value: SortKey;
  onChange: (s: SortKey) => void;
  kind: "donation" | "expense";
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as SortKey)}
      className="rounded-lg border border-outline-variant bg-white px-3 py-1.5 text-[12.5px] font-semibold text-primary-container focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary"
      aria-label="Sıralama"
    >
      <option value="newest">En Yeni → Eski</option>
      <option value="oldest">En Eski → Yeni</option>
      <option value="amount-desc">
        {kind === "donation" ? "Tutar Yüksek → Düşük" : "Tutar Yüksek → Düşük"}
      </option>
      <option value="amount-asc">
        {kind === "donation" ? "Tutar Düşük → Yüksek" : "Tutar Düşük → Yüksek"}
      </option>
    </select>
  );
}

function SearchBox({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative flex-1 min-w-[180px]">
      <Search
        size={14}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-outline-variant bg-white text-[12.5px] text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary"
      />
    </div>
  );
}

function SourceBadge({ source }: { source: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-surface-container-high text-on-surface-variant px-2 py-0.5 text-[10.5px] font-semibold tracking-wide whitespace-nowrap">
      {source}
    </span>
  );
}

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 text-[10.5px] font-bold tracking-wider whitespace-nowrap">
      {category || "Diğer"}
    </span>
  );
}

function DocumentLink({
  doc,
  category,
}: {
  doc?: string;
  category: string;
}) {
  if (!doc || doc === "#" || doc === "—") {
    return <span className="text-on-surface-variant/60 text-[11.5px]">—</span>;
  }
  if (/^https?:\/\//i.test(doc)) {
    return (
      <a
        href={doc}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-secondary font-semibold hover:underline text-[12px]"
      >
        📎 Belge
        <ExternalLink size={11} />
      </a>
    );
  }
  return (
    <button
      type="button"
      onClick={() =>
        typeof window !== "undefined" &&
        window.alert(`Demo belgesi: ${category}. Gerçek ortamda PDF/JPG önizleme açılır.`)
      }
      className="inline-flex items-center gap-1 text-secondary font-semibold hover:underline text-[12px]"
    >
      📎 Belge
    </button>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-outline-variant bg-white p-8 text-center text-[13px] text-on-surface-variant">
      {message}
    </div>
  );
}

function DonationsSkeleton() {
  return (
    <div className="rounded-2xl border border-outline-variant bg-white overflow-hidden">
      <ul className="divide-y divide-outline-variant">
        {Array.from({ length: 6 }).map((_, i) => (
          <li
            key={i}
            className="px-4 md:px-5 py-3.5 flex items-center gap-3 animate-pulse"
          >
            <div className="h-3 w-24 rounded bg-surface-container shrink-0" />
            <div className="h-3.5 flex-1 rounded bg-surface-container" />
            <div className="h-3.5 w-20 rounded bg-surface-container shrink-0" />
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Pagination ─────────────────────────────────────────────────────────────

function Pagination({
  currentPage,
  totalPages,
  onChange,
}: {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const numbers = compactPageNumbers(currentPage, totalPages);

  return (
    <nav
      className="flex items-center justify-between gap-3 flex-wrap"
      aria-label="Sayfalama"
    >
      <p className="text-[12px] text-on-surface-variant">
        Sayfa <span className="font-semibold text-primary-container">{currentPage}</span> /{" "}
        {totalPages}
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className="inline-flex items-center gap-1 rounded-lg border border-outline-variant bg-white px-2.5 py-1.5 text-[12.5px] font-semibold text-primary-container hover:border-secondary disabled:opacity-40 disabled:cursor-not-allowed transition"
          aria-label="Önceki sayfa"
        >
          <ChevronLeft size={14} />
          <span className="hidden sm:inline">Önceki</span>
        </button>
        <div className="hidden sm:flex items-center gap-1">
          {numbers.map((n, i) =>
            n === "…" ? (
              <span
                key={`gap-${i}`}
                className="px-2 text-[12.5px] text-on-surface-variant select-none"
                aria-hidden
              >
                …
              </span>
            ) : (
              <button
                key={n}
                type="button"
                onClick={() => onChange(n)}
                aria-current={n === currentPage ? "page" : undefined}
                className={cn(
                  "min-w-[32px] h-8 rounded-lg text-[12.5px] font-semibold transition border",
                  n === currentPage
                    ? "bg-primary-container text-white border-primary-container"
                    : "bg-white text-primary-container border-outline-variant hover:border-secondary",
                )}
              >
                {n}
              </button>
            ),
          )}
        </div>
        <button
          type="button"
          onClick={() => onChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          className="inline-flex items-center gap-1 rounded-lg border border-outline-variant bg-white px-2.5 py-1.5 text-[12.5px] font-semibold text-primary-container hover:border-secondary disabled:opacity-40 disabled:cursor-not-allowed transition"
          aria-label="Sonraki sayfa"
        >
          <span className="hidden sm:inline">Sonraki</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </nav>
  );
}

/** [1, 2, "…", 11, 12] gibi bir kısaltılmış sayfa listesi üretir. */
function compactPageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const out: (number | "…")[] = [1];
  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);
  if (left > 2) out.push("…");
  for (let i = left; i <= right; i++) out.push(i);
  if (right < total - 1) out.push("…");
  out.push(total);
  return out;
}

