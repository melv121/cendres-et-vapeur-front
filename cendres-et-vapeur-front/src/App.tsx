import logo from './assets/logo.png'
import './App.css'

function App() {

  return (
    <div className="app-container">
      <header className="app-header">
        <img src={logo} className="logo" alt="Cendres et Vapeur logo" />
      </header>
      
      
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
    </div>
  )
}

export default App
