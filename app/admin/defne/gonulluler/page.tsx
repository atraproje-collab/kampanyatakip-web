"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckSquare,
  MessageCircle,
  Pencil,
  Plus,
  Send,
  Square,
  Trash2,
  Users,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/Button";
import { FormField, Modal, PanelCard, inputClass } from "@/components/admin/AdminUI";
import { adminVolunteers, type Volunteer } from "@/lib/admin-mock-data";
import { demoCampaign } from "@/lib/mock-campaign-data";
import { cn } from "@/lib/utils";

const ROLES: Volunteer["role"][] = [
  "Kumbara Sorumlusu",
  "Stant Sorumlusu",
  "Sosyal Medya",
  "Diğer",
];

type RecipientGroup = "all" | "kumbara" | "stant" | "manual";

const TEMPLATES: { key: string; label: string; body: string }[] = [
  {
    key: "custom",
    label: "Özel mesaj",
    body: "",
  },
  {
    key: "kumbara",
    label: "Kumbara açılış hatırlatması",
    body: `Merhaba [Ad],
Bu hafta sorumlu olduğunuz kumbaranın açılışı planlanıyor. Lütfen tutanak fotoğrafını ve sayım tutarını paneli üzerinden iletmeyi unutmayın.
Teşekkürler — Minik Defne Kampanya Ekibi`,
  },
  {
    key: "meeting",
    label: "Toplantı duyurusu",
    body: `Merhaba [Ad],
Bu hafta Cumartesi saat 18:00'de gönüllü toplantımız var. Yapılan ve planlanan işleri birlikte değerlendireceğiz.
Katılımınızı bekliyoruz — Minik Defne Kampanya Ekibi`,
  },
  {
    key: "thanks",
    label: "Teşekkür mesajı",
    body: `Sevgili [Ad],
Minik Defne için verdiğiniz emek paha biçilemez. Sahada gösterdiğiniz özveri sayesinde hedefimize her gün biraz daha yaklaşıyoruz.
Yürekten teşekkür ederiz — Defne Ailesi`,
  },
];

