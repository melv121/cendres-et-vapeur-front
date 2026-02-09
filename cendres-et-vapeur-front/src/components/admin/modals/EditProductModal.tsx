import { useState } from "react";
import type { Product } from "../AdminProduct";
import "../admin.css";

type EditProductModalProps = {
  product: Product | null;
  onClose: () => void;
  onSave?: (p: Product) => Promise<void> | void;
  onCreate?: (p: Omit<Product, 'id'>) => Promise<void> | void;
};

const defaultProduct: Omit<Product, 'id'> = {
  name: '',
  description: '',
  price: 0,
  stock: 0,
  category_id: 1,
  status: 'ACTIVE',
};

export default function EditProductModal({
  product,
  onClose,
  onSave,
  onCreate,
}: EditProductModalProps) {
  const isCreating = product === null;
  const [form, setForm] = useState<Omit<Product, 'id'> & { id?: number }>(
    product ? { ...product } : { ...defaultProduct }
  );
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name.trim()) {
      alert('Le nom du produit est requis');
      return;
    }
    
    setSaving(true);
    try {
      if (isCreating && onCreate) {
        await onCreate(form);
      } else if (onSave && form.id !== undefined) {
        await onSave(form as Product);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admModalBackdrop" onMouseDown={onClose}>
      <div className="admModal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="admModalHead">
          <h3>{isCreating ? 'Créer un Produit' : 'Éditer Produit'}</h3>
          <button className="admIconBtn" onClick={onClose} aria-label="Fermer">
            ✕
          </button>
        </div>

        <form className="admForm" onSubmit={submit}>
          <label>
            Nom *
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nom du produit"
              required
            />
          </label>

          <label>
            Description
            <textarea
              value={form.description || ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Description du produit"
              rows={3}
            />
          </label>

          <label>
            Prix (Cu)
            <input
              type="number"
              min="0"
              step="0.01"
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
              min="0"
              value={form.stock}
              onChange={(e) =>
                setForm({ ...form, stock: Number(e.target.value) })
              }
            />
          </label>

          <label>
            Catégorie ID
            <input
              type="number"
              min="1"
              value={form.category_id || 1}
              onChange={(e) =>
                setForm({ ...form, category_id: Number(e.target.value) })
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
              {saving ? "Sauvegarde..." : (isCreating ? "Créer" : "Sauvegarder")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}