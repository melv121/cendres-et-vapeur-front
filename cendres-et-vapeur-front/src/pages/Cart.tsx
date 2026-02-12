import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getUserCart, getProductById, updateCartItemQuantity, removeFromCart, emptyCart, updateOrder } from '../api/api';
import '../styles/Cart.css';

interface CartItem {
  id: number;
  product_id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  quantity: number;
  stock: number;
}

const Cart = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showPayment, setShowPayment] = useState(false);
  const [paying, setPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const getUserId = (): number | null => {
    const userStr = localStorage.getItem('cev_auth_user');
    if (!userStr) return null;
    try {
      const user = JSON.parse(userStr);
      return user.id || null;
    } catch {
      return null;
    }
  };

  const userId = getUserId();

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    fetchCart();
  }, []);

  const fetchCart = async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const cart = await getUserCart(userId);

      setOrderId(cart.id);

      // Pour chaque item du panier, ça récupère les infos du produit
      const items: CartItem[] = await Promise.all(
        (cart.items || []).map(async (item: any) => {
          try {
            const product = await getProductById(item.product_id);
            return {
              id: item.id,
              product_id: item.product_id,
              name: product.name || `Produit #${item.product_id}`,
              description: product.description || '',
              image: product.image_url || '',
              price: Number(item.unit_price_frozen),
              quantity: item.quantity,
              stock: product.stock || 99,
            };
          } catch {
            return {
              id: item.id,
              product_id: item.product_id,
              name: `Produit #${item.product_id}`,
              description: '',
              image: '',
              price: Number(item.unit_price_frozen),
              quantity: item.quantity,
              stock: 99,
            };
          }
        })
      );

      setCartItems(items);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement du panier');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (id: number, delta: number) => {
    const item = cartItems.find(i => i.id === id);
    if (!item || !userId) return;

    const newQuantity = item.quantity + delta;
    if (newQuantity < 1 || newQuantity > item.stock) return;

    try {
      await updateCartItemQuantity(userId, item.product_id, newQuantity);
      setCartItems(items =>
        items.map(i => i.id === id ? { ...i, quantity: newQuantity } : i)
      );
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour');
    }
  };

  const removeItem = async (id: number) => {
    const item = cartItems.find(i => i.id === id);
    if (!item || !userId) return;

    try {
      await removeFromCart(userId, item.product_id);
      setCartItems(items => items.filter(i => i.id !== id));
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression');
    }
  };

  const clearCart = async () => {
    if (!userId) return;
    if (!window.confirm('Êtes-vous sûr de vouloir vider le panier ?')) return;

    try {
      await emptyCart(userId);
      setCartItems([]);
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err: any) {
      setError(err.message || 'Erreur lors du vidage du panier');
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
    if (cartItems.length === 0) return;
    setShowPayment(true);
  };

  const handleConfirmPayment = async () => {
    if (!orderId || !userId) return;
    setPaying(true);
    setError(null);
    try {
      await updateOrder(orderId, {
        status: 'paid',
        total_amount: calculateTotal(),
        user_id: userId,
      });
      setPaymentSuccess(true);
      setCartItems([]);
      setShowPayment(false);
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err: any) {
      setError(err.message || 'Erreur lors du paiement');
    } finally {
      setPaying(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <h2>Paiement réussi</h2>
            <p>Votre commande a été confirmée. Une facture a été générée.</p>
            <button onClick={() => navigate('/shop')} className="btn-primary">
              Continuer mes achats
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <h2>Connexion requise</h2>
            <p>Vous devez être connecté pour accéder à votre panier.</p>
            <Link to="/login" className="btn-primary">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <p>Chargement du panier…</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <h2>Erreur</h2>
            <p>{error}</p>
            <button onClick={fetchCart} className="btn-primary">
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

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

              {!showPayment ? (
                <>
                  <button onClick={handleCheckout} className="btn-checkout">
                    Procéder au paiement
                  </button>

                  <div className="security-badge">
                    <span>Paiement 100% sécurisé</span>
                  </div>
                </>
              ) : (
                <div className="payment-form">
                  <div className="summary-divider"></div>

                  <p style={{ opacity: 0.8, color: '#cd7f32' }}>
                    Confirmez-vous le paiement de {calculateTotal().toFixed(2)} € ?
                  </p>

                  {error && (
                    <p style={{ color: '#d4955f', marginTop: 8 }}>{error}</p>
                  )}

                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    <button
                      onClick={() => { setShowPayment(false); setError(null); }}
                      className="btn-primary"
                      style={{ flex: 1, padding: 12 }}
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleConfirmPayment}
                      className="btn-checkout"
                      disabled={paying}
                      style={{ flex: 1 }}
                    >
                      {paying ? 'Paiement en cours…' : 'Confirmer le paiement'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
