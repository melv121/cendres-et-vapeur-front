import { useMemo, useState, useEffect } from "react";
import EditProductModal from "./modals/EditProductModal";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../../api/api";
import { useNotification } from "../../contexts/NotificationContext";
import "./admin.css";

export type Product = {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category_id?: number;
  status: "ACTIVE" | "HIDDEN";
  image_url?: string;
};

export default function AdminProducts() {
  const [rows, setRows] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { success, error: showError, confirm: showConfirm } = useNotification();

  const total = useMemo(() => rows.length, [rows]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getProducts();
      const data = Array.isArray(response) ? response : (response.products || []);
      const products = data.map((product: any) => ({
        id: product.id,
        name: product.name || 'Sans nom',
        price: product.current_price || product.price || 0,
        stock: product.stock || 0,
        status: product.stock > 0 ? 'ACTIVE' : 'HIDDEN',
      }));
      setRows(products);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des produits');
      console.error('Erreur API:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onCreate = async (p: Omit<Product, 'id'>) => {
    try {
      const newProduct = await createProduct({
        name: p.name,
        description: p.description || '',
        image_url: null,
        category_id: p.category_id || 1,
        stock: Number(p.stock),
        base_price: Number(p.price),
        current_price: Number(p.price),
        popularity_score: 0,
      });

      setRows((prev) => [...prev, {
        id: newProduct.id,
        name: newProduct.name,
        description: newProduct.description,
        price: newProduct.current_price,
        stock: newProduct.stock,
        category_id: newProduct.category_id,
        status: newProduct.stock > 0 ? 'ACTIVE' : 'HIDDEN',
      }]);
      setIsCreating(false);
    } catch (err: any) {
      console.error('Erreur création produit:', err);
      showError('Erreur lors de la création: ' + err.message);
    }
  };

  const onSave = async (p: Product) => {
    try {
      await updateProduct(p.id, {
        name: p.name,
        description: p.description || '',
        image_url: null,
        category_id: p.category_id || 1,
        stock: Number(p.stock),
        base_price: Number(p.price),
        current_price: Number(p.price),
        popularity_score: 0,
      });
      setRows((prev) => prev.map((x) => (x.id === p.id ? p : x)));
      setSelected(null);
    } catch (err: any) {
      console.error('Erreur mise à jour produit:', err);
      showError('Erreur lors de la sauvegarde: ' + err.message);
    }
  };

  const onDelete = async (id: number) => {
    showConfirm('Supprimer ce produit ?', {
      onConfirm: async () => {
        try {
          await deleteProduct(id);
          setRows((prev) => prev.filter((x) => x.id !== id));
          success('Produit supprimé');
        } catch (err: any) {
          showError('Erreur lors de la suppression: ' + err.message);
        }
      },
    });
  };

  if (loading) {
    return (
      <div className="admBlock">
        <p style={{ textAlign: 'center', padding: '2rem', color: '#d4955f' }}>Chargement des produits...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admBlock">
        <p style={{ textAlign: 'center', padding: '2rem', color: '#d4955f' }}>
          Erreur: {error}
        </p>
        <button className="admBtn" onClick={fetchProducts} style={{ display: 'block', margin: '0 auto' }}>
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="admBlock">
      <div className="admBlockHead">
        <div>
          <h2>Gestion Produits</h2>
          <p>{total} produit(s)</p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="admBtn"
            onClick={() => setIsCreating(true)}
            title="Ajouter un nouveau produit"
          >
            + Ajouter
          </button>
          <button
            className="admBtn ghost"
            onClick={fetchProducts}
            title="Actualiser les données"
          >
            Actualiser
          </button>
        </div>
      </div>

      <div className="admTableWrap">
        <table className="admTable">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Prix</th>
              <th>Stock</th>
              <th>Statut</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="mono">{r.id}</td>
                <td>{r.name}</td>
                <td>{r.price} €</td>
                <td>{r.stock}</td>
                <td>
                  <span
                    className={`pill ${r.status === "ACTIVE" ? "ok" : "warn"
                      }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td>
                  <button className="admBtn ghost" onClick={() => setSelected(r)}>
                    Éditer
                  </button>
                  <button className="admBtn ghost" onClick={() => onDelete(r.id)} style={{ marginLeft: '5px' }}>
                    ✕
                  </button>
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="empty">
                  Aucun produit.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <EditProductModal
          product={selected}
          onClose={() => setSelected(null)}
          onSave={onSave}
        />
      )}

      {isCreating && (
        <EditProductModal
          product={null}
          onClose={() => setIsCreating(false)}
          onCreate={onCreate}
        />
      )}
    </div>
  );
}