import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../types/Product';
import { getAllShopProducts } from '../services/productShop';
import '../styles/Shop.css';

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

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
                          <img src={product.image} alt={product.name} />
                        ) : (
                          <div className="image-placeholder">IMAGE</div>
                        )}
                      </div>

                      <h3>{product.name}</h3>
                      <p className="product-description">{product.description}</p>

                      <div className="price-section">
                        <div className="product-price">{product.current_price} €</div>
                        <div className="product-popularity">
                          {product.popularity_score}
                        </div>
                      </div>

                      <button className="btn-primary">Voir les détails</button>
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
