import { useMemo, useState, useEffect } from "react";
import EditProductModal from "./modals/EditProductModal";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../../api/api";
import "./admin.css";

export type Product = {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category_id?: number;
  status: "ACTIVE" | "HIDDEN";
};

export default function AdminProducts() {
  const [rows, setRows] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const total = useMemo(() => rows.length, [rows]);

  // Charger les produits depuis l'API
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getProducts();
      // L'API retourne directement un tableau de produits
      const data = Array.isArray(response) ? response : (response.products || []);
      // Adapter les données de l'API au format du composant
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

  // Charger les données au montage du composant
  useEffect(() => {
    fetchProducts();
  }, []);

  // Créer un nouveau produit
  const onCreate = async (p: Omit<Product, 'id'>) => {
    try {
      const newProduct = await createProduct({
        name: p.name,
        description: p.description || '',
        category_id: p.category_id || 1,
        stock: p.stock,
        base_price: p.price,
        current_price: p.price,
        popularity_score: 0,
      });
      // Ajouter le nouveau produit à la liste
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
      alert('Erreur lors de la création: ' + err.message);
    }
  };

  const onSave = async (p: Product) => {
    try {
      await updateProduct(p.id, {
        name: p.name,
        description: p.description,
        current_price: p.price,
        stock: p.stock,
      });
      setRows((prev) => prev.map((x) => (x.id === p.id ? p : x)));
      setSelected(null);
    } catch (err: any) {
      alert('Erreur lors de la sauvegarde: ' + err.message);
    }
  };

  const onDelete = async (id: number) => {
    if (!confirm('Supprimer ce produit ?')) return;
    try {
      await deleteProduct(id);
      setRows((prev) => prev.filter((x) => x.id !== id));
    } catch (err: any) {
      alert('Erreur lors de la suppression: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="admBlock">
        <p style={{ textAlign: 'center', padding: '2rem' }}>Chargement des produits...</p>
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
                    className={`pill ${
                      r.status === "ACTIVE" ? "ok" : "warn"
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