import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../types/Product';
import { getAllShopProducts } from '../services/productShop';
import '../styles/Shop.css';

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllShopProducts();
      setProducts(data);
    } catch (err) {
      console.error('Erreur lors du chargement des produits:', err);
      setError('Impossible de charger les produits. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shop-page">
      <section className="shop-header">
        <h1>Boutique</h1>
        <p className="shop-subtitle">Tous les articles disponibles dans la colonie</p>
      </section>

      <section className="shop-catalog">
        <div className="container">
          {loading ? (
            <div className="loading">Chargement des produits...</div>
          ) : error ? (
            <div className="error-message" style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ color: '#d4955f', marginBottom: '16px' }}>{error}</p>
              <button 
                onClick={loadProducts}
                style={{
                  padding: '10px 20px',
                  background: '#8b5a2b',
                  border: '2px solid #b87333',
                  color: '#e8dcc8',
                  cursor: 'pointer'
                }}
              >
                🔄 Réessayer
              </button>
            </div>
          ) : (
            <div className="product-grid">
              {products.map((product) => (
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
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Shop;
