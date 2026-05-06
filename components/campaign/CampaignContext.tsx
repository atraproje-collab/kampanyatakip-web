"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  type CampaignData,
  type CurrencyCode,
  type RecentDonor,
} from "@/lib/mock-campaign-data";
import {
  fetchDonations,
  fetchKumbaralar,
  fetchStantlar,
  donationToRecentDonor,
  type Donation,
  type KumbaraRow,
  type StantRow,
} from "@/lib/api";
import { mockExchangeRate, toTRY, toUSD } from "@/lib/exchange-rate";
import {
  applyCampaignSettings,
  loadCampaignSettings,
  CAMPAIGN_SETTINGS_EVENT,
  type CampaignSettings,
} from "@/lib/campaign-settings";

const POLL_INTERVAL_MS = 30_000; // 30 saniye

type Toast = {
  id: number;
  name: string;
  amount: number;
  currency: CurrencyCode;
};

type ContextValue = {
  campaign: CampaignData;
  /** Total raised converted to USD using current FX rate. */
  raisedUsd: number;
  /** Total raised converted to TRY using current FX rate. */
  raisedTry: number;
  /** Number of donation records. */
  donorCount: number;
  /** Donations sorted newest first; full list. */
  donations: Donation[];
  /** Top 10 recent donors (legacy shape for existing components). */
  recentDonors: RecentDonor[];
  kumbaralar: KumbaraRow[];
  stantlar: StantRow[];
  toasts: Toast[];
  dismissToast: (id: number) => void;
  /** true once at least one successful API response has been received */
  apiConnected: boolean;
  /** true after the first sync completes (success OR failure) — safe to render numbers */
  statsReady: boolean;
  /** Last fetch error message (null when healthy) */
  apiError: string | null;
};

const CampaignContext = createContext<ContextValue | null>(null);

export function CampaignProvider({
  campaign: campaignProp,
  children,
}: {
  campaign: CampaignData;
  children: ReactNode;
}) {
  // Server render starts with the static prop; on the client we merge any
  // saved admin settings (localStorage) so /kampanya/demo and admin panel
  // stay in sync within the same browser.
  const [campaign, setCampaign] = useState<CampaignData>(campaignProp);

  useEffect(() => {
    setCampaign(applyCampaignSettings(campaignProp, loadCampaignSettings()));
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<CampaignSettings>).detail;
      if (detail) {
        setCampaign(applyCampaignSettings(campaignProp, detail));
      }
    };
    const onStorage = () => {
      setCampaign(applyCampaignSettings(campaignProp, loadCampaignSettings()));
    };
    window.addEventListener(CAMPAIGN_SETTINGS_EVENT, onChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(CAMPAIGN_SETTINGS_EVENT, onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, [campaignProp]);

  const [donations, setDonations] = useState<Donation[]>([]);
  const [kumbaralar, setKumbaralar] = useState<KumbaraRow[]>([]);
  const [stantlar, setStantlar] = useState<StantRow[]>([]);
  const [apiConnected, setApiConnected] = useState(false);
  const [statsReady, setStatsReady] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Toasts kept in state for forward compat. With pure-API mode, we no longer
  // generate fake ticker toasts; future enhancement may diff polling results
  // and surface genuinely new donations.
  const [toasts] = useState<Toast[]>([]);
  const dismissToast = (_id: number) => {};

  // ── Polling ───────────────────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;

    const sync = async () => {
      const [donationsRes, kumbaralarRes, stantlarRes] = await Promise.allSettled([
        fetchDonations(),
        fetchKumbaralar(),
        fetchStantlar(),
      ]);
      if (!mounted) return;

      let gotAny = false;
      const failures: string[] = [];

      if (donationsRes.status === "fulfilled" && donationsRes.value) {
        const sorted = [...donationsRes.value].sort((a, b) =>
          a.date < b.date ? 1 : -1,
        );
        setDonations(sorted);
        gotAny = true;
        // eslint-disable-next-line no-console
        console.log("[CampaignContext] /bagislar →", {
          count: sorted.length,
          sample: sorted.slice(0, 3),
        });
      } else {
        failures.push("bağışlar");
        // eslint-disable-next-line no-console
        console.warn("[CampaignContext] /bagislar başarısız", donationsRes);
      }

      if (kumbaralarRes.status === "fulfilled" && kumbaralarRes.value) {
        setKumbaralar(kumbaralarRes.value);
        gotAny = true;
      } else {
        failures.push("kumbaralar");
      }

      if (stantlarRes.status === "fulfilled" && stantlarRes.value) {
        setStantlar(stantlarRes.value);
        gotAny = true;
      } else {
        failures.push("stantlar");
      }

      setApiConnected(gotAny);
      setApiError(
        failures.length === 0 ? null : `Veri yüklenemedi: ${failures.join(", ")}`,
      );
      setStatsReady(true);
    };

    sync();
    const interval = setInterval(sync, POLL_INTERVAL_MS);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // ── Derived ───────────────────────────────────────────────────────────────
  const rate = mockExchangeRate;
  const raisedTry = donations.reduce(
    (sum, d) => sum + toTRY(d.amount, d.currency, rate),
    0,
  );
  const raisedUsd = toUSD(raisedTry, "TRY", rate);
  const donorCount = donations.length;
  const recentDonors: RecentDonor[] = donations
    .slice(0, 40)
    .map((d, i) => donationToRecentDonor(d, i));

  return (
    <CampaignContext.Provider
      value={{
        campaign,
        raisedUsd,
        raisedTry,
        donorCount,
        donations,
        recentDonors,
        kumbaralar,
        stantlar,
        toasts,
        dismissToast,
        apiConnected,
        statsReady,
        apiError,
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
}

export function useCampaign(): ContextValue {
  const ctx = useContext(CampaignContext);
  if (!ctx)
    throw new Error("useCampaign must be used within CampaignProvider");
  return ctx;
}
