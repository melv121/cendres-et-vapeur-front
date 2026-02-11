import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Product } from '../types/Product';
import { productService } from '../services/productService';
import { addToCart } from '../api/api';
import '../styles/ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const data = await productService.getProductById(parseInt(id));
      setProduct(data);
    } catch (error) {
      console.error('Erreur lors du chargement du produit:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (product && newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    const userStr = localStorage.getItem('cev_user');
    const token = localStorage.getItem('cev_auth_token');
    if (!userStr || !token) {
      navigate('/login');
      return;
    }
    try {
      const user = JSON.parse(userStr);
      await addToCart(user.id, product!.id, quantity);
      window.dispatchEvent(new Event('cartUpdated'));
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (err: any) {
      alert(err.message || 'Erreur lors de l\'ajout au panier');
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { text: 'Rupture de stock', className: 'out-of-stock' };
    if (stock <= 5) return { text: 'Stock limité', className: 'low-stock' };
    return { text: 'En stock', className: 'in-stock' };
  };

  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="loading">Chargement du produit...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="error-message">
            <h2>Produit introuvable</h2>
            <p>Le produit que vous recherchez n'existe pas ou n'est plus disponible.</p>
            <button onClick={() => navigate('/shop')} className="btn-primary">
              Retour à la boutique
            </button>
          </div>
        </div>
      </div>
    );
  }

  const stockStatus = getStockStatus(product.stock);

  return (
    <div className="product-detail-page">
      <div className="container">
        <button onClick={() => navigate('/shop')} className="btn-back">
          ← Retour à la boutique
        </button>

        <div className="product-detail-container">
          <div className="product-image-section">
            {product.image ? (
              <img src={product.image} alt={product.name} className="product-image-large" />
            ) : (
              <div className="image-placeholder-large">
                <span>IMAGE PRODUIT</span>
              </div>
            )}
            
            <div className="product-badges">
              <div className={`stock-badge ${stockStatus.className}`}>
                {stockStatus.text}
              </div>
              <div className="popularity-badge">
                Popularité: {product.popularity_score}/10
              </div>
            </div>
          </div>

          <div className="product-info-section">
            <h1 className="product-title">{product.name}</h1>
            
            <div className="product-meta">
              <span className="product-id">Réf: #{product.id}</span>
              <span className="product-stock-count">{product.stock} unité(s) disponible(s)</span>
            </div>

            <div className="product-price-section">
              <div className="price-container">
                {product.base_price !== product.current_price && (
                  <span className="original-price">{product.base_price} €</span>
                )}
                <span className="current-price">{product.current_price} €</span>
              </div>
            </div>

            <div className="product-description-section">
              <h2>Description</h2>
              <p className="product-description-text">{product.description}</p>
            </div>

            <div className="product-details">
              <h3>Caractéristiques</h3>
              <ul>
                <li><strong>Catégorie:</strong> #{product.category_id}</li>
                <li><strong>Stock disponible:</strong> {product.stock} unités</li>
                <li><strong>Score de popularité:</strong> {product.popularity_score}/10</li>
                <li><strong>Prix de base:</strong> {product.base_price} €</li>
              </ul>
            </div>

            {product.stock > 0 ? (
              <div className="purchase-section">
                <div className="quantity-selector">
                  <label>Quantité:</label>
                  <div className="quantity-controls">
                    <button 
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <span className="quantity-display">{quantity}</span>
                    <button 
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="total-price">
                  <span>Total:</span>
                  <span className="total-amount">{(product.current_price * quantity).toFixed(2)} €</span>
                </div>

                <button 
                  onClick={handleAddToCart}
                  className={`btn-add-to-cart ${addedToCart ? 'added' : ''}`}
                  disabled={addedToCart}
                >
                  {addedToCart ? '✓ Ajouté au panier' : 'Ajouter au panier'}
                </button>
              </div>
            ) : (
              <div className="out-of-stock-message">
                <p>Ce produit est actuellement en rupture de stock.</p>
                <button className="btn-notify">Me notifier lors du réapprovisionnement</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
