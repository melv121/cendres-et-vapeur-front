import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserCart } from '../api/api';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/logo.png';
import './Navbar.css';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  const fetchCartCount = async (userId: number) => {
    try {
      const cart = await getUserCart(userId);
      const count = (cart.items || []).reduce((sum: number, item: any) => sum + item.quantity, 0);
      setCartCount(count);
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCartCount(user.id);
    } else {
      setCartCount(0);
    }

    const handleCartUpdate = () => {
      if (user) {
        fetchCartCount(user.id);
      }
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('userLoggedIn', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('userLoggedIn', handleCartUpdate);
    };
  }, [user]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setCartCount(0);
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
            <Link to="/infos" className="navbar-link">À propos</Link>
          </li>
          <li className="navbar-item">
            <Link to="/contact" className="navbar-link">Contact</Link>
          </li>
          <li className="navbar-item navbar-cart">
            <Link to="/cart" className="navbar-link">
              panier <span className="cart-count">{cartCount}</span>
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
                {user.role !== 'ADMIN' && (
                  <span className="navbar-role">{user.role}</span>
                )}
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