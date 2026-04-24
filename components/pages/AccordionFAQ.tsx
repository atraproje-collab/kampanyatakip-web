"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  faqCategories,
  faqItems,
  type FaqCategoryId,
} from "@/lib/faq-data";

type TabId = "all" | FaqCategoryId;

const TABS: Array<{ id: TabId; label: string }> = [
  { id: "all", label: "Tümü" },
  ...faqCategories.map((c) => ({ id: c.id as TabId, label: c.label })),
];

export function AccordionFAQ() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabId>("all");
  const [openIndexes, setOpenIndexes] = useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    setOpenIndexes((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const handleTabChange = (id: TabId) => {
    setActiveTab(id);
    setOpenIndexes(new Set());
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr");
    return faqItems.filter((item) => {
      if (activeTab !== "all" && item.category !== activeTab) return false;
      if (!q) return true;
      return (
        item.question.toLocaleLowerCase("tr").includes(q) ||
        item.answer.toLocaleLowerCase("tr").includes(q)
      );
    });
  }, [query, activeTab]);

  return (
    <div className="flex flex-col gap-8">
      {/* Search */}
      <div className="relative">
        <Search
          size={18}
          className="absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant/70"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Sorunuzu yazın..."
          aria-label="Sıkça sorulan sorularda ara"
          className="w-full rounded-xl border border-outline-variant bg-white pl-12 pr-5 py-4 text-[15px] text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all"
        />
      </div>

      {/* Category tabs */}
      <div
        role="tablist"
        aria-label="Kategoriler"
        className="-mx-6 md:mx-0 px-6 md:px-0 flex gap-2 overflow-x-auto pb-2 scrollbar-none"
        style={{ scrollbarWidth: "none" }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                "shrink-0 px-4 py-2 rounded-full text-[14px] font-semibold transition-all border",
                isActive
                  ? "bg-secondary text-on-secondary border-secondary shadow-[0_4px_6px_rgba(0,103,127,0.20)]"
                  : "bg-white text-on-surface-variant border-outline-variant hover:text-primary-container hover:border-primary-container",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* List */}
      <div className="rounded-2xl border border-outline-variant bg-white overflow-hidden divide-y divide-outline-variant">
        {filtered.length === 0 ? (
          <div className="p-10 text-center text-on-surface-variant">
            <p className="text-[15px]">
              Aradığınız soruyu bulamadık. Başka bir terim deneyin ya da bize
              ulaşın.
            </p>
          </div>
        ) : (
          filtered.map((item, i) => {
            const open = openIndexes.has(i);
            return (
              <div key={`${item.category}-${i}`} className="transition-colors">
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  aria-expanded={open}
                  className={cn(
                    "w-full flex items-start justify-between gap-4 px-5 md:px-7 py-5 text-left transition-colors",
                    open
                      ? "bg-surface-container-low"
                      : "hover:bg-surface-container-low/60",
                  )}
                >
                  <span className="text-[15px] md:text-[16px] font-semibold text-primary-container leading-[26px]">
                    {item.question}
                  </span>
                  <span
                    className={cn(
                      "shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-250",
                      open
                        ? "bg-secondary text-on-secondary rotate-45"
                        : "bg-surface-container text-primary-container",
                    )}
                    aria-hidden
                  >
                    <Plus size={16} strokeWidth={2.5} />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 md:px-7 pb-6 pr-14 md:pr-16 text-[14px] md:text-[15px] leading-[24px] text-on-surface-variant">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>

      {filtered.length > 0 && (
        <p className="text-[12px] text-on-surface-variant/80 text-center">
          {filtered.length} soru gösteriliyor
        </p>
      )}
    </div>
  );
}