export default function VolunteersPage() {
  const [list, setList] = useState<Volunteer[]>(adminVolunteers);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState<Volunteer | null>(null);

  // Add form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<Volunteer["role"]>("Kumbara Sorumlusu");
  const [assignedTo, setAssignedTo] = useState("");

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editRole, setEditRole] = useState<Volunteer["role"]>("Kumbara Sorumlusu");
  const [editAssigned, setEditAssigned] = useState("");

  // Bulk message state
  const [recipientGroup, setRecipientGroup] = useState<RecipientGroup>("all");
  const [manualSelected, setManualSelected] = useState<Set<string>>(new Set());
  const [templateKey, setTemplateKey] = useState("custom");
  const [message, setMessage] = useState("");

  const assignmentOptionsFor = (r: Volunteer["role"]) => {
    if (r === "Kumbara Sorumlusu") {
      return demoCampaign.transparency.kumbaralar.map(
        (k) => `Kumbara #${k.id} (${k.location})`,
      );
    }
    if (r === "Stant Sorumlusu") {
      return demoCampaign.transparency.stantlar.map(
        (s) => `Stant #${s.id} (${s.location})`,
      );
    }
    return ["Genel", "Saha Ekibi", "İletişim"];
  };

  const assignmentOptions = useMemo(() => assignmentOptionsFor(role), [role]);
  const editAssignmentOptions = useMemo(() => assignmentOptionsFor(editRole), [editRole]);

  const handleAdd = () => {
    if (!name.trim() || !phone.trim()) return;
    const v: Volunteer = {
      id: `V-${String(list.length + 1).padStart(2, "0")}`,
      name: name.trim(),
      phone: phone.trim(),
      role,
      assignedTo: assignedTo || assignmentOptions[0] || "Genel",
      addedAt: new Date().toISOString().slice(0, 10),
    };
    setList([v, ...list]);
    setOpenAdd(false);
    setName("");
    setPhone("");
    setRole("Kumbara Sorumlusu");
    setAssignedTo("");
  };

  const openEditModal = (v: Volunteer) => {
    setOpenEdit(v);
    setEditName(v.name);
    setEditPhone(v.phone);
    setEditRole(v.role);
    setEditAssigned(v.assignedTo);
  };

  const handleSaveEdit = () => {
    if (!openEdit || !editName.trim() || !editPhone.trim()) return;
    setList((prev) =>
      prev.map((x) =>
        x.id === openEdit.id
          ? {
              ...x,
              name: editName.trim(),
              phone: editPhone.trim(),
              role: editRole,
              assignedTo: editAssigned || editAssignmentOptions[0] || "Genel",
            }
          : x,
      ),
    );
    setOpenEdit(null);
  };

  const handleRemove = (id: string) => {
    if (!confirm("Bu gönüllüyü listeden kaldırmak istediğinize emin misiniz?")) return;
    setList((prev) => prev.filter((v) => v.id !== id));
    setManualSelected((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  // Bulk recipient resolution
  const recipients = useMemo(() => {
    if (recipientGroup === "all") return list;
    if (recipientGroup === "kumbara") return list.filter((v) => v.role === "Kumbara Sorumlusu");
    if (recipientGroup === "stant") return list.filter((v) => v.role === "Stant Sorumlusu");
    return list.filter((v) => manualSelected.has(v.id));
  }, [recipientGroup, list, manualSelected]);

  // Auto-fill template
  useEffect(() => {
    const tpl = TEMPLATES.find((t) => t.key === templateKey);
    if (tpl) setMessage(tpl.body);
  }, [templateKey]);

  const toggleManual = (id: string) => {
    setManualSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSendBulk = () => {
    if (recipients.length === 0) {
      alert("En az bir alıcı seçilmelidir.");
      return;
    }
    if (!message.trim()) {
      alert("Mesaj metni boş olamaz.");
      return;
    }
    if (
      !confirm(
        `${recipients.length} gönüllü için mesajlaşma uygulamasında ${recipients.length} ayrı sekme açılacak. Devam edilsin mi?`,
      )
    ) {
      return;
    }
    recipients.forEach((v, idx) => {
      const personalMessage = message.replaceAll("[Ad]", v.name.split(" ")[0] ?? v.name);
      const phoneDigits = v.phone.replace(/\D/g, "");
      const url = `https://wa.me/${phoneDigits}?text=${encodeURIComponent(personalMessage)}`;
      // küçük gecikme — popup engelleyiciden kaçınmak için
      setTimeout(() => {
        window.open(url, `_msg_${idx}`);
      }, idx * 250);
    });
  };

  return (
    <AdminLayout
      title="Gönüllüler"
      subtitle={`${list.length} aktif gönüllü`}
      actions={
        <Button variant="primary" size="sm" onClick={() => setOpenAdd(true)}>
          <Plus className="w-4 h-4" />
          Gönüllü Ekle
        </Button>
      }
    >
      <PanelCard>
        <div className="overflow-x-auto">
          <table className="w-full text-body-sm">
            <thead>
              <tr className="bg-surface-container-low text-label-sm text-on-surface-variant uppercase tracking-wide">
                <th className="text-left px-5 py-3 font-semibold">Ad Soyad</th>
                <th className="text-left px-5 py-3 font-semibold">Telefon</th>
                <th className="text-left px-5 py-3 font-semibold">Görev</th>
                <th className="text-left px-5 py-3 font-semibold">Sorumlu Olduğu</th>
                <th className="text-left px-5 py-3 font-semibold">Eklenme</th>
                <th className="text-right px-5 py-3 font-semibold">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {list.map((v, i) => (
                <tr
                  key={v.id}
                  className={`border-t border-outline-variant hover:bg-surface-container-low transition ${i % 2 === 1 ? "bg-surface-container-low/40" : ""}`}
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-secondary text-on-secondary text-label-sm font-bold flex items-center justify-center shrink-0">
                        {v.name.charAt(0)}
                      </div>
                      <span className="font-medium text-on-surface">{v.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-on-surface-variant tabular-nums">{v.phone}</td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary-fixed text-primary text-label-sm font-medium">
                      {v.role}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-on-surface-variant">{v.assignedTo}</td>
                  <td className="px-5 py-3 text-on-surface-variant tabular-nums">{v.addedAt}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(v)}
                        className="p-1.5 rounded-md text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                        aria-label="Düzenle"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleRemove(v.id)}
                        className="p-1.5 rounded-md text-on-surface-variant hover:bg-error-container hover:text-error"
                        aria-label="Kaldır"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PanelCard>

      {/* Bulk message panel */}
      <PanelCard
        title="Toplu Mesaj Gönder"
        description="Seçili gönüllülere mesajlaşma uygulaması üzerinden tek tıkla mesaj gönderin"
        className="mt-6"
      >
        <div className="grid lg:grid-cols-2 gap-0">
          {/* Recipients column */}
          <div className="px-5 py-4 lg:border-r border-outline-variant">
            <h3 className="text-label-md font-semibold text-on-surface mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" /> Alıcı Seçimi
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {[
                { key: "all" as RecipientGroup, label: "Tüm gönüllüler" },
                { key: "kumbara" as RecipientGroup, label: "Kumbara sorumluları" },
                { key: "stant" as RecipientGroup, label: "Stant sorumluları" },
                { key: "manual" as RecipientGroup, label: "Elle seçim" },
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setRecipientGroup(opt.key)}
                  className={cn(
                    "px-3 py-2 rounded-lg border text-label-md font-medium text-left transition",
                    recipientGroup === opt.key
                      ? "border-secondary bg-secondary-container/30 text-on-secondary-container"
                      : "border-outline-variant text-on-surface-variant hover:bg-surface-container-low",
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {recipientGroup === "manual" && (
              <div className="mt-3 max-h-56 overflow-y-auto rounded-lg border border-outline-variant divide-y divide-outline-variant bg-surface-container-low">
                {list.map((v) => {
                  const checked = manualSelected.has(v.id);
                  return (
                    <button
                      key={v.id}
                      onClick={() => toggleManual(v.id)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-surface-container transition"
                    >
                      {checked ? (
                        <CheckSquare className="w-4 h-4 text-secondary shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-on-surface-variant shrink-0" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-label-md text-on-surface truncate">{v.name}</p>
                        <p className="text-label-sm text-on-surface-variant truncate">
                          {v.role} • {v.phone}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="mt-4 px-3 py-2.5 rounded-lg bg-primary-fixed text-on-primary-fixed border border-primary-fixed-dim/40">
              <p className="text-label-md font-semibold">
                {recipients.length} kişiye gönderilecek
              </p>
              <p className="text-label-sm text-on-primary-fixed-variant mt-0.5">
                {recipients.length === 0
                  ? "Henüz alıcı seçilmedi."
                  : recipients.slice(0, 4).map((r) => r.name).join(", ") +
                    (recipients.length > 4 ? ` ve ${recipients.length - 4} kişi daha` : "")}
              </p>
            </div>
          </div>

          {/* Message column */}
          <div className="px-5 py-4 border-t lg:border-t-0 border-outline-variant">
            <h3 className="text-label-md font-semibold text-on-surface mb-3 flex items-center gap-2">
              <MessageCircle className="w-4 h-4" /> Mesaj
            </h3>

            <FormField label="Hazır şablon">
              <select
                className={inputClass}
                value={templateKey}
                onChange={(e) => setTemplateKey(e.target.value)}
              >
                {TEMPLATES.map((t) => (
                  <option key={t.key} value={t.key}>
                    {t.label}
                  </option>
                ))}
              </select>
            </FormField>

            <div className="mt-3">
              <FormField
                label="Mesaj metni"
                hint="`[Ad]` yer tutucusu her gönüllünün adıyla otomatik değiştirilir."
              >
                <textarea
                  rows={6}
                  className={inputClass}
                  placeholder="Mesajınızı buraya yazın…"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (templateKey !== "custom") setTemplateKey("custom");
                  }}
                />
              </FormField>
            </div>

            <div className="mt-4 flex justify-end">
              <Button variant="primary" size="md" onClick={handleSendBulk}>
                <Send className="w-4 h-4" />
                Mesajlaşma Uygulamasıyla Gönder
              </Button>
            </div>
          </div>
        </div>
      </PanelCard>

      {/* Add modal */}
      <Modal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        title="Yeni Gönüllü"
        description="Sahada görev alacak gönüllüyü ekleyin"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setOpenAdd(false)}>
              İptal
            </Button>
            <Button variant="primary" size="sm" onClick={handleAdd}>
              Ekle
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormField label="Ad Soyad" required>
            <input
              className={inputClass}
              placeholder="Ad ve soyad"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormField>
          <FormField label="Telefon" required>
            <input
              className={inputClass}
              placeholder="+90 5xx xxx xx xx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </FormField>
          <FormField label="Görev" required>
            <select
              className={inputClass}
              value={role}
              onChange={(e) => {
                setRole(e.target.value as Volunteer["role"]);
                setAssignedTo("");
              }}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Sorumlu Olduğu Birim">
            <select
              className={inputClass}
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            >
              {assignmentOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </FormField>
        </div>
      </Modal>

      {/* Edit modal */}
      <Modal
        open={openEdit !== null}
        onClose={() => setOpenEdit(null)}
        title={openEdit ? `Düzenle — ${openEdit.name}` : ""}
        description="Gönüllü bilgilerini güncelleyin"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setOpenEdit(null)}>
              İptal
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveEdit}>
              Kaydet
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormField label="Ad Soyad" required>
            <input
              className={inputClass}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
          </FormField>
          <FormField label="Telefon" required>
            <input
              className={inputClass}
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
            />
          </FormField>
          <FormField label="Görev" required>
            <select
              className={inputClass}
              value={editRole}
              onChange={(e) => {
                setEditRole(e.target.value as Volunteer["role"]);
                setEditAssigned("");
              }}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Sorumlu Olduğu Birim">
            <select
              className={inputClass}
              value={editAssigned}
              onChange={(e) => setEditAssigned(e.target.value)}
            >
              {editAssignmentOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </FormField>
        </div>
      </Modal>
    </AdminLayout>
  );
}
