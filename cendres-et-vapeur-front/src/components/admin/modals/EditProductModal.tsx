import { useState } from "react";
import type { Product } from "../AdminProduct";
import { uploadProductImage } from "../../../api/api";
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
  image_url: '',
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
  const [imagePreview, setImagePreview] = useState<string>(product?.image_url || '');
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Image trop volumineuse (max 2MB)');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);

        // Si le produit existe déjà, uploader l'image immédiatement
        if (product?.id) {
          setUploading(true);
          uploadProductImage(product.id, file)
            .then((result) => {
              setForm({ ...form, image_url: result.image_url || `/products/${product.id}/image` });
              alert('Image uploadée avec succès!');
            })
            .catch((err) => {
              console.error('Erreur upload:', err);
              alert('Erreur lors de l\'upload: ' + (err as any).message);
            })
            .finally(() => {
              setUploading(false);
            });
        } else {
          // Pour un nouveau produit, on stocke juste en base64
          setForm({ ...form, image_url: base64 });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (url: string) => {
    setForm({ ...form, image_url: url });
    setImagePreview(url);
  };

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
    <div className="admModalBackdrop" onClick={onClose}>
      <div className="admModal" onClick={(e) => e.stopPropagation()}>
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

          <label>
            Image du produit
            <div className="image-upload-section">
              <div className="image-upload-buttons">
                <label className="admBtn ghost" style={{ cursor: uploading ? 'not-allowed' : 'pointer', display: 'inline-block', opacity: uploading ? 0.6 : 1 }}>
                  {uploading ? '⏳ Upload...' : '📁 Choisir un fichier'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
              <input
                type="text"
                value={form.image_url || ''}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="Ou entrez une URL d'image"
                style={{ marginTop: '8px' }}
              />
              {imagePreview && (
                <div className="image-preview" style={{ marginTop: '10px' }}>
                  <img
                    src={imagePreview}
                    alt="Aperçu"
                    style={{ maxWidth: '100%', maxHeight: '150px', border: '2px solid #8b5a2b' }}
                    onError={() => setImagePreview('')}
                  />
                  <button
                    type="button"
                    className="admBtn ghost"
                    onClick={() => { setForm({ ...form, image_url: '' }); setImagePreview(''); }}
                    style={{ marginTop: '8px' }}
                  >
                    🗑️ Supprimer l'image
                  </button>
                </div>
              )}
            </div>
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