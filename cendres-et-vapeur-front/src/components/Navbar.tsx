import React, { useState } from 'react';
import logo from '../assets/logo.png';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <img src={logo} alt="Cendres et Vapeur" className="navbar-logo-img" />
          <span className="navbar-brand">Cendres et Vapeur</span>
        </div>

        <button 
          className={`navbar-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <li className="navbar-item">
            <a href="/" className="navbar-link">Accueil</a>
          </li>
          <li className="navbar-item">
            <a href="/shop" className="navbar-link">Boutique</a>
          </li>
          <li className="navbar-item">
            <a href="/about" className="navbar-link">À propos</a>
          </li>
          <li className="navbar-item">
            <a href="/contact" className="navbar-link">Contact</a>
          </li>
          <li className="navbar-item navbar-cart">
            <a href="/cart" className="navbar-link">
              panier <span className="cart-count">0</span>
            </a>
          </li>
          <li className="navbar-item">
            <a href ="login" className ="navbar-link">Se connecter</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;