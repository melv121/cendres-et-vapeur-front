import React from 'react';

const Home: React.FC = () => {
  return (
    <>
      <section className="hero-banner">
        <div className="hero-content">
          <h1>Cendres et Vapeur</h1>
          <p className="hero-tagline">
            Le marché post-apocalyptique où le cuivre est roi
          </p>
          <button className="cta-button" aria-label="Découvrir nos produits">
            Voir nos produits
          </button>
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
          
          <div className="products-grid">
            <div className="product-card">
              <div className="product-image">
                <img src="" alt="Engrenage en Cuivre" />
              </div>
              <div className="product-info">
                <h3>Engrenage en Cuivre</h3>
                <p className="product-description">Mécanisme forgé à la main, récupéré des anciennes usines</p>
                <div className="product-footer">
                  <span className="product-price">45 Cu</span>
                  <button className="add-to-cart">Ajouter</button>
                </div>
              </div>
            </div>

            <div className="product-card">
              <div className="product-image">
                <img src="" alt="Lampe à Vapeur" />
              </div>
              <div className="product-info">
                <h3>Lampe à Vapeur</h3>
                <p className="product-description">Éclairage portable fonctionnant aux cristaux de vapeur</p>
                <div className="product-footer">
                  <span className="product-price">78€</span>
                  <button className="add-to-cart">Ajouter</button>
                </div>
              </div>
            </div>

            <div className="product-card">
              <div className="product-image">
                <img src="" alt="Montre Mécanique" />
              </div>
              <div className="product-info">
                <h3>Montre Mécanique</h3>
                <p className="product-description">Garde-temps restauré du monde d'avant</p>
                <div className="product-footer">
                  <span className="product-price">120€</span>
                  <button className="add-to-cart">Ajouter</button>
                </div>
              </div>
            </div>

            <div className="product-card">
              <div className="product-image">
                <img src="" alt="Boussole de Navigation" />
              </div>
              <div className="product-info">
                <h3>Boussole de Navigation</h3>
                <p className="product-description">Instrument de navigation renforcé au cuivre</p>
                <div className="product-footer">
                  <span className="product-price">65€</span>
                  <button className="add-to-cart">Ajouter</button>
                </div>
              </div>
            </div>

            <div className="product-card">
              <div className="product-image">
                <img src="" alt="Lunettes de Protection" />
              </div>
              <div className="product-info">
                <h3>Lunettes de Protection</h3>
                <p className="product-description">Protection oculaire contre la poussière et les cendres</p>
                <div className="product-footer">
                  <span className="product-price">52€</span>
                  <button className="add-to-cart">Ajouter</button>
                </div>
              </div>
            </div>

            <div className="product-card">
              <div className="product-image">
                <img src="" alt="Kit de Survie" />
              </div>
              <div className="product-info">
                <h3>Kit de Survie</h3>
                <p className="product-description">Ensemble complet d'outils pour survivant</p>
                <div className="product-footer">
                  <span className="product-price">95 Cu</span>
                  <button className="add-to-cart">Ajouter</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;