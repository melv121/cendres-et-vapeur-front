import { useState } from "react";
import type { Product } from "../AdminProduct";
import "../admin.css";

export default function EditProductModal({
  product,
  onClose,
  onSave,
}: {
  product: Product;
  onClose: () => void;
  onSave: (p: Product) => Promise<void> | void;
}) {
  const [form, setForm] = useState<Product>({ ...product });
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
          <h3>Éditer Produit</h3>
          <button className="admIconBtn" onClick={onClose} aria-label="Fermer">
            ✕
          </button>
        </div>

        <form className="admForm" onSubmit={submit}>
          <label>
            Nom
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </label>

          <label>
            Prix (€)
            <input
              type="number"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: Number(e.target.value) })
              }
            />
          </label>

          <label>
            Stock
            <input
              type="number"
              value={form.stock}
              onChange={(e) =>
                setForm({ ...form, stock: Number(e.target.value) })
              }
            />
          </label>

          <label>
            Statut
            <select
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.value as Product["status"],
                })
              }
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="HIDDEN">HIDDEN</option>
            </select>
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