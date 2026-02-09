import { useState } from "react";
import "../admin.css";

// Type produit local - compatible avec AdminProduct.tsx
export type Product = {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category_id?: number;
  status: "ACTIVE" | "HIDDEN";
};

type EditProductModalProps =
  | {
      product: Product;
      onClose: () => void;
      onSave: (p: Product) => Promise<void> | void;
      onCreate?: never;
    }
  | {
      product: null;
      onClose: () => void;
      onSave?: never;
      onCreate: (p: Omit<Product, "id">) => Promise<void> | void;
    };

const emptyProduct: Omit<Product, "id"> = {
  name: "",
  description: "",
  price: 0,
  stock: 0,
  category_id: 1,
  status: "ACTIVE",
};

export default function EditProductModal({
  product,
  onClose,
  onSave,
  onCreate,
}: EditProductModalProps) {
  const isCreating = product === null;
  const [form, setForm] = useState<Product | Omit<Product, "id">>(
    product ? { ...product } : { ...emptyProduct }
  );
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isCreating && onCreate) {
        await onCreate(form as Omit<Product, "id">);
      } else if (onSave) {
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
          <h3>{isCreating ? "Nouveau Produit" : "Éditer Produit"}</h3>
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
