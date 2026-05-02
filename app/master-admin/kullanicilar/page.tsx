"use client";

import { Info, Plus, ShieldCheck } from "lucide-react";
import { MasterAdminLayout } from "@/components/master-admin/MasterAdminLayout";
import {
  MASTER_USERS,
  ROLE_DESCRIPTION,
  ROLE_LABEL,
  type UserRole,
} from "@/lib/master-admin-mock-data";
import { cn } from "@/lib/utils";

const ROLE_STYLE: Record<UserRole, string> = {
  "super-admin": "bg-violet-50 text-violet-700 border-violet-200",
  "campaign-manager": "bg-sky-50 text-sky-700 border-sky-200",
  accounting: "bg-emerald-50 text-emerald-700 border-emerald-200",
  tech: "bg-amber-50 text-amber-700 border-amber-200",
};

function formatRelative(iso: string | null) {
  if (!iso) return "—";
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 60) return `${minutes} dk önce`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} saat önce`;
  const days = Math.round(hours / 24);
  return `${days} gün önce`;
}

export default function MasterAdminUsersPage() {
  return (
    <MasterAdminLayout
      title="Kullanıcılar"
      subtitle="Master panele erişimi olan kullanıcılar"
      actions={
        <button
          type="button"
          disabled
          title="Yakında — çok kullanıcı desteği"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary/40 text-on-primary text-label-md cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          Kullanıcı Ekle
        </button>
      }
    >
      <div className="mb-5 rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sky-800 text-body-sm flex items-start gap-2">
        <Info className="w-4 h-4 shrink-0 mt-0.5" />
        <p>
          Şu anda sadece tek kullanıcı destekleniyor. Çok kullanıcı + rol
          tabanlı erişim yakında eklenecek.
        </p>
      </div>

      <section className="rounded-2xl border border-outline-variant bg-surface-container-lowest overflow-hidden">
        <div className="px-5 py-4 border-b border-outline-variant">
          <h2 className="text-h3 font-semibold text-on-surface">
            Aktif Kullanıcılar
          </h2>
          <p className="text-body-sm text-on-surface-variant">
            {MASTER_USERS.length} kullanıcı
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-body-sm">
            <thead className="bg-surface-container-low">
              <tr className="text-left text-label-sm text-on-surface-variant uppercase tracking-wide">
                <th className="px-4 py-3 font-semibold">Ad</th>
                <th className="px-4 py-3 font-semibold">E-posta</th>
                <th className="px-4 py-3 font-semibold">Rol</th>
                <th className="px-4 py-3 font-semibold">Son Giriş</th>
                <th className="px-4 py-3 font-semibold">Durum</th>
                <th className="px-4 py-3 font-semibold text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {MASTER_USERS.map((u) => (
                <tr key={u.id} className="hover:bg-surface-container-low/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary text-on-primary text-label-sm font-bold flex items-center justify-center shrink-0">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-on-surface">
                        {u.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-on-surface-variant font-mono text-label-md">
                    {u.email}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex px-2 py-0.5 rounded-md border text-label-sm font-medium",
                        ROLE_STYLE[u.role],
                      )}
                    >
                      {ROLE_LABEL[u.role]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-on-surface-variant">
                    {formatRelative(u.lastLogin)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-label-sm font-medium",
                        u.status === "active"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-gray-100 text-gray-600 border-gray-200",
                      )}
                    >
                      <span
                        className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          u.status === "active"
                            ? "bg-emerald-500"
                            : "bg-gray-400",
                        )}
                      />
                      {u.status === "active" ? "Aktif" : "Pasif"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      disabled
                      title="Yakında"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-outline-variant text-label-sm text-on-surface-variant cursor-not-allowed opacity-60"
                    >
                      Düzenle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-outline-variant bg-surface-container-lowest p-5">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="w-5 h-5 text-secondary" />
          <h2 className="text-h3 font-semibold text-on-surface">
            Rol Tipleri (yakında)
          </h2>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(Object.keys(ROLE_LABEL) as UserRole[]).map((role) => (
            <li
              key={role}
              className="rounded-lg border border-outline-variant bg-surface-container-low/40 px-4 py-3"
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span
                  className={cn(
                    "inline-flex px-2 py-0.5 rounded-md border text-label-sm font-medium",
                    ROLE_STYLE[role],
                  )}
                >
                  {ROLE_LABEL[role]}
                </span>
              </div>
              <p className="text-body-sm text-on-surface-variant">
                {ROLE_DESCRIPTION[role]}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </MasterAdminLayout>
  );
}
