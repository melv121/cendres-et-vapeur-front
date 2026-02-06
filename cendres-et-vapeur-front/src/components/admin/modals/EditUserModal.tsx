import { useState } from "react";
import type { AdminUser } from "../AdminUsers";
import "../admin.css";

export default function EditUserModal({
  user,
  onClose,
  onSave,
}: {
  user: AdminUser;
  onClose: () => void;
  onSave: (u: AdminUser) => Promise<void> | void;
}) {
  const [form, setForm] = useState<AdminUser>({ ...user });
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admModalBackdrop" onMouseDown={onClose}>
      <div className="admModal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="admModalHead">
          <h3>Éditer Utilisateur</h3>
          <button className="admIconBtn" onClick={onClose} aria-label="Fermer">
            ✕
          </button>
        </div>

        <form className="admForm" onSubmit={submit}>
          <label>
            Email
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </label>

          <label>
            Nom complet
            <input
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
          </label>

          <label>
            Rôle
            <select
              value={form.role}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value as AdminUser["role"] })
              }
            >
              <option value="USER">USER</option>
              <option value="EDITOR">EDITOR</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </label>

          <label className="row">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
            Actif
          </label>

          <div className="admActions">
            <button
              type="button"
              className="admBtn ghost"
              onClick={onClose}
              disabled={saving}
            >
              Annuler
            </button>
            <button type="submit" className="admBtn" disabled={saving}>
              {saving ? "Sauvegarde..." : "Sauvegarder"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
