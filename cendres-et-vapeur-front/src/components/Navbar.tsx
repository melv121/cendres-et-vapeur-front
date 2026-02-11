import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import './Navbar.css';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  avatar_url?: string;
}

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const checkUser = () => {
      const userStr = localStorage.getItem('cev_user');
      const token = localStorage.getItem('cev_auth_token');
      
      if (userStr && token) {
        try {
          setUser(JSON.parse(userStr));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkUser();
    
    // Écouter les changements de localStorage
    window.addEventListener('storage', checkUser);
    
    // Écouter un événement custom pour les changements dans le même onglet
    window.addEventListener('userLoggedIn', checkUser);
    
    return () => {
      window.removeEventListener('storage', checkUser);
      window.removeEventListener('userLoggedIn', checkUser);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('cev_auth_token');
    localStorage.removeItem('cev_user');
    setUser(null);
    navigate('/');
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
            <Link to="/about" className="navbar-link">À propos</Link>
          </li>
          <li className="navbar-item">
            <Link to="/contact" className="navbar-link">Contact</Link>
          </li>
          <li className="navbar-item navbar-cart">
            <Link to="/cart" className="navbar-link">
              panier <span className="cart-count">0</span>
            </Link>
          </li>
          
          {user ? (
            <>
              {user.role === 'ADMIN' && (
                <li className="navbar-item">
                  <Link to="/admin" className="navbar-link navbar-admin">Admin</Link>
                </li>
              )}
              <li className="navbar-item navbar-user">
                <span className="navbar-username">{user.username}</span>
                <span className="navbar-role">{user.role}</span>
                <button onClick={handleLogout} className="navbar-logout">Déconnexion</button>
              </li>
            </>
          ) : (
            <li className="navbar-item">
              <Link to="/login" className="navbar-link">Se connecter</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;