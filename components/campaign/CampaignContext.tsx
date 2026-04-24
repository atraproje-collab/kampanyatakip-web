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
  const nextIdRef = useRef(campaign.recentDonors.length + 1);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const scheduleNext = () => {
      const wait = randomBetween(15000, 30000);
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

        // Remove toast after a while
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
