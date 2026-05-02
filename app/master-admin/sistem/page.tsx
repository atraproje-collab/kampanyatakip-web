"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Database,
  HardDrive,
  MessageSquare,
  Server,
  ShieldAlert,
  ShieldCheck,
  Workflow,
  XCircle,
} from "lucide-react";
import { MasterAdminLayout } from "@/components/master-admin/MasterAdminLayout";
import {
  SYSTEM_EVENTS_24H,
  SYSTEM_HEALTH,
  type HealthStatus,
} from "@/lib/master-admin-mock-data";
import { cn } from "@/lib/utils";

function formatRelative(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 60) return `${minutes} dk önce`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} saat önce`;
  const days = Math.round(hours / 24);
  return `${days} gün önce`;
}

function statusBadge(status: HealthStatus) {
  const cfg: Record<
    HealthStatus,
    { dot: string; label: string; cls: string }
  > = {
    ok: {
      dot: "bg-emerald-500",
      label: "Tamam",
      cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    warning: {
      dot: "bg-amber-500",
      label: "Uyarı",
      cls: "bg-amber-50 text-amber-700 border-amber-200",
    },
    error: {
      dot: "bg-rose-500",
      label: "Hata",
      cls: "bg-rose-50 text-rose-700 border-rose-200",
    },
  };
  const c = cfg[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-label-sm font-medium",
        c.cls,
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", c.dot)} />
      {c.label}
    </span>
  );
}

function rollupStatus(...states: HealthStatus[]): HealthStatus {
  if (states.includes("error")) return "error";
  if (states.includes("warning")) return "warning";
  return "ok";
}

export default function MasterAdminSystemHealthPage() {
  const overall = rollupStatus(
    ...SYSTEM_HEALTH.flatMap((r) => [
      r.server,
      r.database,
      r.automation,
      r.whatsapp,
    ]),
  );

  const errors = SYSTEM_HEALTH.filter((r) =>
    [r.server, r.database, r.automation, r.whatsapp].includes("error"),
  );

  return (
    <MasterAdminLayout
      title="Sistem Sağlığı"
      subtitle="Tüm kampanyaların altyapı durumu"
    >
      <div
        className={cn(
          "mb-5 rounded-lg border px-4 py-3 flex items-start gap-2 text-body-sm",
          overall === "ok" && "border-emerald-200 bg-emerald-50 text-emerald-800",
          overall === "warning" && "border-amber-200 bg-amber-50 text-amber-900",
          overall === "error" && "border-rose-200 bg-rose-50 text-rose-800",
        )}
      >
        {overall === "ok" ? (
          <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
        ) : overall === "warning" ? (
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
        ) : (
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
        )}
        <p>
          {overall === "ok"
            ? "Tüm sistemler çalışıyor. Kritik hata bildirimi yok."
            : overall === "warning"
              ? "Sistemler çalışıyor — bir veya daha fazla kampanyada uyarı var."
              : "Bir veya daha fazla kampanyada hata var. Aşağıdaki listeyi inceleyin."}
        </p>
      </div>

      <section className="rounded-2xl border border-outline-variant bg-surface-container-lowest overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-outline-variant">
          <h2 className="text-h3 font-semibold text-on-surface">
            Kampanya Durumu
          </h2>
          <p className="text-body-sm text-on-surface-variant">
            Sunucu, veritabanı, otomasyon ve mesajlaşma kontrolleri
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-body-sm">
            <thead className="bg-surface-container-low">
              <tr className="text-left text-label-sm text-on-surface-variant uppercase tracking-wide">
                <th className="px-4 py-3 font-semibold">Kampanya</th>
                <th className="px-4 py-3 font-semibold">
                  <span className="inline-flex items-center gap-1">
                    <Server className="w-3.5 h-3.5" /> Sunucu
                  </span>
                </th>
                <th className="px-4 py-3 font-semibold">
                  <span className="inline-flex items-center gap-1">
                    <Database className="w-3.5 h-3.5" /> DB
                  </span>
                </th>
                <th className="px-4 py-3 font-semibold">
                  <span className="inline-flex items-center gap-1">
                    <Workflow className="w-3.5 h-3.5" /> Otomasyon
                  </span>
                </th>
                <th className="px-4 py-3 font-semibold">
                  <span className="inline-flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" /> WA
                  </span>
                </th>
                <th className="px-4 py-3 font-semibold">
                  <span className="inline-flex items-center gap-1">
                    <HardDrive className="w-3.5 h-3.5" /> Son Yedek
                  </span>
                </th>
                <th className="px-4 py-3 font-semibold">Genel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {SYSTEM_HEALTH.map((row) => {
                const general = rollupStatus(
                  row.server,
                  row.database,
                  row.automation,
                  row.whatsapp,
                );
                return (
                  <tr
                    key={row.campaignSlug}
                    className="hover:bg-surface-container-low/50"
                  >
                    <td className="px-4 py-3">
                      <div className="font-semibold text-on-surface">
                        {row.campaignName}
                      </div>
                      {row.note && (
                        <div className="text-label-sm text-on-surface-variant mt-0.5">
                          {row.note}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">{statusBadge(row.server)}</td>
                    <td className="px-4 py-3">{statusBadge(row.database)}</td>
                    <td className="px-4 py-3">{statusBadge(row.automation)}</td>
                    <td className="px-4 py-3">{statusBadge(row.whatsapp)}</td>
                    <td className="px-4 py-3 text-on-surface-variant">
                      {formatRelative(row.lastBackup)}
                    </td>
                    <td className="px-4 py-3">{statusBadge(general)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="rounded-2xl border border-outline-variant bg-surface-container-lowest overflow-hidden">
          <div className="px-5 py-4 border-b border-outline-variant">
            <h2 className="text-h3 font-semibold text-on-surface">
              Son 24 Saat Olayları
            </h2>
            <p className="text-body-sm text-on-surface-variant">
              Otomatik yedekleme ve sistem bildirimleri
            </p>
          </div>
          <ul className="divide-y divide-outline-variant">
            {SYSTEM_EVENTS_24H.map((event) => {
              const Icon =
                event.level === "ok"
                  ? CheckCircle2
                  : event.level === "warning"
                    ? AlertTriangle
                    : XCircle;
              const fg =
                event.level === "ok"
                  ? "text-emerald-600"
                  : event.level === "warning"
                    ? "text-amber-600"
                    : "text-rose-600";
              const bg =
                event.level === "ok"
                  ? "bg-emerald-50"
                  : event.level === "warning"
                    ? "bg-amber-50"
                    : "bg-rose-50";
              return (
                <li key={event.id} className="px-5 py-3 flex items-start gap-3">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                      bg,
                    )}
                  >
                    <Icon className={cn("w-4 h-4", fg)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-body-sm text-on-surface">
                      {event.campaignLabel && (
                        <span className="font-semibold">
                          {event.campaignLabel}:{" "}
                        </span>
                      )}
                      {event.message}
                    </p>
                    <p className="text-label-sm text-on-surface-variant mt-0.5">
                      {formatRelative(event.timestamp)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="rounded-2xl border border-outline-variant bg-surface-container-lowest overflow-hidden">
          <div className="px-5 py-4 border-b border-outline-variant">
            <h2 className="text-h3 font-semibold text-on-surface">
              Hata Bildirimleri
            </h2>
            <p className="text-body-sm text-on-surface-variant">
              Şu an aktif olan kritik hatalar
            </p>
          </div>
          {errors.length === 0 ? (
            <div className="px-5 py-10 flex flex-col items-center justify-center gap-2 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <p className="text-body-md font-medium text-on-surface">
                Aktif hata yok
              </p>
              <p className="text-body-sm text-on-surface-variant max-w-xs">
                Tüm kritik bileşenler çalışıyor. Hata oluşursa bu kart otomatik
                güncellenir.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-outline-variant">
              {errors.map((row) => (
                <li
                  key={row.campaignSlug}
                  className="px-5 py-3 flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center shrink-0">
                    <XCircle className="w-4 h-4 text-rose-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-body-md font-semibold text-on-surface">
                      {row.campaignName}
                    </p>
                    <p className="text-body-sm text-on-surface-variant">
                      {row.note ?? "Bir veya daha fazla bileşende kritik hata."}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </MasterAdminLayout>
  );
}
