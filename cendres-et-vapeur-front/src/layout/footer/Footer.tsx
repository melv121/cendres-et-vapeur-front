import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-title">À propos</h3>
          <p className="footer-description">
            Cendres et Vapeur - Votre marché d'artefacts et de reliques dans un monde post-apocalyptique steampunk.
          </p> 
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Navigation</h3>
          <ul className="footer-links">
            <li><Link to="/" className="footer-link">Accueil</Link></li>
            <li><Link to="/shop" className="footer-link">Boutique</Link></li>
            <li><Link to="/about" className="footer-link">À propos</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Compte</h3>
          <ul className="footer-links">
            <li><Link to="/login" className="footer-link">Connexion</Link></li>
            <li><Link to="/register" className="footer-link">Inscription</Link></li>
            <li><Link to="/profile" className="footer-link">Mon profil</Link></li>
            <li><Link to="/orders" className="footer-link">Mes commandes</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Aide & Support</h3>
          <ul className="footer-links">
            <li><Link to="/faq" className="footer-link">FAQ</Link></li>
            <li><Link to="/shipping" className="footer-link">Livraison</Link></li>
            <li><Link to="/returns" className="footer-link">Retours</Link></li>
            <li><Link to="/contact" className="footer-link">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Mentions légales</h3>
          <ul className="footer-links">
            <li><Link to="/privacy" className="footer-link">Confidentialité</Link></li>
            <li><Link to="/terms" className="footer-link">Conditions d'utilisation</Link></li>
            <li><Link to="/cookies" className="footer-link">Cookies</Link></li>
            <li><Link to="/legal" className="footer-link">Mentions légales</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p className="copyright">
            &copy; {currentYear} Cendres et Vapeur. Tous droits réservés.
          </p>
          <div className="footer-badges">
            <span className="badge">Paiement sécurisé</span>
            <span className="badge">Livraison garantie</span>
            <span className="badge">Support 24/7</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer