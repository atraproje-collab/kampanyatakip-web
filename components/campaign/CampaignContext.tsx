"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  DONATION_AMOUNTS_USD,
  DONATION_METHODS,
  DONATION_NAMES,
  type CampaignData,
  type CurrencyCode,
  type RecentDonor,
} from "@/lib/mock-campaign-data";
import { fetchStats, fetchRecentDonors } from "@/lib/api";

const POLL_INTERVAL_MS = 30_000; // 30 saniye

type Toast = {
  id: number;
  name: string;
  amount: number;
  currency: CurrencyCode;
};

type ContextValue = {
  campaign: CampaignData;
  /** Total raised in campaign's primary currency (USD for Defne demo). */
  raisedUsd: number;
  donorCount: number;
  recentDonors: RecentDonor[];
  toasts: Toast[];
  dismissToast: (id: number) => void;
  /** true once at least one successful API response has been received */
  apiConnected: boolean;
};

const CampaignContext = createContext<ContextValue | null>(null);

const randomBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export function CampaignProvider({
  campaign,
  children,
}: {
  campaign: CampaignData;
  children: ReactNode;
}) {
  const [raisedUsd, setRaisedUsd] = useState(campaign.raisedUsd);
  const [donorCount, setDonorCount] = useState(campaign.donorCount);
  const [recentDonors, setRecentDonors] = useState<RecentDonor[]>(
    campaign.recentDonors,
  );
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [apiConnected, setApiConnected] = useState(false);

  // Use large random starting ID for ticker-generated donors to avoid
  // collisions with real database IDs from the API.
  const nextIdRef = useRef(Date.now());

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ── API polling ─────────────────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;

    const syncFromApi = async () => {
      const [statsResult, recentResult] = await Promise.allSettled([
        fetchStats(),
        fetchRecentDonors(),
      ]);

      if (!mounted) return;

      // Stats: only move counters forward (never backwards due to ticker)
      if (statsResult.status === "fulfilled" && statsResult.value) {
        const s = statsResult.value;
        setRaisedUsd((prev) => Math.max(prev, s.raisedUsd));
        setDonorCount((prev) => Math.max(prev, s.donorCount));
        setApiConnected(true);
      }

      // Recent donors: replace list with real API data
      if (
        recentResult.status === "fulfilled" &&
        recentResult.value &&
        recentResult.value.length > 0
      ) {
        setRecentDonors(recentResult.value.slice(0, 40));
        setApiConnected(true);
      }
    };

    // Initial fetch
    syncFromApi();

    // Recurring poll every 30 s
    const interval = setInterval(syncFromApi, POLL_INTERVAL_MS);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // ── Live ticker (mock donations for UX engagement) ───────────────────────────
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const scheduleNext = () => {
      const wait = randomBetween(15_000, 30_000);
      timer = setTimeout(() => {
        const amount = pick(DONATION_AMOUNTS_USD);
        const name = pick(DONATION_NAMES);
        const method = pick(DONATION_METHODS);
        const id = nextIdRef.current++;

        const donor: RecentDonor = {
          id,
          name,
          amount,
          currency: "USD",
          method,
          time: "az önce",
          timestamp: Date.now(),
          isFresh: true,
        };

        setRaisedUsd((r) => r + amount);
        setDonorCount((c) => c + 1);
        setRecentDonors((list) => [donor, ...list].slice(0, 40));
        setToasts((list) => [
          ...list,
          { id, name, amount, currency: "USD" },
        ]);

        // Auto-dismiss toast
        setTimeout(() => {
          setToasts((list) => list.filter((t) => t.id !== id));
        }, 4500);

        // Clear isFresh flag
        setTimeout(() => {
          setRecentDonors((list) =>
            list.map((d) => (d.id === id ? { ...d, isFresh: false } : d)),
          );
        }, 2500);

        scheduleNext();
      }, wait);
    };

    scheduleNext();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <CampaignContext.Provider
      value={{
        campaign,
        raisedUsd,
        donorCount,
        recentDonors,
        toasts,
        dismissToast,
        apiConnected,
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
