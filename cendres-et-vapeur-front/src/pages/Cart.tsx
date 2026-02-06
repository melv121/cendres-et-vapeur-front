import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Cart.css';

interface CartItem {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  quantity: number;
  stock: number;
}

const Cart = () => {
  const navigate = useNavigate();
  
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: 'Engrenage en Cuivre',
      description: 'Mécanisme forgé à la main',
      image: '',
      price: 45,
      quantity: 2,
      stock: 12
    },
    {
      id: 2,
      name: 'Lampe à Vapeur',
      description: 'Éclairage portable',
      image: '',
      price: 78,
      quantity: 1,
      stock: 8
    },
    {
      id: 3,
      name: 'Montre Mécanique',
      description: 'Garde-temps restauré',
      image: '',
      price: 120,
      quantity: 1,
      stock: 5
    }
  ]);

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(items =>
      items.map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity + delta;
          if (newQuantity >= 1 && newQuantity <= item.stock) {
            return { ...item, quantity: newQuantity };
          }
        }
        return item;
      })
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const clearCart = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vider le panier ?')) {
      setCartItems([]);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    if (subtotal === 0) return 0;
    if (subtotal >= 200) return 0; 
    return 15;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Votre panier est vide');
      return;
    }
    alert('Redirection vers le paiement...');
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <div className="empty-cart-icon"></div>
            <h2>Votre panier est vide</h2>
            <p>Vous n'avez pas encore ajouté d'articles dans votre panier.</p>
            <button onClick={() => navigate('/shop')} className="btn-primary">
              Découvrir la boutique
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1 className="cart-title">Mon Panier</h1>
          <button onClick={clearCart} className="btn-clear-cart">
            Vider le panier
          </button>
        </div>

        <div className="cart-layout">
          <div className="cart-items-section">
            <div className="cart-items-header">
              <span>Article</span>
              <span>Prix unitaire</span>
              <span>Quantité</span>
              <span>Total</span>
              <span></span>
            </div>

            <div className="cart-items-list">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-info">
                    <div className="cart-item-image">
                      {item.image ? (
                        <img src={item.image} alt={item.name} />
                      ) : (
                        <div className="image-placeholder">IMG</div>
                      )}
                    </div>
                    <div className="cart-item-details">
                      <h3 className="cart-item-name">{item.name}</h3>
                      <p className="cart-item-description">{item.description}</p>
                      <span className="cart-item-stock">
                        Stock disponible: {item.stock} unités
                      </span>
                    </div>
                  </div>

                  <div className="cart-item-price">
                    {item.price.toFixed(2)} €
                  </div>

                  <div className="cart-item-quantity">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      disabled={item.quantity <= 1}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      disabled={item.quantity >= item.stock}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>

                  <div className="cart-item-total">
                    {(item.price * item.quantity).toFixed(2)} €
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="btn-remove"
                    title="Supprimer"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <button onClick={() => navigate('/shop')} className="btn-continue-shopping">
              ← Continuer mes achats
            </button>
          </div>

          <div className="cart-summary-section">
            <div className="cart-summary">
              <h2 className="summary-title">Récapitulatif</h2>

              <div className="summary-line">
                <span>Sous-total ({cartItems.length} article{cartItems.length > 1 ? 's' : ''})</span>
                <span className="summary-amount">{calculateSubtotal().toFixed(2)} €</span>
              </div>

              <div className="summary-line">
                <span>Livraison</span>
                <span className="summary-amount">
                  {calculateShipping() === 0 ? (
                    <span className="free-shipping">Gratuite</span>
                  ) : (
                    `${calculateShipping().toFixed(2)} €`
                  )}
                </span>
              </div>
                  
              <div className="summary-divider"></div>

              <div className="summary-total">
                <span>Total</span>
                <span className="total-amount">{calculateTotal().toFixed(2)} €</span>
              </div>

              <button onClick={handleCheckout} className="btn-checkout">
                Procéder au paiement
              </button>

              <div className="payment-methods">
                <p className="payment-title">Paiements acceptés</p>
                <div className="payment-icons">
                </div>
              </div>

              <div className="security-badge">
                <span>Paiement 100% sécurisé</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
