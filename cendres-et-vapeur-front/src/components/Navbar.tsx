import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import './Navbar.css';

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
            <Link to="/" className="navbar-link">Accueil</Link>
          </li>
          <li className="navbar-item">
            <Link to="/shop" className="navbar-link">Boutique</Link>
          </li>
          <li className="navbar-item">
            <Link to="/infos" className="navbar-link">À propos</Link>
          </li>
          <li className="navbar-item">
            <Link to="/contact" className="navbar-link">Contact</Link>
          </li>
          <li className="navbar-item navbar-cart">
            <Link to="/cart" className="navbar-link">
              panier <span className="cart-count">0</span>
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/login" className="navbar-link">Se connecter</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;