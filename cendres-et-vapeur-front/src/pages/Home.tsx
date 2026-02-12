import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Product } from '../types/Product';
import { productService } from '../services/productService';
import { addToCart } from '../api/api';

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId: number) => {
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

  return (
    <>
      <section className="hero-banner">
        <div className="hero-content">
          <h1>Cendres et Vapeur</h1>
          <p className="hero-tagline">
            Le marché post-apocalyptique où le cuivre est roi
          </p>
          <Link to="/shop" className="cta-button" aria-label="Découvrir nos produits">
            Voir nos produits
          </Link>
        </div>
      </section>
      
      <section className="about-section">
        <div className="about-content">
          <h2>Bienvenue dans un nouveau monde</h2>
          <p className="about-text">
            Dans les ruines du monde ancien, une nouvelle civilisation émerge. 
            <strong> Cendres et Vapeur</strong> est le premier marché numérique post-apocalyptique 
            où survivants et artisans échangent des biens forgés à partir des vestiges de notre passé.
          </p>
          <div className="features-grid">
            <div className="feature-item">
              <span className="feature-icon"></span>
              <h3>Bourse du Cuivre</h3>
              <p>Les prix fluctuent en temps réel selon la disponibilité des ressources</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon"></span>
              <h3>Artisanat Unique</h3>
              <p>Chaque objet est fabriqué à la main par nos artisans survivants</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon"></span>
              <h3>Livraison Sécurisée</h3>
              <p>Vos commandes sont protégées par nos convois blindés à vapeur</p>
            </div>
          </div>
        </div>
      </section>

      <section className="catalog-section">
        <div className="catalog-content">
          <h2>Nos Produits</h2>
          <p className="catalog-subtitle">Découvrez notre sélection d'artefacts et d'équipements</p>
          
          {loading ? (
            <div className="loader"></div>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    <img src={product.image} alt={product.name} />
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="product-description">{product.description}</p>
                    <div className="product-footer">
                      <span className="product-price">{product.current_price} Cu</span>
                      <button
                        className="add-to-cart"
                        onClick={() => handleAddToCart(product.id)}
                        disabled={addingId === product.id}
                      >
                        {addingId === product.id ? '...' : 'Ajouter'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Home;