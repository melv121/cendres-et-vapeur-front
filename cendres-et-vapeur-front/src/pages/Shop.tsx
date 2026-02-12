import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Product } from '../types/Product';
import { getAllShopProducts } from '../services/productShop';
import { addToCart } from '../api/api';
import { ProductImage } from '../components/ProductImage';
import '../styles/Shop.css';

function formatEUR(n: number | undefined | null) {
  const value = Number(n || 0);
  return value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
}

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllShopProducts();
      setProducts(data);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent, productId: number) => {
    e.preventDefault();
    const userStr = localStorage.getItem('cev_auth_user');
    const token = localStorage.getItem('cev_auth_token');
    if (!userStr || !token) {
      navigate('/login');
      return;
    }
    try {
      const user = JSON.parse(userStr);
      setAddingId(productId);
      await addToCart(user.id, productId, 1);
      window.dispatchEvent(new Event('cartUpdated'));
      alert('Produit ajouté au panier');
    } catch (err: any) {
      alert(err.message || 'Erreur lors de l\'ajout au panier');
    } finally {
      setAddingId(null);
    }
  };

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;

    return products.filter((p) => {
      const name = (p.name ?? "").toLowerCase();
      const desc = (p.description ?? "").toLowerCase();
      return name.includes(q) || desc.includes(q);
    });
  }, [products, search]);

  return (
    <div className="shop-page">
      <section className="shop-header">
        <h1>Boutique</h1>
        <p className="shop-subtitle">Tous les articles disponibles dans la colonie</p>

        <div className="shop-search">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un produit (nom, description...)"
            aria-label="Rechercher un produit"
          />
          {search.trim() !== "" && (
            <button
              type="button"
              className="shop-search-clear"
              onClick={() => setSearch("")}
              aria-label="Effacer la recherche"
              title="Effacer"
            >
              Supprimer
            </button>
          )}
        </div>

        {!loading && (
          <div className="shop-results">
            {filteredProducts.length} résultat{filteredProducts.length > 1 ? "s" : ""}
          </div>
        )}
      </section>

      <section className="shop-catalog">
        <div className="container">
          {loading ? (
            <div className="loading">Chargement des produits...</div>
          ) : (
            <div className="product-grid">
              {filteredProducts.length === 0 ? (
                <div className="shop-empty">
                  Aucun produit ne correspond à “{search}”.
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className="product-card-link"
                  >
                    <div className="product-card">
                      <div className="product-stock">Stock: {product.stock}</div>

                      <div className="product-image">
                        {product.image ? (
                          <ProductImage src={product.image} alt={product.name} />
                        ) : (
                          <div className="image-placeholder">IMAGE</div>
                        )}
                      </div>

                      <h3>{product.name}</h3>
                      <p className="product-description">{product.description}</p>

                      <div className="price-section">
                        <div className="product-price">{formatEUR(product.current_price || product.base_price)}</div>
                        <div className="product-popularity">
                          {product.popularity_score}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn-primary">Voir les détails</button>
                        <button
                          className="btn-primary"
                          onClick={(e) => handleAddToCart(e, product.id)}
                          disabled={addingId === product.id || product.stock === 0}
                        >
                          {addingId === product.id ? '...' : 'Ajouter'}
                        </button>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Shop;