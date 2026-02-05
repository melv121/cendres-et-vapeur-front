import { useEffect, useState } from 'react';
import type { Product } from '../types/Product';
import { getAllShopProducts } from '../services/productShop';
import '../styles/Shop.css';

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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
          ) : (
            <div className="product-grid">
              {products.map((product) => (
                <div key={product.id} className="product-card">
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
                  
                  <button className="btn-primary">Ajouter au panier</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Shop;
